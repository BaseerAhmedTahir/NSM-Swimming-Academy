"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateFreezing = exports.unfreeze = exports.createFreezing = exports.getFreezingById = exports.getFreezings = void 0;
const database_1 = require("../../config/database");
const pagination_1 = require("../../utils/pagination");
const getFreezings = async (branchId, queryArgs) => {
    const { page, limit, skip } = (0, pagination_1.getPaginationOptions)(queryArgs?.page, queryArgs?.limit);
    const where = {};
    if (branchId)
        where.branchId = branchId;
    if (queryArgs.month && queryArgs.year) {
        const startDate = new Date(queryArgs.year, queryArgs.month - 1, 1);
        const endDate = new Date(queryArgs.year, queryArgs.month, 0);
        where.freezeStartDate = { gte: startDate, lte: endDate };
    }
    const [total, records] = await Promise.all([
        database_1.prisma.freezing.count({ where }),
        database_1.prisma.freezing.findMany({
            where,
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' },
            include: {
                student: { select: { name: true, studentId: true, phone: true } },
                branch: { select: { name: true } }
            }
        })
    ]);
    return (0, pagination_1.formatPaginatedResponse)(records, total, page, limit);
};
exports.getFreezings = getFreezings;
const getFreezingById = async (id, branchId) => {
    const where = branchId ? { id, branchId } : { id };
    return await database_1.prisma.freezing.findFirstOrThrow({ where, include: { student: true } });
};
exports.getFreezingById = getFreezingById;
const createFreezing = async (data, adminBranchId) => {
    return await database_1.prisma.$transaction(async (tx) => {
        // Find student first to get their branchId if not provided
        const student = await tx.student.findUniqueOrThrow({ where: { id: data.studentId } });
        const branchId = adminBranchId || student.branchId;
        const startDate = new Date(data.freezeStartDate);
        const endDate = new Date(data.freezeEndDate);
        // Calculate duration in months if not provided
        let duration = data.duration;
        if (!duration) {
            duration = (endDate.getFullYear() - startDate.getFullYear()) * 12 + (endDate.getMonth() - startDate.getMonth());
            if (duration < 1)
                duration = 1;
        }
        const record = await tx.freezing.create({
            data: {
                studentId: data.studentId,
                branchId,
                freezeStartDate: startDate,
                freezeEndDate: endDate,
                duration: duration,
                comment: data.comment,
                status: 'FROZEN',
                frozenBy: data.frozenBy
            }
        });
        await tx.student.update({
            where: { id: data.studentId },
            data: { status: 'FROZEN' }
        });
        await tx.membershipHistory.updateMany({
            where: { studentId: data.studentId, status: 'ACTIVE' },
            data: { status: 'FROZEN' }
        });
        // Also remove from future schedule slots during frozen period
        await tx.scheduleSlot.updateMany({
            where: {
                studentId: data.studentId,
                schedule: { date: { gte: startDate, lte: endDate } }
            },
            data: { studentId: null }
        });
        return record;
    });
};
exports.createFreezing = createFreezing;
const unfreeze = async (id, branchId, unfreezeData) => {
    const where = branchId ? { id, branchId } : { id };
    return await database_1.prisma.$transaction(async (tx) => {
        const record = await tx.freezing.findFirstOrThrow({ where });
        if (record.status !== 'FROZEN')
            throw new Error('Account is not frozen');
        await tx.freezing.update({
            where: { id },
            data: {
                status: 'UNFROZEN',
                unfrozenAt: new Date(),
                comment: record.comment ? `${record.comment} \n Unfreeze notes: ${unfreezeData.comment || ''}` : unfreezeData.comment
            }
        });
        await tx.student.update({
            where: { id: record.studentId },
            data: { status: 'ACTIVE' }
        });
        // Potentially extend membership expiry date by the amount of time they were frozen
        const membership = await tx.membershipHistory.findFirst({
            where: { studentId: record.studentId, status: 'FROZEN' },
            orderBy: { createdAt: 'desc' }
        });
        if (membership) {
            const frozenDurationMs = new Date().getTime() - new Date(record.freezeStartDate).getTime();
            const newExpiry = new Date(membership.expiryDate.getTime() + frozenDurationMs);
            await tx.membershipHistory.update({
                where: { id: membership.id },
                data: { status: 'ACTIVE', expiryDate: newExpiry }
            });
            // Sync it back to student
            await tx.student.update({
                where: { id: record.studentId },
                data: { membershipExpiryDate: newExpiry }
            });
        }
        return record;
    });
};
exports.unfreeze = unfreeze;
const updateFreezing = async (id, branchId, data) => {
    const where = branchId ? { id, branchId } : { id };
    await database_1.prisma.freezing.findFirstOrThrow({ where });
    return await database_1.prisma.freezing.update({
        where: { id },
        data: {
            comment: data.comment,
            duration: data.duration,
            freezeEndDate: data.freezeEndDate
        }
    });
};
exports.updateFreezing = updateFreezing;
