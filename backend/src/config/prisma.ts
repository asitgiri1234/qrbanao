import { PrismaClient } from '@prisma/client';
import { isProd } from './env';

/**
 * A single shared PrismaClient instance.
 *
 * Why a singleton: each PrismaClient owns a connection pool. Creating one per
 * request would exhaust Postgres connections under load. In development we also
 * cache it on `globalThis` so hot-reloading (tsx watch) does not spawn a new
 * client on every file change.
 */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: isProd ? ['error'] : ['query', 'warn', 'error'],
  });

if (!isProd) {
  globalForPrisma.prisma = prisma;
}
