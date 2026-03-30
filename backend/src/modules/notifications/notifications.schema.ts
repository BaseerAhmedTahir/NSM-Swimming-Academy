import { z } from 'zod';

export const createNotificationSchema = z.object({
  body: z.object({
    branchId: z.string().uuid().optional(),
    title: z.string().min(1, 'Title is required'),
    message: z.string().min(1, 'Message is required'),
    type: z.enum(['SYSTEM', 'PROMOTION', 'REMINDER', 'MISSED_CLASS', 'PAYMENT_DUE', 'CUSTOM']),
    sentTo: z.enum(['ALL', 'BRANCH', 'STUDENT_LEVEL', 'INDIVIDUAL']),
    targetId: z.string().uuid().optional(),
  })
});

export const markReadSchema = z.object({
  body: z.object({
    notificationIds: z.array(z.string().uuid())
  })
});
