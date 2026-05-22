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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-md" onClick={onClose}>
      <div
        className="w-full max-w-md bg-white p-5 shadow-[0_12px_48px_rgba(203,108,230,0.12),0_24px_64px_rgba(0,0,0,0.1)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold tracking-tight text-zinc-800">Recurring Availability</h2>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded text-zinc-400 transition-colors hover:bg-[rgba(203,108,230,0.1)] hover:text-[#CB6CE6]"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="mt-5 space-y-3.5">
          <div className="grid grid-cols-3 gap-2.5">
            <div>
              <label className="block text-[10px] font-medium uppercase tracking-widest text-zinc-400">Day</label>
              <select
                value={day}
                onChange={(e) => setDay(parseInt(e.target.value))}
                className="mt-1 w-full rounded border border-[rgba(203,108,230,0.15)] bg-zinc-50 px-2.5 py-1.5 text-xs text-zinc-700 outline-none transition-colors hover:border-[rgba(203,108,230,0.3)] focus:border-[#CB6CE6] focus:ring-1 focus:ring-[rgba(203,108,230,0.2)] [color-scheme:light]"
              >
                {DAYS.map((name, i) => (
                  <option key={i} value={i}>{name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-medium uppercase tracking-widest text-zinc-400">Start</label>
              <select
                value={startHour}
                onChange={(e) => setStartHour(parseInt(e.target.value))}
                className="mt-1 w-full rounded border border-[rgba(203,108,230,0.15)] bg-zinc-50 px-2.5 py-1.5 text-xs text-zinc-700 outline-none transition-colors hover:border-[rgba(203,108,230,0.3)] focus:border-[#CB6CE6] focus:ring-1 focus:ring-[rgba(203,108,230,0.2)] [color-scheme:light]"
              >
                {HOURS.slice(7, 22).map((h) => (
                  <option key={h.value} value={h.value}>{h.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-medium uppercase tracking-widest text-zinc-400">End</label>
              <select
                value={endHour}
                onChange={(e) => setEndHour(parseInt(e.target.value))}
                className="mt-1 w-full rounded border border-[rgba(203,108,230,0.15)] bg-zinc-50 px-2.5 py-1.5 text-xs text-zinc-700 outline-none transition-colors hover:border-[rgba(203,108,230,0.3)] focus:border-[#CB6CE6] focus:ring-1 focus:ring-[rgba(203,108,230,0.2)] [color-scheme:light]"
              >
                {HOURS.slice(8, 23).map((h) => (
                  <option key={h.value} value={h.value}>{h.label}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={handleAdd}
            className="flex w-full items-center justify-center gap-1.5 rounded border border-[rgba(203,108,230,0.15)] bg-white px-4 py-2 text-[11px] font-semibold text-[#9C4FC2] shadow-[inset_0_0_0_rgba(255,255,255,0.1)] transition-all hover:border-[rgba(203,108,230,0.3)] hover:bg-[rgba(203,108,230,0.05)]"
          >
            <Plus className="h-3 w-3" />
            Add availability rule
          </button>
        </div>

        {sortedRules.length > 0 && (
          <div className="mt-5 space-y-1.5">
            {sortedRules.map((rule) => (
              <div
                key={rule.id}
                className={`flex items-center justify-between rounded border px-3 py-2.5 transition-colors ${
                  rule.active
                    ? 'border-[rgba(203,108,230,0.15)] bg-white'
                    : 'border-zinc-200 bg-zinc-50 opacity-55'
                }`}
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleRule(rule.id)}
                    className={`h-3.5 w-3.5 border duration-150 transition-all rounded-none ${
                      rule.active
                        ? 'border-[#CB6CE6] bg-[#CB6CE6]'
                        : 'border-zinc-300 bg-white'
                    }`}
                    title={rule.active ? 'Active' : 'Inactive'}
                  >
                    {rule.active && (
                      <svg viewBox="0 0 14 14" className="h-full w-full fill-white">
                        <path d="M11.3 3.3L5 9.6 2.7 7.3l-1.4 1.4L5 12.4l7.7-7.7z" />
                      </svg>
                    )}
                  </button>
                  <div>
                    <span className="text-xs font-semibold text-zinc-700">{DAYS[rule.dayOfWeek]}</span>
                    <span className="ml-2 text-[10.5px] text-zinc-400">
                      {HOURS[rule.startHour]?.label} &mdash; {HOURS[rule.endHour]?.label}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => removeRule(rule.id)}
                  className="flex h-6 w-6 items-center justify-center rounded text-zinc-300 transition-colors hover:bg-red-50 hover:text-red-500"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {sortedRules.length === 0 && (
          <div className="mt-6 rounded border border-dashed border-[rgba(203,108,230,0.2)] py-5 text-center">
            <p className="text-[11px] text-zinc-400">
              No rules yet. Add your weekly availability to auto-block time for focus partners.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
