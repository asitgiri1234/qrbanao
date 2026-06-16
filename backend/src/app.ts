import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { type Application } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { env, isProd } from './config/env';
import { apiRouter } from './routes';
import { errorHandler, notFoundHandler } from './middlewares/error.middleware';

/**
 * Builds and configures the Express application. Kept separate from the server
 * bootstrap (server.ts) so it can be imported directly by integration tests
 * without binding a port.
 */
export const createApp = (): Application => {
  const app = express();

  // Security headers.
  app.use(helmet());

  // CORS — credentials:true is required so the browser sends/receives the
  // httpOnly refresh cookie. Origin is locked to the configured frontend.
  app.use(
    cors({
      origin: env.CORS_ORIGIN.split(',').map((o) => o.trim()),
      credentials: true,
    }),
  );

  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  if (!isProd) {
    app.use(morgan('dev'));
  }

  // Trust the reverse proxy (needed for secure cookies behind nginx/load balancers).
  app.set('trust proxy', 1);

  app.use('/api/v1', apiRouter);

  // 404 + centralized error handling are registered last.
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
