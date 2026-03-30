"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCancellation = exports.createCancellation = exports.getCancellationById = exports.getCancellations = void 0;
const database_1 = require("../../config/database");
const pagination_1 = require("../../utils/pagination");
const getCancellations = async (branchId, queryArgs) => {
    const { page, limit, skip } = (0, pagination_1.getPaginationOptions)(queryArgs?.page, queryArgs?.limit);
    const where = {};
    if (branchId)
        where.branchId = branchId;
    // Monthly list (e.g. ?month=2&year=2026)
    if (queryArgs.month && queryArgs.year) {
        const startDate = new Date(queryArgs.year, queryArgs.month - 1, 1);
        const endDate = new Date(queryArgs.year, queryArgs.month, 0); // Last day of month
        where.cancellationDate = { gte: startDate, lte: endDate };
    }
    const [total, records] = await Promise.all([
        database_1.prisma.cancellation.count({ where }),
        database_1.prisma.cancellation.findMany({
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
exports.getCancellations = getCancellations;
const getCancellationById = async (id, branchId) => {
    const where = branchId ? { id, branchId } : { id };
    return await database_1.prisma.cancellation.findFirstOrThrow({ where, include: { student: true } });
};
exports.getCancellationById = getCancellationById;
const createCancellation = async (data, adminBranchId) => {
    const branchId = data.branchId || adminBranchId;
    return await database_1.prisma.$transaction(async (tx) => {
        // Validate student
        const student = await tx.student.findUniqueOrThrow({
            where: { id: data.studentId }
        });
        const actualBranchId = branchId || student.branchId;
        const cancelRecord = await tx.cancellation.create({
            data: {
                studentId: data.studentId,
                branchId: actualBranchId,
                reason: data.reason,
                cancellationDate: new Date(data.cancellationDate),
                classesUsed: 0,
                classesTotal: 0,
                classesRemaining: 0,
                refundAmount: parseFloat(data.refundAmount) || 0,
                cancelledBy: 'Admin'
            }
        });
        // Update student status
        await tx.student.update({
            where: { id: data.studentId },
            data: { status: 'CANCELLED' }
        });
        // Terminate membership
        await tx.membershipHistory.updateMany({
            where: { studentId: data.studentId, status: 'ACTIVE' },
            data: { status: 'CANCELLED' }
        });
        // Remove from future classes
        await tx.scheduleSlot.updateMany({
            where: { studentId: data.studentId },
            data: { studentId: null }
        });
        return cancelRecord;
    });
};
exports.createCancellation = createCancellation;
const updateCancellation = async (id, branchId, data) => {
    const where = branchId ? { id, branchId } : { id };
    await database_1.prisma.cancellation.findFirstOrThrow({ where });
    return await database_1.prisma.cancellation.update({
        where: { id },
        data: {
            reason: data.reason,
            refundStatus: data.refundStatus,
            refundAmount: data.refundAmount
        }
    });
};
exports.updateCancellation = updateCancellation;
