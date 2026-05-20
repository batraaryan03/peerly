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
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
        <div className="w-full max-w-sm px-6 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-purple-500/10">
            <Check className="h-6 w-6 text-purple-500" />
          </div>
          <h2 className="mt-4 text-xl font-medium tracking-tight">You&apos;re in!</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Session with {slot.userName} has been created. Go to Sessions to join.
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              onClick={onClose}
              className="rounded-md bg-muted px-4 py-2.5 text-sm font-medium text-foreground transition-opacity hover:opacity-90"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="w-full max-w-md px-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-medium tracking-tight">Request to join</h2>
          <button
            onClick={onClose}
            className="rounded p-1 text-muted-foreground transition-colors hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-6 space-y-4">
          <div className="flex items-center gap-3 rounded-md bg-muted p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-foreground/10 text-sm font-medium">
              {slot.userAvatar}
            </div>
            <div>
              <p className="font-medium">{slot.userName}</p>
              <p className="mt-0.5 text-sm text-muted-foreground">
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
              className="mt-1 w-full resize-none border-0 border-b border-transparent bg-transparent pb-1 text-sm outline-none ring-0 placeholder:text-muted-foreground/40 focus:border-b focus:border-purple-600"
            />
          </div>
          <button
            onClick={handleRequest}
            className="mt-4 w-full rounded-md bg-foreground px-4 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90"
          >
            Send request
          </button>
        </div>
      </div>
    </div>
  );
}
