import { z } from 'zod';

export const createNotificationSchema = z.object({
  body: z.object({
    branchId: z.string().uuid().optional(),
    title: z.string().min(1, 'Title is required'),
    message: z.string().min(1, 'Message is required'),
    type: z.enum(['HOLIDAY', 'CLASS_UPDATE', 'OFFER', 'FEE_REMINDER', 'ASSESSMENT_RESULT', 'MISSED_CLASS', 'WELCOME', 'GENERAL', 'CLASS_CANCELLED']),
    sentTo: z.enum(['INDIVIDUAL', 'ALL', 'BRANCH', 'COACH_STUDENTS', 'PENDING_FEES']),
    targetId: z.string().uuid().optional(),
  })
});

export const markReadSchema = z.object({
  body: z.object({
    notificationIds: z.array(z.string().uuid())
  })
});
