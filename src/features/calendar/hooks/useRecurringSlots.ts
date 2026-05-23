import { useEffect, useRef } from 'react';
import { parseISO, isSameDay, getDay, addDays } from 'date-fns';
import { useRecurringStore } from '@/features/calendar/store/recurring.store';
import { useCalendarStore } from '@/features/calendar/store/calendar.store';
import { useUserStore } from '@/features/user/store/user.store';
import { generateSlotId } from '@/features/calendar/utils/date-utils';
import type { TimeSlot } from '@/types';

function slotOverlaps(slot: TimeSlot, start: Date, end: Date): boolean {
  const s = parseISO(slot.startTime);
  const e = parseISO(slot.endTime);
  return s < end && e > start;
}

export function useRecurringSlots(days: { date: string }[]) {
  const rules = useRecurringStore((s) => s.rules);
  const timeSlots = useCalendarStore((s) => s.timeSlots);
  const addTimeSlot = useCalendarStore((s) => s.addTimeSlot);
  const currentUser = useUserStore((s) => s.currentUser);
  const appliedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!currentUser || rules.length === 0) return;

    for (const day of days) {
      const date = parseISO(day.date);
      const dayOfWeek = getDay(date);

      for (const rule of rules) {
        if (!rule.active) continue;
        if (rule.userId !== currentUser.id) continue;
        if (rule.dayOfWeek !== dayOfWeek) continue;

        const ruleKey = `${day.date}-${rule.id}`;
        if (appliedRef.current.has(ruleKey)) continue;

        const slotStart = new Date(date);
        slotStart.setHours(rule.startHour, 0, 0, 0);
        const slotEnd = new Date(date);
        slotEnd.setHours(rule.endHour, 0, 0, 0);

        if (slotEnd <= slotStart) continue;
        if (slotEnd <= new Date()) continue;

        const hasOverlap = timeSlots.some((s) => {
          if (s.userId !== currentUser.id) return false;
          return slotOverlaps(s, slotStart, slotEnd);
        });

        if (!hasOverlap) {
          const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}&background=CB6CE6&color=fff&size=100`;
          addTimeSlot({
            id: generateSlotId(),
            userId: currentUser.id,
            userName: currentUser.name,
            userAvatar: currentUser.avatar,
            userImage: avatarUrl,
            startTime: slotStart.toISOString(),
            endTime: slotEnd.toISOString(),
            status: 'available',
            createdAt: Date.now(),
          });
        }

        appliedRef.current.add(ruleKey);
      }
    }
  }, [days, rules, timeSlots, currentUser, addTimeSlot]);
}
