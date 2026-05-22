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
    <div className="flex min-h-[100dvh] flex-col">
      {!currentUser && <IdentityDialog />}
      <header className="sticky top-0 z-40 bg-white/[0.04] backdrop-blur-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
        <nav className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-2.5">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 text-sm font-medium tracking-tight">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-500 text-[9px] font-bold text-white">
                P
              </div>
              {APP_NAME}
            </Link>
            <div className="flex items-center gap-0.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-emerald-500/10 text-emerald-500'
                        : 'text-muted-foreground hover:bg-white/[0.04] hover:text-foreground'
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isSignedIn || currentUser ? (
              <div className="flex items-center gap-2">
                {currentUser && (
                  <div className="flex items-center gap-1.5 rounded-lg bg-white/[0.04] px-2.5 py-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
                    <div className="flex h-5 w-5 items-center justify-center rounded-md bg-emerald-500 text-[8px] font-bold text-white">
                      {currentUser.avatar || '?'}
                    </div>
                    <span className="text-xs font-medium text-muted-foreground">
                      {currentUser.name || 'Anonymous'}
                    </span>
                  </div>
                )}
                {isSignedIn && <UserButton />}
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <SignInButton mode="modal">
                  <button className="rounded-lg px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground">
                    Sign in
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-medium text-white transition-all hover:bg-emerald-600 active:scale-[0.98]">
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
