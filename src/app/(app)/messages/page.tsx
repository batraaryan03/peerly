'use client';

import { useEffect, useState } from 'react';
import { useUserStore } from '@/features/user/store/user.store';
import { useMessagesStore } from '@/features/messages/store/messages.store';
import { MessageSquare, User } from 'lucide-react';
import Link from 'next/link';

export default function MessagesPage() {
  const currentUser = useUserStore((s) => s.currentUser);
  const { messages, fetchMessages } = useMessagesStore();
  const [users, setUsers] = useState<{ id: string; name: string; imageUrl: string }[]>([]);

  useEffect(() => { if (currentUser) { fetch('/api/users').then(r => r.json()).then(d => setUsers(d.users || [])).catch(() => {}); } }, [currentUser]);

  const otherUserIds = [...new Set(messages.map(m => m.senderId === currentUser?.id ? m.receiverId : m.senderId).filter(Boolean))];

  return (
    <div className="mx-auto max-w-3xl px-6 py-8 mt-20">
      <h1 className="text-base font-semibold tracking-tight text-zinc-800 mb-6">Messages</h1>
      <div className="grid gap-2">
        {users.filter(u => u.id !== currentUser?.id).map(u => (
          <Link key={u.id} href={`/messages/dm/${u.id}`} className="flex items-center gap-3 bg-white/80 backdrop-blur-xl border border-[#CB6CE6]/10 p-3 hover:shadow-[0_2px_8px_rgba(203,108,230,0.06)] transition-shadow">
            {u.imageUrl ? <img src={u.imageUrl} alt="" className="h-9 w-9 rounded-full object-cover" /> : <div className="flex h-9 w-9 items-center justify-center bg-[#CB6CE6]/10 text-[#CB6CE6]"><User size={16} /></div>}
            <p className="text-sm font-medium text-zinc-800">{u.name}</p>
          </Link>
        ))}
        {users.filter(u => u.id !== currentUser?.id).length === 0 && (
          <div className="border border-[#CB6CE6]/10 bg-white/80 py-16 text-center">
            <MessageSquare size={24} className="mx-auto text-zinc-300" />
            <p className="mt-2 text-sm text-zinc-400">No conversations yet</p>
            <p className="text-xs text-zinc-400 mt-1">Click on a user from the calendar to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
}
