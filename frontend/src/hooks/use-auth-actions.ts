'use client';

import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { api } from '@/lib/api-client';
import { useAuth } from '@/components/providers/auth-provider';
import type { User } from '@/types';
import type { LoginValues, RegisterValues } from '@/lib/validations';

interface AuthPayload {
  user: User;
  accessToken: string;
}

/**
 * Encapsulates login/register/logout side effects (session wiring, cache
 * invalidation, navigation, toasts) behind reusable mutation hooks so pages
 * stay declarative.
 */
export function useLogin() {
  const { setSession } = useAuth();
  const router = useRouter();

  return useMutation({
    mutationFn: (values: LoginValues) => api.post<AuthPayload>('/auth/login', values),
    onSuccess: (res) => {
      setSession(res.data.user, res.data.accessToken);
      toast.success(`Welcome back, ${res.data.user.name.split(' ')[0]}`);
      router.push('/dashboard');
    },
  });
}

export function useRegister() {
  const { setSession } = useAuth();
  const router = useRouter();

  return useMutation({
    mutationFn: (values: RegisterValues) => api.post<AuthPayload>('/auth/register', values),
    onSuccess: (res) => {
      setSession(res.data.user, res.data.accessToken);
      toast.success('Account created. Let’s set up your restaurant.');
      router.push('/dashboard');
    },
  });
}

export function useLogout() {
  const { clearSession } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => api.post('/auth/logout'),
    onSettled: () => {
      clearSession();
      queryClient.clear();
      router.push('/login');
    },
  });
}
