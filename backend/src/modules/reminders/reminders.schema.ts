import { z } from 'zod';

export const createReminderSchema = z.object({
  body: z.object({
    branchId: z.string().uuid().optional(),
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional(),
    // Accept any ISO date string (frontend may send timezone-aware strings)
    dueDate: z.string().min(1, 'Due date is required'),
    type: z.enum(['PAYMENT_OVERDUE', 'STUDENT_FOLLOWUP', 'CALL_REQUEST', 'CUSTOM']).optional().default('CUSTOM'),
    relatedId: z.string().uuid().optional(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).default('MEDIUM'),

    // Cross-branch / multi-target fields
    targetType: z.enum(['self', 'branch', 'email']).optional().default('self'),
    targetValue: z.string().optional(),          // branchId (UUID) or email address
    targetBranchId: z.string().uuid().optional(), // direct override if needed
    reminderFor: z.enum(['MYSELF', 'OTHER_BRANCH', 'SPECIFIC_PERSON', 'STUDENT']).optional(),
  })
});

export const updateReminderSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    dueDate: z.string().optional(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
    status: z.enum(['PENDING', 'COMPLETED', 'SNOOZED']).optional(),
    targetType: z.enum(['self', 'branch', 'email']).optional(),
    targetValue: z.string().optional(),
    targetBranchId: z.string().uuid().optional(),
    reminderFor: z.enum(['MYSELF', 'OTHER_BRANCH', 'SPECIFIC_PERSON', 'STUDENT']).optional(),
    message: z.string().optional(),
    scheduledTime: z.string().optional(),
    completedAt: z.string().optional(),
    snoozedUntil: z.string().optional(),
  })
});

export const snoozeReminderSchema = z.object({
  body: z.object({
    snoozeUntil: z.string().min(1)
  })
});
