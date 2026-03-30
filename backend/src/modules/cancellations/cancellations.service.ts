import { prisma } from '../../config/database';
import { getPaginationOptions, formatPaginatedResponse } from '../../utils/pagination';

export const getCancellations = async (branchId: string | undefined, queryArgs: any) => {
    const { page, limit, skip } = getPaginationOptions(queryArgs?.page, queryArgs?.limit);
    
    const where: any = {};
    if (branchId) where.branchId = branchId;
    
    // Monthly list (e.g. ?month=2&year=2026)
    if (queryArgs.month && queryArgs.year) {
        const startDate = new Date(queryArgs.year, queryArgs.month - 1, 1);
        const endDate = new Date(queryArgs.year, queryArgs.month, 0); // Last day of month
        where.cancellationDate = { gte: startDate, lte: endDate };
    }

    const [total, records] = await Promise.all([
        prisma.cancellation.count({ where }),
        prisma.cancellation.findMany({
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

    return formatPaginatedResponse(records, total, page, limit);
};

export const getCancellationById = async (id: string, branchId?: string) => {
    const where = branchId ? { id, branchId } : { id };
    return await prisma.cancellation.findFirstOrThrow({ where, include: { student: true } });
};

export const createCancellation = async (data: any, adminBranchId?: string) => {
    const branchId = data.branchId || adminBranchId;
    
    return await prisma.$transaction(async (tx: any) => {
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

export const updateCancellation = async (id: string, branchId: string | undefined, data: any) => {
    const where = branchId ? { id, branchId } : { id };
    await prisma.cancellation.findFirstOrThrow({ where });

    return await prisma.cancellation.update({
        where: { id },
        data: {
            reason: data.reason,
            refundStatus: data.refundStatus,
            refundAmount: data.refundAmount
        }
    });
};
