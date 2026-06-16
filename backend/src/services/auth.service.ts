import type { User } from '@prisma/client';
import { userRepository } from '../repositories/user.repository';
import { hashPassword, verifyPassword } from '../utils/password';
import { AppError } from '../utils/AppError';
import { tokenService, type TokenPair } from './token.service';
import type { LoginInput, RegisterInput } from '../validators/auth.validator';

/** User shape returned to clients — never includes the password hash. */
export type PublicUser = Omit<User, 'password'>;

export interface AuthResult {
  user: PublicUser;
  tokens: TokenPair;
}

const toPublicUser = (user: User): PublicUser => {
  const { password: _password, ...rest } = user;
  return rest;
};

class AuthService {
  async register(input: RegisterInput): Promise<AuthResult> {
    const existing = await userRepository.findByEmail(input.email);
    if (existing) {
      // 409, not 400 — the request was well-formed, the resource just collides.
      throw AppError.conflict('An account with this email already exists');
    }

    const user = await userRepository.create({
      name: input.name,
      email: input.email,
      password: await hashPassword(input.password),
    });

    const tokens = await tokenService.issueTokenPair(user);
    return { user: toPublicUser(user), tokens };
  }

  async login(input: LoginInput): Promise<AuthResult> {
    const user = await userRepository.findByEmail(input.email);

    // Generic message + always running compare-like work avoids leaking which
    // emails are registered (user enumeration).
    if (!user) {
      throw AppError.unauthorized('Invalid email or password');
    }

    const ok = await verifyPassword(input.password, user.password);
    if (!ok) {
      throw AppError.unauthorized('Invalid email or password');
    }

    const tokens = await tokenService.issueTokenPair(user);
    return { user: toPublicUser(user), tokens };
  }

  async getProfile(userId: string): Promise<PublicUser> {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw AppError.notFound('User not found');
    }
    return toPublicUser(user);
  }
}

export const authService = new AuthService();
