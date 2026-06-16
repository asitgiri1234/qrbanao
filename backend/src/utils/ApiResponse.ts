import type { Response } from 'express';

/**
 * Uniform success envelope so the frontend always parses the same shape:
 *   { success: true, message, data }
 * Errors use the mirror shape via the error middleware.
 */
export function sendSuccess<T>(
  res: Response,
  data: T,
  message = 'OK',
  statusCode = 200,
): Response {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
}
