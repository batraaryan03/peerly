'use client';

import { useState, useEffect } from 'react';
import { useUserStore } from '@/features/user/store/user.store';
import { useCalendarStore } from '@/features/calendar/store/calendar.store';
import type { User } from '@/types';
import { generateMockSlots } from '@/features/calendar/utils/mock-data';

export function IdentityDialog() {
  const { currentUser, setCurrentUser } = useUserStore();
  const seedSlots = useCalendarStore((s) => s.seedSlots);
  const timeSlots = useCalendarStore((s) => s.timeSlots);
  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (timeSlots.length === 0) {
      const mockSlots = generateMockSlots();
      seedSlots(mockSlots);
    }
  }, [timeSlots.length, seedSlots]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newUser: User = {
      id: `user-${Date.now()}`,
      name: name.trim(),
      email: `${name.trim().toLowerCase().replace(/\s+/g, '.')}@peerly.dev`,
      avatar: name
        .trim()
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase(),
      bio: 'Ready to focus.',
      rating: 0,
      ratingCount: 0,
      status: 'available',
      createdAt: Date.now(),
    };

    setCurrentUser(newUser);
    setSubmitted(true);
  };

  if (submitted || currentUser) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl bg-white/[0.06] p-6 backdrop-blur-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 text-xs font-bold text-white">
          P
        </div>
        <h2 className="mt-3 text-base font-medium text-foreground">
          Welcome to Peerly
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          What should we call you?
        </p>
        <form onSubmit={handleSubmit} className="mt-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="w-full rounded-lg bg-white/[0.04] px-3 py-2.5 text-sm font-medium text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] outline-none placeholder:text-muted-foreground/40 focus-visible:shadow-[inset_0_0_0_1px_#10b981]"
            autoFocus
            maxLength={50}
          />
          <button
            type="submit"
            className="mt-3 w-full rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-emerald-600 active:scale-[0.98]"
          >
            Get started
          </button>
        </form>
      </div>
    </div>
  );
}
