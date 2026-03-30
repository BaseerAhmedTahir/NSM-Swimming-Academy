"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.snoozeReminderSchema = exports.updateReminderSchema = exports.createReminderSchema = void 0;
const zod_1 = require("zod");
exports.createReminderSchema = zod_1.z.object({
    body: zod_1.z.object({
        branchId: zod_1.z.string().uuid().optional(),
        title: zod_1.z.string().min(1, 'Title is required'),
        description: zod_1.z.string().optional(),
        dueDate: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/, 'Must be ISO format'),
        type: zod_1.z.enum(['PAYMENT_OVERDUE', 'STUDENT_FOLLOWUP', 'CALL_REQUEST', 'CUSTOM']),
        relatedId: zod_1.z.string().uuid().optional(),
        priority: zod_1.z.enum(['LOW', 'MEDIUM', 'HIGH']).default('MEDIUM')
    })
});
exports.updateReminderSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().optional(),
        description: zod_1.z.string().optional(),
        dueDate: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/).optional(),
        priority: zod_1.z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
        status: zod_1.z.enum(['PENDING', 'COMPLETED', 'SNOOZED']).optional(),
    })
});
exports.snoozeReminderSchema = zod_1.z.object({
    body: zod_1.z.object({
        snoozeUntil: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/)
    })
});
