import { z } from 'zod';
import { CATEGORIES } from '../types';

export const createExpenseSchema = z.object({
  title: z
    .string({ required_error: 'Title is required.' })
    .trim()
    .min(1, 'Title must not be empty.')
    .max(40, 'Title must be 40 characters or fewer.'),

  amount: z
    .number({
      required_error: 'Amount is required.',
      invalid_type_error: 'Amount must be a number.',
    })
    .positive('Amount must be greater than zero.')
    .refine(
      (val) => Number((val * 100).toFixed(0)) === Math.round(val * 100),
      'Amount must have at most two decimal places.',
    ),

  category: z.enum(CATEGORIES, {
    required_error: 'Category is required.',
    invalid_type_error: 'Invalid category value.',
  }),

  date: z
    .string({ required_error: 'Date is required.' })
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format.')
    .refine((val) => !isNaN(Date.parse(val)), 'Date must be a valid calendar date.'),

  note: z
    .string()
    .trim()
    .max(165, 'Note must be 165 characters or fewer.')
    .optional()
    .transform((val) => (val === '' ? undefined : val)),
});

export type CreateExpenseInput = z.infer<typeof createExpenseSchema>;
