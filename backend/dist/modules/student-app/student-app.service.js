"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteReview = exports.submitReview = exports.cancelClass = exports.getNotifications = exports.getPayments = exports.getAttendance = exports.getSchedule = exports.getProfile = void 0;
const database_1 = require("../../config/database");
const errors_1 = require("../../utils/errors");
const client_1 = require("@prisma/client");
const getProfile = async (studentId) => {
    const student = await database_1.prisma.student.findUniqueOrThrow({
        where: { id: studentId },
        select: {
            id: true, studentId: true, name: true, email: true, phone: true,
            level: true, status: true, packageType: true,
            membershipStartDate: true, membershipExpiryDate: true,
            branch: { select: { id: true, name: true } },
            membershipHistory: {
                where: { status: client_1.MembershipStatus.ACTIVE },
                orderBy: { createdAt: 'desc' },
                take: 1,
                select: { totalClasses: true, classesUsed: true }
            },
            payments: {
                orderBy: { paymentDate: 'desc' },
                take: 1,
                select: {
                    id: true, status: true,
                    totalAmount: true, paidAmount: true, pendingAmount: true,
                    paymentDate: true
                }
            },
            reviews: {
                take: 1,
                orderBy: { createdAt: 'desc' },
                select: { id: true, rating: true, text: true }
            }
        }
    });
    // Flatten active membership for easy consumption in mobile app
    const activeMembership = student.membershipHistory[0] || null;
    const { membershipHistory: _, reviews, ...studentData } = student;
    return {
        ...studentData,
        totalClasses: activeMembership?.totalClasses ?? 0,
        classesUsed: activeMembership?.classesUsed ?? 0,
        review: reviews[0] || null,
    };
};
exports.getProfile = getProfile;
const getSchedule = async (studentId) => {
    const slots = await database_1.prisma.scheduleSlot.findMany({
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
exports.getSchedule = getSchedule;
const getAttendance = async (studentId) => {
    return await database_1.prisma.attendanceRecord.findMany({
        where: { studentId },
        include: { scheduleSlot: { include: { schedule: true } } },
        orderBy: { date: 'desc' }
    });
};
exports.getAttendance = getAttendance;
const getPayments = async (studentId) => {
    return await database_1.prisma.payment.findMany({
        where: { studentId },
        orderBy: { paymentDate: 'desc' }
    });
};
exports.getPayments = getPayments;
const getNotifications = async (studentId, branchId) => {
    return await database_1.prisma.notification.findMany({
        where: {
            OR: [
                { sentTo: client_1.NotificationTarget.ALL },
                { sentTo: client_1.NotificationTarget.BRANCH, branchId },
                { sentTo: client_1.NotificationTarget.INDIVIDUAL, targetId: studentId }
            ]
        },
        orderBy: { createdAt: 'desc' }
    });
};
exports.getNotifications = getNotifications;
const cancelClass = async (studentId, scheduleSlotId) => {
    const slot = await database_1.prisma.scheduleSlot.findUnique({
        where: { id: scheduleSlotId },
        include: { schedule: true, attendanceRecord: true }
    });
    if (!slot || slot.studentId !== studentId) {
        throw new errors_1.NotFoundError('Schedule slot not found or not assigned to you');
    }
    if (slot.attendanceRecord) {
        throw new errors_1.ConflictError('Cannot cancel a class that already has attendance marked');
    }
    // Enforce 24-hour cancellation policy
    const classDateTime = new Date(slot.schedule.date);
    const [time, meridian] = slot.timeSlot.split(' ');
    const [hours, minutes] = time.split(':');
    let hour = parseInt(hours);
    if (meridian === 'PM' && hour !== 12)
        hour += 12;
    if (meridian === 'AM' && hour === 12)
        hour = 0;
    classDateTime.setUTCHours(hour, parseInt(minutes), 0, 0);
    const now = new Date();
    const CANCELLATION_HOURS_REQUIRED = 24;
    const diffHours = (classDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);
    if (diffHours < CANCELLATION_HOURS_REQUIRED) {
        throw new errors_1.ConflictError('Classes can only be cancelled at least 24 hours before the scheduled time.');
    }
    // Actually cancel
    await database_1.prisma.$transaction(async (tx) => {
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
exports.cancelClass = cancelClass;
const submitReview = async (studentId, branchId, data) => {
    const existing = await database_1.prisma.review.findFirst({ where: { studentId } });
    if (existing) {
        return await database_1.prisma.review.update({
            where: { id: existing.id },
            data: {
                rating: data.rating,
                text: data.text || null,
                branchId: branchId || null
            }
        });
    }
    return await database_1.prisma.review.create({
        data: {
            studentId,
            branchId: branchId || null,
            rating: data.rating,
            text: data.text || null,
        }
    });
};
exports.submitReview = submitReview;
const deleteReview = async (studentId) => {
    const result = await database_1.prisma.review.deleteMany({
        where: { studentId }
    });
    if (result.count === 0) {
        throw new errors_1.NotFoundError('Review not found');
    }
    return { success: true, message: 'Review deleted successfully' };
};
exports.deleteReview = deleteReview;
