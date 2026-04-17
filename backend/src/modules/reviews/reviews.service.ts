import { prisma } from '../../config/database';
import { getPaginationOptions, formatPaginatedResponse } from '../../utils/pagination';

export const createReview = async (studentId: string, branchId: string | undefined, data: { rating: number; text?: string }) => {
    return await prisma.review.create({
        data: {
            studentId,
            branchId: branchId || null,
            rating: data.rating,
            text: data.text || null,
        }
    });
};

export const getAllReviews = async (queryArgs: any, branchId?: string) => {
    const { page, limit, skip } = getPaginationOptions(queryArgs?.page, queryArgs?.limit);

    const where: any = {};
    if (branchId) where.branchId = branchId;
    if (queryArgs?.branchId) where.branchId = queryArgs.branchId;
    if (queryArgs?.rating) where.rating = parseInt(queryArgs.rating);

    const [total, reviews] = await Promise.all([
        prisma.review.count({ where }),
        prisma.review.findMany({
            where,
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' },
            include: {
                student: { select: { id: true, studentId: true, name: true, phone: true } },
                branch:  { select: { id: true, name: true } },
            }
        })
    ]);

    return formatPaginatedResponse(reviews, total, page, limit);
};

export const getReviewStats = async (branchId?: string) => {
    const where: any = {};
    if (branchId) where.branchId = branchId;

    const [total, avgResult, fiveStarCount, thisMonthCount] = await Promise.all([
        prisma.review.count({ where }),
        prisma.review.aggregate({ _avg: { rating: true }, where }),
        prisma.review.count({ where: { ...where, rating: 5 } }),
        prisma.review.count({
            where: {
                ...where,
                createdAt: { gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) }
            }
        })
    ]);

    return {
        total,
        averageRating: avgResult._avg.rating ? parseFloat(avgResult._avg.rating.toFixed(1)) : 0,
        fiveStarCount,
        thisMonthCount,
    };
};
