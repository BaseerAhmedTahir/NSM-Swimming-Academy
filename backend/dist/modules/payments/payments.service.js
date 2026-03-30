"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateInstallment = exports.createInstallment = exports.getPaymentStats = exports.updatePayment = exports.createPayment = exports.getPaymentById = exports.getAllPayments = void 0;
const database_1 = require("../../config/database");
const pagination_1 = require("../../utils/pagination");
const generateId_1 = require("../../utils/generateId");
const getAllPayments = async (queryArgs, branchId) => {
    const { page, limit, skip } = (0, pagination_1.getPaginationOptions)(queryArgs?.page, queryArgs?.limit);
    const where = {};
    if (branchId)
        where.branchId = branchId;
    if (queryArgs.status)
        where.status = queryArgs.status;
    if (queryArgs.studentId)
        where.studentId = queryArgs.studentId;
    if (queryArgs.search) {
        where.OR = [
            { invoiceNumber: { contains: queryArgs.search, mode: 'insensitive' } },
            { student: { name: { contains: queryArgs.search, mode: 'insensitive' } } }
        ];
    }
    const [total, payments] = await Promise.all([
        database_1.prisma.payment.count({ where }),
        database_1.prisma.payment.findMany({
            where,
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' },
            include: { student: { select: { name: true, studentId: true } } }
        })
    ]);
    return (0, pagination_1.formatPaginatedResponse)(payments, total, page, limit);
};
exports.getAllPayments = getAllPayments;
const getPaymentById = async (id, branchId) => {
    const where = branchId ? { id, branchId } : { id };
    const payment = await database_1.prisma.payment.findFirstOrThrow({
        where,
        include: {
            installments: true,
            student: { select: { id: true, name: true, email: true, phone: true, trn: true } },
            branch: { select: { id: true, name: true, trn: true } }
        }
    });
    // Dynamic price correction for BASIC package
    if (payment.packageType === 'BASIC' && payment.amount === 800) {
        payment.amount = 500;
        payment.totalAmount = 500 - (payment.discount || 0);
        if (payment.status === 'PAID') {
            payment.paidAmount = payment.totalAmount;
            payment.pendingAmount = 0;
        }
        else {
            payment.pendingAmount = Math.max(0, payment.totalAmount - payment.paidAmount);
        }
    }
    return payment;
};
exports.getPaymentById = getPaymentById;
const createPayment = async (data, adminBranchId) => {
    const branchId = data.branchId || adminBranchId;
    return await database_1.prisma.$transaction(async (tx) => {
        const branch = await tx.branch.findUniqueOrThrow({ where: { id: branchId } });
        // Find the payment with the highest sequence number in this branch for current year
        const year = new Date().getFullYear();
        const lastPayment = await tx.payment.findFirst({
            where: {
                branchId,
                createdAt: { gte: new Date(year, 0, 1) }
            },
            orderBy: { createdAt: 'desc' },
            select: { invoiceNumber: true }
        });
        let nextSequence = 1;
        if (lastPayment && lastPayment.invoiceNumber) {
            const parts = lastPayment.invoiceNumber.split('-');
            const lastSeq = parseInt(parts[parts.length - 1]);
            if (!isNaN(lastSeq)) {
                nextSequence = lastSeq + 1;
            }
        }
        const invoiceNumber = (0, generateId_1.generateInvoiceNumber)(branch.code, nextSequence);
        const totalAmount = data.amount - (data.discount || 0);
        const pendingAmount = totalAmount - data.paidAmount;
        return await tx.payment.create({
            data: {
                invoiceNumber,
                studentId: data.studentId,
                branchId,
                amount: data.amount,
                discount: data.discount || 0,
                totalAmount,
                paidAmount: data.paidAmount,
                pendingAmount: pendingAmount > 0 ? pendingAmount : 0,
                paymentMode: data.paymentMode,
                paymentDate: new Date(),
                status: pendingAmount <= 0 ? 'PAID' : (data.paidAmount > 0 ? 'PARTIAL' : 'PENDING'),
                packageType: data.packageType,
                registrationType: data.registrationType,
                isInstallment: data.isInstallment,
                notes: data.notes
            }
        });
    });
};
exports.createPayment = createPayment;
const updatePayment = async (id, branchId, data) => {
    const where = branchId ? { id, branchId } : { id };
    const payment = await database_1.prisma.payment.findFirstOrThrow({ where });
    const paidAmount = data.paidAmount !== undefined ? data.paidAmount : payment.paidAmount;
    const pendingAmount = payment.totalAmount - paidAmount;
    // Auto calculate status if not explicitly provided
    let status = data.status || payment.status;
    if (data.paidAmount !== undefined && !data.status) {
        if (pendingAmount <= 0)
            status = 'PAID';
        else if (paidAmount > 0)
            status = 'PARTIAL';
        else
            status = 'PENDING';
    }
    return await database_1.prisma.payment.update({
        where: { id },
        data: {
            paidAmount,
            pendingAmount: pendingAmount > 0 ? pendingAmount : 0,
            status,
            notes: data.notes
        }
    });
};
exports.updatePayment = updatePayment;
const getPaymentStats = async (branchId) => {
    const where = {};
    if (branchId)
        where.branchId = branchId;
    const [totalRevenue, pendingRevenue, counts] = await Promise.all([
        database_1.prisma.payment.aggregate({ _sum: { paidAmount: true }, where }),
        database_1.prisma.payment.aggregate({ _sum: { pendingAmount: true }, where }),
        database_1.prisma.payment.groupBy({
            by: ['status'],
            where,
            _count: true
        })
    ]);
    return {
        totalRevenue: totalRevenue._sum.paidAmount || 0,
        pendingRevenue: pendingRevenue._sum.pendingAmount || 0,
        statusCounts: counts.reduce((acc, curr) => ({ ...acc, [curr.status]: curr._count }), {})
    };
};
exports.getPaymentStats = getPaymentStats;
const createInstallment = async (data, branchId) => {
    // Validate access to the payment
    const where = branchId ? { id: data.paymentId, branchId } : { id: data.paymentId };
    await database_1.prisma.payment.findFirstOrThrow({ where });
    return await database_1.prisma.installment.create({
        data: {
            paymentId: data.paymentId,
            amount: data.amount,
            dueDate: new Date(data.dueDate),
            status: 'PENDING'
        }
    });
};
exports.createInstallment = createInstallment;
const updateInstallment = async (id, branchId, data) => {
    const installment = await database_1.prisma.installment.findUniqueOrThrow({
        where: { id },
        include: { payment: true }
    });
    if (branchId && installment.payment.branchId !== branchId) {
        throw new Error('Access denied to this installment');
    }
    // Auto-sync payment paid amounts if installment mark is Paid
    // We make an assumption here to keep the total matching or just let them manage it.
    // Simplifying: just update the installment status
    const paidDate = data.status === 'PAID' && !installment.paidDate ? new Date() : (data.paidDate ? new Date(data.paidDate) : installment.paidDate);
    return await database_1.prisma.installment.update({
        where: { id },
        data: {
            status: data.status,
            paidDate
        }
    });
};
exports.updateInstallment = updateInstallment;
