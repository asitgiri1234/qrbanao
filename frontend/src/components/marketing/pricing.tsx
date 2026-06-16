import Link from 'next/link';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

const PLANS = [
  {
    name: 'Starter',
    price: 'Free',
    blurb: 'Everything to launch your first QR menu.',
    features: ['1 restaurant', 'Unlimited menu views', 'Custom branding', 'QR code'],
    highlighted: false,
  },
  {
    name: 'Growth',
    price: 'Coming soon',
    blurb: 'Orders, payments, and analytics for busy venues.',
    features: ['Everything in Starter', 'Online ordering', 'Payments', 'Analytics dashboard'],
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: 'Coming soon',
    blurb: 'Multi-location chains with advanced needs.',
    features: ['Unlimited restaurants', 'Team roles', 'API access', 'Priority support'],
    highlighted: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <Badge variant="muted" className="mb-4">
          Pricing
        </Badge>
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Simple pricing, free to start
        </h2>
        <p className="mt-4 text-muted-foreground">
          Begin free today. Paid plans unlock as we ship orders, payments, and analytics.
        </p>
      </div>

      <div className="mt-14 grid gap-6 lg:grid-cols-3">
        {PLANS.map((plan) => (
          <Card
            key={plan.name}
            className={
              plan.highlighted
                ? 'relative border-primary/40 shadow-md ring-1 ring-primary/20'
                : ''
            }
          >
            {plan.highlighted && (
              <span className="absolute -top-3 left-6 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground shadow">
                Most popular
              </span>
            )}
            <CardContent className="p-7">
              <h3 className="text-lg font-semibold">{plan.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{plan.blurb}</p>
              <p className="mt-5 text-3xl font-semibold tracking-tight">{plan.price}</p>

              <ul className="mt-6 space-y-3 text-sm">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2.5">
                    <Check className="size-4 text-primary" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              {plan.price === 'Coming soon' ? (
                <Button className="mt-7 w-full" variant="outline" disabled>
                  Coming soon
                </Button>
              ) : (
                <Button
                  asChild
                  className="mt-7 w-full"
                  variant={plan.highlighted ? 'default' : 'outline'}
                >
                  <Link href="/register">Get started</Link>
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
