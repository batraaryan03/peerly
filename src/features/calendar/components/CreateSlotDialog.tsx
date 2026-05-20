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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="w-full max-w-md px-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-medium tracking-tight">Block time</h2>
          <button
            onClick={onClose}
            className="rounded p-1 text-muted-foreground transition-colors hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-6 space-y-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground">Start</label>
            <input
              type="datetime-local"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="mt-1 w-full border-0 border-b border-transparent bg-transparent pb-1 text-sm outline-none ring-0 focus:border-b focus:border-purple-600"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">End</label>
            <input
              type="datetime-local"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="mt-1 w-full border-0 border-b border-transparent bg-transparent pb-1 text-sm outline-none ring-0 focus:border-b focus:border-purple-600"
            />
          </div>
          <button
            onClick={handleCreate}
            className="mt-4 w-full rounded-md bg-foreground px-4 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90"
          >
            Create slot
          </button>
        </div>
      </div>
    </div>
  );
}
