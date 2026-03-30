import { z } from 'zod';

export const getReportsSchema = z.object({
  query: z.object({
    branchId: z.string().uuid().optional(),
    month: z.string().regex(/^(1[0-2]|[1-9])$/).optional(),
    year: z.string().regex(/^\d{4}$/).optional(),
    format: z.enum(['JSON', 'PDF']).default('JSON')
  })
});
