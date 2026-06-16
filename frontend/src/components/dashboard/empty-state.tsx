'use client';

import { Store, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card py-20 text-center">
      <span className="mb-5 flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Store className="size-7" />
      </span>
      <h2 className="text-xl font-semibold tracking-tight">Create your first restaurant</h2>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        You haven&apos;t added a restaurant yet. Set one up to reserve your QR link and start
        building your digital storefront.
      </p>
      <Button className="mt-6" onClick={onCreate}>
        <Plus className="size-4" />
        Create restaurant
      </Button>
    </div>
  );
}
