import { useEffect, useRef } from 'react';
import { parseISO, getDay } from 'date-fns';
import { format } from 'date-fns/format';
import { useRecurringStore } from '@/features/calendar/store/recurring.store';
import { useCalendarStore } from '@/features/calendar/store/calendar.store';
import { useUserStore } from '@/features/user/store/user.store';
import type { TimeSlot } from '@/types';

function genId(): string {
  return `slot-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function slotOverlaps(slot: TimeSlot, start: Date, end: Date): boolean {
  return parseISO(slot.startTime) < end && parseISO(slot.endTime) > start;
}

export function useRecurringSlots(days: { date: string }[]) {
  const rules = useRecurringStore((s) => s.rules);
  const timeSlots = useCalendarStore((s) => s.timeSlots);
  const addTimeSlots = useCalendarStore((s) => s.addTimeSlots);
  const currentUser = useUserStore((s) => s.currentUser);
  const appliedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!currentUser || rules.length === 0) return;
    const newSlots: TimeSlot[] = [];

    for (const day of days) {
      const date = parseISO(day.date);
      const dayOfWeek = getDay(date);

      for (const rule of rules) {
        if (!rule.active || rule.userId !== currentUser.id || rule.dayOfWeek !== dayOfWeek) continue;

        const ruleKey = `${day.date}-${rule.id}`;
        if (appliedRef.current.has(ruleKey)) continue;

        const slotStart = new Date(date);
        slotStart.setHours(rule.startHour, 0, 0, 0);
        const slotEnd = new Date(date);
        slotEnd.setHours(rule.endHour, 0, 0, 0);

        if (slotEnd <= slotStart || slotEnd <= new Date()) continue;

        const hasOverlap = timeSlots.some((s) => s.userId === currentUser.id && slotOverlaps(s, slotStart, slotEnd));
        if (hasOverlap) continue;

        const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}&background=CB6CE6&color=fff&size=100`;
        newSlots.push({
          id: genId(),
          userId: currentUser.id,
          userName: currentUser.name,
          userAvatar: currentUser.avatar,
          userImage: avatarUrl,
          startTime: slotStart.toISOString(),
          endTime: slotEnd.toISOString(),
          date: format(slotStart, 'yyyy-MM-dd'),
          status: 'available',
          createdAt: Date.now(),
        });

        appliedRef.current.add(ruleKey);
      }
    }

    if (newSlots.length > 0) addTimeSlots(newSlots);
  }, [days, rules, timeSlots, currentUser, addTimeSlots]);
}
