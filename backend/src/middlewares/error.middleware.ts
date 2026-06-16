import type { NextFunction, Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import { AppError } from '../utils/AppError';
import { isProd } from '../config/env';

/** 404 handler for unmatched routes. */
export const notFoundHandler = (req: Request, _res: Response, next: NextFunction): void => {
  next(AppError.notFound(`Route ${req.method} ${req.originalUrl} not found`));
};

/**
 * Central error handler. Converts known error types into a consistent JSON
 * envelope and hides internal details in production. This is the single place
 * responsible for shaping error responses.
 */
export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
): void => {
  let statusCode = 500;
  let message = 'Something went wrong';
  let details: unknown;

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    details = err.details;
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // P2002 = unique constraint violation (e.g. duplicate slug/email).
    if (err.code === 'P2002') {
      statusCode = 409;
      message = 'A record with these details already exists';
    } else if (err.code === 'P2025') {
      statusCode = 404;
      message = 'Resource not found';
    } else {
      statusCode = 400;
      message = 'Database request error';
    }
  } else if (err instanceof Error && !isProd) {
    message = err.message;
  }

  if (statusCode >= 500) {
    // eslint-disable-next-line no-console
    console.error('[error]', err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(details ? { errors: details } : {}),
    ...(!isProd && err instanceof Error ? { stack: err.stack } : {}),
  });
};
