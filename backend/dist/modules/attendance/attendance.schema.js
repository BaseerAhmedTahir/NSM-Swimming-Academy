"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAttendanceSchema = exports.updateAttendanceSchema = exports.markAttendanceSchema = void 0;
const zod_1 = require("zod");
exports.markAttendanceSchema = zod_1.z.object({
    body: zod_1.z.object({
        scheduleSlotId: zod_1.z.string().uuid(),
        studentId: zod_1.z.string().uuid(),
        date: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be YYYY-MM-DD format'),
        status: zod_1.z.enum(['ATTENDED', 'ABSENT', 'INFORMED', 'FROZEN', 'NOT_MARKED']),
        comment: zod_1.z.string().optional()
    })
});
exports.updateAttendanceSchema = zod_1.z.object({
    body: zod_1.z.object({
        status: zod_1.z.enum(['ATTENDED', 'ABSENT', 'INFORMED', 'FROZEN', 'NOT_MARKED']),
        comment: zod_1.z.string().optional()
    })
});
exports.getAttendanceSchema = zod_1.z.object({
    query: zod_1.z.object({
        date: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
        branchId: zod_1.z.string().uuid().optional() // Auto injected
    })
});
