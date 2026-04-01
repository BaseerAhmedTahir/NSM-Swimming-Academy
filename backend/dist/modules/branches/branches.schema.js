"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.branchAdminSchema = exports.updateBranchSchema = exports.createBranchSchema = void 0;
const zod_1 = require("zod");
exports.createBranchSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1, "Branch name is required"),
        code: zod_1.z.string().optional(),
        address: zod_1.z.string().optional(),
        phone: zod_1.z.string().optional(),
        email: zod_1.z.string().email().optional().or(zod_1.z.literal('')),
        whatsapp: zod_1.z.string().optional(),
        mapUrl: zod_1.z.string().url().optional().or(zod_1.z.literal('')),
        operatingHours: zod_1.z.string().optional(),
        trn: zod_1.z.string().optional(),
        isActive: zod_1.z.boolean().optional().default(true)
    })
});
exports.updateBranchSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().optional(),
        code: zod_1.z.string().optional(),
        address: zod_1.z.string().optional(),
        phone: zod_1.z.string().optional(),
        email: zod_1.z.string().email().optional(),
        whatsapp: zod_1.z.string().optional(),
        mapUrl: zod_1.z.string().url().optional().or(zod_1.z.literal('')),
        operatingHours: zod_1.z.string().optional(),
        trn: zod_1.z.string().optional(),
        isActive: zod_1.z.boolean().optional()
    })
});
exports.branchAdminSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1, "Name is required"),
        username: zod_1.z.string().min(3, "Username must be at least 3 characters"),
        email: zod_1.z.string().email("Valid email is required"),
        password: zod_1.z.string().min(6, "Password must be at least 6 characters")
    })
});
