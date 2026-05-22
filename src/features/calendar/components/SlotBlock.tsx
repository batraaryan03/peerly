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
  const isClickable = isAvailable && !isOwn;
  const colors = userColors || { bg: 'bg-white/[0.04]', text: 'text-zinc-400', dot: 'bg-zinc-500' };

  return (
    <motion.button
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={isClickable ? onClick : undefined}
      onContextMenu={(e) => {
        e.preventDefault();
        onContextMenu?.();
      }}
      className={`h-full w-full rounded-none px-2.5 py-1 text-left text-xs leading-tight backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] transition-shadow hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.15)] ${
        isOwn
          ? 'bg-[#8B5CF6]/20 text-[#8B5CF6] border-l-2 border-[#8B5CF6]'
          : isAvailable
            ? `${colors.bg} ${colors.text} cursor-pointer border-l-2 border-zinc-600`
            : 'bg-white/[0.04] text-zinc-500 border-l-2 border-zinc-700'
      } ${!isClickable ? 'cursor-default' : ''}`}
      title={`${slot.userName}: ${formatSlotTime(slot.startTime)} — ${formatSlotTime(slot.endTime)}`}
    >
      <div className="flex items-center gap-1.5">
        <span className="truncate text-[10px] font-medium">{slot.userName}</span>
        <span className="shrink-0 text-[9px] opacity-60">
          {formatSlotTime(slot.startTime)}
        </span>
      </div>
      {isOwn && onContextMenu && (
        <span className="mt-0.5 block text-[8px] opacity-40">Right-click to remove</span>
      )}
    </motion.button>
  );
}
