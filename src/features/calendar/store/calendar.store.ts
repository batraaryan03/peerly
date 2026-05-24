import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { TimeSlot } from '@/types';

interface CalendarState {
  timeSlots: TimeSlot[];
  selectedDate: string;
  view: 'week' | 'day';
  addTimeSlot: (slot: TimeSlot) => Promise<void>;
  removeTimeSlot: (id: string) => Promise<void>;
  updateSlotStatus: (id: string, status: TimeSlot['status']) => Promise<void>;
  setSelectedDate: (date: string) => void;
  setView: (view: 'week' | 'day') => void;
  seedSlots: (slots: TimeSlot[]) => void;
  fetchTimeSlots: (userId: string) => Promise<void>;
}

async function apiCall(endpoint: string, options?: RequestInit) {
  const res = await fetch(endpoint, options);
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    const message = body || res.statusText || `HTTP ${res.status}`;
    throw new Error(`API error: ${message}`);
  }
  return res.json();
}

export const useCalendarStore = create<CalendarState>()(
  persist(
    (set) => ({
      timeSlots: [],
      selectedDate: new Date().toISOString(),
      view: 'week',
      addTimeSlot: async (slot) => {
        set((state) => ({ timeSlots: [...state.timeSlots, slot] }));
        try {
          await apiCall('/api/time-slots', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(slot),
          });
        } catch (error) {
          console.error('Failed to save time slot:', error);
        }
      },
      removeTimeSlot: async (id) => {
        set((state) => ({ timeSlots: state.timeSlots.filter((s) => s.id !== id) }));
        try {
          await apiCall(`/api/time-slots/${id}`, { method: 'DELETE' });
        } catch (error) {
          console.error('Failed to delete time slot:', error);
        }
      },
      updateSlotStatus: async (id, status) => {
        set((state) => ({
          timeSlots: state.timeSlots.map((s) =>
            s.id === id ? { ...s, status } : s,
          ),
        }));
        try {
          await apiCall(`/api/time-slots/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status }),
          });
        } catch (error) {
          console.error('Failed to update time slot:', error);
        }
      },
      setSelectedDate: (date) => set({ selectedDate: date }),
      setView: (view) => set({ view }),
      seedSlots: (slots) => set({ timeSlots: slots }),
      fetchTimeSlots: async (userId) => {
        try {
          const data = await apiCall(`/api/time-slots?userId=${userId}`);
          set({ timeSlots: data.timeSlots || [] });
        } catch (error) {
          console.error('Failed to fetch time slots:', error);
        }
      },
    }),
    { name: 'peerly-calendar' },
  ),
);