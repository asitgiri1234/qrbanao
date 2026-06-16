import { z } from 'zod';
import { ISO_CURRENCY_CODES } from './currencies';

/** Shared client-side schemas — mirror the backend validators for parity. */

const countDigits = (value: string): number => (value.match(/\d/g) ?? []).length;

// Optional phone: empty means "not provided"; otherwise it must look like a
// real number (digits + separators, 7–15 digits) — no free text.
const optionalPhone = z
  .string()
  .trim()
  .refine((v) => v === '' || /^\+?[0-9\s\-()]+$/.test(v), {
    message: 'Phone may only contain digits, spaces and + - ( )',
  })
  .refine((v) => v === '' || (countDigits(v) >= 7 && countDigits(v) <= 15), {
    message: 'Enter a valid phone number (7–15 digits)',
  });

// Optional currency: empty falls back to the default; otherwise a real ISO code.
const optionalCurrency = z
  .string()
  .trim()
  .toUpperCase()
  .refine((v) => v === '' || ISO_CURRENCY_CODES.has(v), {
    message: 'Use a valid ISO code (e.g. INR, USD, EUR)',
  });

export const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(80),
  email: z.string().min(1, 'Email is required').email('Enter a valid email'),
  password: z
    .string()
    .min(8, 'At least 8 characters')
    .regex(/[a-z]/, 'Include a lowercase letter')
    .regex(/[A-Z]/, 'Include an uppercase letter')
    .regex(/[0-9]/, 'Include a number'),
});

export const createRestaurantSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(80),
  phone: optionalPhone,
  address: z.string().max(200).optional().or(z.literal('')),
  currency: optionalCurrency,
  themeColor: z
    .string()
    .regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, 'Enter a hex color')
    .optional()
    .or(z.literal('')),
  description: z.string().max(500).optional().or(z.literal('')),
});

export type LoginValues = z.infer<typeof loginSchema>;
export type RegisterValues = z.infer<typeof registerSchema>;
export type CreateRestaurantValues = z.infer<typeof createRestaurantSchema>;
