'use client';

import { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { useRecurringStore, DAYS } from '@/features/calendar/store/recurring.store';
import { useUserStore } from '@/features/user/store/user.store';
import type { RecurringRule } from '@/types';

interface RecurringSettingsProps {
  onClose: () => void;
}

const HOURS = Array.from({ length: 24 }, (_, i) => {
  const ampm = i >= 12 ? 'PM' : 'AM';
  const h = i === 0 ? 12 : i > 12 ? i - 12 : i;
  return { value: i, label: `${h} ${ampm}` };
});

export function RecurringSettings({ onClose }: RecurringSettingsProps) {
  const currentUser = useUserStore((s) => s.currentUser);
  const rules = useRecurringStore((s) => s.rules);
  const addRule = useRecurringStore((s) => s.addRule);
  const removeRule = useRecurringStore((s) => s.removeRule);
  const toggleRule = useRecurringStore((s) => s.toggleRule);

  const [day, setDay] = useState(1);
  const [startHour, setStartHour] = useState(14);
  const [endHour, setEndHour] = useState(16);

  const handleAdd = () => {
    if (!currentUser || endHour <= startHour) return;
    addRule({
      id: `rule-${Date.now()}`,
      userId: currentUser.id,
      dayOfWeek: day,
      startHour,
      endHour,
      active: true,
    });
  };

  const sortedRules = [...rules].sort((a, b) => {
    if (a.dayOfWeek !== b.dayOfWeek) return a.dayOfWeek - b.dayOfWeek;
    return a.startHour - b.startHour;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md border border-white/[0.06] bg-zinc-950 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-medium tracking-tight text-zinc-100">
            Recurring Availability
          </h2>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center text-zinc-500 transition-colors hover:text-zinc-300"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-6 space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-medium uppercase tracking-widest text-zinc-500">
                Day
              </label>
              <select
                value={day}
                onChange={(e) => setDay(parseInt(e.target.value))}
                className="mt-1 w-full border border-white/[0.08] bg-zinc-900 px-2 py-1.5 text-sm text-zinc-300 outline-none focus:border-[#8B5CF6]"
              >
                {DAYS.map((name, i) => (
                  <option key={i} value={i}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-medium uppercase tracking-widest text-zinc-500">
                Start
              </label>
              <select
                value={startHour}
                onChange={(e) => setStartHour(parseInt(e.target.value))}
                className="mt-1 w-full border border-white/[0.08] bg-zinc-900 px-2 py-1.5 text-sm text-zinc-300 outline-none focus:border-[#8B5CF6]"
              >
                {HOURS.slice(7, 22).map((h) => (
                  <option key={h.value} value={h.value}>
                    {h.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-medium uppercase tracking-widest text-zinc-500">
                End
              </label>
              <select
                value={endHour}
                onChange={(e) => setEndHour(parseInt(e.target.value))}
                className="mt-1 w-full border border-white/[0.08] bg-zinc-900 px-2 py-1.5 text-sm text-zinc-300 outline-none focus:border-[#8B5CF6]"
              >
                {HOURS.slice(8, 23).map((h) => (
                  <option key={h.value} value={h.value}>
                    {h.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={handleAdd}
            className="flex w-full items-center justify-center gap-2 border border-white/[0.08] bg-white/[0.04] px-4 py-2 text-sm font-medium text-zinc-300 transition-all hover:bg-white/[0.08]"
          >
            <Plus className="h-3.5 w-3.5" />
            Add rule
          </button>
        </div>

        {sortedRules.length > 0 && (
          <div className="mt-6 space-y-1.5">
            {sortedRules.map((rule) => (
              <div
                key={rule.id}
                className={`flex items-center justify-between border border-white/[0.06] px-3 py-2 transition-colors ${
                  rule.active ? 'bg-white/[0.03]' : 'bg-white/[0.01] opacity-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleRule(rule.id)}
                    className={`h-3.5 w-3.5 border ${
                      rule.active
                        ? 'border-[#8B5CF6] bg-[#8B5CF6]'
                        : 'border-white/[0.15]'
                    }`}
                  >
                    {rule.active && (
                      <svg viewBox="0 0 14 14" className="h-full w-full fill-white">
                        <path d="M11.3 3.3L5 9.6 2.7 7.3l-1.4 1.4L5 12.4l7.7-7.7z" />
                      </svg>
                    )}
                  </button>
                  <div>
                    <span className="text-sm font-medium text-zinc-200">
                      {DAYS[rule.dayOfWeek]}
                    </span>
                    <span className="ml-2 text-xs text-zinc-500">
                      {HOURS[rule.startHour]?.label} — {HOURS[rule.endHour]?.label}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => removeRule(rule.id)}
                  className="flex h-6 w-6 items-center justify-center text-zinc-600 transition-colors hover:text-red-400"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        {sortedRules.length === 0 && (
          <p className="mt-6 text-center text-xs text-zinc-600">
            No recurring rules yet. Add your weekly availability above.
          </p>
        )}
      </div>
    </div>
  );
}
