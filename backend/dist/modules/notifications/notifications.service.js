"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.markNotificationsRead = exports.createNotification = exports.getNotifications = void 0;
const database_1 = require("../../config/database");
const pagination_1 = require("../../utils/pagination");
const sse_1 = require("../../utils/sse");
const getNotifications = async (userId, targetId, branchId, queryArgs) => {
    const { page, limit, skip } = (0, pagination_1.getPaginationOptions)(queryArgs?.page, queryArgs?.limit);
    // Admins see all notifications they sent or are relevant to their branch
    // Students only see their notifications
    let where = {};
    if (targetId) {
        // Student view
        where = {
            OR: [
                { sentTo: 'ALL' },
                { sentTo: 'BRANCH', branchId },
                { sentTo: 'INDIVIDUAL', targetId },
                { studentNotifications: { some: { studentId: targetId } } }
            ]
        };
    }
    else if (branchId) {
        // Staff view
        where.branchId = branchId;
    }
    const [total, notifications] = await Promise.all([
        database_1.prisma.notification.count({ where }),
        database_1.prisma.notification.findMany({
            where,
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' }
        })
    ]);
    // If it's a student viewing, we might need a way to track "isRead" per user if sentTo ALL/BRANCH.
    // For simplicity with the dummy schema, assume we just fetch them. 
    // Usually there's a NotificationRead table, but we will just map properties.
    return (0, pagination_1.formatPaginatedResponse)(notifications, total, page, limit);
};
exports.getNotifications = getNotifications;
const createNotification = async (data, adminBranchId) => {
    const branchId = data.branchId || adminBranchId;
    const notification = await database_1.prisma.notification.create({
        data: {
            branchId,
            title: data.title,
            message: data.message,
            type: data.type,
            sentTo: data.sentTo,
            targetId: data.targetId
        }
    });
    // Create StudentNotification bridging records to persist
    if (data.sentTo === 'INDIVIDUAL' && data.targetId) {
        await database_1.prisma.studentNotification.create({
            data: { notificationId: notification.id, studentId: data.targetId }
        });
    }
    else if (data.sentTo === 'BRANCH' && branchId) {
        const students = await database_1.prisma.student.findMany({ where: { branchId }, select: { id: true } });
        if (students.length > 0) {
            await database_1.prisma.studentNotification.createMany({
                data: students.map(s => ({ notificationId: notification.id, studentId: s.id }))
            });
        }
    }
    else if (data.sentTo === 'ALL') {
        const students = await database_1.prisma.student.findMany({ select: { id: true } });
        if (students.length > 0) {
            await database_1.prisma.studentNotification.createMany({
                data: students.map(s => ({ notificationId: notification.id, studentId: s.id }))
            });
        }
    }
    else if (data.sentTo === 'PENDING_FEES') {
        const whereClause = {
            payments: { some: { status: { in: ['PENDING', 'OVERDUE'] } } }
        };
        if (branchId) {
            whereClause.branchId = branchId;
        }
        const students = await database_1.prisma.student.findMany({ where: whereClause, select: { id: true } });
        if (students.length > 0) {
            await database_1.prisma.studentNotification.createMany({
                data: students.map(s => ({ notificationId: notification.id, studentId: s.id }))
            });
        }
    }
    // Fire SSE
    (0, sse_1.broadcastNotification)(notification, { branchId: notification.branchId || undefined, targetId: notification.targetId || undefined, sendTo: notification.sentTo });
    return notification;
};
exports.createNotification = createNotification;
const markNotificationsRead = async (notificationIds, userId) => {
    // In a production app with broadcast messages, you'd use a joining table `NotificationRecipient` to track read status per user.
    // Since our schema tracks `isRead` on the `Notification` itself (which works for INDIVIDUAL), we'll just update it.
    await database_1.prisma.studentNotification.updateMany({
        where: {
            notificationId: { in: notificationIds },
            studentId: userId // Only mark if it specifically belongs to them
        },
        data: { isRead: true, readAt: new Date() }
    });
};
exports.markNotificationsRead = markNotificationsRead;
