'use client';

import Image from 'next/image';
import {
  Store,
  Link2,
  Calendar,
  QrCode,
  Pencil,
  Trash2,
  Menu,
  ShoppingBag,
  BarChart3,
  Lock,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';
import type { Restaurant } from '@/types';

const FUTURE_ACTIONS = [
  { icon: Menu, label: 'Menu' },
  { icon: QrCode, label: 'QR code' },
  { icon: ShoppingBag, label: 'Orders' },
  { icon: BarChart3, label: 'Analytics' },
];

export function RestaurantCard({
  restaurant,
  onDelete,
  deleting,
}: {
  restaurant: Restaurant;
  onDelete: (id: string) => void;
  deleting: boolean;
}) {
  const isActive = restaurant.status === 'ACTIVE';

  return (
    <Card className="overflow-hidden">
      {/* Brand band uses the restaurant's own theme color */}
      <div className="h-1.5 w-full" style={{ backgroundColor: restaurant.themeColor }} />

      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            {restaurant.logo ? (
              <Image
                src={restaurant.logo}
                alt={restaurant.name}
                width={48}
                height={48}
                className="size-12 rounded-xl object-cover"
              />
            ) : (
              <span
                className="flex size-12 items-center justify-center rounded-xl text-white"
                style={{ backgroundColor: restaurant.themeColor }}
              >
                <Store className="size-5" />
              </span>
            )}
            <div>
              <h3 className="text-base font-semibold leading-tight">{restaurant.name}</h3>
              <Badge variant={isActive ? 'success' : 'muted'} className="mt-1.5">
                <span
                  className={`size-1.5 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-muted-foreground'}`}
                />
                {isActive ? 'Active' : 'Inactive'}
              </Badge>
            </div>
          </div>
        </div>

        <dl className="mt-5 space-y-2.5 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Link2 className="size-4 shrink-0" />
            <span className="truncate">
              /qr/<span className="font-medium text-foreground">{restaurant.slug}</span>
            </span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="size-4 shrink-0" />
            <span>Created {formatDate(restaurant.createdAt)}</span>
          </div>
        </dl>

        {/* Quick actions — available now */}
        <div className="mt-5 flex gap-2">
          <Button variant="outline" size="sm" className="flex-1" disabled>
            <Pencil className="size-4" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={() => onDelete(restaurant.id)}
            disabled={deleting}
            aria-label={`Delete ${restaurant.name}`}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>

        {/* Future features — visibly disabled to signal the roadmap */}
        <div className="mt-5 border-t border-border/60 pt-4">
          <p className="mb-3 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <Lock className="size-3" />
            Coming soon
          </p>
          <div className="grid grid-cols-4 gap-2">
            {FUTURE_ACTIONS.map((action) => (
              <div
                key={action.label}
                className="flex cursor-not-allowed flex-col items-center gap-1 rounded-lg border border-dashed border-border/70 py-2.5 opacity-60"
              >
                <action.icon className="size-4 text-muted-foreground" />
                <span className="text-[10px] text-muted-foreground">{action.label}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
