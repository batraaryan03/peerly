'use client';

import { useState } from 'react';
import { useUserStore } from '@/features/user/store/user.store';
import type { User } from '@/types';

export function IdentityDialog() {
  const { currentUser, setCurrentUser } = useUserStore();
  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState(false);

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
      imageUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(name.trim())}&background=CB6CE6&color=fff&size=100`,
      bio: 'Ready to focus.',
      rating: 0,
      ratingCount: 0,
      status: 'available',
      createdAt: Date.now(),
    };

    setCurrentUser(newUser);
    fetch('/api/users/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser),
    }).catch(() => {});
    setSubmitted(true);
  };

  if (submitted || currentUser) return null;

  const glossyBtn = {
    backgroundImage: 'linear-gradient(135deg, rgba(203,108,230,1) 0%, rgba(203,108,230,0.88) 50%, rgba(203,108,230,1) 100%)',
  } as React.CSSProperties;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md">
      <div
        className="w-full max-w-sm overflow-hidden bg-white p-6 shadow-[0_12px_48px_rgba(203,108,230,0.12),0_24px_48px_rgba(0,0,0,0.08)]"
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-lg shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]" style={glossyBtn}>
          <span className="text-xs font-bold text-white">P</span>
        </div>
        <h2 className="mt-3 text-base font-semibold tracking-tight text-zinc-800">
          Welcome to Peerly
        </h2>
        <p className="mt-1 text-sm text-zinc-500">
          What should we call you?
        </p>
        <form onSubmit={handleSubmit} className="mt-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="mt-1 w-full rounded border border-[rgba(203,108,230,0.15)] bg-zinc-50 px-3 py-2.5 text-sm font-medium text-zinc-800 outline-none transition-colors hover:border-[rgba(203,108,230,0.3)] focus:border-[#CB6CE6] focus:bg-white focus:ring-1 focus:ring-[rgba(203,108,230,0.2)] placeholder:text-zinc-300"
            autoFocus
            maxLength={50}
          />
          <button
            type="submit"
            className="mt-3 w-full rounded px-4 py-2.5 text-sm font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_2px_8px_rgba(203,108,230,0.3)] transition-all active:scale-[0.97]"
            style={glossyBtn}
          >
            Get started
          </button>
        </form>
      </div>
    </div>
  );
}
