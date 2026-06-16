import 'express';

/**
 * Augment Express' Request with the authenticated user, populated by the auth
 * middleware. Keeping it here gives every downstream handler typed access to
 * `req.user` without casting.
 */
declare global {
  namespace Express {
    interface UserContext {
      id: string;
      email: string;
    }

    interface Request {
      user?: UserContext;
    }
  }
}

export {};
