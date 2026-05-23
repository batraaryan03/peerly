'use client';

import { useMemo, useState, useCallback, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import type { CalendarProps, View, EventProps } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import type { withDragAndDropProps } from 'react-big-calendar/lib/addons/dragAndDrop';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import './calendar.css';
import { format } from 'date-fns/format';
import { getDay } from 'date-fns/getDay';
import { startOfWeek } from 'date-fns/startOfWeek';
import { enUS } from 'date-fns/locale/en-US';
import { useCalendarStore } from '@/features/calendar/store/calendar.store';
import { useUserStore } from '@/features/user/store/user.store';
import type { TimeSlot, CalendarEvent, TooltipItem } from '@/types';
import { EventPopup } from '@/features/calendar/components/EventPopup';
import { CustomToolbar } from '@/features/calendar/components/rbc-custom/CustomToolbar';
import { CustomHeader } from '@/features/calendar/components/rbc-custom/CustomHeader';
import { CustomDateHeader } from '@/features/calendar/components/rbc-custom/CustomDateHeader';
import { AnimatedTooltip } from '@/components/ui/animated-tooltip';
import {
  Clock, Users, Plus, ChevronDown,
} from 'lucide-react';

const locales = { 'en-US': enUS };

const localizer = dateFnsLocalizer({
  format,
  startOfWeek,
  getDay,
  locales,
});

type TEvent = CalendarEvent;
const DragAndDropCalendar = withDragAndDrop(
  Calendar as React.ComponentType<CalendarProps<TEvent>>,
) as React.ComponentType<CalendarProps<TEvent> & withDragAndDropProps<TEvent>>;

function calcPeerCount(slot: TimeSlot, all: TimeSlot[]): number {
  const sStart = new Date(slot.startTime).getTime();
  const sEnd = new Date(slot.endTime).getTime();
  let count = 0;
  for (const other of all) {
    if (other.id === slot.id) continue;
    const oStart = new Date(other.startTime).getTime();
    const oEnd = new Date(other.endTime).getTime();
    if (sStart < oEnd && sEnd > oStart) count++;
  }
  return count;
}

function getPeerTooltipItems(slot: TimeSlot, all: TimeSlot[]): TooltipItem[] {
  const sStart = new Date(slot.startTime).getTime();
  const sEnd = new Date(slot.endTime).getTime();
  const items: TooltipItem[] = [];
  for (const other of all) {
    if (other.id === slot.id) continue;
    const oStart = new Date(other.startTime).getTime();
    const oEnd = new Date(other.endTime).getTime();
    if (sStart < oEnd && sEnd > oStart) {
      items.push({
        id: items.length + 1,
        name: other.userName,
        designation: 'Available',
        image: other.userImage,
      });
    }
  }
  return items;
}

function toCalendarEvent(slot: TimeSlot, userId: string, allSlots: TimeSlot[]): CalendarEvent {
  const avatarUrl = slot.userImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(slot.userName)}&background=CB6CE6&color=fff&size=100`;
  return {
    id: slot.id,
    title: slot.userName,
    start: new Date(slot.startTime),
    end: new Date(slot.endTime),
    userId: slot.userId,
    userName: slot.userName,
    userAvatar: slot.userAvatar,
    userImage: avatarUrl,
    peerCount: calcPeerCount(slot, allSlots),
    status: slot.status,
    isOwn: slot.userId === userId,
    peers: getPeerTooltipItems(slot, allSlots),
  };
}

function snapToHour(d: Date): Date {
  const snapped = new Date(d);
  snapped.setMinutes(0);
  snapped.setSeconds(0);
  snapped.setMilliseconds(0);
  return snapped;
}

function generateSlotId(): string {
  return `slot-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function getAvatarUrl(name: string, image?: string): string {
  return image || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=CB6CE6&color=fff&size=100`;
}

function WeekEvent({ event }: EventProps<CalendarEvent>) {
  const allItems: TooltipItem[] = useMemo(() => {
    const items: TooltipItem[] = [
      {
        id: 0,
        name: event.userName,
        designation: event.isOwn ? 'You' : 'Available',
        image: getAvatarUrl(event.userName, event.userImage),
      },
      ...event.peers,
    ];
    return items;
  }, [event.userName, event.userImage, event.peers, event.isOwn]);

  return (
    <div className="flex h-full flex-col justify-center gap-0.5 overflow-hidden px-[5px] py-[1px]">
      <div className="flex items-center gap-0.5">
        <AnimatedTooltip items={allItems} size="sm" />
        <div className="flex flex-col gap-0 min-w-0 ml-1">
          <span className="truncate text-[11px] font-semibold leading-tight tracking-tight text-zinc-700">
            {event.title}
          </span>
          {event.peerCount > 0 && (
            <div className="flex items-center gap-1">
              <Users size={8} className="text-[#CB6CE6]/55 shrink-0" />
              <span className="text-[8px] font-semibold text-[#CB6CE6]/65 uppercase tracking-wider">
                {event.peerCount} peer{event.peerCount !== 1 ? 's' : ''}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MonthEvent({ event }: EventProps<CalendarEvent>) {
  return (
    <div
      className="flex items-center gap-1 px-1.5 py-0.5 cursor-pointer transition-colors hover:opacity-80"
      style={{
        background: event.isOwn
          ? 'rgba(203, 108, 230, 0.12)'
          : 'rgba(203, 108, 230, 0.06)',
        borderLeft: `2px solid ${event.isOwn ? '#CB6CE6' : 'rgba(203, 108, 230, 0.3)'}`,
      }}
    >
      <div
        className="h-1.5 w-1.5 shrink-0 rounded-full"
        style={{
          background: event.isOwn ? '#CB6CE6' : 'rgba(203, 108, 230, 0.45)',
        }}
      />
      <span className="truncate text-[10px] font-semibold leading-tight text-zinc-700">
        {event.title}
      </span>
      {event.peerCount > 0 && (
        <span className="shrink-0 text-[8px] font-semibold text-[#CB6CE6]">
          {event.peerCount}
        </span>
      )}
    </div>
  );
}

function hasOverlap(timeSlots: TimeSlot[], userId: string, start: Date, end: Date): boolean {
  return timeSlots.some((s) => {
    if (s.userId !== userId) return false;
    if (s.status === 'cancelled') return false;
    const sStart = new Date(s.startTime).getTime();
    const sEnd = new Date(s.endTime).getTime();
    const newStart = start.getTime();
    const newEnd = end.getTime();
    return newStart < sEnd && newEnd > sStart;
  });
}

function createHourSlots(
  start: Date,
  end: Date,
  userId: string,
  currentUser: { name?: string; avatar?: string; id: string } | null,
  addTimeSlot: (slot: TimeSlot) => void,
  timeSlots: TimeSlot[],
) {
  const snappedStart = snapToHour(start);
  const snappedEnd = snapToHour(end);
  if (snappedEnd <= snappedStart) return;

  const hourStart = snappedStart.getHours();
  const hourEnd = snappedEnd.getHours();
  const totalHours = hourEnd - hourStart;

  for (let i = 0; i < totalHours; i++) {
    const slotStart = new Date(snappedStart);
    slotStart.setHours(hourStart + i, 0, 0, 0);
    const slotEnd = new Date(slotStart);
    slotEnd.setHours(slotStart.getHours() + 1, 0, 0, 0);

    if (hasOverlap(timeSlots, userId, slotStart, slotEnd)) continue;

    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.name || 'You')}&background=CB6CE6&color=fff&size=100`;

    const newSlot: TimeSlot = {
      id: generateSlotId(),
      userId,
      userName: currentUser?.name || 'You',
      userAvatar: currentUser?.avatar || '?',
      userImage: avatarUrl,
      startTime: slotStart.toISOString(),
      endTime: slotEnd.toISOString(),
      status: 'available',
      createdAt: Date.now(),
    };
    addTimeSlot(newSlot);
  }
}

