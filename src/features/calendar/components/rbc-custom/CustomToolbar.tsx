'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { View } from 'react-big-calendar';

type ViewsProp = string[] | { [key: string]: boolean | React.ComponentType };

interface CustomToolbarProps {
  date: Date;
  view: string;
  views: ViewsProp;
  label: string;
  onNavigate: (action: 'PREV' | 'NEXT' | 'TODAY' | 'DATE') => void;
  onView: (view: View) => void;
}

const VIEW_ORDER = ['month', 'week', 'day'] as const;

export function CustomToolbar({
  date,
  view,
  views,
  label,
  onNavigate,
  onView,
}: CustomToolbarProps) {
  const viewsMap =
    Array.isArray(views)
      ? Object.fromEntries(views.map((v) => [v, true]))
      : (views as { [key: string]: boolean | React.ComponentType });
  const availableViews = VIEW_ORDER.filter((v) => viewsMap[v]);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2">
        <button
          onClick={() => onNavigate('TODAY')}
          className="flex items-center gap-1.5 border border-zinc-200 bg-white/80 px-3 py-1.5 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider transition-all hover:border-[#CB6CE6]/30 hover:bg-[#CB6CE6]/5 hover:text-zinc-800 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] backdrop-blur-xl"
        >
          Today
        </button>
        <div className="flex">
          <button
            onClick={() => onNavigate('PREV')}
            className="flex h-7 w-7 items-center justify-center border border-zinc-200 bg-white/80 text-zinc-400 transition-all hover:border-[#CB6CE6]/30 hover:bg-[#CB6CE6]/5 hover:text-zinc-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] backdrop-blur-xl"
          >
            <ChevronLeft size={15} />
          </button>
          <button
            onClick={() => onNavigate('NEXT')}
            className="flex h-7 w-7 items-center justify-center border border-l-0 border-zinc-200 bg-white/80 text-zinc-400 transition-all hover:border-[#CB6CE6]/30 hover:bg-[#CB6CE6]/5 hover:text-zinc-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] backdrop-blur-xl"
          >
            <ChevronRight size={15} />
          </button>
        </div>
        <h2 className="text-[17px] font-bold tracking-tight text-zinc-800 select-none">
          {label}
        </h2>
      </div>

      <div className="flex">
        {availableViews.map((v, i) => {
          const isActive = view === v;
          const label =
            v === 'month' ? 'Month' : v === 'week' ? 'Week' : 'Day';
          const isFirst = i === 0;
          const isLast = i === availableViews.length - 1;
          return (
            <button
              key={v}
              onClick={() => onView(v as View)}
              className={`px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wider transition-all shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] backdrop-blur-xl ${
                isFirst
                  ? 'border border-r-0'
                  : isLast
                    ? 'border'
                    : 'border border-r-0'
              } ${
                isActive
                  ? 'border-[#CB6CE6] bg-[#CB6CE6] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_2px_8px_rgba(203,108,230,0.3)]'
                  : 'border-zinc-200 bg-white/80 text-zinc-500 hover:border-[#CB6CE6]/30 hover:bg-[#CB6CE6]/5 hover:text-zinc-700'
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
