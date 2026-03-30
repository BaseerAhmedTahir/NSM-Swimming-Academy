"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCancellationSchema = exports.createCancellationSchema = void 0;
const zod_1 = require("zod");
exports.createCancellationSchema = zod_1.z.object({
    body: zod_1.z.object({
        studentId: zod_1.z.string().uuid(),
        branchId: zod_1.z.string().uuid().optional(),
        reason: zod_1.z.string().min(1, 'Reason is required'),
        cancellationDate: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be YYYY-MM-DD'),
        feesTaken: zod_1.z.number().min(0).default(0),
        refundAmount: zod_1.z.number().min(0).default(0),
        notes: zod_1.z.string().optional()
    })
});
exports.updateCancellationSchema = zod_1.z.object({
    body: zod_1.z.object({
        feesTaken: zod_1.z.number().min(0).optional(),
        refundAmount: zod_1.z.number().min(0).optional(),
        notes: zod_1.z.string().optional()
    })
});
