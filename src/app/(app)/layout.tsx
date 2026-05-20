'use client';

import { useUserStore } from '@/features/user/store/user.store';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CalendarDays, ListTodo } from 'lucide-react';
import { APP_NAME } from '@/lib/constants';
import { IdentityDialog } from '@/features/user/components/IdentityDialog';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const currentUser = useUserStore((s) => s.currentUser);
  const pathname = usePathname();

  const navItems = [
    { href: '/calendar', label: 'Calendar', icon: CalendarDays },
    { href: '/sessions', label: 'Sessions', icon: ListTodo },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      {!currentUser && <IdentityDialog />}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-base font-semibold tracking-tight">
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
                    className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-muted text-foreground'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
              {currentUser?.avatar || '?'}
            </div>
            <span className="text-sm text-muted-foreground">
              {currentUser?.name || 'Anonymous'}
            </span>
          </div>
        </nav>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
