import bcrypt from 'bcryptjs';

// 12 rounds is a good 2025-era balance between brute-force resistance and
// login latency for an interactive web app.
const SALT_ROUNDS = 12;

export const hashPassword = (plain: string): Promise<string> =>
  bcrypt.hash(plain, SALT_ROUNDS);

export const verifyPassword = (plain: string, hash: string): Promise<boolean> =>
  bcrypt.compare(plain, hash);
