export type UserStatus = 'available' | 'busy' | 'away';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  bio: string;
  rating: number;
  ratingCount: number;
  status: UserStatus;
  createdAt: number;
}

export type SlotStatus = 'available' | 'booked' | 'completed' | 'cancelled';

export interface TimeSlot {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  startTime: string;
  endTime: string;
  status: SlotStatus;
  createdAt: number;
}

export type SessionStatus = 'pending' | 'approved' | 'completed' | 'cancelled';

export interface Session {
  id: string;
  timeSlotId: string;
  hostId: string;
  hostName: string;
  hostAvatar: string;
  participantId: string;
  participantName: string;
  participantAvatar: string;
  startTime: string;
  endTime: string;
  status: SessionStatus;
  roomName: string;
  createdAt: number;
}

export type RequestStatus = 'pending' | 'accepted' | 'rejected';

export interface SessionRequest {
  id: string;
  sessionId: string;
  timeSlotId: string;
  requesterId: string;
  requesterName: string;
  requesterAvatar: string;
  message: string;
  status: RequestStatus;
  createdAt: number;
}

export interface Rating {
  id: string;
  sessionId: string;
  fromUserId: string;
  toUserId: string;
  score: number;
  comment: string;
  createdAt: number;
}

export interface CalendarDay {
  date: string;
  isToday: boolean;
  isCurrentMonth: boolean;
  slots: TimeSlot[];
}

export interface WeekDay {
  date: string;
  dayName: string;
  dayNumber: number;
  isToday: boolean;
}
