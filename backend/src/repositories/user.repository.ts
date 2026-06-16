import type { Prisma, User } from '@prisma/client';
import { prisma } from '../config/prisma';

/**
 * Data-access layer for users. Repositories are the ONLY place that talks to
 * Prisma. Services depend on these functions, never on the ORM directly, so we
 * can swap the persistence layer (or mock it in tests) without touching
 * business logic — the Dependency Inversion part of SOLID.
 */
export const userRepository = {
  findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } });
  },

  findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
  },

  create(data: Prisma.UserCreateInput): Promise<User> {
    return prisma.user.create({ data });
  },
};
