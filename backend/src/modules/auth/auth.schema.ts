import { z } from 'zod';

export const adminLoginSchema = z.object({
  body: z.object({
    username: z.string().min(1, 'Username is required'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    branchId: z.string().uuid('Invalid branch ID').optional()
  })
});

export const studentLoginSchema = z.object({
  body: z.object({
    // Mobile app sends 'emailOrPhone'; accepts email or phone number
    emailOrPhone: z.string().min(1, 'Email or Phone is required'),
    password: z.string().min(6, 'Password is required')
  })
});

// Full registration schema (for admin-created students via API)
export const studentRegisterSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    phone: z.string().min(8, 'Phone number must be at least 8 characters'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    branchId: z.string().uuid('Invalid branch ID'),
    // These are optional for mobile self-registration; admin fills them in later
    age: z.number().int().min(1).max(100).optional(),
    gender: z.enum(['MALE', 'FEMALE']).optional(),
    level: z.string().optional(),
    category: z.enum(['TODDLER', 'KID', 'ADULT']).optional(),
    packageType: z.enum(['BASIC', 'SILVER', 'GOLD', 'PLATINUM', 'INDIVIDUAL']).optional(),
    privacyPolicyAccepted: z.boolean().optional(),
  })
});

export const refreshTokenSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(1, 'Refresh token is required')
  })
});

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address')
  })
});

export const resetPasswordSchema = z.object({
  body: z.object({
    token: z.string().min(1, 'Token is required'),
    newPassword: z.string().min(6, 'New password must be at least 6 characters')
  })
});
