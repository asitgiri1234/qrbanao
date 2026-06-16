'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { createRestaurantSchema, type CreateRestaurantValues } from '@/lib/validations';
import { useCreateRestaurant } from '@/hooks/use-restaurants';
import { ApiRequestError } from '@/lib/api-client';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateRestaurantDialog({ open, onOpenChange }: Props) {
  const createRestaurant = useCreateRestaurant();
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CreateRestaurantValues>({
    resolver: zodResolver(createRestaurantSchema),
    defaultValues: { currency: 'INR', themeColor: '#4F46E5' },
  });

  const close = () => {
    reset();
    onOpenChange(false);
  };

  const onSubmit = async (values: CreateRestaurantValues) => {
    try {
      await createRestaurant.mutateAsync(values);
      close();
    } catch (err) {
      const message =
        err instanceof ApiRequestError ? err.message : 'Could not create the restaurant.';
      setError('root', { message });
    }
  };

  const busy = isSubmitting || createRestaurant.isPending;

  return (
    <Dialog open={open} onOpenChange={(v) => (v ? onOpenChange(true) : close())}>
      <DialogHeader>
        <DialogTitle>Create a restaurant</DialogTitle>
        <DialogDescription>
          Set up your storefront. You can refine every detail later.
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {errors.root && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {errors.root.message}
          </div>
        )}

        <div className="space-y-1.5">
          <Label htmlFor="name">Restaurant name</Label>
          <Input
            id="name"
            placeholder="The Pizza House"
            aria-invalid={Boolean(errors.name)}
            {...register('name')}
          />
          {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="currency">Currency</Label>
            <Input id="currency" placeholder="INR" {...register('currency')} />
            {errors.currency && (
              <p className="text-xs text-destructive">{errors.currency.message}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="themeColor">Theme color</Label>
            <Input id="themeColor" type="text" placeholder="#4F46E5" {...register('themeColor')} />
            {errors.themeColor && (
              <p className="text-xs text-destructive">{errors.themeColor.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="phone">Phone (optional)</Label>
          <Input id="phone" placeholder="+91 98765 43210" {...register('phone')} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="address">Address (optional)</Label>
          <Input id="address" placeholder="123 Main Street, Mumbai" {...register('address')} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="description">Description (optional)</Label>
          <Textarea
            id="description"
            placeholder="Wood-fired pizzas and fresh pasta in the heart of the city."
            {...register('description')}
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="ghost" onClick={close} disabled={busy}>
            Cancel
          </Button>
          <Button type="submit" disabled={busy}>
            {busy && <Loader2 className="size-4 animate-spin" />}
            Create restaurant
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
