import { z } from 'zod';

export const markAttendanceSchema = z.object({
  body: z.object({
    scheduleSlotId: z.string().uuid(),
    studentId: z.string().uuid(),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be YYYY-MM-DD format'),
    status: z.enum(['ATTENDED', 'ABSENT', 'INFORMED', 'FROZEN', 'NOT_MARKED']),
    comment: z.string().optional()
  })
});

export const updateAttendanceSchema = z.object({
  body: z.object({
    status: z.enum(['ATTENDED', 'ABSENT', 'INFORMED', 'FROZEN', 'NOT_MARKED']),
    comment: z.string().optional()
  })
});

export const getAttendanceSchema = z.object({
  query: z.object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    branchId: z.string().uuid().optional() // Auto injected
  })
});
