"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelClass = exports.getNotifications = exports.getPayments = exports.getAttendance = exports.getSchedule = exports.getProfile = void 0;
const database_1 = require("../../config/database");
const errors_1 = require("../../utils/errors");
const env_1 = require("../../config/env");
const getProfile = async (studentId) => {
    return await database_1.prisma.student.findUniqueOrThrow({
        where: { id: studentId },
        select: {
            id: true, studentId: true, name: true, email: true, phone: true,
            level: true, status: true, packageType: true, membershipExpiryDate: true,
            branch: { select: { id: true, name: true } }
        }
    });
};
exports.getProfile = getProfile;
const getSchedule = async (studentId) => {
    return await database_1.prisma.scheduleSlot.findMany({
        where: { studentId },
        include: { schedule: { include: { coach: { select: { name: true } } } } },
        orderBy: { schedule: { date: 'asc' } }
    });
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
                { sentTo: 'ALL' },
                { sentTo: 'BRANCH', branchId },
                { sentTo: 'INDIVIDUAL', targetId: studentId }
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
    // Check 2-hour threshold
    const classDateTime = new Date(slot.schedule.date);
    // Add time from timeSlot string (e.g. "4:00 PM")
    const [time, meridian] = slot.timeSlot.split(' ');
    const [hours, minutes] = time.split(':');
    let hour = parseInt(hours);
    if (meridian === 'PM' && hour !== 12)
        hour += 12;
    if (meridian === 'AM' && hour === 12)
        hour = 0;
    classDateTime.setUTCHours(hour, parseInt(minutes), 0, 0);
    const now = new Date();
    const thresholdHours = Number(env_1.env.CANCELLATION_THRESHOLD_HOURS || 2);
    const diffHours = (classDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);
    if (diffHours < thresholdHours) {
        throw new errors_1.ConflictError(`You can only cancel classes at least ${thresholdHours} hours in advance.`);
    }
    // Actually cancel
    await database_1.prisma.$transaction(async (tx) => {
        await tx.scheduleSlot.update({
            where: { id: scheduleSlotId },
            data: { studentId: null }
        });
        await tx.cancellationRecord.create({
            data: {
                studentId,
                branchId: slot.schedule.branchId,
                reason: 'Cancelled by student via app',
                status: 'APPROVED',
                date: now
            }
        });
    });
    return { success: true, message: 'Class cancelled successfully' };
};
exports.cancelClass = cancelClass;
