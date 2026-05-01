"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateInstallmentSchema = exports.createInstallmentSchema = exports.updatePaymentSchema = exports.createPaymentSchema = void 0;
const zod_1 = require("zod");
exports.createPaymentSchema = zod_1.z.object({
    body: zod_1.z.object({
        studentId: zod_1.z.string().uuid(),
        branchId: zod_1.z.string().uuid().optional(),
        amount: zod_1.z.number().min(0, 'Amount must be positive'),
        discount: zod_1.z.number().min(0).default(0),
        paidAmount: zod_1.z.number().min(0),
        paymentMode: zod_1.z.enum(['CASH', 'CARD', 'ONLINE']),
        status: zod_1.z.enum(['PAID', 'PENDING', 'PARTIAL', 'OVERDUE', 'REFUNDED']),
        packageType: zod_1.z.string(),
        registrationType: zod_1.z.enum(['NEW', 'RENEW']),
        isInstallment: zod_1.z.boolean().default(false),
        notes: zod_1.z.string().optional()
    })
});
exports.updatePaymentSchema = zod_1.z.object({
    body: zod_1.z.object({
        paidAmount: zod_1.z.number().min(0).optional(),
        status: zod_1.z.enum(['PAID', 'PENDING', 'PARTIAL', 'OVERDUE', 'REFUNDED']).optional(),
        notes: zod_1.z.string().optional()
    })
});
exports.createInstallmentSchema = zod_1.z.object({
    body: zod_1.z.object({
        paymentId: zod_1.z.string().uuid(),
        amount: zod_1.z.number().min(0),
        dueDate: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/)
    })
});
exports.updateInstallmentSchema = zod_1.z.object({
    body: zod_1.z.object({
        status: zod_1.z.enum(['PAID', 'PENDING', 'PARTIAL', 'OVERDUE', 'REFUNDED']),
        paidDate: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    })
});
