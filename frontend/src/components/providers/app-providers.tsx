'use client';

import { Toaster } from 'sonner';
import { QueryProvider } from './query-provider';
import { AuthProvider } from './auth-provider';

/** Single client boundary that wires React Query, auth session, and toasts. */
export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <AuthProvider>
        {children}
        <Toaster position="top-center" richColors closeButton />
      </AuthProvider>
    </QueryProvider>
  );
}
