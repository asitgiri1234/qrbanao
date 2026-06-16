import type { ApiError, ApiSuccess } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1';

/** Error thrown for any non-2xx API response, carrying field-level details. */
export class ApiRequestError extends Error {
  status: number;
  fieldErrors?: Record<string, string[]>;

  constructor(status: number, message: string, fieldErrors?: Record<string, string[]>) {
    super(message);
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

/*
 * Access token lives in memory only (not localStorage) to reduce XSS blast
 * radius. The refresh token is an httpOnly cookie the browser sends
 * automatically. On a 401 we transparently call /auth/refresh once and retry,
 * de-duplicating concurrent refreshes so a burst of requests triggers a single
 * refresh round-trip.
 */
let accessToken: string | null = null;
let refreshPromise: Promise<boolean> | null = null;

export const tokenStore = {
  get: () => accessToken,
  set: (token: string | null) => {
    accessToken = token;
  },
};

interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
  /** Internal: skip the refresh-and-retry dance (used by refresh itself). */
  skipAuthRetry?: boolean;
}

async function rawRequest<T>(path: string, options: RequestOptions = {}): Promise<ApiSuccess<T>> {
  const { body, headers, skipAuthRetry, ...rest } = options;

  const res = await fetch(`${API_URL}${path}`, {
    ...rest,
    credentials: 'include', // send the refresh cookie
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401 && !skipAuthRetry && path !== '/auth/login') {
    const refreshed = await tryRefresh();
    if (refreshed) {
      return rawRequest<T>(path, { ...options, skipAuthRetry: true });
    }
  }

  const json = (await res.json().catch(() => null)) as ApiSuccess<T> | ApiError | null;

  if (!res.ok || !json || json.success === false) {
    const err = json as ApiError | null;
    throw new ApiRequestError(
      res.status,
      err?.message ?? 'Request failed',
      err?.errors,
    );
  }

  return json;
}

async function tryRefresh(): Promise<boolean> {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      try {
        const res = await rawRequest<{ accessToken: string }>('/auth/refresh', {
          method: 'POST',
          skipAuthRetry: true,
        });
        accessToken = res.data.accessToken;
        return true;
      } catch {
        accessToken = null;
        return false;
      } finally {
        refreshPromise = null;
      }
    })();
  }
  return refreshPromise;
}

/** Thin typed verb helpers — the surface the rest of the app imports. */
export const api = {
  get: <T>(path: string) => rawRequest<T>(path, { method: 'GET' }),
  post: <T>(path: string, body?: unknown) => rawRequest<T>(path, { method: 'POST', body }),
  put: <T>(path: string, body?: unknown) => rawRequest<T>(path, { method: 'PUT', body }),
  delete: <T>(path: string) => rawRequest<T>(path, { method: 'DELETE' }),
};
