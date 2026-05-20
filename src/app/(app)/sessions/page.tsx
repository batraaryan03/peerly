'use client';

import { useMatchingStore } from '@/features/matching/store/matching.store';
import { useUserStore } from '@/features/user/store/user.store';
import { useCalendarStore } from '@/features/calendar/store/calendar.store';
import {
  formatSlotTime,
  formatSlotDate,
  isSlotPast,
} from '@/features/calendar/utils/date-utils';
import Link from 'next/link';
import { Video, Check, X, Clock } from 'lucide-react';
import type { Session } from '@/types';

export default function SessionsPage() {
  const currentUser = useUserStore((s) => s.currentUser);
  const sessions = useMatchingStore((s) => s.sessions);
  const requests = useMatchingStore((s) => s.requests);
  const updateSessionStatus = useMatchingStore((s) => s.updateSessionStatus);
  const updateRequestStatus = useMatchingStore((s) => s.updateRequestStatus);
  const updateSlotStatus = useCalendarStore((s) => s.updateSlotStatus);

  if (!currentUser) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-12">
        <p className="text-muted-foreground">
          Set up your profile to see sessions.
        </p>
      </div>
    );
  }

  // Group sessions by role
  const hosted = sessions.filter((s) => s.hostId === currentUser.id);
  const participating = sessions.filter((s) => s.participantId === currentUser.id);

  // Pending incoming requests (someone wants to join your slot)
  const incomingRequests = requests.filter(
    (r) => {
      const session = sessions.find((s) => s.id === r.sessionId);
      return session?.hostId === currentUser.id && r.status === 'pending';
    },
  );

  const handleApprove = (sessionId: string) => {
    updateSessionStatus(sessionId, 'approved');
    const session = sessions.find((s) => s.id === sessionId);
    if (session) {
      updateSlotStatus(session.timeSlotId, 'booked');
      const req = requests.find((r) => r.sessionId === sessionId);
      if (req) updateRequestStatus(req.id, 'accepted');
    }
  };

  const handleReject = (sessionId: string) => {
    updateSessionStatus(sessionId, 'cancelled');
    const req = requests.find((r) => r.sessionId === sessionId);
    if (req) updateRequestStatus(req.id, 'rejected');
  };

  const SessionCard = ({
    session,
    isHost,
  }: {
    session: Session;
    isHost: boolean;
  }) => {
    const past = isSlotPast({
      id: session.id,
      userId: isHost ? session.hostId : session.participantId,
      userName: session.hostName,
      userAvatar: session.hostAvatar,
      startTime: session.startTime,
      endTime: session.endTime,
      status: 'booked',
      createdAt: session.createdAt,
    });
    const partner = isHost
      ? { name: session.participantName, avatar: session.participantAvatar }
      : { name: session.hostName, avatar: session.hostAvatar };

    return (
      <div className="flex items-center justify-between rounded-md bg-muted p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-foreground/10 text-xs font-medium">
            {partner.avatar}
          </div>
          <div>
            <p className="text-sm font-medium">{partner.name}</p>
            <p className="text-xs text-muted-foreground">
              {formatSlotDate(session.startTime)} &middot;{' '}
              {formatSlotTime(session.startTime)} —{' '}
              {formatSlotTime(session.endTime)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {session.status === 'approved' && !past && (
            <Link
              href={`/meeting/${session.id}`}
              className="inline-flex items-center gap-1.5 rounded-md bg-purple-600 px-3 py-1.5 text-xs font-medium text-white transition-opacity hover:opacity-90"
            >
              <Video className="h-3.5 w-3.5" />
              Join
            </Link>
          )}
          {session.status === 'approved' && past && (
            <span className="text-xs text-muted-foreground">Completed</span>
          )}
          {session.status === 'pending' && isHost && (
            <div className="flex items-center gap-1">
              <button
                onClick={() => handleApprove(session.id)}
                className="rounded-md bg-foreground p-1.5 text-background transition-opacity hover:opacity-90"
              >
                <Check className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => handleReject(session.id)}
                className="rounded-md bg-muted-foreground/20 p-1.5 text-muted-foreground transition-colors hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
          {session.status === 'pending' && !isHost && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              Awaiting approval
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <h1 className="text-2xl font-medium tracking-tight">Sessions</h1>

      {/* Incoming Requests */}
      {incomingRequests.length > 0 && (
        <section className="mt-8">
          <h2 className="text-sm font-medium text-muted-foreground">
            Incoming requests ({incomingRequests.length})
          </h2>
          <div className="mt-3 space-y-2">
            {incomingRequests.map((req) => {
              const session = sessions.find((s) => s.id === req.sessionId);
              if (!session) return null;
              return <SessionCard key={req.id} session={session} isHost />;
            })}
          </div>
        </section>
      )}

      {/* Upcoming */}
      <section className="mt-8">
        <h2 className="text-sm font-medium text-muted-foreground">
          Upcoming ({hosted.filter((s) => s.status !== 'cancelled').length + participating.filter((s) => s.status !== 'cancelled').length})
        </h2>
        <div className="mt-3 space-y-2">
          {[...hosted, ...participating]
            .filter((s) => s.status !== 'cancelled')
            .sort(
              (a, b) =>
                new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
            ).map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                isHost={session.hostId === currentUser.id}
              />
            ))}
          {[...hosted, ...participating].filter((s) => s.status !== 'cancelled').length === 0 && (
            <p className="text-sm text-muted-foreground">
              No upcoming sessions. Find someone on the calendar.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
