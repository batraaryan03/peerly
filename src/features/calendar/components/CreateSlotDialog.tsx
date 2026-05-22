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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl bg-white/[0.06] p-6 backdrop-blur-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-medium text-foreground">Block time</h2>
          <button
            onClick={onClose}
            className="rounded p-1 text-muted-foreground transition-colors hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-4 space-y-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground">Start</label>
            <input
              type="datetime-local"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="mt-1 w-full rounded-lg bg-white/[0.04] px-3 py-2 text-sm text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] outline-none focus-visible:shadow-[inset_0_0_0_1px_#10b981] [color-scheme:dark]"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">End</label>
            <input
              type="datetime-local"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="mt-1 w-full rounded-lg bg-white/[0.04] px-3 py-2 text-sm text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] outline-none focus-visible:shadow-[inset_0_0_0_1px_#10b981] [color-scheme:dark]"
            />
          </div>
          <button
            onClick={handleCreate}
            className="w-full rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-emerald-600 active:scale-[0.98]"
          >
            Create slot
          </button>
        </div>
      </div>
    </div>
  );
}
