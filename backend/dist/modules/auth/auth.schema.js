"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordSchema = exports.forgotPasswordSchema = exports.refreshTokenSchema = exports.studentRegisterSchema = exports.studentLoginSchema = exports.adminLoginSchema = void 0;
const zod_1 = require("zod");
exports.adminLoginSchema = zod_1.z.object({
    body: zod_1.z.object({
        username: zod_1.z.string().min(1, 'Username is required'),
        password: zod_1.z.string().min(6, 'Password must be at least 6 characters'),
        branchId: zod_1.z.string().uuid('Invalid branch ID')
    })
});
exports.studentLoginSchema = zod_1.z.object({
    body: zod_1.z.object({
        emailOrPhone: zod_1.z.string().min(1, 'Email or Phone is required'),
        password: zod_1.z.string().min(6, 'Password is required')
    })
});
exports.studentRegisterSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(2, 'Name must be at least 2 characters'),
        age: zod_1.z.number().int().min(1).max(100),
        gender: zod_1.z.enum(['MALE', 'FEMALE']),
        email: zod_1.z.string().email('Invalid email address'),
        phone: zod_1.z.string().min(8, 'Phone number must be at least 8 characters'),
        password: zod_1.z.string().min(6, 'Password must be at least 6 characters'),
        level: zod_1.z.string().min(1, 'Level is required'),
        category: zod_1.z.enum(['TODDLER', 'KID', 'ADULT']),
        packageType: zod_1.z.enum(['BASIC', 'SILVER', 'GOLD', 'PLATINUM', 'INDIVIDUAL']),
        branchId: zod_1.z.string().uuid('Invalid branch ID'),
        privacyPolicyAccepted: zod_1.z.boolean().refine(val => val === true, {
            message: 'You must accept the privacy policy',
        }),
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
