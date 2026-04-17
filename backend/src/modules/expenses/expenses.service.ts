import { prisma } from '../../config/database';
import { getPaginationOptions, formatPaginatedResponse } from '../../utils/pagination';

export const getAllExpenses = async (queryArgs: any, adminBranchId?: string) => {
    const { page, limit, skip } = getPaginationOptions(queryArgs?.page, queryArgs?.limit);

    const where: any = {};
    if (adminBranchId) where.branchId = adminBranchId; // STAFF can only see their branch
    if (queryArgs?.branchId) where.branchId = queryArgs.branchId;
    if (queryArgs?.category) where.category = queryArgs.category;
    if (queryArgs?.month && queryArgs?.year) {
        const month = parseInt(queryArgs.month);
        const year  = parseInt(queryArgs.year);
        where.date = {
            gte: new Date(year, month - 1, 1),
            lte: new Date(year, month,     0, 23, 59, 59),
        };
    } else if (queryArgs?.year) {
        const year = parseInt(queryArgs.year);
        where.date = {
            gte: new Date(year, 0, 1),
            lte: new Date(year, 11, 31, 23, 59, 59),
        };
    }

    const [total, expenses] = await Promise.all([
        prisma.expense.count({ where }),
        prisma.expense.findMany({
            where, skip, take: limit,
            orderBy: { date: 'desc' },
            include: {
                branch:    { select: { id: true, name: true } },
                createdBy: { select: { id: true, name: true } },
            }
        })
    ]);

    return formatPaginatedResponse(expenses, total, page, limit);
};

export const createExpense = async (data: any, adminId: string) => {
    // Sanitize branchId: the frontend sends "none" when no branch is selected
    const branchId = (!data.branchId || data.branchId === 'none') ? null : data.branchId;
    return await prisma.expense.create({
        data: {
            title:       data.title,
            category:    data.category,
            amount:      data.amount,
            date:        new Date(data.date),
            branchId,
            notes:       data.notes || null,
            createdById: adminId,
        },
        include: {
            branch:    { select: { id: true, name: true } },
            createdBy: { select: { id: true, name: true } },
        }
    });
};

export const updateExpense = async (id: string, data: any) => {
    const updateData: any = {};
    if (data.title    !== undefined) updateData.title    = data.title;
    if (data.category !== undefined) updateData.category = data.category;
    if (data.amount   !== undefined) updateData.amount   = data.amount;
    if (data.date     !== undefined) updateData.date     = new Date(data.date);
    if (data.branchId !== undefined) updateData.branchId = data.branchId;
    if (data.notes    !== undefined) updateData.notes    = data.notes;

    return await prisma.expense.update({
        where: { id },
        data: updateData,
        include: {
            branch:    { select: { id: true, name: true } },
            createdBy: { select: { id: true, name: true } },
        }
    });
};

export const deleteExpense = async (id: string) => {
    return await prisma.expense.delete({ where: { id } });
};

export const getExpenseStats = async (queryArgs: any, adminBranchId?: string) => {
    const branchId = adminBranchId || queryArgs?.branchId;

    // Build date filter
    const month = queryArgs?.month ? parseInt(queryArgs.month) : new Date().getMonth() + 1;
    const year  = queryArgs?.year  ? parseInt(queryArgs.year)  : new Date().getFullYear();

    const dateFrom = new Date(year, month - 1, 1);
    const dateTo   = new Date(year, month,     0, 23, 59, 59);

    const expenseWhere: any = { date: { gte: dateFrom, lte: dateTo } };
    if (branchId) expenseWhere.branchId = branchId;

    const paymentWhere: any = {
        createdAt: { gte: dateFrom, lte: dateTo },
        status: { in: ['PAID', 'PARTIAL'] },
    };
    if (branchId) paymentWhere.branchId = branchId;

    const [expenseAgg, revenueAgg, byCategory] = await Promise.all([
        prisma.expense.aggregate({ _sum: { amount: true }, where: expenseWhere }),
        prisma.payment.aggregate({ _sum: { paidAmount: true }, where: paymentWhere }),
        prisma.expense.groupBy({
            by: ['category'],
            where: expenseWhere,
            _sum: { amount: true },
        }),
    ]);

    const totalExpenses = expenseAgg._sum.amount || 0;
    const totalRevenue  = revenueAgg._sum.paidAmount || 0;
    const netProfit     = totalRevenue - totalExpenses;

    const categoryBreakdown: Record<string, number> = {};
    byCategory.forEach(row => {
        categoryBreakdown[row.category] = row._sum.amount || 0;
    });

    return { totalExpenses, totalRevenue, netProfit, byCategory: categoryBreakdown, month, year };
};
