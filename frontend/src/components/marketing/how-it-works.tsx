const STEPS = [
  {
    step: '01',
    title: 'Create your account',
    description: 'Sign up in seconds. No setup fees, no contracts, no hardware to install.',
  },
  {
    step: '02',
    title: 'Add your restaurant',
    description:
      'Name it, set your brand color and currency. We instantly reserve your /qr/ link.',
  },
  {
    step: '03',
    title: 'Go live',
    description:
      'Print your QR code and start serving. Update the menu anytime — changes are instant.',
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="border-y border-border/60 bg-secondary/40">
      <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Live in three simple steps
          </h2>
          <p className="mt-4 text-muted-foreground">
            From sign-up to your first scan in under five minutes.
          </p>
        </div>

        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {STEPS.map((item) => (
            <div key={item.step} className="relative">
              <span className="text-5xl font-semibold tracking-tight text-primary/25">
                {item.step}
              </span>
              <h3 className="mt-3 text-lg font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
