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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/50 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-8 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)]">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 text-sm font-bold text-white">
          P
        </div>
        <h2 className="mt-4 text-xl font-medium tracking-tight text-zinc-900">
          Welcome to Peerly
        </h2>
        <p className="mt-1 text-sm text-zinc-500">
          What should we call you?
        </p>
        <form onSubmit={handleSubmit} className="mt-6">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-base font-medium outline-none ring-0 placeholder:text-zinc-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20"
            autoFocus
            maxLength={50}
          />
          <button
            type="submit"
            className="mt-4 w-full rounded-xl bg-zinc-900 px-4 py-3 text-sm font-medium text-white transition-all hover:bg-zinc-800 active:scale-[0.98]"
          >
            Get started
          </button>
        </form>
      </div>
    </div>
  );
}
