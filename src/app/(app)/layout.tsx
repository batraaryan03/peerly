'use client';

import { useUserStore } from '@/features/user/store/user.store';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CalendarDays, ListTodo, Sparkles } from 'lucide-react';
import Image from 'next/image';
import { SignInButton, SignUpButton, UserButton, useUser } from '@clerk/nextjs';
import { IdentityDialog } from '@/features/user/components/IdentityDialog';

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
      <header className="sticky top-0 z-40 bg-[rgba(8,9,13,0.8)] backdrop-blur-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
        <nav className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-2.5">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2.5 text-sm font-semibold tracking-tight text-white">
              <svg
                viewBox="0 0 1280 1024"
                className="h-6.5 w-6.5"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <g transform="matrix(1.6 0 0 1.6 640 411)">
                  <path
                    fill="#CB6CE6"
                    d="M15.78 125.3L16.5 149.52l19.27 10.37L50 184.51h31.55l21.36 11.49 18.63-11.49H150l15.78-27.3 20.64-12.73-.65-21.86L200 98l-15.78-27.3-.72-24.22-19.27-10.36L150 11.49h-31.55L97.09 0 78.47 11.49H50L34.22 38.78 13.58 51.52l.65 21.85L0 98zM198.29 98l-12.61 21.81-1.36-46zM20.37 147.13l-.43-14.64L32 153.39zM50.85 183l-12.6-21.81L78.81 183zM102.78 191.42l-12.91-6.94H114zM149.15 183l-25.22-.01 39.19-24.17zM182.41 142.29l-12.48 7.71L182 129.11zM179.63 48.84l.44 14.64L168 42.61zM149.15 13l12.61 21.81L121.19 13zM97.22 4.55l12.91 6.94H86zM50.85 13h25.22L36.88 37.15zM83.58 13h29.3l52.63 28.3 14.65 25.35 1.77 59.69-14.65 25.35-50.85 31.32h-29.31L36.88 154.7l-14.65-25.32-1.77-59.69L32.72 44.34zM30.06 46L18 66.88l-.39-13.2zM14.32 76.18l1.36 46L1.71 98z"
                  />
                </g>
                <g transform="matrix(1.6 0 0 1.6 640 697)">
                  <path
                    fill="#CB6CE6"
                    d="M5.85 0v-11.7h11.25c5.17 0 9.22-4.05 9.22-9.23s-4.05-9.22-9.22-9.22H2.25V0zM16.88-14.85H5.85V-27h11.03c3.64 0 6.07 2.43 6.07 6.07s-2.43 6.08-6.07 6.08zM44.1 0h21.6v-3.15H47.7V-13.5h15.3v-3.15H47.7V-27h18v-3.15H44.1zM83.48 0h21.6v-3.15H87.08V-13.5h15.3v-3.15H87.08V-27h18v-3.15H83.48zM126.45 0v-12.55h8.69l7.87 12.55h4.23l-7.92-12.69c4.37-.72 7.61-4.27 7.61-8.73 0-4.9-4.1-8.73-9.23-8.73h-14.85V0zM137.7-15.66l-11.25-.05V-27h11.03c3.64 0 6.07 2.21 6.07 5.58 0 3.42-2.3 5.67-5.85 5.76zM165.02 0h21.6v-3.15h-18V-30.15h-3.6zM212.31-11.61l.36-.54L224.33-30.15H220l-9.49 14.67L201.06-30.15h-4.32l11.61 18-.36.54V0h3.6z"
                  />
                </g>
              </svg>
              Peerly
            </Link>
            <div className="flex items-center border-r border-[rgba(203,108,230,0.1)] h-4 my-auto mx-1" />
            <div className="flex items-center gap-0.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-all ${
                      isActive
                        ? 'text-white bg-[rgba(203,108,230,0.12)] border border-[rgba(203,108,230,0.18)]'
                        : 'text-[rgba(249,250,251,0.45)] hover:text-white hover:bg-[rgba(203,108,230,0.08)]'
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
                  <div className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-[rgba(249,250,251,0.7)] bg-[rgba(203,108,230,0.08)] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] border border-[rgba(203,108,230,0.1)]">
                    <div className="flex h-5 w-5 items-center justify-center text-[8px] font-bold text-white bg-[rgba(203,108,230,0.3)]">
                      {currentUser.avatar || '?'}
                    </div>
                    <span>{currentUser.name || 'Anonymous'}</span>
                  </div>
                )}
                {isSignedIn && <UserButton />}
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <SignInButton mode="modal">
                  <button className="px-3 py-1.5 text-xs font-medium text-[rgba(249,250,251,0.6)] transition-colors hover:text-white">
                    Sign in
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button
                    className="px-3 py-1.5 text-xs font-bold text-white transition-all active:scale-[0.97]"
                    style={{
                      background: 'rgba(203,108,230,0.88)',
                      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.2), 0 2px 12px rgba(203,108,230,0.35)',
                    }}
                  >
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
