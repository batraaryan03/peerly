'use client';

import { useEffect, useState } from 'react';
import { useUserStore } from '@/features/user/store/user.store';
import { useGroupsStore } from '@/features/groups/store/groups.store';
import { Users, Plus, X, LogIn } from 'lucide-react';

export default function GroupsPage() {
  const currentUser = useUserStore((s) => s.currentUser);
  const { groups, fetchGroups, createGroup, joinGroup } = useGroupsStore();
  const [showCreate, setShowCreate] = useState(false);
  const [showJoin, setShowJoin] = useState(false);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [joinId, setJoinId] = useState('');

  useEffect(() => {
    if (currentUser) fetchGroups(currentUser.id);
  }, [currentUser, fetchGroups]);

  const handleCreate = () => {
    if (!currentUser || !name.trim()) return;
    const id = `group-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    createGroup({ id, name: name.trim(), description: desc, avatarUrl, createdBy: currentUser.id, createdAt: Date.now() });
    setName(''); setDesc(''); setAvatarUrl(''); setShowCreate(false);
  };

  const handleJoin = () => {
    if (!currentUser || !joinId.trim()) return;
    joinGroup(joinId.trim(), currentUser.id);
    setJoinId(''); setShowJoin(false);
  };

  return (
    <div className="mx-auto max-w-3xl px-6 py-8 mt-20">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-base font-semibold tracking-tight text-zinc-800">Groups</h1>
        <div className="flex gap-2">
          <button onClick={() => setShowJoin(true)} className="flex items-center gap-1.5 border border-zinc-200 bg-white/80 px-3 py-1.5 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider hover:border-[#CB6CE6]/30 hover:text-zinc-800 backdrop-blur-xl transition-all">
            <LogIn size={12} /> Join
          </button>
          <button onClick={() => setShowCreate(true)} className="flex items-center gap-1.5 bg-[#CB6CE6] px-3 py-1.5 text-[11px] font-bold text-white uppercase tracking-wider shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_2px_8px_rgba(203,108,230,0.3)] transition-all hover:bg-[#b055d4] active:scale-[0.98]">
            <Plus size={12} /> Create
          </button>
        </div>
      </div>

      <div className="grid gap-3">
        {groups.map((g) => (
          <div key={g.id} className="flex items-center gap-3 bg-white/80 backdrop-blur-xl border border-[#CB6CE6]/10 p-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] hover:shadow-[0_2px_8px_rgba(203,108,230,0.06)] transition-shadow">
            {g.avatarUrl ? (
              <img src={g.avatarUrl} alt="" className="h-9 w-9 rounded object-cover" />
            ) : (
              <div className="flex h-9 w-9 items-center justify-center bg-[#CB6CE6]/10 text-[#CB6CE6]"><Users size={16} /></div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-zinc-800">{g.name}</p>
              <p className="text-xs text-zinc-400 truncate">{g.description || 'No description'}</p>
            </div>
          </div>
        ))}
        {groups.length === 0 && (
          <div className="border border-[#CB6CE6]/10 bg-white/80 py-16 text-center">
            <Users size={24} className="mx-auto text-zinc-300" />
            <p className="mt-2 text-sm text-zinc-400">No groups yet</p>
          </div>
        )}
      </div>

      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-md">
          <div className="w-full max-w-sm bg-white/95 backdrop-blur-2xl border border-[#CB6CE6]/20 p-6 shadow-[0_12px_48px_rgba(203,108,230,0.12)]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-zinc-800">Create group</h2>
              <button onClick={() => setShowCreate(false)} className="text-zinc-400 hover:text-zinc-600"><X size={16} /></button>
            </div>
            <div className="space-y-3">
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Group name" className="w-full border border-zinc-200 bg-white/80 px-3 py-2 text-sm text-zinc-700 outline-none focus:border-[#CB6CE6]" />
              <input value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Description (optional)" className="w-full border border-zinc-200 bg-white/80 px-3 py-2 text-sm text-zinc-700 outline-none focus:border-[#CB6CE6]" />
              <input value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} placeholder="Avatar image URL (optional)" className="w-full border border-zinc-200 bg-white/80 px-3 py-2 text-sm text-zinc-700 outline-none focus:border-[#CB6CE6]" />
              <button onClick={handleCreate} className="w-full bg-[#CB6CE6] py-2 text-sm font-bold text-white uppercase tracking-wider shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_2px_8px_rgba(203,108,230,0.3)] hover:bg-[#b055d4] active:scale-[0.98] transition-all">
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {showJoin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-md">
          <div className="w-full max-w-sm bg-white/95 backdrop-blur-2xl border border-[#CB6CE6]/20 p-6 shadow-[0_12px_48px_rgba(203,108,230,0.12)]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-zinc-800">Join group</h2>
              <button onClick={() => setShowJoin(false)} className="text-zinc-400 hover:text-zinc-600"><X size={16} /></button>
            </div>
            <div className="space-y-3">
              <input value={joinId} onChange={(e) => setJoinId(e.target.value)} placeholder="Group ID" className="w-full border border-zinc-200 bg-white/80 px-3 py-2 text-sm text-zinc-700 outline-none focus:border-[#CB6CE6]" />
              <button onClick={handleJoin} className="w-full bg-[#CB6CE6] py-2 text-sm font-bold text-white uppercase tracking-wider shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_2px_8px_rgba(203,108,230,0.3)] hover:bg-[#b055d4] active:scale-[0.98] transition-all">
                Join
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
