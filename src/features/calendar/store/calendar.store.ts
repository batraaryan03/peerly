import { create } from 'zustand';
import type { TimeSlot } from '@/types';

interface CalendarState {
  timeSlots: TimeSlot[];
  loading: boolean;
  error: string | null;
  addTimeSlots: (slots: TimeSlot[]) => Promise<void>;
  removeTimeSlot: (id: string) => Promise<void>;
  updateSlotStatus: (id: string, status: TimeSlot['status']) => Promise<void>;
  fetchTimeSlots: (startDate: string, endDate: string) => Promise<void>;
}

async function api(endpoint: string, options?: RequestInit) {
  const res = await fetch(endpoint, options);
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`API: ${body || res.statusText || res.status}`);
  }
  return res.json();
}

export const useCalendarStore = create<CalendarState>()((set) => ({
  timeSlots: [],
  loading: false,
  error: null,

  fetchTimeSlots: async (startDate, endDate) => {
    set({ loading: true, error: null });
    try {
      const data = await api(`/api/time-slots?start=${startDate}&end=${endDate}`);
      set({ timeSlots: data.timeSlots || [], loading: false });
    } catch (e) {
      set({ loading: false, error: (e as Error).message });
    }
  },

  addTimeSlots: async (slots) => {
    set((s) => ({ timeSlots: [...s.timeSlots, ...slots] }));
    try {
      await api('/api/time-slots', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(slots) });
    } catch (e) {
      console.error('Failed to save slots:', e);
    }
  },

  removeTimeSlot: async (id) => {
    set((s) => ({ timeSlots: s.timeSlots.filter((x) => x.id !== id) }));
    try {
      await api(`/api/time-slots/${id}`, { method: 'DELETE' });
    } catch (e) {
      console.error('Failed to delete slot:', e);
    }
  },

  updateSlotStatus: async (id, status) => {
    set((s) => ({ timeSlots: s.timeSlots.map((x) => (x.id === id ? { ...x, status } : x)) }));
    try {
      await api(`/api/time-slots/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) });
    } catch (e) {
      console.error('Failed to update slot:', e);
    }
  },
}));
