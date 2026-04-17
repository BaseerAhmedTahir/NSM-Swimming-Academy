import { z } from 'zod';

export const createPaymentSchema = z.object({
  body: z.object({
    studentId: z.string().uuid(),
    branchId: z.string().uuid().optional(),
    amount: z.number().min(0, 'Amount must be positive'),
    discount: z.number().min(0).default(0),
    paidAmount: z.number().min(0),
    paymentMode: z.enum(['CASH', 'CARD', 'ONLINE']),
    status: z.enum(['PAID', 'PENDING', 'PARTIAL', 'OVERDUE', 'REFUNDED']),
    packageType: z.string(),
    registrationType: z.enum(['NEW', 'RENEW']),
    isInstallment: z.boolean().default(false),
    notes: z.string().optional()
  })
});

export const updatePaymentSchema = z.object({
  body: z.object({
    paidAmount: z.number().min(0).optional(),
    status: z.enum(['PAID', 'PENDING', 'PARTIAL', 'OVERDUE', 'REFUNDED']).optional(),
    notes: z.string().optional()
  })
});

export const createInstallmentSchema = z.object({
  body: z.object({
    paymentId: z.string().uuid(),
    amount: z.number().min(0),
    dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/)
  })
});

export const updateInstallmentSchema = z.object({
  body: z.object({
    status: z.enum(['PAID', 'PENDING', 'PARTIAL', 'OVERDUE', 'REFUNDED']),
    paidDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  })
});
