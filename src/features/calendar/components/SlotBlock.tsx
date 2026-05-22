'use client';

import { motion } from 'framer-motion';
import { formatSlotTime } from '@/features/calendar/utils/date-utils';
import type { TimeSlot } from '@/types';

interface SlotBlockProps {
  slot: TimeSlot;
  isOwn: boolean;
  onClick: () => void;
  onContextMenu?: () => void;
  userColors?: { bg: string; text: string; dot: string };
}

export function SlotBlock({ slot, isOwn, onClick, onContextMenu, userColors }: SlotBlockProps) {
  const isAvailable = slot.status === 'available';
  const isBooked = slot.status === 'booked';
  const isCancelled = slot.status === 'cancelled';
  const isClickable = isAvailable && !isOwn;
  const colors = userColors || {
    bg: 'bg-[rgba(203,108,230,0.07)]',
    text: 'text-[rgba(203,108,230,0.85)]',
    dot: 'bg-[#9C4FC2]',
  };

  const getBlockClass = () => {
    if (isOwn) {
      return `${colors.bg} ${colors.text} shadow-[inset_0_1px_0_rgba(255,255,255,0.3)]`;
    }
    if (isBooked || isCancelled) {
      return 'bg-zinc-200 text-zinc-400 shadow-none';
    }
    return `${colors.bg} ${colors.text} shadow-[inset_0_0_0_rgba(255,255,255,0.6)]`;
  };

  const getBorderClass = () => {
    if (isOwn) return 'border-l-[3px] border-l-[#CB6CE6]';
    if (isBooked || isCancelled) return 'border-l-[2px] border-l-zinc-300';
    return 'border-l-[3px] border-l-[#9C4FC2]';
  };

  return (
    <motion.button
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      onClick={isClickable ? onClick : undefined}
      onContextMenu={(e) => {
        e.preventDefault();
        onContextMenu?.();
      }}
      title={`${slot.userName}: ${formatSlotTime(slot.startTime)} — ${formatSlotTime(slot.endTime)}`}
      className={`
        h-full w-full rounded-none px-2 py-0.5 text-left text-[10.5px] leading-snug
        backdrop-blur-xl transition-all duration-100
        ${getBlockClass()} ${getBorderClass()}
        ${isClickable ? 'cursor-pointer hover:shadow-[0_0_10px_rgba(203,108,230,0.15)]' : 'cursor-default'}
        ${!isClickable && !isBooked && !isCancelled ? '' : ''}
      `}
    >
      <div className="flex items-center gap-1.5">
        <div className="mt-px h-1 w-1 shrink-0 rounded-full [background:currentColor]" />
        <span className="truncate font-medium">{slot.userName}</span>
        <span className="shrink-0 text-[9px] opacity-50">
          {formatSlotTime(slot.startTime)}
        </span>
      </div>
    </motion.button>
  );
}
