import { z } from 'zod';

const hexColor = z
  .string()
  .regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, 'themeColor must be a hex color');

const idParams = z.object({
  params: z.object({ id: z.string().uuid('Invalid restaurant id') }),
});

export const createRestaurantSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2, 'Name must be at least 2 characters').max(80),
    phone: z.string().trim().max(20).optional(),
    address: z.string().trim().max(200).optional(),
    currency: z.string().trim().length(3, 'Use a 3-letter currency code').toUpperCase().optional(),
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
      phone: z.string().trim().max(20),
      address: z.string().trim().max(200),
      currency: z.string().trim().length(3).toUpperCase(),
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
