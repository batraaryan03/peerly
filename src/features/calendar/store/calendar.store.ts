import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { TimeSlot } from '@/types';

interface CalendarState {
  timeSlots: TimeSlot[];
  selectedDate: string;
  view: 'week' | 'day';
  addTimeSlot: (slot: TimeSlot) => void;
  removeTimeSlot: (id: string) => void;
  updateSlotStatus: (id: string, status: TimeSlot['status']) => void;
  setSelectedDate: (date: string) => void;
  setView: (view: 'week' | 'day') => void;
  seedSlots: (slots: TimeSlot[]) => void;
}

export const useCalendarStore = create<CalendarState>()(
  persist(
    (set) => ({
      timeSlots: [],
      selectedDate: new Date().toISOString(),
      view: 'week',
      addTimeSlot: (slot) =>
        set((state) => ({ timeSlots: [...state.timeSlots, slot] })),
      removeTimeSlot: (id) =>
        set((state) => ({ timeSlots: state.timeSlots.filter((s) => s.id !== id) })),
      updateSlotStatus: (id, status) =>
        set((state) => ({
          timeSlots: state.timeSlots.map((s) =>
            s.id === id ? { ...s, status } : s,
          ),
        })),
      setSelectedDate: (date) => set({ selectedDate: date }),
      setView: (view) => set({ view }),
      seedSlots: (slots) => set({ timeSlots: slots }),
    }),
    { name: 'peerly-calendar' },
  ),
);
