'use client';

import { useEffect, useRef } from 'react';
import {
  X,
  Video,
  UserPlus,
  Trash2,
  Clock as ClockIcon,
  Users,
} from 'lucide-react';
import type { CalendarEvent } from '@/types';

interface EventPopupProps {
  event: CalendarEvent;
  position: { x: number; y: number };
  onClose: () => void;
  onJoin: (event: CalendarEvent) => void;
  onDelete: (event: CalendarEvent) => void;
  onJoinMeet: (event: CalendarEvent) => void;
}

export function EventPopup({
  event,
  position,
  onClose,
  onJoin,
  onDelete,
  onJoinMeet,
}: EventPopupProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  const formatHour = (d: Date) => {
    const h = d.getHours();
    const m = d.getMinutes();
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hour12 = h % 12 || 12;
    return `${hour12}:${m.toString().padStart(2, '0')}${ampm.toLowerCase()}`;
  };

  const style: React.CSSProperties = {
    position: 'fixed',
    left: Math.min(position.x, window.innerWidth - 300),
    top: Math.min(position.y, window.innerHeight - 280),
    zIndex: 9999,
  };

  const isBooked = event.status === 'booked';

  return (
    <div
      ref={ref}
      style={style}
      className="w-[270px] bg-white/90 backdrop-blur-2xl border border-[#CB6CE6]/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_8px_32px_rgba(203,108,230,0.15),0_0_0_1px_rgba(203,108,230,0.06)]"
    >
      <div className="relative flex items-center justify-between px-4 py-3 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#CB6CE6]/5 via-transparent to-[#CB6CE6]/5" />
        <div className="flex items-center gap-2.5 min-w-0 relative z-10">
          <div className="flex h-8 w-8 items-center justify-center text-[11px] font-bold text-white bg-gradient-to-br from-[#CB6CE6] to-[#b055d4] shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_2px_8px_rgba(203,108,230,0.25)]">
            {event.userAvatar || event.userName.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="truncate text-[13px] font-bold text-zinc-800 tracking-tight">
              {event.title}
            </p>
            <p className="truncate text-[10px] font-medium text-zinc-400">
              {event.isOwn ? 'Your slot' : `${event.userName}'s slot`}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="relative z-10 ml-2 flex h-5 w-5 shrink-0 items-center justify-center text-zinc-300 transition-colors hover:text-zinc-600"
        >
          <X size={13} />
        </button>
      </div>

      <div className="space-y-2 px-4 py-2.5 border-t border-[#CB6CE6]/10">
        <div className="flex items-center gap-2 text-[11px] text-zinc-500">
          <ClockIcon size={11} className="text-zinc-300" />
          <span className="font-medium">
            {formatHour(event.start)} &ndash; {formatHour(event.end)}
          </span>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-zinc-500">
          <Users size={11} className="text-zinc-300" />
          <span className="font-medium">
            {event.peerCount === 0
              ? 'No peers yet'
              : `${event.peerCount} peer${event.peerCount !== 1 ? 's' : ''} in this slot`}
          </span>
        </div>
      </div>

      <div className="flex gap-1.5 border-t border-[#CB6CE6]/10 px-4 py-3">
        {isBooked && (
          <button
            onClick={() => onJoinMeet(event)}
            className="flex flex-1 items-center justify-center gap-1.5 bg-[#CB6CE6] px-2 py-2 text-[10px] font-bold uppercase tracking-wider text-white transition-all hover:bg-[#b055d4] active:scale-[0.97] shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_2px_8px_rgba(203,108,230,0.2)]"
          >
            <Video size={12} />
            Join Meet
          </button>
        )}
        {!event.isOwn && !isBooked && (
          <button
            onClick={() => onJoin(event)}
            className="flex flex-1 items-center justify-center gap-1.5 bg-[#CB6CE6] px-2 py-2 text-[10px] font-bold uppercase tracking-wider text-white transition-all hover:bg-[#b055d4] active:scale-[0.97] shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_2px_8px_rgba(203,108,230,0.2)]"
          >
            <UserPlus size={12} />
            Request
          </button>
        )}
        {event.isOwn && !isBooked && (
          <button
            onClick={() => onDelete(event)}
            className="flex flex-1 items-center justify-center gap-1.5 border border-red-200 bg-red-50/50 px-2 py-2 text-[10px] font-bold uppercase tracking-wider text-red-500 transition-all hover:bg-red-50/80 hover:border-red-300 active:scale-[0.97] shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] backdrop-blur-xl"
          >
            <Trash2 size={12} />
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
