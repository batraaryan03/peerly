import { create } from 'zustand';
import type { Session, SessionRequest, RequestStatus } from '@/types';

interface MatchingState {
  sessions: Session[];
  requests: SessionRequest[];
  loading: boolean;
  fetchSessions: (userId: string) => Promise<void>;
  fetchRequests: (userId: string) => Promise<void>;
  addSession: (session: Session) => void;
  updateSessionStatus: (id: string, status: Session['status']) => Promise<void>;
  addRequest: (request: SessionRequest) => Promise<void>;
  updateRequestStatus: (id: string, status: RequestStatus) => void;
}

const BASE = '/api';

export const useMatchingStore = create<MatchingState>()((set) => ({
  sessions: [],
  requests: [],
  loading: false,

  addSession: async (session) => {
    set((s) => ({ sessions: [...s.sessions, session] }));
    try {
      await fetch(`${BASE}/sessions`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(session) });
    } catch {}
  },

  fetchSessions: async (userId) => {
    set({ loading: true });
    try {
      const r = await fetch(`${BASE}/sessions?userId=${userId}`);
      const d = await r.json();
      set({ sessions: d.sessions || [], loading: false });
    } catch {
      set({ loading: false });
    }
  },

  fetchRequests: async (userId) => {
    try {
      const r = await fetch(`${BASE}/session-requests?userId=${userId}`);
      const d = await r.json();
      set({ requests: d.requests || [] });
    } catch {}
  },

  updateSessionStatus: async (id, status) => {
    set((s) => ({ sessions: s.sessions.map((x) => (x.id === id ? { ...x, status } : x)) }));
    try {
      await fetch(`${BASE}/sessions/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) });
    } catch {}
  },

  addRequest: async (request) => {
    set((s) => ({ requests: [...s.requests, request] }));
    try {
      await fetch(`${BASE}/session-requests`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(request) });
    } catch {}
  },

  updateRequestStatus: (id, status) => {
    set((s) => ({ requests: s.requests.map((r) => (r.id === id ? { ...r, status } : r)) }));
  },
}));
