import { z } from 'zod';

export const createFreezingSchema = z.object({
  body: z.object({
    studentId: z.string().uuid(),
    branchId: z.string().uuid().optional(),
    comment: z.string().min(1, 'Comment/Reason is required'),
    freezeStartDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be YYYY-MM-DD format'),
    freezeEndDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be YYYY-MM-DD format'),
    duration: z.number().int().min(1).default(1),
    frozenBy: z.string().optional()
  })
});

export const updateFreezingSchema = z.object({
  body: z.object({
    comment: z.string().optional(),
    duration: z.number().int().min(1).optional(),
    freezeEndDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be YYYY-MM-DD format').optional()
  })
});

export const unfreezeSchema = z.object({
  body: z.object({
    notes: z.string().optional()
  })
});
