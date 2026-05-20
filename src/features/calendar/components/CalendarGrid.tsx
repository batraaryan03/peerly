'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  parseISO,
  isSameDay,
  addDays,
  subDays,
  addMonths,
  subMonths,
  isToday,
  format,
} from 'date-fns';
import { useCalendarStore } from '@/features/calendar/store/calendar.store';
import { useUserStore } from '@/features/user/store/user.store';
import {
  getWeekDays,
  getCurrentWeekLabel,
  getCurrentMonthLabel,
  getMonthGrid,
  getHourLabels,
  generateSlotId,
  getSlotsForDate,
} from '@/features/calendar/utils/date-utils';
import { SlotBlock } from '@/features/calendar/components/SlotBlock';
import { RequestJoinDialog } from '@/features/matching/components/RequestJoinDialog';
import { IdentityDialog } from '@/features/user/components/IdentityDialog';
import type { TimeSlot } from '@/types';

type ViewMode = 'month' | 'week' | 'day';

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
  const [selectionStart, setSelectionStart] = useState<{
    date: string;
    hour: number;
  } | null>(null);
  const [selectionEnd, setSelectionEnd] = useState<{
    date: string;
    hour: number;
  } | null>(null);

  const gridRef = useRef<HTMLDivElement>(null);

  const hours = getHourLabels();
  const baseHour = 7;

  const goBack = () => {
    if (view === 'month') setCursorDate((d) => subMonths(d, 1));
    else if (view === 'week') setCursorDate((d) => subDays(d, 7));
    else setCursorDate((d) => subDays(d, 1));
  };

  const goForward = () => {
    if (view === 'month') setCursorDate((d) => addMonths(d, 1));
    else if (view === 'week') setCursorDate((d) => addDays(d, 7));
    else setCursorDate((d) => addDays(d, 1));
  };

  const goToday = () => setCursorDate(new Date());

  const getDateLabel = () => {
    if (view === 'month') return getCurrentMonthLabel(cursorDate);
    if (view === 'week') return getCurrentWeekLabel(cursorDate);
    return format(parseISO(cursorDate.toISOString()), 'EEEE, MMMM d, yyyy');
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
    if (!currentUser) {
      setShowIdentity(true);
      return;
    }
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

      if (currentUser) {
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
      }

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

    const hourInRange = hour >= Math.min(selectionStart.hour, selectionEnd.hour) &&
      hour <= Math.max(selectionStart.hour, selectionEnd.hour);

    const dateInRange =
      isSameDay(cellDate, startDate) || isSameDay(cellDate, endDate) ||
      (cellDate > startDate && cellDate < endDate);

    return (isSameDay(cellDate, startDate) || isSameDay(cellDate, endDate) || dateInRange) && hourInRange;
  };

  if (!currentUser && !showIdentity) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-muted-foreground">Set up your profile to use the calendar.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 52px)' }}>
      {showIdentity && <IdentityDialog />}
      {showRequestDialog && selectedSlot && (
        <RequestJoinDialog
          slot={selectedSlot}
          onClose={() => setShowRequestDialog(false)}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <button
              onClick={goBack}
              className="rounded p-1 text-muted-foreground transition-colors hover:text-foreground"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={goToday}
              className="rounded px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Today
            </button>
            <button
              onClick={goForward}
              className="rounded p-1 text-muted-foreground transition-colors hover:text-foreground"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <h2 className="text-base font-medium tracking-tight">
            {getDateLabel()}
          </h2>
        </div>
        <div className="flex items-center gap-3">
          {/* View switcher */}
          <div className="flex items-center rounded-md bg-muted p-0.5 text-xs">
            {(['month', 'week', 'day'] as ViewMode[]).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`rounded px-2.5 py-1 font-medium capitalize transition-colors ${
                  view === v
                    ? 'bg-white text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {v}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-sm bg-foreground/20" />
              <span>Available</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-sm bg-purple-500" />
              <span>Your slots</span>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar body */}
      <div className="flex-1 overflow-auto px-6 pb-6">
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
}: {
  cursorDate: Date;
  timeSlots: TimeSlot[];
  currentUser: { id: string } | null;
  onSlotClick: (slot: TimeSlot) => void;
  onDayClick: (date: string) => void;
}) {
  const days = getMonthGrid(cursorDate);
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="flex flex-col">
      <div className="grid grid-cols-7">
        {dayNames.map((name) => (
          <div
            key={name}
            className="py-2 text-center text-xs font-medium text-muted-foreground"
          >
            {name}
          </div>
        ))}
      </div>
      <div className="grid flex-1 grid-cols-7">
        {days.map(({ date, isCurrentMonth }, i) => {
          const dateStr = date.toISOString();
          const daySlots = getSlotsForDate(timeSlots, date);
          const isTodayDay = isToday(date);

          return (
            <div
              key={i}
              className={`min-h-[100px] border-t border-transparent p-1.5 transition-colors hover:bg-muted/30 ${
                !isCurrentMonth ? 'opacity-30' : ''
              }`}
              onClick={() => onDayClick(dateStr)}
            >
              <div
                className={`mb-1 flex h-6 w-6 items-center justify-center rounded-full text-xs ${
                  isTodayDay
                    ? 'bg-purple-600 font-semibold text-white'
                    : 'text-muted-foreground'
                }`}
              >
                {format(date, 'd')}
              </div>
              <div className="space-y-0.5">
                {daySlots.slice(0, 3).map((slot) => (
                  <button
                    key={slot.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSlotClick(slot);
                    }}
                    className={`flex w-full items-center gap-1 rounded-sm px-1 py-0.5 text-[10px] transition-opacity hover:opacity-80 ${
                      slot.userId === currentUser?.id
                        ? 'bg-purple-500/30 text-purple-700 dark:text-purple-300'
                        : 'bg-foreground/10 text-foreground'
                    }`}
                  >
                    <div className="flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-foreground/20 text-[7px] font-medium">
                      {slot.userAvatar}
                    </div>
                    <span className="truncate">{slot.userName}</span>
                  </button>
                ))}
                {daySlots.length > 3 && (
                  <div className="text-[10px] text-muted-foreground">
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

  return (
    <div
      ref={gridRef}
      className="grid select-none"
      style={{
        gridTemplateColumns: `60px repeat(${days.length}, 1fr)`,
        gridTemplateRows: `40px repeat(${hours.length}, minmax(48px, 1fr))`,
      }}
      onMouseDown={onCellMouseDown}
      onMouseOver={onCellMouseOver}
    >
      <div />

      {days.map((day) => (
        <div
          key={day.date}
          className={`flex flex-col items-center justify-center text-xs font-medium ${
            day.isToday ? 'text-purple-600' : 'text-muted-foreground'
          }`}
        >
          <span>{day.dayName}</span>
          <span
            className={`mt-0.5 flex h-6 w-6 items-center justify-center rounded-full text-sm ${
              day.isToday ? 'bg-purple-600 font-semibold text-white' : ''
            }`}
          >
            {day.dayNumber}
          </span>
        </div>
      ))}

      {hours.map((_, hourIndex) => (
        <div key={hourIndex} className="contents">
          <div className="flex items-start justify-end pr-3 pt-1 text-xs text-muted-foreground">
            {hours[hourIndex]}
          </div>

          {days.map((day) => {
            const cellSlots = getSlotsForDate(
              timeSlots,
              parseISO(day.date),
            ).filter((slot) => {
              const slotHour = parseISO(slot.startTime).getHours();
              return slotHour === baseHour + hourIndex;
            });

            const selected = isInSelection(day.date, hourIndex);

            return (
              <div
                key={`${day.date}-${hourIndex}`}
                data-date={day.date}
                data-hour={hourIndex}
                className={`relative min-h-[48px] border-t border-transparent transition-colors ${
                  selected ? 'bg-purple-500/10' : 'hover:bg-muted/30'
                }`}
              >
                {cellSlots.map((slot) => (
                  <SlotBlock
                    key={slot.id}
                    slot={slot}
                    isOwn={slot.userId === currentUser?.id}
                    onClick={() => onSlotClick(slot)}
                  />
                ))}
              </div>
            );
          })}
        </div>
      ))}
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

  return (
    <div
      ref={gridRef}
      className="mx-auto max-w-2xl select-none"
      onMouseDown={onCellMouseDown}
      onMouseOver={onCellMouseOver}
    >
      <div className="mb-2 text-center">
        <span
          className={`text-sm font-medium ${
            isTodayDay ? 'text-purple-600' : 'text-muted-foreground'
          }`}
        >
          {dayName}, {dayNumber}
        </span>
      </div>
      <div className="space-y-0">
        {hours.map((_, hourIndex) => {
          const cellSlots = getSlotsForDate(timeSlots, date).filter((slot) => {
            const slotHour = parseISO(slot.startTime).getHours();
            return slotHour === baseHour + hourIndex;
          });

          const selected = isInSelection(dateStr, hourIndex);

          return (
            <div
              key={hourIndex}
              data-date={dateStr}
              data-hour={hourIndex}
              className={`flex min-h-[56px] border-t border-transparent transition-colors ${
                selected ? 'bg-purple-500/10' : 'hover:bg-muted/30'
              }`}
            >
              <div className="w-16 shrink-0 pt-1 text-right text-xs text-muted-foreground">
                {hours[hourIndex]}
              </div>
              <div className="relative flex-1 px-2">
                {cellSlots.map((slot) => (
                  <SlotBlock
                    key={slot.id}
                    slot={slot}
                    isOwn={slot.userId === currentUser?.id}
                    onClick={() => onSlotClick(slot)}
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
