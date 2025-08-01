import z from 'zod';

export const listMealsByDaySchema = z.object({
  date: z.string().min(1).date().transform((date) => new Date(date)),
});
