import { create } from 'zustand';

interface Notification {
  id: string; userId: string; type: string; title: string;
  body: string; link: string; isRead: number; createdAt: number;
}

interface NotificationsState {
  notifications: Notification[]; unreadCount: number;
  fetchNotifications: (userId: string) => Promise<void>;
  markRead: (userId: string) => Promise<void>;
}

export const useNotificationsStore = create<NotificationsState>()((set) => ({
  notifications: [], unreadCount: 0,
  fetchNotifications: async (userId) => {
    try {
      const r = await fetch(`/api/notifications?userId=${userId}`);
      const d = await r.json();
      const all = d.notifications || [];
      set({ notifications: all, unreadCount: all.filter((n: Notification) => !n.isRead).length });
    } catch {}
  },
  markRead: async (userId) => {
    set((s) => ({ notifications: s.notifications.map((n) => ({ ...n, isRead: 1 })), unreadCount: 0 }));
    try {
      await fetch('/api/notifications', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId }) });
    } catch {}
  },
}));
