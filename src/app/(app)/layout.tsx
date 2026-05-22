'use client';

import { useUserStore } from '@/features/user/store/user.store';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CalendarDays, ListTodo } from 'lucide-react';
import { APP_NAME } from '@/lib/constants';
import { IdentityDialog } from '@/features/user/components/IdentityDialog';
import {
  SignInButton,
  SignUpButton,
  UserButton,
  useUser,
} from '@clerk/nextjs';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { currentUser } = useUserStore();
  const { isSignedIn } = useUser();
  const pathname = usePathname();

  const navItems = [
    { href: '/calendar', label: 'Calendar', icon: CalendarDays },
    { href: '/sessions', label: 'Sessions', icon: ListTodo },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      {!currentUser && <IdentityDialog />}
      <header className="sticky top-0 z-40 border-b border-zinc-200/50 bg-white/90 backdrop-blur-md">
        <nav className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-3">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 text-base font-semibold tracking-tight">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500 text-[10px] font-bold text-white">
                P
              </div>
              {APP_NAME}
            </Link>
            <div className="flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
          <div className="flex items-center gap-3">
            {isSignedIn || currentUser ? (
              <div className="flex items-center gap-3">
                {currentUser && (
                  <div className="flex items-center gap-2 rounded-lg bg-zinc-50 px-3 py-1.5">
                    <div className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-500 text-[9px] font-bold text-white">
                      {currentUser.avatar || '?'}
                    </div>
                    <span className="text-sm font-medium text-zinc-700">
                      {currentUser.name || 'Anonymous'}
                    </span>
                  </div>
                )}
                {isSignedIn && <UserButton />}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <SignInButton mode="modal">
                  <button className="rounded-lg px-4 py-1.5 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900">
                    Sign in
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="rounded-lg bg-emerald-500 px-4 py-1.5 text-sm font-medium text-white transition-all hover:bg-emerald-600 active:scale-[0.98]">
                    Get started
                  </button>
                </SignUpButton>
              </div>
            )}
          </div>
        </nav>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
