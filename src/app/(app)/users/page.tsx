'use client';

import { useEffect, useState } from 'react';
import { useUserStore } from '@/features/user/store/user.store';
import { User, MessageCircle } from 'lucide-react';
import Link from 'next/link';

export default function UsersPage() {
  const currentUser = useUserStore((s) => s.currentUser);
  const [users, setUsers] = useState<{ id: string; name: string; email: string; imageUrl: string }[]>([]);

  useEffect(() => {
    fetch('/api/users').then(r => r.json()).then(d => setUsers(d.users || [])).catch(() => {});
  }, []);

  return (
    <div className="mx-auto max-w-3xl px-6 py-8 mt-20">
      <h1 className="text-base font-semibold tracking-tight text-zinc-800 mb-6">Users</h1>
      <div className="grid gap-2">
        {users.filter(u => u.id !== currentUser?.id).map(u => (
          <div key={u.id} className="flex items-center justify-between bg-white/80 backdrop-blur-xl border border-[#CB6CE6]/10 p-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] hover:shadow-[0_2px_8px_rgba(203,108,230,0.06)] transition-shadow">
            <div className="flex items-center gap-3">
              {u.imageUrl ? (
                <img src={u.imageUrl} alt="" className="h-9 w-9 rounded-full object-cover" />
              ) : (
                <div className="flex h-9 w-9 items-center justify-center bg-[#CB6CE6]/10 text-[#CB6CE6]"><User size={16} /></div>
              )}
              <div>
                <p className="text-sm font-medium text-zinc-800">{u.name}</p>
                <p className="text-xs text-zinc-400">{u.email}</p>
              </div>
            </div>
            <Link href={`/messages/dm/${u.id}`} className="flex items-center gap-1.5 bg-[#CB6CE6] px-3 py-1.5 text-[11px] font-bold text-white uppercase tracking-wider shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_2px_8px_rgba(203,108,230,0.3)] hover:bg-[#b055d4] active:scale-[0.98] transition-all">
              <MessageCircle size={12} /> Message
            </Link>
          </div>
        ))}
        {users.filter(u => u.id !== currentUser?.id).length === 0 && (
          <div className="border border-[#CB6CE6]/10 bg-white/80 py-16 text-center">
            <User size={24} className="mx-auto text-zinc-300" />
            <p className="mt-2 text-sm text-zinc-400">No other users yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
