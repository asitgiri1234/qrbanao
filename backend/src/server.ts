import { createApp } from './app';
import { env } from './config/env';
import { prisma } from './config/prisma';

/**
 * Server bootstrap: connect to the database, start listening, and wire up
 * graceful shutdown so in-flight requests finish and the DB pool closes
 * cleanly on SIGINT/SIGTERM (important in containerized deployments).
 */
async function bootstrap(): Promise<void> {
  await prisma.$connect();

  const app = createApp();
  const server = app.listen(env.PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`🚀 QRbanao API listening on http://localhost:${env.PORT} (${env.NODE_ENV})`);
  });

  const shutdown = async (signal: string): Promise<void> => {
    // eslint-disable-next-line no-console
    console.log(`\n${signal} received, shutting down gracefully...`);
    server.close(async () => {
      await prisma.$disconnect();
      process.exit(0);
    });
    // Force-exit if connections do not drain in time.
    setTimeout(() => process.exit(1), 10_000).unref();
  };

  process.on('SIGINT', () => void shutdown('SIGINT'));
  process.on('SIGTERM', () => void shutdown('SIGTERM'));
}

bootstrap().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('Failed to start server:', err);
  process.exit(1);
});
