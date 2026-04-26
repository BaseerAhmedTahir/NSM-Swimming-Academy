import { z } from 'zod';

export const createCoachSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name is required'),
    email: z.string().email('Invalid email address'),
    phone: z.string().min(8, 'Phone number must be at least 8 digits'),
    branchId: z.string().uuid('Invalid branch ID').optional() 
    // ^ Optional because it will be auto-injected by branchScope if admin is STAFF
  })
});

export const updateCoachSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
    branchId: z.string().uuid().optional(),
    isActive: z.boolean().optional()
  })
});

export const assignStudentsSchema = z.object({
    body: z.object({
        studentIds: z.array(z.string().uuid()).min(1, 'At least one student ID required')
    })
});
