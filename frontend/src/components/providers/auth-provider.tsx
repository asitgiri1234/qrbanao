'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { api, tokenStore } from '@/lib/api-client';
import type { User } from '@/types';

interface AuthContextValue {
  user: User | null;
  /** True while we bootstrap the session on first load. */
  isLoading: boolean;
  isAuthenticated: boolean;
  setSession: (user: User, accessToken: string) => void;
  refreshUser: () => Promise<void>;
  clearSession: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/**
 * Holds the authenticated user in React state and the access token in memory
 * (via tokenStore). On mount it attempts a silent refresh: if a valid httpOnly
 * refresh cookie exists, the user stays logged in across reloads without ever
 * persisting a token to localStorage.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const setSession = useCallback((nextUser: User, accessToken: string) => {
    tokenStore.set(accessToken);
    setUser(nextUser);
  }, []);

  const clearSession = useCallback(() => {
    tokenStore.set(null);
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    const res = await api.get<{ user: User }>('/auth/me');
    setUser(res.data.user);
  }, []);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        // Exchange the refresh cookie for a fresh access token, then load the user.
        const refreshed = await api.post<{ accessToken: string }>('/auth/refresh');
        tokenStore.set(refreshed.data.accessToken);
        const me = await api.get<{ user: User }>('/auth/me');
        if (active) setUser(me.data.user);
      } catch {
        if (active) clearSession();
      } finally {
        if (active) setIsLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [clearSession]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: Boolean(user),
        setSession,
        refreshUser,
        clearSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
