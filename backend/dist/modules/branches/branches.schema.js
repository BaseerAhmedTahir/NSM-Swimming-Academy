"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBranchSchema = void 0;
const zod_1 = require("zod");
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
