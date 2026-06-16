'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { api } from '@/lib/api-client';
import type { Restaurant } from '@/types';
import type { CreateRestaurantValues } from '@/lib/validations';

const KEY = ['restaurants'] as const;

/** Strip empty optional strings so we don't send `""` to the API. */
function clean(values: CreateRestaurantValues): Record<string, string> {
  return Object.fromEntries(
    Object.entries(values).filter(([, v]) => v !== undefined && v !== ''),
  ) as Record<string, string>;
}

export function useRestaurants() {
  return useQuery({
    queryKey: KEY,
    queryFn: async () => {
      const res = await api.get<{ restaurants: Restaurant[] }>('/restaurants');
      return res.data.restaurants;
    },
  });
}

export function useCreateRestaurant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: CreateRestaurantValues) => {
      const res = await api.post<{ restaurant: Restaurant }>('/restaurants', clean(values));
      return res.data.restaurant;
    },
    onSuccess: (restaurant) => {
      queryClient.invalidateQueries({ queryKey: KEY });
      toast.success(`${restaurant.name} is live on QRbanao 🎉`);
    },
  });
}

export function useDeleteRestaurant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.delete(`/restaurants/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KEY });
      toast.success('Restaurant deleted');
    },
  });
}
