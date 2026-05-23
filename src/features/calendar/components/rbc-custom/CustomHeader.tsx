'use client';

import { isToday } from 'date-fns';
import { format } from 'date-fns/format';

interface CustomHeaderProps {
  date: Date;
  label: string;
}

export function CustomHeader({ date, label }: CustomHeaderProps) {
  const today = isToday(date);

  return (
    <div
      className={`flex flex-col items-center justify-center px-2 py-3 ${
        today ? '' : 'text-zinc-400'
      }`}
    >
      <span className="text-[9px] font-semibold uppercase tracking-[0.1em] text-zinc-400">
        {format(date, 'EEE')}
      </span>
      <span
        className={`mt-0.5 text-[14px] font-bold leading-none ${
          today ? 'text-[#CB6CE6]' : 'text-zinc-700'
        }`}
      >
        {format(date, 'd')}
      </span>
      {today && (
        <div className="mt-1 h-[3px] w-[18px] rounded-full bg-[#CB6CE6] shadow-[0_0_6px_rgba(203,108,230,0.3)]" />
      )}
    </div>
  );
}
