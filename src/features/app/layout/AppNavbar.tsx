'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CalendarDays, ListTodo, Users, MessageSquare, Bell, User } from 'lucide-react';
import { SignInButton, SignUpButton, UserButton, useUser } from '@clerk/nextjs';
import { useUserStore } from '@/features/user/store/user.store';
import { useNotificationsStore } from '@/features/notifications/store/notifications.store';
import { useEffect, useState, useRef } from 'react';

export function AppNavbar() {
  const { isSignedIn } = useUser();
  const { currentUser } = useUserStore();
  const pathname = usePathname();
  const { unreadCount, fetchNotifications, markRead, notifications } = useNotificationsStore();
  const [showNotif, setShowNotif] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentUser) {
      fetchNotifications(currentUser.id);
      const iv = setInterval(() => fetchNotifications(currentUser.id), 15000);
      return () => clearInterval(iv);
    }
  }, [currentUser, fetchNotifications]);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotif(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const navItems = [
    { href: '/calendar', label: 'Calendar', icon: CalendarDays },
    { href: '/sessions', label: 'Sessions', icon: ListTodo },
    { href: '/users', label: 'Users', icon: User },
    { href: '/groups', label: 'Groups', icon: Users },
    { href: '/messages', label: 'Messages', icon: MessageSquare },
  ];

  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95vw] max-w-5xl">
      <div className="bg-white/70 backdrop-blur-2xl border border-white/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_8px_32px_rgba(0,0,0,0.04)]">
        <nav className="flex items-center justify-between px-4 h-12">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-1.5 text-sm font-bold tracking-tight text-zinc-800">
              <svg viewBox="0 0 1280 1024" className="h-4 w-4 shrink-0" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Peerly logo">
                <g transform="matrix(1.6 0 0 1.6 640 411)">
                  <path fill="#CB6CE6" d="M15.78 125.3L16.5 149.52l19.27 10.37L50 184.51h31.55l21.36 11.49 18.63-11.49H150l15.78-27.3 20.64-12.73-.65-21.86L200 98l-15.78-27.3-.72-24.22-19.27-10.36L150 11.49h-31.55L97.09 0 78.47 11.49H50L34.22 38.78 13.58 51.52l.65 21.85L0 98zM198.29 98l-12.61 21.81-1.36-46zM20.37 147.13l-.43-14.64L32 153.39zM50.85 183l-12.6-21.81L78.81 183zM102.78 191.42l-12.91-6.94H114zM149.15 183l-25.22-.01 39.19-24.17zM182.41 142.29l-12.48 7.71L182 129.11zM179.63 48.84l.44 14.64L168 42.61zM149.15 13l12.61 21.81L121.19 13zM97.22 4.55l12.91 6.94H86zM50.85 13h25.22L36.88 37.15zM83.58 13h29.3l52.63 28.3 14.65 25.35 1.77 59.69-14.65 25.35-50.85 31.32h-29.31L36.88 154.7l-14.65-25.32-1.77-59.69L32.72 44.34z"/>
                </g>
              </svg>
              <span className="hidden sm:inline">Peerly</span>
            </Link>

            <div className="flex items-center gap-0.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname.startsWith(item.href);
                return (
                  <Link key={item.href} href={item.href}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium transition-all rounded-sm ${
                      isActive ? 'bg-[#CB6CE6]/10 text-[#CB6CE6]' : 'text-zinc-500 hover:text-zinc-800'
                    }`}>
                    <Icon size={13} />
                    <span className="hidden sm:inline">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {currentUser && (
              <div className="relative" ref={notifRef}>
                <button onClick={() => { setShowNotif(!showNotif); if (showNotif) markRead(currentUser.id); }} className="relative flex h-7 w-7 items-center justify-center text-zinc-400 hover:text-zinc-700 transition-colors">
                  <Bell size={15} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center bg-red-500 text-[8px] font-bold text-white rounded-full">{unreadCount > 9 ? '9+' : unreadCount}</span>
                  )}
                </button>
                {showNotif && (
                  <div className="absolute right-0 top-full mt-2 w-72 bg-white/95 backdrop-blur-2xl border border-[#CB6CE6]/20 shadow-[0_8px_32px_rgba(0,0,0,0.08)] max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <p className="px-4 py-8 text-center text-xs text-zinc-400">No notifications</p>
                    ) : notifications.slice(0, 20).map((n) => (
                      <Link key={n.id} href={n.link || '#'} onClick={() => setShowNotif(false)} className={`block px-4 py-3 border-b border-[#CB6CE6]/5 hover:bg-[#CB6CE6]/5 transition-colors ${!n.isRead ? 'bg-[#CB6CE6]/[0.02]' : ''}`}>
                        <p className="text-xs font-semibold text-zinc-800">{n.title}</p>
                        <p className="text-[11px] text-zinc-500 truncate">{n.body}</p>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
            {isSignedIn ? (
              <UserButton />
            ) : currentUser ? (
              <div className="flex items-center gap-2 text-xs font-medium text-zinc-600">
                {currentUser.imageUrl ? (
                  <img src={currentUser.imageUrl} alt="" className="h-6 w-6 rounded-full object-cover" />
                ) : (
                  <div className="flex h-6 w-6 items-center justify-center text-[9px] font-bold text-white bg-[#CB6CE6]/50 rounded-full">
                    {currentUser.avatar || '?'}
                  </div>
                )}
                <span className="hidden sm:inline">{currentUser.name}</span>
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <SignInButton mode="modal">
                  <button className="px-3 py-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-800 transition-colors">
                    Sign in
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="px-4 py-1.5 text-xs font-bold text-white bg-[#CB6CE6] shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_2px_8px_rgba(203,108,230,0.3)] transition-all active:scale-[0.97] rounded-sm">
                    Get started
                  </button>
                </SignUpButton>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
