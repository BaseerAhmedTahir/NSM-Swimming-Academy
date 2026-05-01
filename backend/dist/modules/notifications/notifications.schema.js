"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.markReadSchema = exports.createNotificationSchema = void 0;
const zod_1 = require("zod");
exports.createNotificationSchema = zod_1.z.object({
    body: zod_1.z.object({
        branchId: zod_1.z.string().uuid().optional(),
        title: zod_1.z.string().min(1, 'Title is required'),
        message: zod_1.z.string().min(1, 'Message is required'),
        type: zod_1.z.enum(['HOLIDAY', 'CLASS_UPDATE', 'OFFER', 'FEE_REMINDER', 'ASSESSMENT_RESULT', 'MISSED_CLASS', 'WELCOME', 'GENERAL', 'CLASS_CANCELLED']),
        sentTo: zod_1.z.enum(['INDIVIDUAL', 'ALL', 'BRANCH', 'COACH_STUDENTS', 'PENDING_FEES']),
        targetId: zod_1.z.string().uuid().optional(),
    })
});
exports.markReadSchema = zod_1.z.object({
    body: zod_1.z.object({
        notificationIds: zod_1.z.array(zod_1.z.string().uuid())
    })
});