export default function CalendarPage() {
  const { timeSlots, addTimeSlot, removeTimeSlot, updateSlotStatus } = useCalendarStore();
  const { currentUser } = useUserStore();

  const [date, setDate] = useState(new Date());
  const [view, setView] = useState<View>('week');
  const [popup, setPopup] = useState<{ event: CalendarEvent; x: number; y: number } | null>(null);
  const [timePrompt, setTimePrompt] = useState<{
    start: Date;
    end: Date;
  } | null>(null);

  const userId = currentUser?.id || 'user-1';

  const events = useMemo<CalendarEvent[]>(() => {
    if (timeSlots.length === 0) return [];
    return timeSlots
      .filter((s) => s.status !== 'cancelled')
      .map((s) => toCalendarEvent(s, userId, timeSlots));
  }, [timeSlots, userId]);

  const handleSelectSlot = useCallback(
    ({ start, end }: { start: Date; end: Date }) => {
      if (view === 'month') {
        setTimePrompt({ start, end });
        return;
      }
      createHourSlots(start, end, userId, currentUser, addTimeSlot, timeSlots);
    },
    [addTimeSlot, userId, currentUser, view, timeSlots],
  );

  const handleEventDrop = useCallback(
    ({ event, start, end }: { event: CalendarEvent; start: string | Date; end: string | Date }) => {
      if (!event.isOwn) return;

      const startDate = start instanceof Date ? start : new Date(start);
      const endDate = end instanceof Date ? end : new Date(end);
      const snappedStart = snapToHour(startDate);
      const snappedEnd = snapToHour(endDate);
      if (snappedEnd <= snappedStart) return;

      if (hasOverlap(timeSlots.filter((s) => s.id !== event.id), userId, snappedStart, snappedEnd)) return;

      removeTimeSlot(event.id);
      const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(event.userName)}&background=CB6CE6&color=fff&size=100`;
      const updated: TimeSlot = {
        id: generateSlotId(),
        userId: event.userId,
        userName: event.userName,
        userAvatar: event.userAvatar,
        userImage: event.userImage || avatarUrl,
        startTime: snappedStart.toISOString(),
        endTime: snappedEnd.toISOString(),
        status: 'available',
        createdAt: Date.now(),
      };
      addTimeSlot(updated);
    },
    [addTimeSlot, removeTimeSlot, userId, timeSlots],
  );

  const handleSelectEvent = useCallback(
    (event: CalendarEvent, e: React.SyntheticEvent) => {
      const native = e.nativeEvent as MouseEvent;
      setPopup({
        event,
        x: native.clientX,
        y: native.clientY,
      });
    },
    [],
  );

  const handleJoin = useCallback(
    (_event: CalendarEvent) => {
      setPopup(null);
    },
    [],
  );

  const handleDelete = useCallback(
    (event: CalendarEvent) => {
      if (event.isOwn) {
        removeTimeSlot(event.id);
      } else {
        updateSlotStatus(event.id, 'cancelled');
      }
      setPopup(null);
    },
    [removeTimeSlot, updateSlotStatus],
  );

  const handleJoinMeet = useCallback(
    (_event: CalendarEvent) => {
      setPopup(null);
    },
    [],
  );

  const eventPropGetter = useCallback(
    (event: CalendarEvent, _start: Date, _end: Date, _isSelected: boolean) => {
      return {
        style: {
          background: event.isOwn
            ? 'rgba(203, 108, 230, 0.1)'
            : 'rgba(203, 108, 230, 0.05)',
          borderLeft: `3px solid ${event.isOwn ? '#CB6CE6' : 'rgba(203, 108, 230, 0.25)'}`,
        },
      };
    },
    [],
  );

  const formats = useMemo(
    () => ({
      timeGutterFormat: 'h:mm a' as string,
      eventTimeRangeFormat: () => '',
      agendaTimeRangeFormat: () => '',
    }),
    [],
  );

  const handleConfirmTime = useCallback(
    (hour: number) => {
      if (!timePrompt) return;
      const start = new Date(timePrompt.start);
      start.setHours(hour, 0, 0, 0);
      const end = new Date(start);
      end.setHours(end.getHours() + 1);

      if (hasOverlap(timeSlots, userId, start, end)) {
        setTimePrompt(null);
        return;
      }

      const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.name || 'You')}&background=CB6CE6&color=fff&size=100`;
      const newSlot: TimeSlot = {
        id: generateSlotId(),
        userId,
        userName: currentUser?.name || 'You',
        userAvatar: currentUser?.avatar || '?',
        userImage: avatarUrl,
        startTime: start.toISOString(),
        endTime: end.toISOString(),
        status: 'available',
        createdAt: Date.now(),
      };
      addTimeSlot(newSlot);
      setTimePrompt(null);
    },
    [timePrompt, addTimeSlot, userId, currentUser, timeSlots],
  );

  return (
    <div className="calendar-wrapper h-full flex flex-col bg-white min-h-0">
      <div className="flex-1 min-h-0">
        <DragAndDropCalendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          defaultDate={new Date()}
          date={date}
          onNavigate={(d: Date) => setDate(d)}
          view={view}
          onView={(v: View) => setView(v)}
          views={['month', 'week', 'day']}
          step={60}
          timeslots={1}
          selectable={'ignoreEvents' as const}
          onSelectSlot={handleSelectSlot}
          onEventDrop={handleEventDrop}
          onSelectEvent={handleSelectEvent}
          eventPropGetter={eventPropGetter}
          components={{
            event: WeekEvent,
            toolbar: CustomToolbar,
            header: CustomHeader,
            month: {
              dateHeader: CustomDateHeader,
              event: MonthEvent,
            },
          }}
          formats={formats}
          style={{ height: '100%' }}
          draggableAccessor={(event: CalendarEvent) => event.isOwn}
          resizableAccessor={(event: CalendarEvent) => event.isOwn}
          scrollToTime={new Date(1970, 1, 1, 8, 0, 0)}
          popup
        />
      </div>

      {popup && (
        <EventPopup
          event={popup.event}
          position={{ x: popup.x, y: popup.y }}
          onClose={() => setPopup(null)}
          onJoin={handleJoin}
          onDelete={handleDelete}
          onJoinMeet={handleJoinMeet}
        />
      )}

      {timePrompt && (
        <TimePromptDialog
          date={timePrompt.start}
          onConfirm={handleConfirmTime}
          onCancel={() => setTimePrompt(null)}
        />
      )}
    </div>
  );
}

