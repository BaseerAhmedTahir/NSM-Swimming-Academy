"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordSchema = exports.forgotPasswordSchema = exports.refreshTokenSchema = exports.studentRegisterSchema = exports.studentLoginSchema = exports.adminLoginSchema = void 0;
const zod_1 = require("zod");
exports.adminLoginSchema = zod_1.z.object({
    body: zod_1.z.object({
        username: zod_1.z.string().min(1, 'Username is required'),
        password: zod_1.z.string().min(6, 'Password must be at least 6 characters'),
        branchId: zod_1.z.string().uuid('Invalid branch ID').optional()
    })
});
exports.studentLoginSchema = zod_1.z.object({
    body: zod_1.z.object({
        // Mobile app sends 'emailOrPhone'; accepts email or phone number
        emailOrPhone: zod_1.z.string().min(1, 'Email or Phone is required'),
        password: zod_1.z.string().min(6, 'Password is required')
    })
});
// Full registration schema (for admin-created students via API)
exports.studentRegisterSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(2, 'Name must be at least 2 characters'),
        email: zod_1.z.string().email('Invalid email address'),
        phone: zod_1.z.string().min(8, 'Phone number must be at least 8 characters'),
        password: zod_1.z.string().min(6, 'Password must be at least 6 characters'),
        branchId: zod_1.z.string().uuid('Invalid branch ID'),
        // These are optional for mobile self-registration; admin fills them in later
        age: zod_1.z.number().int().min(1).max(100).optional(),
        gender: zod_1.z.enum(['MALE', 'FEMALE']).optional(),
        level: zod_1.z.string().optional(),
        category: zod_1.z.enum(['TODDLER', 'KID', 'ADULT']).optional(),
        packageType: zod_1.z.enum(['BASIC', 'SILVER', 'GOLD', 'PLATINUM', 'INDIVIDUAL']).optional(),
        privacyPolicyAccepted: zod_1.z.boolean().optional(),
    })
});
exports.refreshTokenSchema = zod_1.z.object({
    body: zod_1.z.object({
        refreshToken: zod_1.z.string().min(1, 'Refresh token is required')
    })
});
exports.forgotPasswordSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email('Invalid email address')
    })
});
exports.resetPasswordSchema = zod_1.z.object({
    body: zod_1.z.object({
        token: zod_1.z.string().min(1, 'Token is required'),
        newPassword: zod_1.z.string().min(6, 'New password must be at least 6 characters')
    })
});
