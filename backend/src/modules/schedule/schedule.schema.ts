import { z } from 'zod';

export const getGridSchema = z.object({
  query: z.object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be YYYY-MM-DD format'),
    branchId: z.string().uuid().optional() // Optional injected
  })
});

export const assignSlotSchema = z.object({
  body: z.object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    coachId: z.string().uuid(),
    timeSlot: z.string(), // e.g. "4:00 PM"
    slotPosition: z.number().int().min(1).max(10),
    studentId: z.string().uuid()
  })
});

export const removeSlotSchema = z.object({
  body: z.object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    coachId: z.string().uuid(),
    timeSlot: z.string(),
    slotPosition: z.number().int().min(1).max(10)
  })
});

export const swapSlotSchema = z.object({
  body: z.object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    fromCoachId: z.string().uuid(),
    fromTimeSlot: z.string(),
    fromSlotPosition: z.number().int().min(1).max(10),
    toCoachId: z.string().uuid(),
    toTimeSlot: z.string(),
    toSlotPosition: z.number().int().min(1).max(10),
  })
});
