import { QrCode, ShoppingBag, CreditCard, BarChart3, Palette, ShieldCheck } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const FEATURES = [
  {
    icon: QrCode,
    title: 'Digital QR menus',
    description:
      'A scannable, always-up-to-date menu hosted at your own qrbanao.com/qr/your-restaurant link.',
  },
  {
    icon: ShoppingBag,
    title: 'Orders & tables',
    description: 'Let guests order from their seat. Track tickets from kitchen to checkout. (Soon)',
  },
  {
    icon: CreditCard,
    title: 'Payments built in',
    description: 'Accept UPI and cards directly from the menu with instant settlement. (Soon)',
  },
  {
    icon: BarChart3,
    title: 'Live analytics',
    description: 'Understand best-sellers, peak hours, and revenue across every location. (Soon)',
  },
  {
    icon: Palette,
    title: 'On-brand by default',
    description: 'Your logo, colors, and currency. A storefront that looks designed, not generic.',
  },
  {
    icon: ShieldCheck,
    title: 'Secure & multi-tenant',
    description: 'Bank-grade auth and strict tenant isolation so your data is always your own.',
  },
];

export function Features() {
  return (
    <section id="features" className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Everything a modern restaurant needs
        </h2>
        <p className="mt-4 text-muted-foreground">
          Start with a stunning QR menu and grow into a full digital operation — without switching
          tools.
        </p>
      </div>

      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((feature) => (
          <Card key={feature.title} className="transition-shadow hover:shadow-md">
            <CardContent className="p-6">
              <span className="mb-4 inline-flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <feature.icon className="size-5" />
              </span>
              <h3 className="text-base font-semibold">{feature.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
