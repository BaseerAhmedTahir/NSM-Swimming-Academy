import { prisma } from '../../config/database';
import { NotFoundError, ConflictError } from '../../utils/errors';
import { sendMissedClassEmail } from '../../utils/email';

export const getAttendanceByDate = async (dateStr: string, branchId?: string) => {
    const targetDate = new Date(dateStr);
    targetDate.setUTCHours(0, 0, 0, 0);

    return await prisma.attendanceRecord.findMany({
        where: {
            date: targetDate,
            ...(branchId ? { student: { branchId } } : {})
        },
        include: {
            student: { select: { id: true, name: true, studentId: true } },
            scheduleSlot: { select: { timeSlot: true, schedule: { select: { coach: { select: { name: true } } } } } }
        }
    });
};

export const markAttendance = async (data: any, branchId: string | undefined, markedBy: string) => {
    const targetDate = new Date(data.date);
    targetDate.setUTCHours(0, 0, 0, 0);

    // Verify slot and student belong to branch
    const slot = await prisma.scheduleSlot.findFirst({
        where: { id: data.scheduleSlotId, studentId: data.studentId, schedule: { branchId } }
    });

    if (!slot) throw new NotFoundError('Schedule slot not found or student not assigned to this slot');

    const existingRecord = await prisma.attendanceRecord.findUnique({
        where: { scheduleSlotId: data.scheduleSlotId }
    });

    if (existingRecord) {
        throw new ConflictError('Attendance already marked for this slot. Use update instead.');
    }

    return await prisma.$transaction(async (tx: any) => {
        const record = await tx.attendanceRecord.create({
            data: {
                scheduleSlotId: data.scheduleSlotId,
                studentId: data.studentId,
                date: targetDate,
                status: data.status,
                comment: data.comment,
                markedBy
            }
        });

        let isLastClass = false;
        let remainingClasses = -1;
        let studentName = '';

        if (data.status === 'ATTENDED') {
            const history = await tx.membershipHistory.findFirst({
                where: { studentId: data.studentId, status: 'ACTIVE' },
                orderBy: { createdAt: 'desc' }
            });

            if (history) {
                const updatedHistory = await tx.membershipHistory.update({
                    where: { id: history.id },
                    data: { classesUsed: { increment: 1 } }
                });

                const totalAvailable = history.totalClasses + (history.freeClasses || 0) + (history.oldClasses || 0);
                remainingClasses = Math.max(0, totalAvailable - updatedHistory.classesUsed);

                // Detect if this is the last class (0 remaining) or second-to-last (1 remaining)
                if (remainingClasses <= 1) {
                    isLastClass = true;
                    const studentInfo = await tx.student.findUnique({ where: { id: data.studentId }, select: { name: true } });
                    studentName = studentInfo?.name || '';
                }

                // Auto-expire if classes are fully used
                if (updatedHistory.classesUsed >= totalAvailable) {
                    await tx.membershipHistory.update({
                        where: { id: history.id },
                        data: { status: 'COMPLETED' }
                    });
                    await tx.student.update({
                        where: { id: data.studentId },
                        data: { status: 'EXPIRED' }
                    });
                }
            }
        }

        // Logic for generating notification or email (Phase 6 Email Service)
        if (data.status === 'ABSENT' || data.status === 'INFORMED') {
             // Create notification
             await tx.notification.create({
                 data: {
                     branchId,
                     title: 'Class Missed',
                     message: `Your attendance was marked as ${data.status} for ${targetDate.toDateString()}`,
                     type: 'MISSED_CLASS',
                     sentTo: 'INDIVIDUAL',
                     targetId: data.studentId
                 }
             });

             // Send Email Notification
             const studentInfo = await tx.student.findUnique({ where: { id: data.studentId }, select: { email: true, name: true } });
             if (studentInfo && studentInfo.email) {
                 sendMissedClassEmail(studentInfo.email, studentInfo.name, targetDate.toDateString()).catch(console.error);
             }
        }

        return { ...record, isLastClass, remainingClasses, studentName };
    });
};

export const updateAttendance = async (id: string, branchId: string | undefined, data: any, updatedBy: string) => {
    const existing = await prisma.attendanceRecord.findFirstOrThrow({
        where: { id, ...(branchId ? { student: { branchId } } : {}) },
        include: { scheduleSlot: true }
    });

    // If changing from ABSENT->ATTENDED or ATTENDED->ABSENT we'd need to adjust classesUsed. 
    // This assumes simple increment/decrement on MembershipHistory.
    return await prisma.$transaction(async (tx: any) => {
        const record = await tx.attendanceRecord.update({
            where: { id },
            data: { 
                status: data.status, 
                comment: data.comment, 
                markedBy: updatedBy 
            }
        });

        if (existing.status !== data.status) {
            const history = await tx.membershipHistory.findFirst({
                where: { studentId: existing.studentId, status: { in: ['ACTIVE', 'COMPLETED'] } },
                orderBy: { createdAt: 'desc' }
            });

            if (history) {
                if (existing.status === 'ATTENDED' && data.status !== 'ATTENDED') {
                    // Decrement used classes
                    const updatedHistory = await tx.membershipHistory.update({
                        where: { id: history.id },
                        data: { classesUsed: { decrement: 1 } }
                    });
                    
                    // Reactivate if they dropped below total available and are currently COMPLETED
                    const totalAvailable = history.totalClasses + (history.freeClasses || 0) + (history.oldClasses || 0);
                    if (updatedHistory.classesUsed < totalAvailable && history.status === 'COMPLETED') {
                        // Also check if membershipExpiryDate hasn't passed
                        const student = await tx.student.findUnique({ where: { id: existing.studentId } });
                        if (student && (!student.membershipExpiryDate || student.membershipExpiryDate >= new Date())) {
                            await tx.membershipHistory.update({
                                where: { id: history.id },
                                data: { status: 'ACTIVE' }
                            });
                            await tx.student.update({
                                where: { id: existing.studentId },
                                data: { status: 'ACTIVE' }
                            });
                        }
                    }
                } else if (existing.status !== 'ATTENDED' && data.status === 'ATTENDED') {
                    // Increment used classes
                    const updatedHistory = await tx.membershipHistory.update({
                        where: { id: history.id },
                        data: { classesUsed: { increment: 1 } }
                    });

                    const totalAvailable = history.totalClasses + (history.freeClasses || 0) + (history.oldClasses || 0);
                    if (updatedHistory.classesUsed >= totalAvailable) {
                        await tx.membershipHistory.update({
                            where: { id: history.id },
                            data: { status: 'COMPLETED' }
                        });
                        await tx.student.update({
                            where: { id: existing.studentId },
                            data: { status: 'EXPIRED' }
                        });
                    }
                }
            }
        }

        return record;
    });
};
