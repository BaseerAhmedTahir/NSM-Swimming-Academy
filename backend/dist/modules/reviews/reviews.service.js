"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReviewStats = exports.getAllReviews = exports.createReview = void 0;
const database_1 = require("../../config/database");
const pagination_1 = require("../../utils/pagination");
const createReview = async (studentId, branchId, data) => {
    return await database_1.prisma.review.create({
        data: {
            studentId,
            branchId: branchId || null,
            rating: data.rating,
            text: data.text || null,
        }
    });
};
exports.createReview = createReview;
const getAllReviews = async (queryArgs, branchId) => {
    const { page, limit, skip } = (0, pagination_1.getPaginationOptions)(queryArgs?.page, queryArgs?.limit);
    const where = {};
    if (branchId)
        where.branchId = branchId;
    if (queryArgs?.branchId)
        where.branchId = queryArgs.branchId;
    if (queryArgs?.rating)
        where.rating = parseInt(queryArgs.rating);
    const [total, reviews] = await Promise.all([
        database_1.prisma.review.count({ where }),
        database_1.prisma.review.findMany({
            where,
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' },
            include: {
                student: { select: { id: true, studentId: true, name: true, phone: true } },
                branch: { select: { id: true, name: true } },
            }
        })
    ]);
    return (0, pagination_1.formatPaginatedResponse)(reviews, total, page, limit);
};
exports.getAllReviews = getAllReviews;
const getReviewStats = async (branchId) => {
    const where = {};
    if (branchId)
        where.branchId = branchId;
    const [total, avgResult, fiveStarCount, thisMonthCount] = await Promise.all([
        database_1.prisma.review.count({ where }),
        database_1.prisma.review.aggregate({ _avg: { rating: true }, where }),
        database_1.prisma.review.count({ where: { ...where, rating: 5 } }),
        database_1.prisma.review.count({
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
exports.getReviewStats = getReviewStats;
