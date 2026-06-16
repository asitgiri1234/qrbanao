import Link from 'next/link';
import { QrCode } from 'lucide-react';
import { cn } from '@/lib/utils';

/** QRbanao wordmark + glyph. Used in the header, footer, and auth screens. */
export function Logo({ className, href = '/' }: { className?: string; href?: string }) {
  return (
    <Link href={href} className={cn('inline-flex items-center gap-2', className)}>
      <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
        <QrCode className="size-5" />
      </span>
      <span className="text-lg font-semibold tracking-tight">QRbanao</span>
    </Link>
  );
}
