import { z } from 'zod';

export const createReviewSchema = z.object({
    body: z.object({
        rating: z.coerce.number().int().min(1).max(5),
        text: z.string().max(500).optional(),
    })
});
