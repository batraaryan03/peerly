'use client';

import Link from 'next/link';
import { useUserStore } from '@/features/user/store/user.store';
import { APP_NAME } from '@/lib/constants';
import {
  SignInButton,
  SignUpButton,
  UserButton,
  useUser,
} from '@clerk/nextjs';

export function Navbar() {
  const { currentUser } = useUserStore();
  const { isSignedIn } = useUser();

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200/50 bg-white/90 backdrop-blur-md">
      <nav className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 text-lg font-semibold tracking-tight">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500 text-[10px] font-bold text-white">
              P
            </div>
            {APP_NAME}
          </Link>
          <div className="hidden items-center gap-6 text-sm md:flex">
            <Link
              href="/pricing"
              className="text-zinc-500 transition-colors hover:text-zinc-900"
            >
              Pricing
            </Link>
            <Link
              href="/about"
              className="text-zinc-500 transition-colors hover:text-zinc-900"
            >
              About
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {isSignedIn ? (
            <div className="flex items-center gap-3">
              <Link
                href="/calendar"
                className="rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-zinc-800 active:scale-[0.98]"
              >
                Dashboard
              </Link>
              <UserButton />
            </div>
          ) : (
            <>
              {currentUser ? (
                <Link
                  href="/calendar"
                  className="rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-zinc-800 active:scale-[0.98]"
                >
                  Dashboard
                </Link>
              ) : (
                <div className="flex items-center gap-2">
                  <SignInButton mode="modal">
                    <button className="rounded-xl px-4 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900">
                      Sign in
                    </button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <button className="rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-zinc-800 active:scale-[0.98]">
                      Get started
                    </button>
                  </SignUpButton>
                </div>
              )}
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
