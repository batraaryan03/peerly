'use client';

import { useState } from 'react';
import { formatSlotTime, formatSlotDate } from '@/features/calendar/utils/date-utils';
import { useUserStore } from '@/features/user/store/user.store';
import { useMatchingStore } from '@/features/matching/store/matching.store';
import { useCalendarStore } from '@/features/calendar/store/calendar.store';
import type { TimeSlot, Session, SessionRequest } from '@/types';
import { X, Check } from 'lucide-react';

interface RequestJoinDialogProps {
  slot: TimeSlot;
  onClose: () => void;
}

export function RequestJoinDialog({ slot, onClose }: RequestJoinDialogProps) {
  const currentUser = useUserStore((s) => s.currentUser);
  const addSession = useMatchingStore((s) => s.addSession);
  const addRequest = useMatchingStore((s) => s.addRequest);
  const updateSlotStatus = useCalendarStore((s) => s.updateSlotStatus);
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleRequest = () => {
    if (!currentUser) return;

    const sessionId = `session-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const requestId = `req-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const roomName = `peerly-${slot.id}-${Date.now().toString(36)}`;

    const session: Session = {
      id: sessionId,
      timeSlotId: slot.id,
      hostId: slot.userId,
      hostName: slot.userName,
      hostAvatar: slot.userAvatar,
      participantId: currentUser.id,
      participantName: currentUser.name,
      participantAvatar: currentUser.avatar,
      startTime: slot.startTime,
      endTime: slot.endTime,
      status: 'approved',
      roomName,
      createdAt: Date.now(),
    };

    const request: SessionRequest = {
      id: requestId,
      sessionId,
      timeSlotId: slot.id,
      requesterId: currentUser.id,
      requesterName: currentUser.name,
      requesterAvatar: currentUser.avatar,
      message: message.trim(),
      status: 'accepted',
      createdAt: Date.now(),
    };

    addSession(session);
    addRequest(request);
    updateSlotStatus(slot.id, 'booked');
    setSent(true);
  };

  if (sent) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
        <div className="w-full max-w-sm rounded-2xl bg-white/[0.06] p-8 backdrop-blur-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] text-center">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/20">
            <Check className="h-5 w-5 text-emerald-500" />
          </div>
          <h2 className="mt-3 text-base font-medium text-foreground">You&apos;re in!</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Session with {slot.userName} has been created.
          </p>
          <div className="mt-5 flex items-center justify-center gap-2">
            <button
              onClick={onClose}
              className="rounded-lg bg-white/[0.06] px-4 py-2 text-sm font-medium text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition-colors hover:bg-white/[0.1]"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl bg-white/[0.06] p-6 backdrop-blur-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-medium text-foreground">Request to join</h2>
          <button
            onClick={onClose}
            className="rounded p-1 text-muted-foreground transition-colors hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-4 space-y-4">
          <div className="flex items-center gap-3 rounded-lg bg-white/[0.03] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/[0.08] text-xs font-medium text-foreground">
              {slot.userAvatar}
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">{slot.userName}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {formatSlotDate(slot.startTime)} &middot;{' '}
                {formatSlotTime(slot.startTime)} — {formatSlotTime(slot.endTime)}
              </p>
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">
              Message (optional)
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Hi! I&apos;d like to work on..."
              rows={3}
              className="mt-1 w-full resize-none rounded-lg bg-white/[0.04] px-3 py-2 text-sm text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] outline-none placeholder:text-muted-foreground/40 focus-visible:shadow-[inset_0_0_0_1px_#10b981]"
            />
          </div>
          <button
            onClick={handleRequest}
            className="w-full rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-emerald-600 active:scale-[0.98]"
          >
            Send request
          </button>
        </div>
      </div>
    </div>
  );
}
