import { z } from 'zod';
import { ISO_CURRENCY_CODES } from '../utils/currencies';

const hexColor = z
  .string()
  .regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, 'themeColor must be a hex color');

// Phone: only digits and common separators, and it must actually contain a
// realistic count of digits (7–15, per ITU E.164) — so free text is rejected.
const countDigits = (value: string): number => (value.match(/\d/g) ?? []).length;
const phone = z
  .string()
  .trim()
  .regex(/^\+?[0-9\s\-()]+$/, 'Phone may only contain digits, spaces and + - ( )')
  .refine((v) => countDigits(v) >= 7 && countDigits(v) <= 15, {
    message: 'Enter a valid phone number (7–15 digits)',
  });

// Currency: must be a real ISO 4217 code, not any 3-letter string.
const currency = z
  .string()
  .trim()
  .toUpperCase()
  .refine((v) => ISO_CURRENCY_CODES.has(v), {
    message: 'Use a valid ISO currency code (e.g. INR, USD, EUR)',
  });

const idParams = z.object({
  params: z.object({ id: z.string().uuid('Invalid restaurant id') }),
});

export const createRestaurantSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2, 'Name must be at least 2 characters').max(80),
    phone: phone.optional(),
    address: z.string().trim().max(200).optional(),
    currency: currency.optional(),
    themeColor: hexColor.optional(),
    logo: z.string().url('Logo must be a URL').optional(),
    description: z.string().trim().max(500).optional(),
  }),
});

export const updateRestaurantSchema = z.object({
  params: idParams.shape.params,
  body: z
    .object({
      name: z.string().trim().min(2).max(80),
      phone,
      address: z.string().trim().max(200),
      currency,
      themeColor: hexColor,
      logo: z.string().url(),
      description: z.string().trim().max(500),
      status: z.enum(['ACTIVE', 'INACTIVE']),
    })
    .partial()
    .refine((data) => Object.keys(data).length > 0, {
      message: 'Provide at least one field to update',
    }),
});

export const restaurantIdSchema = idParams;

export type CreateRestaurantInput = z.infer<typeof createRestaurantSchema>['body'];
export type UpdateRestaurantInput = z.infer<typeof updateRestaurantSchema>['body'];
