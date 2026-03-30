"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unfreezeSchema = exports.updateFreezingSchema = exports.createFreezingSchema = void 0;
const zod_1 = require("zod");
exports.createFreezingSchema = zod_1.z.object({
    body: zod_1.z.object({
        studentId: zod_1.z.string().uuid(),
        branchId: zod_1.z.string().uuid().optional(),
        comment: zod_1.z.string().min(1, 'Comment/Reason is required'),
        freezeStartDate: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be YYYY-MM-DD format'),
        freezeEndDate: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be YYYY-MM-DD format'),
        duration: zod_1.z.number().int().min(1).default(1),
        frozenBy: zod_1.z.string().optional()
    })
});
exports.updateFreezingSchema = zod_1.z.object({
    body: zod_1.z.object({
        comment: zod_1.z.string().optional(),
        duration: zod_1.z.number().int().min(1).optional(),
        freezeEndDate: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be YYYY-MM-DD format').optional()
    })
});
exports.unfreezeSchema = zod_1.z.object({
    body: zod_1.z.object({
        notes: zod_1.z.string().optional()
    })
});
