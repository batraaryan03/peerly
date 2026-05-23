'use client';

import { isToday } from 'date-fns';

interface CustomDateHeaderProps {
  date: Date;
  label: string;
  isOffRange: boolean;
  onDrillDown: () => void;
}

export function CustomDateHeader({
  date,
  label,
  isOffRange,
  onDrillDown,
}: CustomDateHeaderProps) {
  const today = isToday(date);

  if (isOffRange) {
    return (
      <div className="px-2 pt-1.5 text-left">
        <span className="text-[11px] font-medium text-zinc-300">
          {label}
        </span>
      </div>
    );
  }

  return (
    <div className="px-2 pt-1.5 text-left">
      <button
        onClick={onDrillDown}
        className={`flex h-7 w-7 items-center justify-center text-[12px] font-medium transition-all ${
          today
            ? 'bg-[#CB6CE6] text-white shadow-[0_2px_8px_rgba(203,108,230,0.25)]'
            : 'text-zinc-500 hover:text-zinc-800'
        }`}
      >
        {label}
      </button>
    </div>
  );
}
