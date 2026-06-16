import type { NextFunction, Request, RequestHandler, Response } from 'express';

/**
 * Wraps an async controller so any rejected promise is forwarded to Express's
 * error middleware. Without this, every controller would need its own
 * try/catch, which clutters the thin-controller layer.
 */
export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>): RequestHandler =>
  (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
