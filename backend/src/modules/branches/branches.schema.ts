import { z } from 'zod';

export const createBranchSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Branch name is required"),
    code: z.string().optional(),
    address: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().email().optional().or(z.literal('')),
    whatsapp: z.string().optional(),
    mapUrl: z.string().url().optional().or(z.literal('')),
    operatingHours: z.string().optional(),
    trn: z.string().optional(),
    isActive: z.boolean().optional().default(true)
  })
});

export const updateBranchSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    code: z.string().optional(),
    address: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().email().optional(),
    whatsapp: z.string().optional(),
    mapUrl: z.string().url().optional().or(z.literal('')),
    operatingHours: z.string().optional(),
    trn: z.string().optional(),
    isActive: z.boolean().optional()
  })
});

export const branchAdminSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Name is required"),
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.string().email("Valid email is required"),
    password: z.string().min(6, "Password must be at least 6 characters")
  })
});
