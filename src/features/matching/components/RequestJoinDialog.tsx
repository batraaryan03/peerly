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

  const glossyBtn = {
    backgroundImage: 'linear-gradient(135deg, rgba(203,108,230,1) 0%, rgba(203,108,230,0.88) 50%, rgba(203,108,230,1) 100%)',
  } as React.CSSProperties;

  if (sent) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-md">
        <div className="w-full max-w-sm bg-white p-8 text-center shadow-[0_12px_48px_rgba(203,108,230,0.12),0_24px_48px_rgba(0,0,0,0.08)]">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(203,108,230,0.12)] shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]">
            <Check className="h-5 w-5 text-[#CB6CE6]" />
          </div>
          <h2 className="mt-3 text-base font-semibold tracking-tight text-zinc-800">Session booked!</h2>
          <p className="mt-1.5 text-sm text-zinc-500">
            You&apos;re paired with {slot.userName}. {formatSlotTime(slot.startTime)} &ndash; {formatSlotTime(slot.endTime)}.
          </p>
          <button
            onClick={onClose}
            className="mt-5 rounded px-5 py-2 text-sm font-medium text-zinc-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_1px_3px_rgba(203,108,230,0.3)] transition-all active:scale-[0.97]"
            style={glossyBtn}
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-md">
      <div
        className="w-full max-w-sm bg-white p-6 shadow-[0_12px_48px_rgba(203,108,230,0.12),0_24px_48px_rgba(0,0,0,0.08)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold tracking-tight text-zinc-800">Request to join</h2>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded text-zinc-400 transition-colors hover:bg-[rgba(203,108,230,0.1)] hover:text-[#CB6CE6]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-4 space-y-3.5">
          <div
            className="flex items-center gap-3 rounded border border-[rgba(203,108,230,0.1)] bg-zinc-50 p-3"
          >
            <div className="flex h-8 w-8 items-center justify-center text-xs font-bold text-zinc-600 bg-white border border-[rgba(203,108,230,0.12)]">
              {slot.userAvatar}
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-800">{slot.userName}</p>
              <p className="mt-0.5 text-[11px] text-zinc-500">
                {formatSlotDate(slot.startTime)} &middot; {formatSlotTime(slot.startTime)} &mdash; {formatSlotTime(slot.endTime)}
              </p>
            </div>
          </div>
          <div>
            <label className="text-[10.5px] font-medium uppercase tracking-wider text-zinc-400">
              Message (optional)
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Hi! I want to focus on..."
              rows={3}
              className="mt-1 w-full resize-none rounded border border-[rgba(203,108,230,0.15)] bg-zinc-50 px-3 py-2 text-sm text-zinc-700 outline-none transition-colors hover:border-[rgba(203,108,230,0.3)] focus:border-[#CB6CE6] focus:bg-white focus:ring-1 focus:ring-[rgba(203,108,230,0.2)] placeholder:text-zinc-300"
            />
          </div>
          <button
            onClick={handleRequest}
            className="w-full rounded px-4 py-2.5 text-sm font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_2px_8px_rgba(203,108,230,0.3)] transition-all active:scale-[0.98]"
            style={glossyBtn}
          >
            Send request
          </button>
        </div>
      </div>
    </div>
  );
}
