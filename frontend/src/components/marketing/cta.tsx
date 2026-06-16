import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function CTA() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <div className="relative overflow-hidden rounded-3xl bg-primary px-8 py-16 text-center text-primary-foreground shadow-xl sm:px-16">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(40%_60%_at_50%_0%,rgba(255,255,255,0.18),transparent)]"
        />
        <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
          Ready to digitize your restaurant?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-balance text-primary-foreground/85">
          Join QRbanao today and give your guests a premium digital experience from the very first
          scan.
        </p>
        <Button asChild size="lg" variant="secondary" className="mt-8">
          <Link href="/register">
            Create your free account
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
