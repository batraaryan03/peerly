import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { RecurringRule } from '@/types';

interface RecurringState {
  rules: RecurringRule[];
  addRule: (rule: RecurringRule) => void;
  removeRule: (id: string) => void;
  toggleRule: (id: string) => void;
  updateRule: (id: string, updates: Partial<RecurringRule>) => void;
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export { DAYS };

export const useRecurringStore = create<RecurringState>()(
  persist(
    (set) => ({
      rules: [],
      addRule: (rule) =>
        set((state) => ({ rules: [...state.rules, rule] })),
      removeRule: (id) =>
        set((state) => ({ rules: state.rules.filter((r) => r.id !== id) })),
      toggleRule: (id) =>
        set((state) => ({
          rules: state.rules.map((r) =>
            r.id === id ? { ...r, active: !r.active } : r,
          ),
        })),
      updateRule: (id, updates) =>
        set((state) => ({
          rules: state.rules.map((r) =>
            r.id === id ? { ...r, ...updates } : r,
          ),
        })),
    }),
    { name: 'peerly-recurring' },
  ),
);
