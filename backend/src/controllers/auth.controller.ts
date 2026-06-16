import type { Request, Response } from 'express';
import { authService } from '../services/auth.service';
import { tokenService } from '../services/token.service';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess } from '../utils/ApiResponse';
import { AppError } from '../utils/AppError';

const REFRESH_COOKIE = 'qrb_refresh';

/**
 * Controllers stay thin: read input, call a service, set the refresh cookie,
 * return the success envelope. All rules live in the service layer.
 *
 * The refresh token is delivered as an httpOnly cookie (XSS-safe). The access
 * token is returned in the JSON body for the SPA to hold in memory.
 */
export const authController = {
  register: asyncHandler(async (req: Request, res: Response) => {
    const { user, tokens } = await authService.register(req.body);
    res.cookie(REFRESH_COOKIE, tokens.refreshToken, tokenService.refreshCookieOptions);
    return sendSuccess(res, { user, accessToken: tokens.accessToken }, 'Account created', 201);
  }),

  login: asyncHandler(async (req: Request, res: Response) => {
    const { user, tokens } = await authService.login(req.body);
    res.cookie(REFRESH_COOKIE, tokens.refreshToken, tokenService.refreshCookieOptions);
    return sendSuccess(res, { user, accessToken: tokens.accessToken }, 'Logged in');
  }),

  refresh: asyncHandler(async (req: Request, res: Response) => {
    const token = req.cookies?.[REFRESH_COOKIE] as string | undefined;
    if (!token) {
      throw AppError.unauthorized('Missing refresh token');
    }
    const tokens = await tokenService.rotate(token);
    res.cookie(REFRESH_COOKIE, tokens.refreshToken, tokenService.refreshCookieOptions);
    return sendSuccess(res, { accessToken: tokens.accessToken }, 'Token refreshed');
  }),

  logout: asyncHandler(async (req: Request, res: Response) => {
    const token = req.cookies?.[REFRESH_COOKIE] as string | undefined;
    if (token) {
      await tokenService.revoke(token);
    }
    res.clearCookie(REFRESH_COOKIE, { path: tokenService.refreshCookieOptions.path });
    return sendSuccess(res, null, 'Logged out');
  }),

  me: asyncHandler(async (req: Request, res: Response) => {
    const user = await authService.getProfile(req.user!.id);
    return sendSuccess(res, { user }, 'OK');
  }),
};
