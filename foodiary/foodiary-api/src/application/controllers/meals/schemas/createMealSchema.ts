import { mbToBytes } from '@shared/utils/mbToBytes';
import z from 'zod';

export const createMealSchema = z.object({
  file: z.object({
    type: z.enum(['audio/m4a', 'image/jpeg']),
    size: z.number().min(1).max(mbToBytes(10)),
  }),
});

export type CreateMealBody = z.infer<typeof createMealSchema>;
