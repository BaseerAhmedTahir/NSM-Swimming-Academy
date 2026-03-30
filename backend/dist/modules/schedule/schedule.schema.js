"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.swapSlotSchema = exports.removeSlotSchema = exports.assignSlotSchema = exports.getGridSchema = void 0;
const zod_1 = require("zod");
exports.getGridSchema = zod_1.z.object({
    query: zod_1.z.object({
        date: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be YYYY-MM-DD format'),
        branchId: zod_1.z.string().uuid().optional() // Optional injected
    })
});
exports.assignSlotSchema = zod_1.z.object({
    body: zod_1.z.object({
        date: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        coachId: zod_1.z.string().uuid(),
        timeSlot: zod_1.z.string(), // e.g. "4:00 PM"
        slotPosition: zod_1.z.number().int().min(1).max(10),
        studentId: zod_1.z.string().uuid()
    })
});
exports.removeSlotSchema = zod_1.z.object({
    body: zod_1.z.object({
        date: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        coachId: zod_1.z.string().uuid(),
        timeSlot: zod_1.z.string(),
        slotPosition: zod_1.z.number().int().min(1).max(10)
    })
});
exports.swapSlotSchema = zod_1.z.object({
    body: zod_1.z.object({
        date: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        fromCoachId: zod_1.z.string().uuid(),
        fromTimeSlot: zod_1.z.string(),
        fromSlotPosition: zod_1.z.number().int().min(1).max(10),
        toCoachId: zod_1.z.string().uuid(),
        toTimeSlot: zod_1.z.string(),
        toSlotPosition: zod_1.z.number().int().min(1).max(10),
    })
});
