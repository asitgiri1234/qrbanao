import { Card, CardContent } from '@/components/ui/card';

const TESTIMONIALS = [
  {
    quote:
      'We replaced our printed menus in a single afternoon. Guests love scanning and we update prices in real time.',
    name: 'Aarav Mehta',
    role: 'Owner, The Pizza House',
  },
  {
    quote:
      'It finally feels like our brand online. The dashboard is clean and our staff needed zero training.',
    name: 'Priya Nair',
    role: 'Co-founder, Brew & Co',
  },
  {
    quote:
      'Setup was effortless and the platform feels built to grow with us as we add more outlets.',
    name: 'Rohan Gupta',
    role: 'Director, Spice Route',
  },
];

export function Testimonials() {
  return (
    <section className="border-y border-border/60 bg-secondary/40">
      <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Loved by restaurant owners
          </h2>
          <p className="mt-4 text-muted-foreground">
            Early teams already running their front-of-house on QRbanao.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <Card key={t.name}>
              <CardContent className="flex h-full flex-col p-6">
                <p className="text-sm leading-relaxed text-foreground/90">&ldquo;{t.quote}&rdquo;</p>
                <div className="mt-6 flex items-center gap-3">
                  <span className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                    {t.name.charAt(0)}
                  </span>
                  <div>
                    <p className="text-sm font-medium">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
