"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.snoozeReminderSchema = exports.updateReminderSchema = exports.createReminderSchema = void 0;
const zod_1 = require("zod");
exports.createReminderSchema = zod_1.z.object({
    body: zod_1.z.object({
        branchId: zod_1.z.string().uuid().optional(),
        title: zod_1.z.string().min(1, 'Title is required'),
        description: zod_1.z.string().optional(),
        // Accept any ISO date string (frontend may send timezone-aware strings)
        dueDate: zod_1.z.string().min(1, 'Due date is required'),
        type: zod_1.z.enum(['PAYMENT_OVERDUE', 'STUDENT_FOLLOWUP', 'CALL_REQUEST', 'CUSTOM']).optional().default('CUSTOM'),
        relatedId: zod_1.z.string().uuid().optional(),
        priority: zod_1.z.enum(['LOW', 'MEDIUM', 'HIGH']).default('MEDIUM'),
        // Cross-branch / multi-target fields
        targetType: zod_1.z.enum(['self', 'branch', 'email']).optional().default('self'),
        targetValue: zod_1.z.string().optional(), // branchId (UUID) or email address
        targetBranchId: zod_1.z.string().uuid().optional(), // direct override if needed
        reminderFor: zod_1.z.enum(['MYSELF', 'OTHER_BRANCH', 'SPECIFIC_PERSON', 'STUDENT']).optional(),
    })
});
exports.updateReminderSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().optional(),
        description: zod_1.z.string().optional(),
        dueDate: zod_1.z.string().optional(),
        priority: zod_1.z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
        status: zod_1.z.enum(['PENDING', 'COMPLETED', 'SNOOZED']).optional(),
        targetType: zod_1.z.enum(['self', 'branch', 'email']).optional(),
        targetValue: zod_1.z.string().optional(),
        targetBranchId: zod_1.z.string().uuid().optional(),
        reminderFor: zod_1.z.enum(['MYSELF', 'OTHER_BRANCH', 'SPECIFIC_PERSON', 'STUDENT']).optional(),
        message: zod_1.z.string().optional(),
        scheduledTime: zod_1.z.string().optional(),
        completedAt: zod_1.z.string().optional(),
        snoozedUntil: zod_1.z.string().optional(),
    })
});
exports.snoozeReminderSchema = zod_1.z.object({
    body: zod_1.z.object({
        snoozeUntil: zod_1.z.string().min(1)
    })
});
