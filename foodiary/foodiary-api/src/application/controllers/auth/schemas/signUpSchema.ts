import { Profile } from '@application/entities/Profile';
import z from 'zod';

export const signUpSchema = z.object({
  account: z.object({
    email: z.string().min(1).email(),
    password: z.string().min(8),
  }),
  profile: z.object({
    name: z.string().min(1),
    birthDate: z.string().min(1).date().transform((date) => new Date(date)),
    gender: z.nativeEnum(Profile.Gender),
    height: z.number().min(0),
    weight: z.number().min(0),
    goal: z.nativeEnum(Profile.Goal),
    activityLevel: z.nativeEnum(Profile.ActivityLevel),
  }),
});

export type SignUpBody = z.infer<typeof signUpSchema>;
