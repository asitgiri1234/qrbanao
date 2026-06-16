import type { NextFunction, Request, Response } from 'express';
import { ZodError, type ZodTypeAny } from 'zod';
import { AppError } from '../utils/AppError';

/**
 * Generic Zod validation middleware. Each schema validates `{ body, params,
 * query }` together and we write the parsed (and coerced/trimmed) values back
 * onto the request, so controllers receive clean, typed input.
 */
export const validate =
  (schema: ZodTypeAny) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    try {
      const parsed = schema.parse({
        body: req.body,
        params: req.params,
        query: req.query,
      }) as { body?: unknown; params?: unknown; query?: unknown };

      if (parsed.body !== undefined) req.body = parsed.body;
      if (parsed.params !== undefined) req.params = parsed.params as Request['params'];
      // req.query is a getter in Express 5 / readonly in some setups; assign defensively.
      if (parsed.query !== undefined) {
        Object.defineProperty(req, 'query', { value: parsed.query, configurable: true });
      }
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const details = err.flatten().fieldErrors;
        next(AppError.badRequest('Validation failed', details));
        return;
      }
      next(err);
    }
  };
