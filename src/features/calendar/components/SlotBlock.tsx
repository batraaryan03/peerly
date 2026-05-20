import { formatSlotTime } from '@/features/calendar/utils/date-utils';
import type { TimeSlot } from '@/types';

interface SlotBlockProps {
  slot: TimeSlot;
  isOwn: boolean;
  onClick: () => void;
  compact?: boolean;
}

export function SlotBlock({ slot, isOwn, onClick }: SlotBlockProps) {
  const isAvailable = slot.status === 'available';
  const isClickable = isAvailable && !isOwn;

  return (
    <button
      onClick={isClickable ? onClick : undefined}
      className={`absolute inset-x-0.5 top-0.5 z-10 rounded-sm px-1 py-0.5 text-left text-[11px] leading-tight transition-opacity hover:opacity-80 ${
        isOwn
          ? 'bg-purple-500 text-white'
          : isAvailable
            ? 'bg-foreground/10 text-foreground cursor-pointer'
            : 'bg-foreground/5 text-muted-foreground'
      } ${!isClickable ? 'cursor-default' : ''}`}
      title={`${slot.userName}: ${formatSlotTime(slot.startTime)} — ${formatSlotTime(slot.endTime)}`}
    >
      <div className="flex items-center gap-1">
        <div
          className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[8px] font-medium ${
            isOwn ? 'bg-white/20 text-white' : 'bg-foreground/20 text-foreground'
          }`}
        >
          {slot.userAvatar}
        </div>
        <span className="truncate text-[10px] font-medium">
          {slot.userName}
        </span>
      </div>
    </button>
  );
}
