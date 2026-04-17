import { z } from 'zod';

export const createExpenseSchema = z.object({
    body: z.object({
        title:    z.string().min(1, 'Title is required'),
        category: z.enum(['COACH_SALARY', 'FACILITY_RENT', 'UTILITIES', 'EQUIPMENT', 'MARKETING', 'ADMIN_COST', 'OTHER']),
        amount:   z.coerce.number().positive('Amount must be positive'),
        date:     z.string().min(1, 'Date is required'),
        branchId: z.string().optional().nullable(),
        notes:    z.string().optional().nullable(),
    })
});

export const updateExpenseSchema = z.object({
    body: z.object({
        title:    z.string().min(1).optional(),
        category: z.enum(['COACH_SALARY', 'FACILITY_RENT', 'UTILITIES', 'EQUIPMENT', 'MARKETING', 'ADMIN_COST', 'OTHER']).optional(),
        amount:   z.coerce.number().positive().optional(),
        date:     z.string().optional(),
        branchId: z.string().optional().nullable(),
        notes:    z.string().optional().nullable(),
    })
});

