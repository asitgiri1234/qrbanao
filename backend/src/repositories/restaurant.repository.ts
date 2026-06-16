import type { Prisma, Restaurant } from '@prisma/client';
import { prisma } from '../config/prisma';

export const restaurantRepository = {
  create(data: Prisma.RestaurantUncheckedCreateInput): Promise<Restaurant> {
    return prisma.restaurant.create({ data });
  },

  findManyByOwner(ownerId: string): Promise<Restaurant[]> {
    return prisma.restaurant.findMany({
      where: { ownerId },
      orderBy: { createdAt: 'desc' },
    });
  },

  findById(id: string): Promise<Restaurant | null> {
    return prisma.restaurant.findUnique({ where: { id } });
  },

  findBySlug(slug: string): Promise<Restaurant | null> {
    return prisma.restaurant.findUnique({ where: { slug } });
  },

  update(id: string, data: Prisma.RestaurantUpdateInput): Promise<Restaurant> {
    return prisma.restaurant.update({ where: { id }, data });
  },

  delete(id: string): Promise<Restaurant> {
    return prisma.restaurant.delete({ where: { id } });
  },
};
