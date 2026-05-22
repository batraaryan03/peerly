import {
  format,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isToday,
  isSameDay,
  isSameMonth,
  parseISO,
  isWithinInterval,
  startOfMonth,
  endOfMonth,
  addDays,
} from 'date-fns';
import type { TimeSlot, WeekDay } from '@/types';

export function getWeekDays(date: Date): WeekDay[] {
  const weekStart = startOfWeek(date, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(date, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

  return days.map((day) => ({
    date: day.toISOString(),
    dayName: format(day, 'EEE'),
    dayNumber: parseInt(format(day, 'd'), 10),
    isToday: isToday(day),
  }));
}

export function getMonthGrid(date: Date): { date: Date; isCurrentMonth: boolean }[] {
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  const start = startOfWeek(monthStart, { weekStartsOn: 1 });
  const end = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start, end });

  return days.map((day) => ({
    date: day,
    isCurrentMonth: isSameMonth(day, date),
  }));
}

export function getTimeSlotsForDay(slots: TimeSlot[], dateIso: string): TimeSlot[] {
  const day = parseISO(dateIso);
  return slots.filter((slot) => {
    const slotStart = parseISO(slot.startTime);
    return isSameDay(slotStart, day);
  });
}

export function getSlotsForDate(slots: TimeSlot[], date: Date): TimeSlot[] {
  return slots.filter((slot) => {
    const slotStart = parseISO(slot.startTime);
    return isSameDay(slotStart, date);
  });
}

export function getCurrentWeekLabel(date: Date): string {
  const weekStart = startOfWeek(date, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(date, { weekStartsOn: 1 });
  const startFormat = format(weekStart, 'MMM d');
  const endFormat = format(weekEnd, 'MMM d, yyyy');
  return `${startFormat} — ${endFormat}`;
}

export function getCurrentMonthLabel(date: Date): string {
  return format(date, 'MMMM yyyy');
}

export function getHourLabels(): string[] {
  const count = 14;
  return Array.from({ length: count }, (_, i) => {
    const hour = i + 7;
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const h = hour > 12 ? hour - 12 : hour;
    return `${h} ${ampm}`;
  });
}

export function getHourFromLabel(label: string): number {
  const match = label.match(/(\d+)\s*(AM|PM)/i);
  if (!match) return 0;
  let hour = parseInt(match[1], 10);
  const period = match[2].toUpperCase();
  if (period === 'PM' && hour !== 12) hour += 12;
  if (period === 'AM' && hour === 12) hour = 0;
  return hour;
}

export function getSlotPosition(
  slot: TimeSlot,
  baseHour: number,
  rowHeight: number,
): { top: number; height: number } {
  const start = parseISO(slot.startTime);
  const end = parseISO(slot.endTime);
  const startHour = start.getHours() + start.getMinutes() / 60;
  const endHour = end.getHours() + end.getMinutes() / 60;
  const top = (startHour - baseHour) * rowHeight;
  const height = (endHour - startHour) * rowHeight;
  return { top, height };
}

export function generateSlotId(): string {
  return `slot-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function formatSlotTime(isoString: string): string {
  return format(parseISO(isoString), 'h:mm a');
}

export function formatSlotDate(isoString: string): string {
  return format(parseISO(isoString), 'MMM d, yyyy');
}

export function isSlotInProgress(slot: TimeSlot): boolean {
  const now = new Date();
  const start = parseISO(slot.startTime);
  const end = parseISO(slot.endTime);
  return isWithinInterval(now, { start, end });
}

export function isSlotPast(slot: TimeSlot): boolean {
  return parseISO(slot.endTime) < new Date();
}

export function addWeeksFn(date: Date, n: number): Date {
  return addDays(date, n * 7);
}

export function subWeeksFn(date: Date, n: number): Date {
  return addDays(date, -n * 7);
}

export function getSlotsInRange(
  slots: TimeSlot[],
  dayStart: Date,
  hourStart: number,
  hourEnd: number,
  baseHour: number,
): TimeSlot[] {
  return slots.filter((slot) => {
    const s = parseISO(slot.startTime);
    if (!isSameDay(s, dayStart)) return false;
    const h = s.getHours();
    return h >= baseHour + hourStart && h < baseHour + hourEnd;
  });
}
