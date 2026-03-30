import { z } from 'zod';

export const cancelClassSchema = z.object({
    body: z.object({
        // Mobile app sends 'scheduleId' (which is the scheduleSlot.id)
        scheduleId: z.string().uuid()
    })
});
