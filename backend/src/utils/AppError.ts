/**
 * Operational error with an HTTP status code.
 *
 * Throwing these from services/repositories lets the central error middleware
 * translate them into clean JSON responses, keeping `try/catch` noise out of
 * controllers. `isOperational` distinguishes expected errors (bad input, not
 * found) from programmer bugs, which we never want to leak to the client.
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly details?: unknown;

  constructor(statusCode: number, message: string, details?: unknown) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    this.details = details;
    Object.setPrototypeOf(this, AppError.prototype);
    Error.captureStackTrace?.(this, this.constructor);
  }

  static badRequest(message = 'Bad request', details?: unknown) {
    return new AppError(400, message, details);
  }

  static unauthorized(message = 'Unauthorized') {
    return new AppError(401, message);
  }

  static forbidden(message = 'Forbidden') {
    return new AppError(403, message);
  }

  static notFound(message = 'Resource not found') {
    return new AppError(404, message);
  }

  static conflict(message = 'Resource already exists') {
    return new AppError(409, message);
  }
}
