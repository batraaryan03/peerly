import { addDays, addHours, startOfWeek, setHours, setMinutes } from 'date-fns';
import type { TimeSlot } from '@/types';
import { MOCK_USERS } from '@/lib/constants';

let slotCounter = 0;

export function generateMockSlots(): TimeSlot[] {
  const now = new Date();
  const weekStart = startOfWeek(now, { weekStartsOn: 1 });
  const slots: TimeSlot[] = [];

  for (let day = 0; day < 5; day++) {
    const date = addDays(weekStart, day);
    if (date < now) continue;

    for (const user of MOCK_USERS.slice(1)) {
      const hourOffset = 9 + Math.floor(Math.random() * 8);
      const start = setMinutes(setHours(date, hourOffset), 0);
      const end = addHours(start, 1 + Math.floor(Math.random() * 2));

      const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=CB6CE6&color=fff&size=100`;
      slots.push({
        id: `mock-slot-${slotCounter++}`,
        userId: user.id,
        userName: user.name,
        userAvatar: user.avatar,
        userImage: avatarUrl,
        startTime: start.toISOString(),
        endTime: end.toISOString(),
        status: 'available',
        createdAt: Date.now(),
      });
    }
  }

  return slots;
}

export function getCurrentUserSlots(slots: TimeSlot[], userId: string): TimeSlot[] {
  return slots.filter((s) => s.userId === userId);
}

export function getOtherUserSlots(slots: TimeSlot[], userId: string): TimeSlot[] {
  return slots.filter((s) => s.userId !== userId);
}
