import { z } from 'zod';

export const saveSettingsSchema = z.object({
  body: z.object({
    settings: z.array(z.object({
      key: z.string().min(1),
      value: z.string().min(1),
      category: z.string().optional()
    }))
  })
});
