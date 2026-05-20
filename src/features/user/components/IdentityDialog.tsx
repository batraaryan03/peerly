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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="w-full max-w-sm px-6">
        <h2 className="text-2xl font-medium tracking-tight">Welcome to Peerly</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          What should we call you?
        </p>
        <form onSubmit={handleSubmit} className="mt-6">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="w-full border-0 border-b border-transparent bg-transparent pb-2 text-lg font-medium outline-none ring-0 placeholder:text-muted-foreground/40 focus:border-b focus:border-purple-600"
            autoFocus
            maxLength={50}
          />
          <button
            type="submit"
            className="mt-6 w-full rounded-md bg-foreground px-4 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90"
          >
            Get started
          </button>
        </form>
      </div>
    </div>
  );
}
