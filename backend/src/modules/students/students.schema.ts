import { z } from 'zod';

export const activateStudentSchema = z.object({
  body: z.object({
    packageType: z.string().optional(), // Accepts dynamic package keys from Settings
  })
});

export const renewStudentSchema = z.object({
  body: z.object({
    packageType: z.string(), // Accepts dynamic package keys from Settings
    discount: z.number().min(0).optional().default(0),
    paymentMode: z.enum(['CASH', 'CARD', 'ONLINE']),
    paymentStatus: z.enum(['PAID', 'PENDING']).default('PAID'),
    isInstallment: z.boolean().default(false),
  })
});

export const updateStudentSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    age: z.coerce.number().int().min(1).max(100).optional(),
    gender: z.enum(['MALE', 'FEMALE']).optional(),
    phone: z.string().optional(),
    email: z.string().email().optional(),
    level: z.string().optional(),
    category: z.enum(['TODDLER', 'KID', 'ADULT']).optional(),
    discount: z.coerce.number().min(0).optional(),
    branchId: z.string().optional(),
    profileImage: z.string().url().optional().or(z.literal('')),
    packageType: z.string().optional(),
    paymentMode: z.enum(['CASH', 'CARD', 'ONLINE']).optional(),
    membershipStartDate: z.string().optional(),
    membershipExpiryDate: z.string().optional(),
    paymentStatus: z.enum(['PAID', 'PENDING', 'PARTIAL']).optional(),
    paidAmount: z.coerce.number().min(0).optional(),
    vatAmount: z.coerce.number().min(0).optional(),
    trn: z.string().optional(),
  })
});

export const createStudentSchema = z.object({
    body: z.object({
      name: z.string().min(2, 'Name must be at least 2 characters'),
      age: z.coerce.number().int().min(1).max(100),
      gender: z.enum(['MALE', 'FEMALE']),
      email: z.string().email('Invalid email address'),
      phone: z.string().min(8, 'Phone number must be at least 8 characters'),
      password: z.string().min(6, 'Password must be at least 6 characters'),
      level: z.string().min(1, 'Level is required'),
      category: z.enum(['TODDLER', 'KID', 'ADULT']),
      packageType: z.string(),
      branchId: z.string().optional(),
      discount: z.coerce.number().min(0).optional().default(0),
      paymentMode: z.enum(['CASH', 'CARD', 'ONLINE']),
      paymentStatus: z.enum(['PAID', 'PENDING', 'PARTIAL']).default('PAID'),
      paidAmount: z.coerce.number().min(0).optional(),
      vatAmount: z.coerce.number().min(0).optional(),
      isInstallment: z.boolean().optional().default(false),
      trn: z.string().optional(),
    })
});
