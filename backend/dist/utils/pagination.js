"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatPaginatedResponse = exports.getPaginationOptions = void 0;
const getPaginationOptions = (pageQuery, limitQuery) => {
    const page = Math.max(1, parseInt(pageQuery) || 1);
    const limit = Math.max(1, parseInt(limitQuery) || 20);
    const skip = (page - 1) * limit;
    return { page, limit, skip };
};
exports.getPaginationOptions = getPaginationOptions;
const formatPaginatedResponse = (data, total, page, limit) => {
    const totalPages = Math.ceil(total / limit);
    return {
        data,
        meta: {
            page,
            limit,
            total,
            totalPages,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1,
        }
    };
};
exports.formatPaginatedResponse = formatPaginatedResponse;
