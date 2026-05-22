'use client';

import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import {
  parseISO,
  isSameDay,
  addDays,
  subDays,
  addMonths,
  subMonths,
  isToday,
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
} from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { useCalendarStore } from '@/features/calendar/store/calendar.store';
import { useUserStore } from '@/features/user/store/user.store';
import {
  getWeekDays,
  getCurrentWeekLabel,
  getCurrentMonthLabel,
  getHourLabels,
  generateSlotId,
  getSlotsForDate,
} from '@/features/calendar/utils/date-utils';
import { SlotBlock } from '@/features/calendar/components/SlotBlock';
import { RequestJoinDialog } from '@/features/matching/components/RequestJoinDialog';
import { IdentityDialog } from '@/features/user/components/IdentityDialog';
import type { TimeSlot } from '@/types';

type ViewMode = 'month' | 'week' | 'day';

const USER_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  'user-1': { bg: 'bg-emerald-500/15', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  'user-2': { bg: 'bg-sky-500/15', text: 'text-sky-700', dot: 'bg-sky-500' },
  'user-3': { bg: 'bg-amber-500/15', text: 'text-amber-700', dot: 'bg-amber-500' },
  'user-4': { bg: 'bg-rose-500/15', text: 'text-rose-700', dot: 'bg-rose-500' },
  'user-5': { bg: 'bg-violet-500/15', text: 'text-violet-700', dot: 'bg-violet-500' },
};

function getSlotColor(userId: string, isOwn: boolean): { bg: string; text: string; dot: string } {
  if (isOwn) return { bg: 'bg-emerald-500/20', text: 'text-emerald-700', dot: 'bg-emerald-500' };
  return USER_COLORS[userId] || { bg: 'bg-zinc-500/10', text: 'text-zinc-600', dot: 'bg-zinc-400' };
}

