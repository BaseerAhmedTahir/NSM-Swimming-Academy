import { z } from 'zod';

export const createCancellationSchema = z.object({
  body: z.object({
    studentId: z.string().uuid(),
    branchId: z.string().uuid().optional(),
    reason: z.string().min(1, 'Reason is required'),
    cancellationDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be YYYY-MM-DD'),
    feesTaken: z.number().min(0).default(0),
    refundAmount: z.number().min(0).default(0),
    notes: z.string().optional()
  })
});

export const updateCancellationSchema = z.object({
  body: z.object({
    feesTaken: z.number().min(0).optional(),
    refundAmount: z.number().min(0).optional(),
    notes: z.string().optional()
  })
});
