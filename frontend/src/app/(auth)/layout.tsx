import Link from 'next/link';
import { Logo } from '@/components/brand/logo';

/**
 * Split auth layout: a marketing panel on the left (hidden on mobile) and the
 * form on the right. Gives the sign-in experience a premium, product feel.
 */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-primary p-12 text-primary-foreground lg:flex">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_50%_at_30%_0%,rgba(255,255,255,0.16),transparent)]"
        />
        <Logo href="/" className="text-primary-foreground [&_span:last-child]:text-primary-foreground" />
        <div className="relative max-w-md">
          <p className="text-2xl font-medium leading-snug">
            “QRbanao let us launch a beautiful digital menu in an afternoon — it just works.”
          </p>
          <p className="mt-4 text-sm text-primary-foreground/80">
            Aarav Mehta · The Pizza House
          </p>
        </div>
        <p className="relative text-xs text-primary-foreground/70">
          © {new Date().getFullYear()} QRbanao
        </p>
      </div>

      {/* Form panel */}
      <div className="flex flex-col items-center justify-center px-4 py-12 sm:px-6">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <Logo href="/" />
          </div>
          {children}
          <p className="mt-8 text-center text-xs text-muted-foreground">
            By continuing you agree to our{' '}
            <Link href="#" className="underline underline-offset-2 hover:text-foreground">
              Terms
            </Link>{' '}
            and{' '}
            <Link href="#" className="underline underline-offset-2 hover:text-foreground">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
