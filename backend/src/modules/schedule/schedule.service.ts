import { prisma } from '../../config/database';
import { NotFoundError, ConflictError } from '../../utils/errors';

export const getScheduleGrid = async (dateStr: string, branchId: string) => {
    const targetDate = new Date(dateStr);
    targetDate.setUTCHours(0, 0, 0, 0);

    const coaches = await prisma.coach.findMany({
        where: { branchId, isActive: true },
        select: { id: true, name: true, gender: true }
    });

    const schedules = await prisma.schedule.findMany({
        where: { branchId, date: targetDate },
        include: {
            slots: {
                include: {
                    student: { select: { id: true, name: true, level: true, status: true, gender: true } },
                    attendanceRecord: { select: { id: true, status: true } }
                }
            }
        }
    });

    return { coaches, schedules };
};

export const assignSlot = async (data: any, branchId: string) => {
    const targetDate = new Date(data.date);
    targetDate.setUTCHours(0, 0, 0, 0);

    return await prisma.$transaction(async (tx: any) => {
        // Ensure student belongs to this branch and is active
        const student = await tx.student.findFirst({
            where: { id: data.studentId, branchId },
            include: { membershipHistory: { where: { status: 'ACTIVE' }, orderBy: { createdAt: 'desc' }, take: 1 } }
        });
        if (!student || student.status !== 'ACTIVE') {
            throw new ConflictError('Student not found or not active in this branch');
        }

        const activeMembership = student.membershipHistory?.[0];
        if (!activeMembership) {
            throw new ConflictError('No active membership found for student');
        }

        // Count future or unmarked scheduled slots
        const futureSlots = await tx.scheduleSlot.count({
            where: {
                studentId: data.studentId,
                attendanceRecord: null
            }
        });

        if (activeMembership.classesUsed + futureSlots >= activeMembership.totalClasses) {
            throw new ConflictError(`Cannot schedule more classes. Package allows ${activeMembership.totalClasses} classes, student has used ${activeMembership.classesUsed} and is scheduled for ${futureSlots} upcoming classes.`);
        }

        // Find or create schedule block for this coach on this date
        let schedule = await tx.schedule.findUnique({
            where: { date_branchId_coachId: { date: targetDate, branchId, coachId: data.coachId } }
        });

        if (!schedule) {
            schedule = await tx.schedule.create({
                data: { date: targetDate, branchId, coachId: data.coachId }
            });
        }

        // Check if student is already assigned to this time slot on this date (across ANY coach)
        const duplicateAssignment = await tx.scheduleSlot.findFirst({
            where: {
                timeSlot: data.timeSlot,
                studentId: data.studentId,
                schedule: {
                    date: targetDate,
                    branchId
                }
            },
            include: {
                schedule: {
                    include: { coach: { select: { name: true } } }
                }
            }
        });

        if (duplicateAssignment) {
            throw new ConflictError(`Student is already scheduled at ${data.timeSlot} with ${duplicateAssignment.schedule.coach.name}`);
        }

        // Check if slot position is taken
        const existingSlot = await tx.scheduleSlot.findUnique({
            where: { scheduleId_timeSlot_slotPosition: { scheduleId: schedule.id, timeSlot: data.timeSlot, slotPosition: data.slotPosition } }
        });

        if (existingSlot && existingSlot.studentId) {
            throw new ConflictError('Slot is already occupied');
        }

        if (existingSlot) {
            await tx.scheduleSlot.update({
                where: { id: existingSlot.id },
                data: { studentId: data.studentId }
            });
        } else {
            await tx.scheduleSlot.create({
                data: {
                    scheduleId: schedule.id,
                    timeSlot: data.timeSlot,
                    slotPosition: data.slotPosition,
                    studentId: data.studentId
                }
            });
        }

        if (data.studentId && data.coachId) {
            await tx.coachStudentAssignment.createMany({
                data: [{ coachId: data.coachId, studentId: data.studentId }],
                skipDuplicates: true
            });
        }

        return true;
    });
};

export const removeSlot = async (data: any, branchId: string) => {
    const targetDate = new Date(data.date);
    targetDate.setUTCHours(0, 0, 0, 0);

    const schedule = await prisma.schedule.findUnique({
        where: { date_branchId_coachId: { date: targetDate, branchId, coachId: data.coachId } }
    });

    if (!schedule) throw new NotFoundError('Schedule not found');

    const slot = await prisma.scheduleSlot.findUnique({
        where: { scheduleId_timeSlot_slotPosition: { scheduleId: schedule.id, timeSlot: data.timeSlot, slotPosition: data.slotPosition } }
    });

    if (!slot) throw new NotFoundError('Slot not found');

    return await prisma.scheduleSlot.update({
        where: { id: slot.id },
        data: { studentId: null }
    });
};

export const swapSlot = async (data: any, branchId: string) => {
    // Basic implementation of swap. Could involve 2 different schedules (different coaches) on same date
    const targetDate = new Date(data.date);
    targetDate.setUTCHours(0, 0, 0, 0);

    return await prisma.$transaction(async (tx: any) => {
        // Find Schedules
        let schedule1 = await tx.schedule.findUnique({ where: { date_branchId_coachId: { date: targetDate, branchId, coachId: data.fromCoachId } } });
        let schedule2 = await tx.schedule.findUnique({ where: { date_branchId_coachId: { date: targetDate, branchId, coachId: data.toCoachId } } });

        if (!schedule1) throw new NotFoundError('Source schedule not found');
        if (!schedule2) {
            // Target coach has no schedule block yet, create it
            schedule2 = await tx.schedule.create({ data: { date: targetDate, branchId, coachId: data.toCoachId } });
        }

        const slot1 = await tx.scheduleSlot.findUnique({
            where: { scheduleId_timeSlot_slotPosition: { scheduleId: schedule1.id, timeSlot: data.fromTimeSlot, slotPosition: data.fromSlotPosition } }
        });
        
        const slot2 = await tx.scheduleSlot.findUnique({
            where: { scheduleId_timeSlot_slotPosition: { scheduleId: schedule2.id, timeSlot: data.toTimeSlot, slotPosition: data.toSlotPosition } }
        });

        const studentId1 = slot1?.studentId || null;
        const studentId2 = slot2?.studentId || null;

        // Upsert Slot 1 with Student 2
        if (slot1) {
            await tx.scheduleSlot.update({ where: { id: slot1.id }, data: { studentId: studentId2 } });
        } else if (studentId2) {
            await tx.scheduleSlot.create({ data: { scheduleId: schedule1.id, timeSlot: data.fromTimeSlot, slotPosition: data.fromSlotPosition, studentId: studentId2 } });
        }

        // Upsert Slot 2 with Student 1
        if (slot2) {
            await tx.scheduleSlot.update({ where: { id: slot2.id }, data: { studentId: studentId1 } });
        } else if (studentId1) {
            await tx.scheduleSlot.create({ data: { scheduleId: schedule2.id, timeSlot: data.toTimeSlot, slotPosition: data.toSlotPosition, studentId: studentId1 } });
        }

        // Auto assign to coaches
        if (studentId2) {
            await tx.coachStudentAssignment.createMany({
                data: [{ coachId: data.fromCoachId, studentId: studentId2 }],
                skipDuplicates: true
            });
        }
        if (studentId1) {
            await tx.coachStudentAssignment.createMany({
                data: [{ coachId: data.toCoachId, studentId: studentId1 }],
                skipDuplicates: true
            });
        }
    });
};
