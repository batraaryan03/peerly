import { create } from 'zustand';

interface Message {
  id: string; senderId: string; receiverId: string | null; groupId: string | null;
  content: string; createdAt: number;
}

interface MessagesState {
  messages: Message[]; loading: boolean; hasMore: boolean;
  fetchMessages: (params: { groupId?: string; senderId?: string; receiverId?: string; limit?: number; before?: number }) => Promise<void>;
  sendMessage: (msg: Message) => Promise<void>;
  loadMore: (params: { groupId?: string; senderId?: string; receiverId?: string; before: number }) => Promise<void>;
  reset: () => void;
}

export const useMessagesStore = create<MessagesState>()((set) => ({
  messages: [], loading: false, hasMore: true,
  fetchMessages: async (params) => {
    set({ loading: true });
    try {
      const q = new URLSearchParams();
      if (params.groupId) q.set('groupId', params.groupId);
      if (params.senderId) q.set('senderId', params.senderId);
      if (params.receiverId) q.set('receiverId', params.receiverId);
      if (params.limit) q.set('limit', String(params.limit));
      const r = await fetch(`/api/messages?${q}`);
      const d = await r.json();
      set({ messages: d.messages || [], loading: false, hasMore: (d.messages || []).length >= (params.limit || 50) });
    } catch { set({ loading: false }); }
  },
  sendMessage: async (msg) => {
    set((s) => ({ messages: [...s.messages, msg] }));
    try {
      await fetch('/api/messages', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(msg) });
    } catch {}
  },
  loadMore: async (params) => {
    try {
      const q = new URLSearchParams();
      if (params.groupId) q.set('groupId', params.groupId);
      if (params.senderId) q.set('senderId', params.senderId);
      if (params.receiverId) q.set('receiverId', params.receiverId);
      q.set('before', String(params.before));
      q.set('limit', '50');
      const r = await fetch(`/api/messages?${q}`);
      const d = await r.json();
      const msgs = d.messages || [];
      set((s) => ({ messages: [...msgs, ...s.messages], hasMore: msgs.length >= 50 }));
    } catch {}
  },
  reset: () => set({ messages: [], loading: false, hasMore: true }),
}));