function TimePromptDialog({
  date,
  onConfirm,
  onCancel,
}: {
  date: Date;
  onConfirm: (hour: number) => void;
  onCancel: () => void;
}) {
  const [hour, setHour] = useState(9);

  const hours = Array.from({ length: 24 }, (_, i) => i);

  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') onCancel();
    }
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onCancel]);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/60 backdrop-blur-sm">
      <div className="w-[320px] bg-white/95 backdrop-blur-2xl border border-[#CB6CE6]/20 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_16px_48px_rgba(203,108,230,0.12),0_0_0_1px_rgba(203,108,230,0.04)]">
        <div className="mb-5 flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center bg-[#CB6CE6]/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
            <Clock size={15} className="text-[#CB6CE6]" />
          </div>
          <div>
            <h3 className="text-[14px] font-bold text-zinc-800 tracking-tight">
              Pick a time
            </h3>
            <p className="text-[11px] text-zinc-500">
              {format(date, 'EEEE, MMMM d')}
            </p>
          </div>
        </div>

        <div className="mb-5 flex items-center gap-2">
          <div className="relative flex-1">
            <select
              value={hour}
              onChange={(e) => setHour(Number(e.target.value))}
              className="w-full appearance-none border border-zinc-200 bg-white/80 px-3 py-2.5 text-[13px] font-medium text-zinc-700 outline-none transition-colors focus:border-[#CB6CE6] shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]"
            >
              {hours.map((h) => (
                <option key={h} value={h} className="bg-white">
                  {h === 0 ? '12 AM' : h < 12 ? `${h} AM` : h === 12 ? '12 PM' : `${h - 12} PM`}
                </option>
              ))}
            </select>
            <ChevronDown size={12} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-300" />
          </div>
        </div>

        <div className="mb-5 flex items-center gap-2 px-3 py-2 border border-[#CB6CE6]/10 bg-[#CB6CE6]/5">
          <Plus size={10} className="text-[#CB6CE6]/50" />
          <span className="text-[10px] text-zinc-400">
            1-hour session &middot; hourly snap
          </span>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="flex-1 border border-zinc-200 bg-white/80 px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-zinc-500 transition-all hover:border-zinc-300 hover:bg-white hover:text-zinc-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] backdrop-blur-xl"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(hour)}
            className="flex-1 bg-[#CB6CE6] px-3 py-2.5 text-[11px] font-bold uppercase tracking-wider text-white transition-all hover:bg-[#b055d4] active:scale-[0.97] shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_2px_12px_rgba(203,108,230,0.35)]"
          >
            Create slot
          </button>
        </div>
      </div>
    </div>
  );
}
