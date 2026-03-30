"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.markReadSchema = exports.createNotificationSchema = void 0;
const zod_1 = require("zod");
exports.createNotificationSchema = zod_1.z.object({
    body: zod_1.z.object({
        branchId: zod_1.z.string().uuid().optional(),
        title: zod_1.z.string().min(1, 'Title is required'),
        message: zod_1.z.string().min(1, 'Message is required'),
        type: zod_1.z.enum(['SYSTEM', 'PROMOTION', 'REMINDER', 'MISSED_CLASS', 'PAYMENT_DUE', 'CUSTOM']),
        sentTo: zod_1.z.enum(['ALL', 'BRANCH', 'STUDENT_LEVEL', 'INDIVIDUAL']),
        targetId: zod_1.z.string().uuid().optional(),
    })
});
exports.markReadSchema = zod_1.z.object({
    body: zod_1.z.object({
        notificationIds: zod_1.z.array(zod_1.z.string().uuid())
    })
});
