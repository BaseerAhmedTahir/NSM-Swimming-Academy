import { prisma } from '../../config/database';
import { getPaginationOptions, formatPaginatedResponse } from '../../utils/pagination';
import { broadcastNotification } from '../../utils/sse';

export const getNotifications = async (userId: string, targetId: string | undefined, branchId: string | undefined, queryArgs: any) => {
    const { page, limit, skip } = getPaginationOptions(queryArgs?.page, queryArgs?.limit);
    
    // Admins see all notifications they sent or are relevant to their branch
    // Students only see their notifications
    
    let where: any = {};
    
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
    } else if (branchId) {
        // Staff view
        where.branchId = branchId;
    }

    const [total, notifications] = await Promise.all([
        prisma.notification.count({ where }),
        prisma.notification.findMany({
            where,
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' }
        })
    ]);

    // If it's a student viewing, we might need a way to track "isRead" per user if sentTo ALL/BRANCH.
    // For simplicity with the dummy schema, assume we just fetch them. 
    // Usually there's a NotificationRead table, but we will just map properties.

    return formatPaginatedResponse(notifications, total, page, limit);
};

export const createNotification = async (data: any, adminBranchId?: string) => {
    const branchId = data.branchId || adminBranchId;
    
    const notification = await prisma.notification.create({
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
        await prisma.studentNotification.create({
            data: { notificationId: notification.id, studentId: data.targetId }
        });
    } else if (data.sentTo === 'BRANCH' && branchId) {
        const students = await prisma.student.findMany({ where: { branchId }, select: { id: true } });
        if (students.length > 0) {
            await prisma.studentNotification.createMany({
                data: students.map(s => ({ notificationId: notification.id, studentId: s.id }))
            });
        }
    } else if (data.sentTo === 'ALL') {
        const students = await prisma.student.findMany({ select: { id: true } });
        if (students.length > 0) {
            await prisma.studentNotification.createMany({
                data: students.map(s => ({ notificationId: notification.id, studentId: s.id }))
            });
        }
    } else if (data.sentTo === 'PENDING_FEES') {
        const whereClause: any = {
            payments: { some: { status: { in: ['PENDING', 'OVERDUE'] } } }
        };
        if (branchId) {
            whereClause.branchId = branchId;
        }
        const students = await prisma.student.findMany({ where: whereClause, select: { id: true } });
        if (students.length > 0) {
            await prisma.studentNotification.createMany({
                data: students.map(s => ({ notificationId: notification.id, studentId: s.id }))
            });
        }
    }

    // Fire SSE
    broadcastNotification(notification, { branchId: notification.branchId || undefined, targetId: notification.targetId || undefined, sendTo: notification.sentTo });

    return notification;
};

export const markNotificationsRead = async (notificationIds: string[], userId: string) => {
    // In a production app with broadcast messages, you'd use a joining table `NotificationRecipient` to track read status per user.
    // Since our schema tracks `isRead` on the `Notification` itself (which works for INDIVIDUAL), we'll just update it.
    await prisma.studentNotification.updateMany({
        where: {
            notificationId: { in: notificationIds },
            studentId: userId // Only mark if it specifically belongs to them
        },
        data: { isRead: true, readAt: new Date() }
    });
};
