'use client';

import { motion } from 'framer-motion';
import { formatSlotTime } from '@/features/calendar/utils/date-utils';
import type { TimeSlot } from '@/types';

interface SlotBlockProps {
  slot: TimeSlot;
  isOwn: boolean;
  onClick: () => void;
  compact?: boolean;
  userColors?: { bg: string; text: string; dot: string };
}

export function SlotBlock({ slot, isOwn, onClick, compact, userColors }: SlotBlockProps) {
  const isAvailable = slot.status === 'available';
  const isClickable = isAvailable && !isOwn;
  const colors = userColors || { bg: 'bg-zinc-500/10', text: 'text-zinc-600', dot: 'bg-zinc-400' };

  if (compact) {
    return (
      <motion.button
        layout
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={isClickable ? onClick : undefined}
        className={`flex w-full items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-medium transition-all hover:opacity-80 ${
          isOwn
            ? 'bg-emerald-500 text-white'
            : `${colors.bg} ${colors.text}`
        } ${!isClickable ? 'cursor-default' : 'cursor-pointer'}`}
        title={`${slot.userName} — ${formatSlotTime(slot.startTime)}`}
      >
        <div className={`h-1.5 w-1.5 shrink-0 rounded-full ${isOwn ? 'bg-white' : colors.dot}`} />
        <span className="truncate">{slot.userName}</span>
      </motion.button>
    );
  }

  return (
    <motion.button
      layout
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={isClickable ? onClick : undefined}
      className={`absolute inset-x-0.5 top-0.5 z-10 rounded-lg px-2 py-1 text-left text-xs leading-tight shadow-sm backdrop-blur-sm transition-shadow hover:shadow-md ${
        isOwn
          ? 'bg-emerald-500 text-white shadow-emerald-500/20'
          : isAvailable
            ? `${colors.bg} ${colors.text} shadow-black/5 cursor-pointer`
            : 'bg-zinc-100 text-zinc-400'
      } ${!isClickable ? 'cursor-default' : ''}`}
      title={`${slot.userName}: ${formatSlotTime(slot.startTime)} — ${formatSlotTime(slot.endTime)}`}
    >
      <div className="flex items-center gap-1.5">
        <div
          className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[8px] font-bold ${
            isOwn ? 'bg-white/20 text-white' : `${colors.dot} text-white`
          }`}
        >
          {slot.userAvatar}
        </div>
        <span className="truncate text-[11px] font-medium">{slot.userName}</span>
      </div>
    </motion.button>
  );
}
