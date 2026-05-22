'use client';

import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Settings } from 'lucide-react';
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
  getSlotPosition,
} from '@/features/calendar/utils/date-utils';
import { SlotBlock } from '@/features/calendar/components/SlotBlock';
import { RecurringSettings } from '@/features/calendar/components/RecurringSettings';
import { useRecurringSlots } from '@/features/calendar/hooks/useRecurringSlots';
import { RequestJoinDialog } from '@/features/matching/components/RequestJoinDialog';
import { IdentityDialog } from '@/features/user/components/IdentityDialog';
import type { TimeSlot } from '@/types';

type ViewMode = 'month' | 'week' | 'day';

const ROW_HEIGHT = 52;
const BASE_HOUR = 7;
const HOUR_COUNT = 14;

function hasOverlap(existing: TimeSlot[], start: Date, end: Date): boolean {
  return existing.some((slot) => {
    const s = parseISO(slot.startTime);
    const e = parseISO(slot.endTime);
    return s < end && e > start;
  });
}

export function CalendarGrid() {
  const currentUser = useUserStore((s) => s.currentUser);
  const timeSlots = useCalendarStore((s) => s.timeSlots);
  const addTimeSlot = useCalendarStore((s) => s.addTimeSlot);
  const removeTimeSlot = useCalendarStore((s) => s.removeTimeSlot);
  const selectedDate = useCalendarStore((s) => s.selectedDate);

  const [view, setView] = useState<ViewMode>('week');
  const [cursorDate, setCursorDate] = useState(() => parseISO(selectedDate));
  const [showIdentity, setShowIdentity] = useState(!currentUser);
  const [showRequestDialog, setShowRequestDialog] = useState(false);
  const [showRecurring, setShowRecurring] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [selectionStart, setSelectionStart] = useState<{ date: string; hour: number } | null>(null);
  const [selectionEnd, setSelectionEnd] = useState<{ date: string; hour: number } | null>(null);

  const gridRef = useRef<HTMLDivElement>(null);

  const hours = useMemo(() => getHourLabels(), []);

  const displayedDays = useMemo(
    () => (view === 'week' ? getWeekDays(cursorDate) : [{ date: cursorDate.toISOString() }]),
    [view, cursorDate],
  );
  useRecurringSlots(displayedDays);

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
      setSelectionStart(null);
      setSelectionEnd(null);
      return;
    }

    const startDate = parseISO(selectionStart.date);
    const endDate = parseISO(selectionEnd.date);
    const startHour = Math.min(selectionStart.hour, selectionEnd.hour);
    const endHour = Math.max(selectionStart.hour, selectionEnd.hour);
    const durationHours = endHour - startHour + 1;

    setIsDragging(false);

    if (!currentUser) {
      setShowIdentity(true);
      setSelectionStart(null);
      setSelectionEnd(null);
      return;
    }

    if (durationHours < 1) {
      setSelectionStart(null);
      setSelectionEnd(null);
      return;
    }

    let current = startDate < endDate ? startDate : endDate;
    const dayEnd = startDate < endDate ? endDate : startDate;

    while (current <= dayEnd || isSameDay(current, dayEnd)) {
      const slotStart = new Date(current);
      slotStart.setHours(BASE_HOUR + startHour, 0, 0, 0);
      const slotEnd = new Date(current);
      slotEnd.setHours(BASE_HOUR + endHour + 1, 0, 0, 0);

      if (!hasOverlap(timeSlots, slotStart, slotEnd)) {
        addTimeSlot({
          id: generateSlotId(),
          userId: currentUser.id,
          userName: currentUser.name,
          userAvatar: currentUser.avatar,
          startTime: slotStart.toISOString(),
          endTime: slotEnd.toISOString(),
          status: 'available',
          createdAt: Date.now(),
        });
      }

      current = addDays(current, 1);
    }

    setSelectionStart(null);
    setSelectionEnd(null);
  }, [isDragging, selectionStart, selectionEnd, currentUser, addTimeSlot, timeSlots]);

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

  const handleSlotRightClick = (slot: TimeSlot) => {
    if (!currentUser) return;
    if (slot.userId !== currentUser.id) return;
    removeTimeSlot(slot.id);
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
    <div className="flex flex-col bg-zinc-950" style={{ height: 'calc(100vh - 53px)' }}>
      {showIdentity && <IdentityDialog />}
      {showRequestDialog && selectedSlot && (
        <RequestJoinDialog slot={selectedSlot} onClose={() => setShowRequestDialog(false)} />
      )}
      {showRecurring && (
        <RecurringSettings onClose={() => setShowRecurring(false)} />
      )}

      <div className="flex items-center justify-between border-b border-white/[0.04] px-6 py-2.5">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-0.5">
            <button
              onClick={goBack}
              className="flex h-7 w-7 items-center justify-center text-zinc-500 transition-colors hover:text-zinc-300"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={goToday}
              className="rounded-none bg-white/[0.04] px-2.5 py-1 text-[11px] font-medium text-zinc-500 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition-colors hover:text-zinc-300"
            >
              Today
            </button>
            <button
              onClick={goForward}
              className="flex h-7 w-7 items-center justify-center text-zinc-500 transition-colors hover:text-zinc-300"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
          <h2 className="text-sm font-medium tracking-tight text-zinc-100">
            {getDateLabel()}
          </h2>
        </div>
        <div className="flex items-center gap-3">
          {currentUser && (
            <button
              onClick={() => setShowRecurring(true)}
              className="flex items-center gap-1.5 rounded-none bg-white/[0.04] px-2.5 py-1.5 text-[11px] font-medium text-zinc-500 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition-colors hover:text-zinc-300"
            >
              <Settings className="h-3 w-3" />
              Availability
            </button>
          )}
          <div className="flex items-center gap-2 text-[11px] text-zinc-500">
            {currentUser && (
              <div className="flex items-center gap-1.5">
                <div className="h-1.5 w-1.5 bg-[#8B5CF6]" />
                <span>Your slots</span>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <div className="h-1.5 w-1.5 bg-zinc-600" />
              <span>Available</span>
            </div>
          </div>
          <div className="flex items-center rounded-none bg-white/[0.04] p-0.5 text-[11px] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
            {(['week', 'day'] as ViewMode[]).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`rounded-none px-2.5 py-1 font-medium capitalize transition-all ${
                  view === v
                    ? 'bg-[#8B5CF6]/20 text-[#8B5CF6]'
                    : 'text-zinc-500 hover:text-zinc-300'
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12 }}
            className="pt-4"
          >
            {view === 'week' ? (
              <WeekView
                days={getWeekDays(cursorDate)}
                hours={hours}
                timeSlots={timeSlots}
                currentUser={currentUser}
                isInSelection={isInSelection}
                onCellMouseDown={handleCellMouseDown}
                onCellMouseOver={handleCellMouseOver}
                onSlotClick={handleSlotClick}
                onSlotRightClick={handleSlotRightClick}
                gridRef={gridRef}
              />
            ) : (
              <DayView
                date={cursorDate}
                hours={hours}
                timeSlots={timeSlots}
                currentUser={currentUser}
                isInSelection={isInSelection}
                onCellMouseDown={handleCellMouseDown}
                onCellMouseOver={handleCellMouseOver}
                onSlotClick={handleSlotClick}
                onSlotRightClick={handleSlotRightClick}
                gridRef={gridRef}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function getColor(userId: string, isOwn: boolean) {
  if (isOwn) return { bg: 'bg-[#8B5CF6]/20', text: 'text-[#8B5CF6]', dot: 'bg-[#8B5CF6]' };
  return { bg: 'bg-white/[0.04]', text: 'text-zinc-400', dot: 'bg-zinc-500' };
}

function WeekView({
  days,
  hours,
  timeSlots,
  currentUser,
  isInSelection,
  onCellMouseDown,
  onCellMouseOver,
  onSlotClick,
  onSlotRightClick,
  gridRef,
}: {
  days: { date: string; dayName: string; dayNumber: number; isToday: boolean }[];
  hours: string[];
  timeSlots: TimeSlot[];
  currentUser: { id: string } | null;
  isInSelection: (date: string, hour: number) => boolean;
  onCellMouseDown: (e: React.MouseEvent) => void;
  onCellMouseOver: (e: React.MouseEvent) => void;
  onSlotClick: (slot: TimeSlot) => void;
  onSlotRightClick: (slot: TimeSlot) => void;
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
    <div className="overflow-hidden bg-zinc-950">
      <div
        ref={gridRef}
        className="grid select-none"
        style={{
          gridTemplateColumns: `56px repeat(${days.length}, 1fr)`,
          gridTemplateRows: `40px repeat(${HOUR_COUNT}, ${ROW_HEIGHT}px)`,
        }}
        onMouseDown={onCellMouseDown}
        onMouseOver={onCellMouseOver}
      >
        <div className="border-b border-white/[0.04]" />

        {days.map((day) => (
          <div
            key={day.date}
            className={`flex flex-col items-center justify-center border-b border-l border-white/[0.04] ${
              day.isToday ? 'bg-[#8B5CF6]/[0.02]' : ''
            }`}
          >
            <span className="text-[10px] font-medium uppercase tracking-widest text-zinc-500">
              {day.dayName}
            </span>
            <span
              className={`mt-px flex h-6 w-6 items-center justify-center text-xs font-medium ${
                day.isToday
                  ? 'bg-[#8B5CF6] font-semibold text-white'
                  : 'text-zinc-100'
              }`}
            >
              {day.dayNumber}
            </span>
          </div>
        ))}

        {hours.map((hourLabel, hourIndex) => (
          <div key={hourIndex} className="contents">
            <div className="relative border-b border-l border-white/[0.04]">
              <span className="absolute -top-2.5 right-2 text-[10px] font-medium text-zinc-500">
                {hourLabel}
              </span>
            </div>

            {days.map((day) => {
              const selected = isInSelection(day.date, hourIndex);
              return (
                <div
                  key={`${day.date}-${hourIndex}`}
                  data-date={day.date}
                  data-hour={hourIndex}
                  className={`relative border-b border-l border-white/[0.04] ${
                    selected
                      ? 'bg-[#8B5CF6]/10 shadow-[inset_0_0_0_1px_rgba(139,92,246,0.25)]'
                      : 'hover:bg-white/[0.02]'
                  } ${day.isToday ? 'bg-[#8B5CF6]/[0.015]' : ''}`}
                  style={{ height: ROW_HEIGHT }}
                />
              );
            })}
          </div>
        ))}

        {days.map((day) => {
          const daySlots = slotsByDay.get(day.date) || [];
          return (
            <div
              key={`overlay-${day.date}`}
              style={{
                gridColumn: days.indexOf(day) + 2,
                gridRow: '2 / -1',
                position: 'relative',
                pointerEvents: 'none',
              }}
            >
              {daySlots.map((slot) => {
                const pos = getSlotPosition(slot, BASE_HOUR, ROW_HEIGHT);
                const isOwn = slot.userId === currentUser?.id;
                const colors = getColor(slot.userId, isOwn);
                return (
                  <div
                    key={slot.id}
                    style={{
                      position: 'absolute',
                      top: pos.top,
                      left: 2,
                      right: 2,
                      height: pos.height - 4,
                      pointerEvents: 'auto',
                    }}
                  >
                    <SlotBlock
                      slot={slot}
                      isOwn={isOwn}
                      onClick={() => onSlotClick(slot)}
                      onContextMenu={() => onSlotRightClick(slot)}
                      userColors={colors}
                    />
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

function DayView({
  date,
  hours,
  timeSlots,
  currentUser,
  isInSelection,
  onCellMouseDown,
  onCellMouseOver,
  onSlotClick,
  onSlotRightClick,
  gridRef,
}: {
  date: Date;
  hours: string[];
  timeSlots: TimeSlot[];
  currentUser: { id: string } | null;
  isInSelection: (date: string, hour: number) => boolean;
  onCellMouseDown: (e: React.MouseEvent) => void;
  onCellMouseOver: (e: React.MouseEvent) => void;
  onSlotClick: (slot: TimeSlot) => void;
  onSlotRightClick: (slot: TimeSlot) => void;
  gridRef: React.RefObject<HTMLDivElement | null>;
}) {
  const dateStr = date.toISOString();
  const dayName = format(date, 'EEEE');
  const dayNumber = format(date, 'd');
  const isTodayDay = isToday(date);
  const daySlots = getSlotsForDate(timeSlots, date);

  return (
    <div className="mx-auto max-w-3xl overflow-hidden bg-zinc-950">
      <div className={`px-5 py-3 border-b border-white/[0.04] ${isTodayDay ? 'bg-[#8B5CF6]/[0.015]' : ''}`}>
        <span className={`text-base font-medium tracking-tight ${isTodayDay ? 'text-[#8B5CF6]' : 'text-zinc-100'}`}>
          {dayName}, <span className="font-normal">{dayNumber}</span>
        </span>
      </div>

      <div
        ref={gridRef}
        className="relative select-none"
        onMouseDown={onCellMouseDown}
        onMouseOver={onCellMouseOver}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '56px 1fr',
            gridTemplateRows: `repeat(${HOUR_COUNT}, ${ROW_HEIGHT}px)`,
          }}
        >
          {hours.map((hourLabel, hourIndex) => {
            const selected = isInSelection(dateStr, hourIndex);
            return (
              <div key={hourIndex} className="contents">
                <div className="relative border-b border-r border-white/[0.04]">
                  <span className="absolute -top-2.5 right-2.5 text-[10px] font-medium text-zinc-500">
                    {hourLabel}
                  </span>
                </div>
                <div
                  data-date={dateStr}
                  data-hour={hourIndex}
                  className={`relative border-b border-white/[0.04] ${
                    selected
                      ? 'bg-[#8B5CF6]/10 shadow-[inset_0_0_0_1px_rgba(139,92,246,0.25)]'
                      : 'hover:bg-white/[0.02]'
                  } ${isTodayDay ? 'bg-[#8B5CF6]/[0.015]' : ''}`}
                  style={{ height: ROW_HEIGHT }}
                />
              </div>
            );
          })}
        </div>

        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 56,
            right: 0,
            bottom: 0,
            pointerEvents: 'none',
          }}
        >
          {daySlots.map((slot) => {
            const pos = getSlotPosition(slot, BASE_HOUR, ROW_HEIGHT);
            const isOwn = slot.userId === currentUser?.id;
            const colors = getColor(slot.userId, isOwn);
            return (
              <div
                key={slot.id}
                style={{
                  position: 'absolute',
                  top: pos.top,
                  left: 4,
                  right: 4,
                  height: pos.height - 4,
                  pointerEvents: 'auto',
                }}
              >
                <SlotBlock
                  slot={slot}
                  isOwn={isOwn}
                  onClick={() => onSlotClick(slot)}
                  onContextMenu={() => onSlotRightClick(slot)}
                  userColors={colors}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
