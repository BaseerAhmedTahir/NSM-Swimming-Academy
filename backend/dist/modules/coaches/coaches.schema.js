"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assignStudentsSchema = exports.updateCoachSchema = exports.createCoachSchema = void 0;
const zod_1 = require("zod");
exports.createCoachSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(2, 'Name is required'),
        email: zod_1.z.string().email('Invalid email address'),
        phone: zod_1.z.string().min(8, 'Phone number required'),
        branchId: zod_1.z.string().uuid('Invalid branch ID').optional()
        // ^ Optional because it will be auto-injected by branchScope if admin is STAFF
    })
});
exports.updateCoachSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().optional(),
        email: zod_1.z.string().email().optional(),
        phone: zod_1.z.string().optional(),
        isActive: zod_1.z.boolean().optional()
    })
});
exports.assignStudentsSchema = zod_1.z.object({
    body: zod_1.z.object({
        studentIds: zod_1.z.array(zod_1.z.string().uuid()).min(1, 'At least one student ID required')
    })
});
