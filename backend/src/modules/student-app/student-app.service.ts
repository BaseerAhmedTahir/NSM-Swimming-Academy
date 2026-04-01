import { prisma } from '../../config/database';
import { NotFoundError, ConflictError } from '../../utils/errors';
import { MembershipStatus, NotificationTarget } from '@prisma/client';


export const getProfile = async (studentId: string) => {
    const student = await prisma.student.findUniqueOrThrow({
        where: { id: studentId },
        select: {
            id: true, studentId: true, name: true, email: true, phone: true,
            level: true, status: true, packageType: true,
            membershipStartDate: true, membershipExpiryDate: true,
            branch: { select: { id: true, name: true } },
            membershipHistory: {
                where: { status: MembershipStatus.ACTIVE },
                orderBy: { createdAt: 'desc' },
                take: 1,
                select: { totalClasses: true, classesUsed: true }
            }
        }
    });

    // Flatten active membership for easy consumption in mobile app
    const activeMembership = student.membershipHistory[0] || null;
    const { membershipHistory: _, ...studentData } = student;
    return {
        ...studentData,
        totalClasses: activeMembership?.totalClasses ?? 0,
        classesUsed: activeMembership?.classesUsed ?? 0,
    };
};

export const getSchedule = async (studentId: string) => {
    const slots = await prisma.scheduleSlot.findMany({
        where: { studentId },
        include: {
            attendanceRecord: { select: { status: true } },
            schedule: {
                include: {
                    coach: { select: { name: true } },
                    branch: { select: { id: true, name: true } } // ← added for mobile "branch Branch" display
                }
            }
        },
        orderBy: { schedule: { date: 'asc' } }
    });

    return slots.map(slot => ({
        ...slot,
        status: slot.attendanceRecord?.status || 'Upcoming'
    }));
};

export const getAttendance = async (studentId: string) => {
    return await prisma.attendanceRecord.findMany({
        where: { studentId },
        include: { scheduleSlot: { include: { schedule: true } } },
        orderBy: { date: 'desc' }
    });
};

export const getPayments = async (studentId: string) => {
    return await prisma.payment.findMany({
        where: { studentId },
        orderBy: { paymentDate: 'desc' }
    });
};

export const getNotifications = async (studentId: string, branchId: string) => {
    return await prisma.notification.findMany({
        where: {
            OR: [
                { sentTo: NotificationTarget.ALL },
                { sentTo: NotificationTarget.BRANCH, branchId },
                { sentTo: NotificationTarget.INDIVIDUAL, targetId: studentId }
            ]
        },
        orderBy: { createdAt: 'desc' }
    });
};

export const cancelClass = async (studentId: string, scheduleSlotId: string) => {
    const slot = await prisma.scheduleSlot.findUnique({
        where: { id: scheduleSlotId },
        include: { schedule: true, attendanceRecord: true }
    });

    if (!slot || slot.studentId !== studentId) {
        throw new NotFoundError('Schedule slot not found or not assigned to you');
    }

    if (slot.attendanceRecord) {
        throw new ConflictError('Cannot cancel a class that already has attendance marked');
    }

    // Enforce 24-hour cancellation policy
    const classDateTime = new Date(slot.schedule.date);
    const [time, meridian] = slot.timeSlot.split(' ');
    const [hours, minutes] = time.split(':');
    let hour = parseInt(hours);
    if (meridian === 'PM' && hour !== 12) hour += 12;
    if (meridian === 'AM' && hour === 12) hour = 0;
    
    classDateTime.setUTCHours(hour, parseInt(minutes), 0, 0);

    const now = new Date();
    const CANCELLATION_HOURS_REQUIRED = 24;
    const diffHours = (classDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (diffHours < CANCELLATION_HOURS_REQUIRED) {
        throw new ConflictError('Classes can only be cancelled at least 24 hours before the scheduled time.');
    }

    // Actually cancel
    await prisma.$transaction(async (tx: any) => {
        await tx.scheduleSlot.update({
            where: { id: scheduleSlotId },
            data: { studentId: null }
        });
        // ClassCancellation model: studentId, classDate (Date), classTime (String), reason
        await tx.classCancellation.create({
            data: {
                studentId,
                classDate: new Date(slot.schedule.date),
                classTime: slot.timeSlot,
                reason: 'Cancelled by student via app',
            }
        });
    });

    return { success: true, message: 'Class cancelled successfully' };
};
