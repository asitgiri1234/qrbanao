import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Soft radial glow backdrop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_0%,oklch(0.52_0.21_268/0.12),transparent)]"
      />
      <div className="mx-auto max-w-4xl px-4 pb-20 pt-24 text-center sm:px-6 sm:pt-32">
        <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-medium text-muted-foreground shadow-sm">
          <Sparkles className="size-3.5 text-primary" />
          The operating system for modern restaurants
        </div>

        <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-6xl">
          Run your entire restaurant from a single{' '}
          <span className="text-primary">QR code</span>.
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-balance text-lg text-muted-foreground">
          QRbanao gives restaurants a premium digital storefront — beautiful QR menus today,
          orders, payments, and analytics tomorrow. Launch in minutes, scale to thousands of
          covers.
        </p>

        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/register">
              Start for free
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="#how-it-works">See how it works</Link>
          </Button>
        </div>

        <p className="mt-4 text-xs text-muted-foreground">
          No credit card required · Free during early access
        </p>
      </div>
    </section>
  );
}
