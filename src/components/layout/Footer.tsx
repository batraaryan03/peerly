import Link from 'next/link';
import { APP_NAME } from '@/lib/constants';

export function Footer() {
  return (
    <footer className="border-t border-zinc-200/50 bg-zinc-50">
      <div className="mx-auto flex max-w-[1400px] flex-col items-center justify-between gap-4 px-6 py-10 text-sm text-zinc-500 md:flex-row">
        <p>&copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.</p>
        <div className="flex items-center gap-6">
          <Link href="/about" className="transition-colors hover:text-zinc-900">
            About
          </Link>
          <Link href="/contact" className="transition-colors hover:text-zinc-900">
            Contact
          </Link>
          <Link href="/terms" className="transition-colors hover:text-zinc-900">
            Terms
          </Link>
          <Link href="/privacy" className="transition-colors hover:text-zinc-900">
            Privacy
          </Link>
        </div>
      </div>
    </footer>
  );
}
