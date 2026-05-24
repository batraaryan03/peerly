import { create } from 'zustand';

interface Group {
  id: string;
  name: string;
  description: string;
  avatarUrl: string;
  createdBy: string;
  createdAt: number;
}

interface GroupsState {
  groups: Group[];
  loading: boolean;
  fetchGroups: (userId: string) => Promise<void>;
  createGroup: (group: Group) => Promise<void>;
  joinGroup: (groupId: string, userId: string) => Promise<void>;
}

export const useGroupsStore = create<GroupsState>()((set) => ({
  groups: [],
  loading: false,
  fetchGroups: async (userId) => {
    set({ loading: true });
    try {
      const r = await fetch(`/api/groups?userId=${userId}`);
      const d = await r.json();
      set({ groups: d.groups || [], loading: false });
    } catch {
      set({ loading: false });
    }
  },
  createGroup: async (group) => {
    set((s) => ({ groups: [group, ...s.groups] }));
    try {
      await fetch('/api/groups', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(group) });
    } catch {}
  },
  joinGroup: async (groupId, userId) => {
    try {
      await fetch('/api/groups/join', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ groupId, userId }) });
    } catch {}
  },
}));
