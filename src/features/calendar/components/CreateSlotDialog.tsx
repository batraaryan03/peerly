'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { useCalendarStore } from '@/features/calendar/store/calendar.store';
import { useUserStore } from '@/features/user/store/user.store';
import { generateSlotId } from '@/features/calendar/utils/date-utils';
import type { TimeSlot } from '@/types';
import { X } from 'lucide-react';

interface CreateSlotDialogProps {
  defaultStart?: string;
  defaultEnd?: string;
  onClose?: () => void;
}

export function CreateSlotDialog({ defaultStart, defaultEnd, onClose }: CreateSlotDialogProps) {
  const currentUser = useUserStore((s) => s.currentUser);
  const addTimeSlot = useCalendarStore((s) => s.addTimeSlot);
  const [startDate, setStartDate] = useState(
    () => defaultStart || format(new Date(), "yyyy-MM-dd'T'HH:mm"),
  );
  const [endDate, setEndDate] = useState(
    () =>
      defaultEnd ||
      format(
        new Date(Date.now() + 3600000),
        "yyyy-MM-dd'T'HH:mm",
      ),
  );

  const handleCreate = () => {
    if (!currentUser) return;
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (end <= start) return;

    const newSlot: TimeSlot = {
      id: generateSlotId(),
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      startTime: start.toISOString(),
      endTime: end.toISOString(),
      status: 'available',
      createdAt: Date.now(),
    };
    addTimeSlot(newSlot);
    onClose?.();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-md">
      <div
        className="w-full max-w-sm overflow-hidden bg-white p-6 shadow-[0_12px_48px_rgba(203,108,230,0.12),0_24px_48px_rgba(0,0,0,0.08)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold tracking-tight text-zinc-800">Block time</h2>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded text-zinc-400 transition-colors hover:bg-[rgba(203,108,230,0.1)] hover:text-[#CB6CE6]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-4 space-y-3.5">
          <div>
            <label className="text-[10.5px] font-medium uppercase tracking-wider text-zinc-500">Start</label>
            <input
              type="datetime-local"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="mt-1 w-full rounded border border-[rgba(203,108,230,0.15)] bg-zinc-50 px-3 py-2 text-sm text-zinc-800 outline-none transition-colors hover:border-[rgba(203,108,230,0.3)] focus:border-[#CB6CE6] focus:bg-white focus:ring-1 focus:ring-[rgba(203,108,230,0.2)] [color-scheme:light]"
            />
          </div>
          <div>
            <label className="text-[10.5px] font-medium uppercase tracking-wider text-zinc-500">End</label>
            <input
              type="datetime-local"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="mt-1 w-full rounded border border-[rgba(203,108,230,0.15)] bg-zinc-50 px-3 py-2 text-sm text-zinc-800 outline-none transition-colors hover:border-[rgba(203,108,230,0.3)] focus:border-[#CB6CE6] focus:bg-white focus:ring-1 focus:ring-[rgba(203,108,230,0.2)] [color-scheme:light]"
            />
          </div>
          <button
            onClick={handleCreate}
            className="w-full rounded px-4 py-2.5 text-sm font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_2px_8px_rgba(203,108,230,0.3)] transition-all active:scale-[0.98]"
            style={{
              background: 'linear-gradient(135deg, rgba(203,108,230,1) 0%, rgba(203,108,230,0.88) 50%, rgba(203,108,230,1) 100%)',
            }}
          >
            Create slot
          </button>
        </div>
      </div>
    </div>
  );
}
