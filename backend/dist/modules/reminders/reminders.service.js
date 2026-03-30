"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteReminder = exports.snoozeReminder = exports.updateReminder = exports.createReminder = exports.getReminders = void 0;
const database_1 = require("../../config/database");
const pagination_1 = require("../../utils/pagination");
const getReminders = async (branchId, queryArgs) => {
    const { page, limit, skip } = (0, pagination_1.getPaginationOptions)(queryArgs?.page, queryArgs?.limit);
    const where = {};
    if (branchId)
        where.branchId = branchId;
    // Filter by status or date windows if requested (e.g. filter=TODAY or OVERDUE)
    if (queryArgs.filter === 'TODAY') {
        const start = new Date();
        start.setUTCHours(0, 0, 0, 0);
        const end = new Date();
        end.setUTCHours(23, 59, 59, 999);
        where.scheduledDate = { gte: start, lte: end };
        where.status = 'PENDING';
    }
    else if (queryArgs.filter === 'OVERDUE') {
        const now = new Date();
        where.scheduledDate = { lt: now };
        where.status = 'PENDING';
    }
    else if (queryArgs.status) {
        where.status = queryArgs.status;
    }
    const [total, reminders] = await Promise.all([
        database_1.prisma.reminder.count({ where }),
        database_1.prisma.reminder.findMany({
            where,
            skip,
            take: limit,
            orderBy: { scheduledDate: 'asc' }
        })
    ]);
    return (0, pagination_1.formatPaginatedResponse)(reminders, total, page, limit);
};
exports.getReminders = getReminders;
const createReminder = async (data, adminBranchId, createdById) => {
    const branchId = data.branchId || adminBranchId;
    return await database_1.prisma.reminder.create({
        data: {
            createdById: createdById,
            branchId,
            message: data.title ? `${data.title}\n${data.description || ''}` : data.message,
            scheduledDate: new Date(data.scheduledDate || data.dueDate),
            scheduledTime: data.scheduledTime || '00:00',
            reminderFor: data.reminderFor || 'MYSELF',
            status: 'PENDING'
        }
    });
};
exports.createReminder = createReminder;
const updateReminder = async (id, branchId, data) => {
    const where = branchId ? { id, branchId } : { id };
    await database_1.prisma.reminder.findFirstOrThrow({ where });
    return await database_1.prisma.reminder.update({
        where: { id },
        data: {
            ...data,
            message: data.title ? `${data.title}\n${data.description || ''}` : data.message,
            scheduledDate: (data.scheduledDate || data.dueDate) ? new Date(data.scheduledDate || data.dueDate) : undefined,
            scheduledTime: data.scheduledTime || undefined
        }
    });
};
exports.updateReminder = updateReminder;
const snoozeReminder = async (id, branchId, snoozeUntil) => {
    const where = branchId ? { id, branchId } : { id };
    await database_1.prisma.reminder.findFirstOrThrow({ where });
    return await database_1.prisma.reminder.update({
        where: { id },
        data: {
            status: 'SNOOZED',
            snoozedUntil: new Date(snoozeUntil)
        }
    });
};
exports.snoozeReminder = snoozeReminder;
const deleteReminder = async (id, branchId) => {
    const where = branchId ? { id, branchId } : { id };
    await database_1.prisma.reminder.findFirstOrThrow({ where });
    return await database_1.prisma.reminder.delete({ where: { id } });
};
exports.deleteReminder = deleteReminder;
