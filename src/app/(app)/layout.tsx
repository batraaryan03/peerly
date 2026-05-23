'use client';

import { useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useUserStore } from '@/features/user/store/user.store';
import { IdentityDialog } from '@/features/user/components/IdentityDialog';
import { AppNavbar } from '@/features/app/layout/AppNavbar';
import type { User } from '@/types';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { currentUser, setCurrentUser } = useUserStore();
  const { isSignedIn, user: clerkUser } = useUser();

  useEffect(() => {
    fetch('/api/db/init', { method: 'POST' }).catch(() => {});

    if (isSignedIn && clerkUser) {
      const existing = currentUser;
      const clerkId = clerkUser.id;
      const clerkName = clerkUser.fullName || 'User';
      const clerkEmail = clerkUser.primaryEmailAddress?.emailAddress || '';
      const clerkImage = clerkUser.imageUrl;

      if (!existing || existing.id.startsWith('user-')) {
        const syncedUser: User = {
          id: clerkId,
          name: clerkName,
          email: clerkEmail,
          avatar: clerkName
            .split(' ')
            .map((n) => n[0])
            .join('')
            .slice(0, 2)
            .toUpperCase(),
          imageUrl: clerkImage,
          bio: '',
          rating: 0,
          ratingCount: 0,
          status: 'available',
          createdAt: Date.now(),
        };
        setCurrentUser(syncedUser);
      }
    }
  }, [isSignedIn, clerkUser, currentUser, setCurrentUser]);

  return (
    <div className="flex min-h-[100dvh] flex-col bg-white">
      {!currentUser && <IdentityDialog />}
      <AppNavbar />
      <main className="flex-1 flex flex-col">{children}</main>
    </div>
  );
}
