import crypto from 'node:crypto';

/**
 * One-way hash for refresh tokens before they touch the database.
 * SHA-256 (not bcrypt) is intentional: the input is a high-entropy random JWT,
 * not a low-entropy human password, so we want fast deterministic lookups by
 * hash rather than per-row salted comparisons.
 */
export const sha256 = (value: string): string =>
  crypto.createHash('sha256').update(value).digest('hex');
