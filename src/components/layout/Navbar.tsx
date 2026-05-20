'use client';

import Link from 'next/link';
import { useUserStore } from '@/features/user/store/user.store';
import { APP_NAME } from '@/lib/constants';

export function Navbar() {
  const { currentUser } = useUserStore();

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-lg font-semibold tracking-tight">
            {APP_NAME}
          </Link>
          <div className="hidden items-center gap-6 text-sm md:flex">
            <Link
              href="/pricing"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Pricing
            </Link>
            <Link
              href="/about"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              About
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {currentUser ? (
            <Link
              href="/calendar"
              className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90"
            >
              Dashboard
            </Link>
          ) : (
            <Link
              href="/calendar"
              className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90"
            >
              Get Started
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
