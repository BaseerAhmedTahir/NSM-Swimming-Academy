"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteReminder = exports.snoozeReminder = exports.updateReminder = exports.createReminder = exports.getReminders = void 0;
const database_1 = require("../../config/database");
const pagination_1 = require("../../utils/pagination");
const getReminders = async (branchId, queryArgs) => {
    const { page, limit, skip } = (0, pagination_1.getPaginationOptions)(queryArgs?.page, queryArgs?.limit);
    // A reminder is visible to a branch if:
    // 1. They created it (branchId matches) — includes outgoing OTHER_BRANCH reminders for tracking
    // 2. They are the TARGET (targetBranchId matches) — incoming reminders
    // Popup suppression for senders is handled in TopBar.tsx, not here.
    const where = branchId
        ? { OR: [{ branchId }, { targetBranchId: branchId }] }
        : {};
    // Auto-reset any SNOOZED reminders whose snooze period has expired back to PENDING
    // This runs before the main query so the re-awakened reminders are immediately fetchable
    const now = new Date();
    await database_1.prisma.reminder.updateMany({
        where: { status: 'SNOOZED', snoozedUntil: { lte: now } },
        data: { status: 'PENDING', snoozedUntil: null }
    });
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
    const [total, rawReminders] = await Promise.all([
        database_1.prisma.reminder.count({ where }),
        database_1.prisma.reminder.findMany({
            where,
            skip,
            take: limit,
            orderBy: { scheduledDate: 'asc' },
            include: {
                branch: { select: { id: true, name: true } },
                createdBy: { select: { id: true, name: true, role: true } }
            }
        })
    ]);
    // Resolve target branch names (no Prisma relation defined for targetBranchId)
    const targetBranchIds = [...new Set(rawReminders
            .map((r) => r.targetBranchId)
            .filter(Boolean))];
    const targetBranches = targetBranchIds.length > 0
        ? await database_1.prisma.branch.findMany({ where: { id: { in: targetBranchIds } }, select: { id: true, name: true } })
        : [];
    const targetBranchMap = Object.fromEntries(targetBranches.map((b) => [b.id, b.name]));
    const reminders = rawReminders.map((r) => ({
        ...r,
        targetBranchName: r.targetBranchId ? targetBranchMap[r.targetBranchId] || null : null
    }));
    return (0, pagination_1.formatPaginatedResponse)(reminders, total, page, limit);
};
exports.getReminders = getReminders;
const createReminder = async (data, adminBranchId, createdById) => {
    // Determine reminderFor from frontend targetType
    let reminderFor = 'MYSELF';
    if (data.targetType === 'branch')
        reminderFor = 'OTHER_BRANCH';
    else if (data.targetType === 'email')
        reminderFor = 'SPECIFIC_PERSON';
    else if (data.targetType === 'student')
        reminderFor = 'STUDENT';
    else if (data.reminderFor)
        reminderFor = data.reminderFor;
    // branchId is the creator's branch (required by schema)
    // For SUPER_ADMIN (no branchId):
    //   - If targeting a branch, use that branch as the context
    //   - If self-reminder, fall back to any available branch in the DB
    let branchId = adminBranchId || data.branchId || null;
    if (!branchId) {
        if (reminderFor === 'OTHER_BRANCH' && data.targetValue) {
            // Use the target branch as the context branch for super-admin
            branchId = data.targetValue;
        }
        else {
            // Self-reminder from SUPER_ADMIN — use first available branch as context
            const firstBranch = await database_1.prisma.branch.findFirst({
                where: { isActive: true },
                select: { id: true }
            });
            if (!firstBranch)
                throw new Error('No active branches found. Please create a branch first.');
            branchId = firstBranch.id;
        }
    }
    return await database_1.prisma.reminder.create({
        data: {
            createdById: createdById,
            branchId,
            reminderFor,
            targetBranchId: data.targetType === 'branch' ? data.targetValue : (data.targetBranchId || null),
            contactEmail: data.targetType === 'email' ? data.targetValue : (data.contactEmail || null),
            message: data.title ? `${data.title}\n${data.description || ''}` : (data.message || ''),
            scheduledDate: new Date(data.scheduledDate || data.dueDate),
            scheduledTime: data.scheduledTime || '00:00',
            priority: data.priority || 'MEDIUM',
            status: 'PENDING'
        },
        include: {
            branch: { select: { id: true, name: true } }
        }
    });
};
exports.createReminder = createReminder;
const updateReminder = async (id, branchId, data) => {
    // Allow update if user owns the reminder OR it was sent to their branch
    const where = branchId
        ? { id, OR: [{ branchId }, { targetBranchId: branchId }] }
        : { id };
    await database_1.prisma.reminder.findFirstOrThrow({ where });
    const updateData = {};
    if (data.status)
        updateData.status = data.status;
    if (data.status === 'COMPLETED')
        updateData.completedAt = new Date();
    if (data.snoozedUntil)
        updateData.snoozedUntil = new Date(data.snoozedUntil);
    if (data.reminderFor)
        updateData.reminderFor = data.reminderFor;
    if (data.targetBranchId !== undefined)
        updateData.targetBranchId = data.targetBranchId;
    if (data.contactEmail !== undefined)
        updateData.contactEmail = data.contactEmail;
    if (data.message)
        updateData.message = data.message;
    if (data.title)
        updateData.message = `${data.title}\n${data.description || ''}`;
    if (data.scheduledDate || data.dueDate)
        updateData.scheduledDate = new Date(data.scheduledDate || data.dueDate);
    if (data.scheduledTime)
        updateData.scheduledTime = data.scheduledTime;
    if (data.priority)
        updateData.priority = data.priority;
    return await database_1.prisma.reminder.update({
        where: { id },
        data: updateData,
        include: {
            branch: { select: { id: true, name: true } }
        }
    });
};
exports.updateReminder = updateReminder;
const snoozeReminder = async (id, branchId, snoozeUntil) => {
    const where = branchId ? { id, OR: [{ branchId }, { targetBranchId: branchId }] } : { id };
    await database_1.prisma.reminder.findFirstOrThrow({ where });
    return await database_1.prisma.reminder.update({
        where: { id },
        data: { status: 'SNOOZED', snoozedUntil: new Date(snoozeUntil) }
    });
};
exports.snoozeReminder = snoozeReminder;
const deleteReminder = async (id, branchId) => {
    const where = branchId ? { id, OR: [{ branchId }, { targetBranchId: branchId }] } : { id };
    await database_1.prisma.reminder.findFirstOrThrow({ where });
    return await database_1.prisma.reminder.delete({ where: { id } });
};
exports.deleteReminder = deleteReminder;
