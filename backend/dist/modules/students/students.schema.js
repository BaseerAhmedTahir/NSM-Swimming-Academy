"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createStudentSchema = exports.updateStudentSchema = exports.renewStudentSchema = exports.activateStudentSchema = void 0;
const zod_1 = require("zod");
exports.activateStudentSchema = zod_1.z.object({
    body: zod_1.z.object({
        packageType: zod_1.z.string().optional(), // Accepts dynamic package keys from Settings
    })
});
exports.renewStudentSchema = zod_1.z.object({
    body: zod_1.z.object({
        packageType: zod_1.z.string(), // Accepts dynamic package keys from Settings
        discount: zod_1.z.number().min(0).optional().default(0),
        paymentMode: zod_1.z.enum(['CASH', 'CARD', 'ONLINE']),
        paymentStatus: zod_1.z.enum(['PAID', 'PENDING']).default('PAID'),
        isInstallment: zod_1.z.boolean().default(false),
    })
});
exports.updateStudentSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().optional(),
        age: zod_1.z.number().int().min(1).max(100).optional(),
        gender: zod_1.z.enum(['MALE', 'FEMALE']).optional(),
        phone: zod_1.z.string().optional(),
        email: zod_1.z.string().email().optional(),
        level: zod_1.z.string().optional(),
        category: zod_1.z.enum(['TODDLER', 'KID', 'ADULT']).optional(),
        discount: zod_1.z.number().min(0).optional(),
        branchId: zod_1.z.string().uuid().optional(),
        profileImage: zod_1.z.string().url().optional().or(zod_1.z.literal('')),
        packageType: zod_1.z.string().optional(), // Accepts dynamic package keys from Settings
        paymentMode: zod_1.z.enum(['CASH', 'CARD', 'ONLINE']).optional(),
        membershipStartDate: zod_1.z.string().optional(),
        membershipExpiryDate: zod_1.z.string().optional(),
        paymentStatus: zod_1.z.enum(['PAID', 'PENDING']).optional(),
        trn: zod_1.z.string().optional(),
    })
});
exports.createStudentSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(2, 'Name must be at least 2 characters'),
        age: zod_1.z.number().int().min(1).max(100),
        gender: zod_1.z.enum(['MALE', 'FEMALE']),
        email: zod_1.z.string().email('Invalid email address'),
        phone: zod_1.z.string().min(8, 'Phone number must be at least 8 characters'),
        password: zod_1.z.string().min(6, 'Password must be at least 6 characters'),
        level: zod_1.z.string().min(1, 'Level is required'),
        category: zod_1.z.enum(['TODDLER', 'KID', 'ADULT']),
        packageType: zod_1.z.string(), // Accepts dynamic package keys from Settings
        branchId: zod_1.z.string().optional(),
        discount: zod_1.z.number().min(0).optional().default(0),
        paymentMode: zod_1.z.enum(['CASH', 'CARD', 'ONLINE']),
        paymentStatus: zod_1.z.enum(['PAID', 'PENDING']).default('PAID'),
        isInstallment: zod_1.z.boolean().default(false),
        trn: zod_1.z.string().optional(),
    })
});
