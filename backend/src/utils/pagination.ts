export interface PaginationData<T> {
    data: T[];
    meta: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
    }
}

export const getPaginationOptions = (pageQuery?: any, limitQuery?: any) => {
    const page = Math.max(1, parseInt(pageQuery as string) || 1);
    const limit = Math.max(1, parseInt(limitQuery as string) || 20);
    const skip = (page - 1) * limit;

    return { page, limit, skip };
};

export const formatPaginatedResponse = <T>(data: T[], total: number, page: number, limit: number): PaginationData<T> => {
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
