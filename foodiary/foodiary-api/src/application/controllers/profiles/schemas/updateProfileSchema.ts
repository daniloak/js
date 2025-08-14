import { Profile } from '@application/entities/Profile';
import z from 'zod';

export const updateProfileSchema = z.object({
  name: z.string().min(1),
  birthDate: z.string().min(1).date().transform((date) => new Date(date)),
  gender: z.nativeEnum(Profile.Gender),
  height: z.number().min(0),
  weight: z.number().min(0),
});

export type UpdateProfileBody = z.infer<typeof updateProfileSchema>;
