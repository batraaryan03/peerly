import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Session, SessionRequest, RequestStatus, SessionStatus } from '@/types';

interface MatchingState {
  sessions: Session[];
  requests: SessionRequest[];
  addSession: (session: Session) => void;
  updateSessionStatus: (id: string, status: SessionStatus) => void;
  addRequest: (request: SessionRequest) => void;
  updateRequestStatus: (id: string, status: RequestStatus) => void;
  seedSessions: (sessions: Session[]) => void;
  seedRequests: (requests: SessionRequest[]) => void;
}

export const useMatchingStore = create<MatchingState>()(
  persist(
    (set) => ({
      sessions: [],
      requests: [],
      addSession: (session) =>
        set((state) => ({ sessions: [...state.sessions, session] })),
      updateSessionStatus: (id, status) =>
        set((state) => ({
          sessions: state.sessions.map((s) =>
            s.id === id ? { ...s, status } : s,
          ),
        })),
      addRequest: (request) =>
        set((state) => ({ requests: [...state.requests, request] })),
      updateRequestStatus: (id, status) =>
        set((state) => ({
          requests: state.requests.map((r) =>
            r.id === id ? { ...r, status } : r,
          ),
        })),
      seedSessions: (sessions) => set({ sessions }),
      seedRequests: (requests) => set({ requests }),
    }),
    { name: 'peerly-matching' },
  ),
);