export function CalendarGrid() {
  const currentUser = useUserStore((s) => s.currentUser);
  const timeSlots = useCalendarStore((s) => s.timeSlots);
  const addTimeSlot = useCalendarStore((s) => s.addTimeSlot);
  const selectedDate = useCalendarStore((s) => s.selectedDate);

  const [view, setView] = useState<ViewMode>('week');
  const [cursorDate, setCursorDate] = useState(() => parseISO(selectedDate));
  const [showIdentity, setShowIdentity] = useState(!currentUser);
  const [showRequestDialog, setShowRequestDialog] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [selectionStart, setSelectionStart] = useState<{ date: string; hour: number } | null>(null);
  const [selectionEnd, setSelectionEnd] = useState<{ date: string; hour: number } | null>(null);

  const gridRef = useRef<HTMLDivElement>(null);

  const hours = useMemo(() => getHourLabels(), []);
  const baseHour = 7;

  const goBack = useCallback(() => {
    if (view === 'month') setCursorDate((d) => subMonths(d, 1));
    else if (view === 'week') setCursorDate((d) => subDays(d, 7));
    else setCursorDate((d) => subDays(d, 1));
  }, [view]);

  const goForward = useCallback(() => {
    if (view === 'month') setCursorDate((d) => addMonths(d, 1));
    else if (view === 'week') setCursorDate((d) => addDays(d, 7));
    else setCursorDate((d) => addDays(d, 1));
  }, [view]);

  const goToday = useCallback(() => setCursorDate(new Date()), []);

  const getDateLabel = () => {
    if (view === 'month') return getCurrentMonthLabel(cursorDate);
    if (view === 'week') return getCurrentWeekLabel(cursorDate);
    return format(cursorDate, 'EEEE, MMMM d, yyyy');
  };

  const getCellFromEvent = (e: React.MouseEvent): { date: string; hour: number } | null => {
    const target = e.target as HTMLElement;
    const cell = target.closest('[data-date]') as HTMLElement | null;
    if (!cell) return null;
    const date = cell.getAttribute('data-date');
    const hour = parseInt(cell.getAttribute('data-hour') || '0', 10);
    if (!date) return null;
    return { date, hour };
  };

  const startCreateSlot = useCallback(
    (date: string, hour: number) => {
      if (!currentUser) {
        setShowIdentity(true);
        return;
      }
      const start = new Date(parseISO(date));
      start.setHours(baseHour + hour, 0, 0, 0);
      const end = new Date(start);
      end.setHours(start.getHours() + 1, 0, 0, 0);

      const newSlot: TimeSlot = {
        id: generateSlotId(),
        userId: currentUser.id,
        userName: currentUser.name,
        userAvatar: currentUser.avatar,
        startTime: start.toISOString(),
        endTime: end.toISOString(),
        status: 'available',
        createdAt: Date.now(),
      };
      addTimeSlot(newSlot);
    },
    [currentUser, addTimeSlot, baseHour],
  );

  const handleCellMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    const cell = getCellFromEvent(e);
    if (!cell) return;
    setIsDragging(true);
    setSelectionStart(cell);
    setSelectionEnd(cell);
  };

  const handleCellMouseOver = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const cell = getCellFromEvent(e);
    if (!cell) return;
    setSelectionEnd(cell);
  };

  const handleMouseUp = useCallback(() => {
    if (!isDragging || !selectionStart || !selectionEnd) {
      setIsDragging(false);
      return;
    }
    setIsDragging(false);
    if (!currentUser) {
      setShowIdentity(true);
      setSelectionStart(null);
      setSelectionEnd(null);
      return;
    }

    const startDate = parseISO(selectionStart.date);
    const endDate = parseISO(selectionEnd.date);
    const startHour = Math.min(selectionStart.hour, selectionEnd.hour);
    const endHour = Math.max(selectionStart.hour, selectionEnd.hour) + 1;

    if (endHour <= startHour) {
      setSelectionStart(null);
      setSelectionEnd(null);
      return;
    }

    const dayStart = startDate < endDate ? startDate : endDate;
    const dayEnd = startDate < endDate ? endDate : startDate;

    let current = dayStart;
    while (current <= dayEnd || isSameDay(current, dayEnd)) {
      const start = new Date(current);
      start.setHours(baseHour + startHour, 0, 0, 0);
      const end = new Date(current);
      end.setHours(baseHour + endHour, 0, 0, 0);

      addTimeSlot({
        id: generateSlotId(),
        userId: currentUser.id,
        userName: currentUser.name,
        userAvatar: currentUser.avatar,
        startTime: start.toISOString(),
        endTime: end.toISOString(),
        status: 'available',
        createdAt: Date.now(),
      });

      current = addDays(current, 1);
    }

    setSelectionStart(null);
    setSelectionEnd(null);
  }, [isDragging, selectionStart, selectionEnd, currentUser, addTimeSlot, baseHour]);

  useEffect(() => {
    document.addEventListener('mouseup', handleMouseUp);
    return () => document.removeEventListener('mouseup', handleMouseUp);
  }, [handleMouseUp]);

  const handleSlotClick = (slot: TimeSlot) => {
    if (!currentUser) {
      setShowIdentity(true);
      return;
    }
    if (slot.userId === currentUser.id) return;
    if (slot.status !== 'available') return;
    setSelectedSlot(slot);
    setShowRequestDialog(true);
  };

  const isInSelection = (date: string, hour: number) => {
    if (!isDragging || !selectionStart || !selectionEnd) return false;
    const startDate = parseISO(selectionStart.date);
    const endDate = parseISO(selectionEnd.date);
    const cellDate = parseISO(date);
    const minHour = Math.min(selectionStart.hour, selectionEnd.hour);
    const maxHour = Math.max(selectionStart.hour, selectionEnd.hour);
    const sameDayStart = isSameDay(cellDate, startDate);
    const sameDayEnd = isSameDay(cellDate, endDate);
    if (sameDayStart && sameDayEnd) return hour >= minHour && hour <= maxHour;
    if (sameDayStart) return hour >= minHour;
    if (sameDayEnd) return hour <= maxHour;
    if (cellDate > startDate && cellDate < endDate) return true;
    return false;
  };

  return (
    <div className="flex flex-col bg-zinc-50/50" style={{ height: 'calc(100vh - 53px)' }}>
      {showIdentity && <IdentityDialog />}
      {showRequestDialog && selectedSlot && (
        <RequestJoinDialog slot={selectedSlot} onClose={() => setShowRequestDialog(false)} />
      )}

      <div className="flex items-center justify-between border-b border-zinc-200/50 bg-white px-6 py-2.5">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <button
              onClick={goBack}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={goToday}
              className="rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-600 transition-colors hover:bg-zinc-50 hover:text-zinc-900"
            >
              Today
            </button>
            <button
              onClick={goForward}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <h2 className="text-base font-semibold tracking-tight text-zinc-800">
            {getDateLabel()}
          </h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            {currentUser && (
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full bg-emerald-500" />
                <span>Your slots</span>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-zinc-300" />
              <span>Available</span>
            </div>
          </div>
          <div className="flex items-center rounded-lg bg-zinc-100 p-0.5 text-xs">
            {(['month', 'week', 'day'] as ViewMode[]).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`rounded-md px-3 py-1 font-medium capitalize transition-all ${
                  view === v
                    ? 'bg-white text-zinc-900 shadow-sm'
                    : 'text-zinc-500 hover:text-zinc-700'
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto px-6 pb-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="pt-4"
          >
            {view === 'month' ? (
              <MonthView
                cursorDate={cursorDate}
                timeSlots={timeSlots}
                currentUser={currentUser}
                onSlotClick={handleSlotClick}
                onDayClick={(date) => {
                  setCursorDate(parseISO(date));
                  setView('day');
                }}
                onCellClick={startCreateSlot}
              />
            ) : view === 'week' ? (
              <WeekDayView
                days={getWeekDays(cursorDate)}
                hours={hours}
                timeSlots={timeSlots}
                currentUser={currentUser}
                baseHour={baseHour}
                isInSelection={isInSelection}
                onCellMouseDown={handleCellMouseDown}
                onCellMouseOver={handleCellMouseOver}
                onSlotClick={handleSlotClick}
                gridRef={gridRef}
              />
            ) : (
              <DayView
                date={cursorDate}
                hours={hours}
                timeSlots={timeSlots}
                currentUser={currentUser}
                baseHour={baseHour}
                isInSelection={isInSelection}
                onCellMouseDown={handleCellMouseDown}
                onCellMouseOver={handleCellMouseOver}
                onSlotClick={handleSlotClick}
                gridRef={gridRef}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ─── Month View ─── */
function MonthView({
  cursorDate,
  timeSlots,
  currentUser,
  onSlotClick,
  onDayClick,
  onCellClick,
}: {
  cursorDate: Date;
  timeSlots: TimeSlot[];
  currentUser: { id: string } | null;
  onSlotClick: (slot: TimeSlot) => void;
  onDayClick: (date: string) => void;
  onCellClick: (date: string, hour: number) => void;
}) {
  const monthStart = startOfMonth(cursorDate);
  const monthEnd = endOfMonth(cursorDate);
  const calStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const allDays = eachDayOfInterval({ start: calStart, end: calEnd });
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-200/60 bg-white shadow-sm">
      <div className="grid grid-cols-7 border-b border-zinc-100">
        {dayNames.map((name) => (
          <div key={name} className="py-3 text-center text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
            {name}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {allDays.map((day, i) => {
          const dateStr = day.toISOString();
          const daySlots = getSlotsForDate(timeSlots, day);
          const isTodayDay = isToday(day);
          const inCurrentMonth = isSameMonth(day, cursorDate);

          return (
            <div
              key={i}
              onClick={() => onDayClick(dateStr)}
              className={`group relative min-h-[110px] border-b border-r border-zinc-100 p-2 transition-colors last:border-r-0 hover:bg-zinc-50/50 ${
                !inCurrentMonth ? 'bg-zinc-50/50' : ''
              } ${i % 7 === 6 ? 'border-r-0' : ''}`}
            >
              <div className="mb-1.5 flex items-center justify-between">
                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-full text-sm font-medium transition-colors ${
                    isTodayDay
                      ? 'bg-emerald-500 font-semibold text-white'
                      : inCurrentMonth
                        ? 'text-zinc-700'
                        : 'text-zinc-300'
                  }`}
                >
                  {format(day, 'd')}
                </div>
                {inCurrentMonth && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onCellClick(dateStr, 9);
                    }}
                    className="flex h-5 w-5 items-center justify-center rounded-full text-zinc-300 opacity-0 transition-all hover:bg-zinc-100 hover:text-zinc-500 group-hover:opacity-100"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                )}
              </div>
              <div className="space-y-0.5">
                {daySlots.slice(0, 3).map((slot) => {
                  const isOwn = slot.userId === currentUser?.id;
                  const colors = getSlotColor(slot.userId, isOwn);
                  return (
                    <button
                      key={slot.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSlotClick(slot);
                      }}
                      className={`flex w-full items-center gap-1.5 rounded-md px-1.5 py-0.5 text-[11px] font-medium transition-all hover:opacity-80 ${
                        isOwn
                          ? 'bg-emerald-500 text-white'
                          : `${colors.bg} ${colors.text}`
                      }`}
                    >
                      <div className={`h-1.5 w-1.5 shrink-0 rounded-full ${colors.dot}`} />
                      <span className="truncate">{slot.userName}</span>
                    </button>
                  );
                })}
                {daySlots.length > 3 && (
                  <div className="px-1.5 text-[10px] font-medium text-zinc-400">
                    +{daySlots.length - 3} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Week / Day Grid ─── */
function WeekDayView({
  days,
  hours,
  timeSlots,
  currentUser,
  baseHour,
  isInSelection,
  onCellMouseDown,
  onCellMouseOver,
  onSlotClick,
  gridRef,
}: {
  days: { date: string; dayName: string; dayNumber: number; isToday: boolean }[];
  hours: string[];
  timeSlots: TimeSlot[];
  currentUser: { id: string } | null;
  baseHour: number;
  isInSelection: (date: string, hour: number) => boolean;
  onCellMouseDown: (e: React.MouseEvent) => void;
  onCellMouseOver: (e: React.MouseEvent) => void;
  onSlotClick: (slot: TimeSlot) => void;
  gridRef: React.RefObject<HTMLDivElement | null>;
}) {
  const slotsByDay = useMemo(() => {
    const map = new Map<string, TimeSlot[]>();
    for (const day of days) {
      map.set(day.date, getSlotsForDate(timeSlots, parseISO(day.date)));
    }
    return map;
  }, [days, timeSlots]);

  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-200/60 bg-white shadow-sm">
      <div
        ref={gridRef}
        className="grid select-none"
        style={{
          gridTemplateColumns: `64px repeat(${days.length}, 1fr)`,
          gridTemplateRows: `44px repeat(${hours.length}, minmax(52px, 1fr))`,
        }}
        onMouseDown={onCellMouseDown}
        onMouseOver={onCellMouseOver}
      >
        <div className="border-b border-zinc-100" />

        {days.map((day) => (
          <div
            key={day.date}
            className={`flex flex-col items-center justify-center border-b border-l border-zinc-100 ${
              day.isToday ? 'bg-emerald-50/50' : ''
            }`}
          >
            <span className="text-[11px] font-medium uppercase tracking-wider text-zinc-400">
              {day.dayName}
            </span>
            <span
              className={`mt-0.5 flex h-7 w-7 items-center justify-center rounded-full text-sm font-medium ${
                day.isToday
                  ? 'bg-emerald-500 font-semibold text-white'
                  : 'text-zinc-700'
              }`}
            >
              {day.dayNumber}
            </span>
          </div>
        ))}

        {hours.map((hourLabel, hourIndex) => {
          return (
            <div key={hourIndex} className="contents">
              <div className="relative border-b border-l border-zinc-100">
                <span className="absolute -top-2.5 right-3 text-[11px] font-medium text-zinc-400">
                  {hourLabel}
                </span>
              </div>

              {days.map((day) => {
                const cellSlots = slotsByDay.get(day.date)?.filter((slot) => {
                  const slotHour = parseISO(slot.startTime).getHours();
                  return slotHour === baseHour + hourIndex;
                }) || [];

                const selected = isInSelection(day.date, hourIndex);
                const colIndex = days.indexOf(day);
                const isLastCol = colIndex === days.length - 1;

                return (
                  <div
                    key={`${day.date}-${hourIndex}`}
                    data-date={day.date}
                    data-hour={hourIndex}
                    className={`relative min-h-[52px] border-b border-l border-zinc-100 transition-colors ${
                      isLastCol ? 'border-r-0' : ''
                    } ${
                      selected
                        ? 'bg-emerald-500/10 shadow-[inset_0_0_0_1px_rgba(16,185,129,0.25)]'
                        : 'hover:bg-zinc-50/50'
                    } ${day.isToday ? 'bg-emerald-50/[0.03]' : ''}`}
                  >
                    {cellSlots.map((slot) => (
                      <SlotBlock
                        key={slot.id}
                        slot={slot}
                        isOwn={slot.userId === currentUser?.id}
                        onClick={() => onSlotClick(slot)}
                        userColors={getSlotColor(slot.userId, slot.userId === currentUser?.id)}
                      />
                    ))}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Day View ─── */
function DayView({
  date,
  hours,
  timeSlots,
  currentUser,
  baseHour,
  isInSelection,
  onCellMouseDown,
  onCellMouseOver,
  onSlotClick,
  gridRef,
}: {
  date: Date;
  hours: string[];
  timeSlots: TimeSlot[];
  currentUser: { id: string } | null;
  baseHour: number;
  isInSelection: (date: string, hour: number) => boolean;
  onCellMouseDown: (e: React.MouseEvent) => void;
  onCellMouseOver: (e: React.MouseEvent) => void;
  onSlotClick: (slot: TimeSlot) => void;
  gridRef: React.RefObject<HTMLDivElement | null>;
}) {
  const dateStr = date.toISOString();
  const dayName = format(date, 'EEEE');
  const dayNumber = format(date, 'd');
  const isTodayDay = isToday(date);
  const daySlots = getSlotsForDate(timeSlots, date);

  return (
    <div className="mx-auto max-w-3xl overflow-hidden rounded-2xl border border-zinc-200/60 bg-white shadow-sm">
      <div
        className={`px-6 py-4 ${isTodayDay ? 'bg-emerald-50/50' : ''}`}
      >
        <span
          className={`text-lg font-semibold tracking-tight ${
            isTodayDay ? 'text-emerald-700' : 'text-zinc-800'
          }`}
        >
          {dayName}, <span className="font-normal">{dayNumber}</span>
        </span>
      </div>
      <div
        ref={gridRef}
        className="select-none"
        onMouseDown={onCellMouseDown}
        onMouseOver={onCellMouseOver}
      >
        {hours.map((hourLabel, hourIndex) => {
          const cellSlots = daySlots.filter((slot) => {
            const slotHour = parseISO(slot.startTime).getHours();
            return slotHour === baseHour + hourIndex;
          });
          const selected = isInSelection(dateStr, hourIndex);

          return (
            <div
              key={hourIndex}
              data-date={dateStr}
              data-hour={hourIndex}
              className={`flex min-h-[60px] border-b border-zinc-100 transition-colors last:border-b-0 ${
                selected
                  ? 'bg-emerald-500/10 shadow-[inset_0_0_0_1px_rgba(16,185,129,0.25)]'
                  : 'hover:bg-zinc-50/50'
              }`}
            >
              <div className="relative flex w-20 shrink-0 items-start justify-end border-r border-zinc-100 pr-3 pt-3">
                <span className="text-[11px] font-medium text-zinc-400">{hourLabel}</span>
              </div>
              <div className="relative flex-1 px-3 py-1">
                {cellSlots.map((slot) => (
                  <SlotBlock
                    key={slot.id}
                    slot={slot}
                    isOwn={slot.userId === currentUser?.id}
                    onClick={() => onSlotClick(slot)}
                    userColors={getSlotColor(slot.userId, slot.userId === currentUser?.id)}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
