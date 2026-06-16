import crypto from 'node:crypto';
import { env } from '../config/env';
import { refreshTokenRepository } from '../repositories/refreshToken.repository';
import { userRepository } from '../repositories/user.repository';
import { sha256 } from '../utils/crypto';
import { AppError } from '../utils/AppError';
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from '../utils/jwt';

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

/**
 * Owns the lifecycle of access + refresh tokens.
 *
 * Design:
 *  - Access tokens are short-lived and stateless (never stored).
 *  - Refresh tokens are long-lived JWTs. Their SHA-256 hash is persisted so we
 *    can revoke them server-side. We also ROTATE them: every refresh issues a
 *    new token and revokes the old one. If an attacker replays a stolen-and-
 *    already-used token we can detect reuse later and harden from there.
 */
const REFRESH_TTL_MS = 7 * 24 * 60 * 60 * 1000; // mirrors JWT_REFRESH_EXPIRES_IN default

class TokenService {
  async issueTokenPair(user: { id: string; email: string }): Promise<TokenPair> {
    const accessToken = signAccessToken({ sub: user.id, email: user.email });

    const jti = crypto.randomUUID();
    const refreshToken = signRefreshToken({ sub: user.id, jti });

    await refreshTokenRepository.create({
      userId: user.id,
      tokenHash: sha256(refreshToken),
      expiresAt: new Date(Date.now() + REFRESH_TTL_MS),
    });

    return { accessToken, refreshToken };
  }

  /**
   * Validate an incoming refresh token, rotate it, and return a fresh pair.
   * Throws 401 if the token is invalid, expired, revoked, or unknown.
   */
  async rotate(refreshToken: string): Promise<TokenPair> {
    let payload;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch {
      throw AppError.unauthorized('Invalid or expired refresh token');
    }

    const tokenHash = sha256(refreshToken);
    const stored = await refreshTokenRepository.findByHash(tokenHash);

    if (!stored || stored.revokedAt || stored.expiresAt < new Date()) {
      throw AppError.unauthorized('Refresh token is no longer valid');
    }

    // The user must still exist (handles account deletion mid-session).
    const user = await userRepository.findById(payload.sub);
    if (!user) {
      throw AppError.unauthorized('Account no longer exists');
    }

    // Rotation: invalidate the presented token before minting a new pair.
    await refreshTokenRepository.revokeByHash(tokenHash);

    return this.issueTokenPair({ id: user.id, email: user.email });
  }

  /** Best-effort revoke on logout; silent if the token is already gone. */
  async revoke(refreshToken: string): Promise<void> {
    try {
      const tokenHash = sha256(refreshToken);
      const stored = await refreshTokenRepository.findByHash(tokenHash);
      if (stored && !stored.revokedAt) {
        await refreshTokenRepository.revokeByHash(tokenHash);
      }
    } catch {
      // Logout must always succeed from the client's perspective.
    }
  }

  /** Cookie attributes for the refresh token — httpOnly so JS can't read it. */
  get refreshCookieOptions() {
    return {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      path: '/api/v1/auth',
      maxAge: REFRESH_TTL_MS,
    };
  }
}

export const tokenService = new TokenService();
