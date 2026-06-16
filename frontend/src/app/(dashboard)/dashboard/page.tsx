'use client';

import { useState } from 'react';
import { Plus, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/components/providers/auth-provider';
import { useRestaurants, useDeleteRestaurant } from '@/hooks/use-restaurants';
import { CreateRestaurantDialog } from '@/components/dashboard/create-restaurant-dialog';
import { RestaurantCard } from '@/components/dashboard/restaurant-card';
import { EmptyState } from '@/components/dashboard/empty-state';

export default function DashboardPage() {
  const { user } = useAuth();
  const { data: restaurants, isLoading, isError, refetch } = useRestaurants();
  const deleteRestaurant = useDeleteRestaurant();
  const [dialogOpen, setDialogOpen] = useState(false);

  const firstName = user?.name?.split(' ')[0] ?? 'there';
  const hasRestaurants = (restaurants?.length ?? 0) > 0;

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this restaurant? This cannot be undone.')) {
      deleteRestaurant.mutate(id);
    }
  };

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Welcome back, {firstName}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {hasRestaurants
              ? 'Manage your restaurants and digital storefronts.'
              : 'Let’s get your first restaurant online.'}
          </p>
        </div>
        {hasRestaurants && (
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="size-4" />
            Add restaurant
          </Button>
        )}
      </div>

      {/* Content states: loading → error → empty → list */}
      {isLoading ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-72 rounded-xl" />
          ))}
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-destructive/30 bg-destructive/5 py-16 text-center">
          <AlertCircle className="mb-3 size-7 text-destructive" />
          <p className="text-sm font-medium">We couldn’t load your restaurants.</p>
          <Button variant="outline" size="sm" className="mt-4" onClick={() => refetch()}>
            Try again
          </Button>
        </div>
      ) : hasRestaurants ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {restaurants!.map((restaurant) => (
            <RestaurantCard
              key={restaurant.id}
              restaurant={restaurant}
              onDelete={handleDelete}
              deleting={deleteRestaurant.isPending}
            />
          ))}
        </div>
      ) : (
        <EmptyState onCreate={() => setDialogOpen(true)} />
      )}

      <CreateRestaurantDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
}
