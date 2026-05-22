'use client';

import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Settings } from 'lucide-react';
import {
  parseISO,
  isSameDay,
  addDays,
  subDays,
  isToday,
  format,
} from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { useCalendarStore } from '@/features/calendar/store/calendar.store';
import { useUserStore } from '@/features/user/store/user.store';
import {
  getWeekDays,
  getCurrentWeekLabel,
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

type ViewMode = 'week' | 'day';

const ROW_HEIGHT = 56;
const BASE_HOUR = 7;
const HOUR_COUNT = 14;

function hasOverlap(existing: TimeSlot[], start: Date, end: Date): boolean {
  return existing.some((slot) => {
    const s = parseISO(slot.startTime);
    const e = parseISO(slot.endTime);
    // Overlap if intervals intersect or touch
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

  const displayedWeekDays = useMemo(() => getWeekDays(cursorDate), [cursorDate]);
  const displayedDay = useMemo(() => [{ date: cursorDate.toISOString() }], [cursorDate]);

  useRecurringSlots(view === 'week' ? displayedWeekDays : displayedDay);

  const goBack = useCallback(() => {
    if (view === 'week') setCursorDate((d) => subDays(d, 7));
    else setCursorDate((d) => subDays(d, 1));
  }, [view]);

  const goForward = useCallback(() => {
    if (view === 'week') setCursorDate((d) => addDays(d, 7));
    else setCursorDate((d) => addDays(d, 1));
  }, [view]);

  const goToday = useCallback(() => setCursorDate(new Date()), []);

  const getDateLabel = () => {
    if (view === 'week') return getCurrentWeekLabel(cursorDate);
    return format(cursorDate, 'EEEE, MMMM d, yyyy');
  };

  const getCellFromEvent = (e: React.MouseEvent): { date: string; hour: number } | null => {
    const target = e.target as HTMLElement;
    // Walk up until we find a .cal-cell or reach the grid
    let el: HTMLElement | null = target;
    while (el && el !== gridRef.current && !el.classList.contains('cal-cell')) {
      el = el.parentElement;
    }
    if (!el) return null;
    const date = el.getAttribute('data-date');
    const hour = parseInt(el.getAttribute('data-hour') || '0', 10);
    if (!date) return null;
    return { date, hour };
  };

  const handleCellMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    e.stopPropagation();
    const cell = getCellFromEvent(e);
    if (!cell) return;
    setIsDragging(true);
    setSelectionStart(cell);
    setSelectionEnd(cell);
  };

  const handleCellMouseOver = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.stopPropagation();
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

  // ── Color helpers ──
  const getCellBg = (selected: boolean, today: boolean) => {
    if (selected && today) return 'bg-[#CB6CE6]/15';
    if (selected) return 'bg-[#CB6CE6]/10';
    if (today) return 'bg-[#CB6CE6]/6';
    return 'hover:bg-[#CB6CE6]/4';
  };

  const getSlotColors = (userId: string, isOwn: boolean) => {
    if (isOwn) return { bg: 'bg-[rgba(203,108,230,0.18)]', text: 'text-[#D992F7]', dot: 'bg-[#CB6CE6]' };
    return { bg: 'bg-[rgba(203,108,230,0.07)]', text: 'text-[rgba(203,108,230,0.85)]', dot: 'bg-[#9C4FC2]' };
  };

  return (
    <div className="flex flex-col bg-zinc-50" style={{ height: 'calc(100vh - 53px)' }}>
      {showIdentity && <IdentityDialog />}
      {showRequestDialog && selectedSlot && (
        <RequestJoinDialog slot={selectedSlot} onClose={() => setShowRequestDialog(false)} />
      )}
      {showRecurring && (
        <RecurringSettings onClose={() => setShowRecurring(false)} />
      )}

      {/* ── Header ── */}
      <div className="flex items-center justify-between border-b border-[rgba(203,108,230,0.15)] bg-white/80 px-5 py-2.5 backdrop-blur-2xl shadow-[inset_0_1px_0_rgba(203,108,230,0.1)]">
        <div className="flex items-center gap-2.5">
          <button
            onClick={goBack}
            aria-label="Previous week"
            className="flex h-8 w-8 items-center justify-center rounded text-zinc-400 transition-all hover:bg-[rgba(203,108,230,0.1)] hover:text-[#CB6CE6]"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={goToday}
            className="rounded border border-[rgba(203,108,230,0.2)] bg-white px-3 py-1.5 text-[11px] font-semibold text-[#9C4FC2] shadow-[inset_0_0_0_rgba(255,255,255,0.1)] transition-all hover:border-[#CB6CE6]/40 hover:bg-[rgba(203,108,230,0.06)]"
          >
            Today
          </button>
          <button
            onClick={goForward}
            aria-label="Next week"
            className="flex h-8 w-8 items-center justify-center rounded text-zinc-400 transition-all hover:bg-[rgba(203,108,230,0.1)] hover:text-[#CB6CE6]"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <h2 className="ml-2 text-sm font-semibold tracking-tight text-zinc-800">
            {getDateLabel()}
          </h2>
        </div>
        <div className="flex items-center gap-2.5">
          {currentUser && (
            <button
              onClick={() => setShowRecurring(true)}
              className="flex items-center gap-1.5 rounded border border-[rgba(203,108,230,0.15)] bg-white px-2.5 py-1.5 text-[11px] font-medium text-[#9C4FC2] shadow-[inset_0_0_0_rgba(255,255,255,0.1)] transition-all hover:bg-[rgba(203,108,230,0.08)] hover:text-[#CB6CE6]"
            >
              <Settings className="h-3 w-3" />
              Availability
            </button>
          )}
          {currentUser && (
            <div className="flex items-center gap-3 text-[11px] text-zinc-400">
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full bg-[#CB6CE6]" />
                <span>Your slots</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full bg-[#9C4FC2]" />
                <span>Available</span>
              </div>
            </div>
          )}
          <div className="flex items-center rounded border border-[rgba(203,108,230,0.12)] bg-white p-0.5 text-[11px] shadow-[inset_0_0_0_rgba(255,255,255,0.08)]">
            {(['week', 'day'] as ViewMode[]).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`rounded px-3 py-1.5 font-medium capitalize transition-all ${
                  view === v
                    ? 'bg-[#CB6CE6] text-white shadow-[0_1px_4px_rgba(203,108,230,0.3)]'
                    : 'text-zinc-400 hover:text-zinc-600'
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Calendar Grid Area ── */}
      <div className="flex-1 overflow-auto px-4 pb-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="pt-3"
          >
            {view === 'week' ? (
              <WeekView
                days={displayedWeekDays}
                hours={hours}
                timeSlots={timeSlots}
                currentUser={currentUser}
                isInSelection={isInSelection}
                onCellMouseDown={handleCellMouseDown}
                onCellMouseOver={handleCellMouseOver}
                onSlotClick={handleSlotClick}
                onSlotRightClick={handleSlotRightClick}
                gridRef={gridRef}
                getSlotColors={getSlotColors}
                getCellBg={getCellBg}
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
                getSlotColors={getSlotColors}
                getCellBg={getCellBg}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

// ══════════════════════════════════════
//  WEEK VIEW
// ══════════════════════════════════════

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
  getSlotColors,
  getCellBg,
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
  getSlotColors: (userId: string, isOwn: boolean) => { bg: string; text: string; dot: string };
  getCellBg: (selected: boolean, today: boolean) => string;
}) {
  const slotsByDay = useMemo(() => {
    const map = new Map<string, TimeSlot[]>();
    for (const day of days) {
      map.set(day.date, getSlotsForDate(timeSlots, parseISO(day.date)));
    }
    return map;
  }, [days, timeSlots]);

  const dayCols = days.length;

  return (
    <div className="overflow-hidden rounded-lg border border-[rgba(203,108,230,0.1)] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.05),inset_0_0_0_1px_rgba(203,108,230,0.06)]">
      <div
        ref={gridRef}
        className="cal-grid grid select-none"
        style={{
          gridTemplateColumns: `56px repeat(${dayCols}, 1fr)`,
          gridTemplateRows: `38px repeat(${HOUR_COUNT}, ${ROW_HEIGHT}px)`,
        }}
      >
        {/* ── Column headers ── */}
        <div className="border-b border-[rgba(203,108,230,0.08)]" />

        {days.map((day) => (
          <div
            key={day.date}
            className={`cal-cell flex flex-col items-center justify-center border-b border-[rgba(203,108,230,0.08)] ${
              day.isToday ? 'bg-[#CB6CE6]/5' : ''
            }`}
            data-date={day.date}
            data-hour={-1}
          >
            <span className="text-[9px] font-medium uppercase tracking-wider text-zinc-400">
              {day.dayName}
            </span>
            <span
              className={`mt-0.5 flex h-6 w-6 items-center justify-center text-[11px] font-semibold ${
                day.isToday
                  ? 'rounded-full bg-[#CB6CE6] text-white shadow-[0_1px_6px_rgba(203,108,230,0.35)]'
                  : 'text-zinc-700'
              }`}
            >
              {day.dayNumber}
            </span>
          </div>
        ))}

        {/* ── Hour rows ── */}
        {hours.map((hourLabel, hourIndex) => (
          <div key={hourIndex} className="contents">
            {/* Left label column */}
            <div className="cal-cell relative flex items-center justify-end pr-2.5 border-b border-r border-[rgba(203,108,230,0.07)]">
              <span
                className="text-[9.5px] font-medium leading-none text-zinc-400"
                style={{ letterSpacing: '0.01em' }}
              >
                {hourLabel}
              </span>
            </div>

            {/* Day cell columns */}
            {days.map((day) => {
              const selected = isInSelection(day.date, hourIndex);
              return (
                <div
                  key={`${day.date}-${hourIndex}`}
                  data-date={day.date}
                  data-hour={hourIndex}
                  className={`cal-cell relative border-b border-[rgba(203,108,230,0.07)] transition-all duration-100 ${
                    getCellBg(selected, day.isToday)
                  }`}
                  style={{ height: ROW_HEIGHT }}
                />
              );
            })}
          </div>
        ))}

        {/* ── Slot overlays (pointer-events:none wrapper, individual slots get pointer-events:auto) ── */}
        {days.map((day) => {
          const daySlots = slotsByDay.get(day.date) || [];
          return (
            <div
              key={`overlay-${day.date}`}
              className="pointer-events-none"
              style={{
                gridColumn: days.indexOf(day) + 2,
                gridRow: '2 / -1',
                position: 'relative',
                zIndex: 10,
              }}
            >
              {daySlots.map((slot) => {
                const pos = getSlotPosition(slot, BASE_HOUR, ROW_HEIGHT);
                const isOwn = slot.userId === currentUser?.id;
                const colors = getSlotColors(slot.userId, isOwn);
                const slotH = Math.max(pos.height - 6, 18);
                return (
                  <div
                    key={slot.id}
                    className="pointer-events-auto"
                    style={{
                      position: 'absolute',
                      top: pos.top + 3,
                      left: 3,
                      right: 3,
                      height: slotH,
                      zIndex: 20,
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

// ══════════════════════════════════════
//  DAY VIEW
// ══════════════════════════════════════

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
  getSlotColors,
  getCellBg,
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
  getSlotColors: (userId: string, isOwn: boolean) => { bg: string; text: string; dot: string };
  getCellBg: (selected: boolean, today: boolean) => string;
}) {
  const dateStr = date.toISOString();
  const dayName = format(date, 'EEEE');
  const dayNumber = format(date, 'd');
  const daySlots = getSlotsForDate(timeSlots, date);
  const isTodayDay = isToday(date);

  return (
    <div className="mx-auto max-w-3xl overflow-hidden rounded-lg border border-[rgba(203,108,230,0.1)] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.05),inset_0_0_0_1px_rgba(203,108,230,0.06)]">
      <div className={`px-5 py-3 border-b border-[rgba(203,108,230,0.1)] ${isTodayDay ? 'bg-[#CB6CE6]/5' : 'bg-zinc-50'}`}>
        <span className={`text-base font-medium tracking-tight ${isTodayDay ? 'text-[#CB6CE6]' : 'text-zinc-800'}`}>
          {dayName},{' '}
          <span className="font-normal text-zinc-600">{dayNumber}</span>
        </span>
      </div>

      <div
        ref={gridRef}
        className="cal-grid relative select-none"
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
              <div className="cal-cell relative flex items-center justify-end pr-3 border-b border-r border-[rgba(203,108,230,0.07)]">
                <span className="text-[9.5px] font-medium leading-none text-zinc-400">
                  {hourLabel}
                </span>
              </div>
              <div
                data-date={dateStr}
                data-hour={hourIndex}
                className={`cal-cell relative border-b border-[rgba(203,108,230,0.07)] transition-all duration-100 ${
                  getCellBg(selected, isTodayDay)
                }`}
                style={{ height: ROW_HEIGHT }}
              />
            </div>
          );
        })}

        {/* ── Slot overlay ── */}
        <div
          className="pointer-events-none"
          style={{
            position: 'absolute',
            top: 0,
            left: 56,
            right: 0,
            bottom: 0,
            zIndex: 10,
          }}
        >
          {daySlots.map((slot) => {
            const pos = getSlotPosition(slot, BASE_HOUR, ROW_HEIGHT);
            const isOwn = slot.userId === currentUser?.id;
            const colors = getSlotColors(slot.userId, isOwn);
            const slotH = Math.max(pos.height - 6, 18);
            return (
              <div
                key={slot.id}
                className="pointer-events-auto"
                style={{
                  position: 'absolute',
                  top: pos.top + 3,
                  left: 4,
                  right: 4,
                  height: slotH,
                  zIndex: 20,
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
