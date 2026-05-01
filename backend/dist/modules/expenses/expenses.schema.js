"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateExpenseSchema = exports.createExpenseSchema = void 0;
const zod_1 = require("zod");
exports.createExpenseSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().min(1, 'Title is required'),
        category: zod_1.z.enum(['COACH_SALARY', 'FACILITY_RENT', 'UTILITIES', 'EQUIPMENT', 'MARKETING', 'ADMIN_COST', 'OTHER']),
        amount: zod_1.z.coerce.number().positive('Amount must be positive'),
        date: zod_1.z.string().min(1, 'Date is required'),
        branchId: zod_1.z.string().optional().nullable(),
        notes: zod_1.z.string().optional().nullable(),
    })
});
exports.updateExpenseSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().min(1).optional(),
        category: zod_1.z.enum(['COACH_SALARY', 'FACILITY_RENT', 'UTILITIES', 'EQUIPMENT', 'MARKETING', 'ADMIN_COST', 'OTHER']).optional(),
        amount: zod_1.z.coerce.number().positive().optional(),
        date: zod_1.z.string().optional(),
        branchId: zod_1.z.string().optional().nullable(),
        notes: zod_1.z.string().optional().nullable(),
    })
});
