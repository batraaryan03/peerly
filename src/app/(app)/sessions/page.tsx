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
import { Video, Check, X, Clock, Inbox } from 'lucide-react';
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
        <p className="text-sm text-muted-foreground">
          Set up your profile to see sessions.
        </p>
      </div>
    );
  }

  const hosted = sessions.filter((s) => s.hostId === currentUser.id);
  const participating = sessions.filter((s) => s.participantId === currentUser.id);

  const incomingRequests = requests.filter((r) => {
    const session = sessions.find((s) => s.id === r.sessionId);
    return session?.hostId === currentUser.id && r.status === 'pending';
  });

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

  const SessionCard = ({ session, isHost }: { session: Session; isHost: boolean }) => {
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
      <div className="flex items-center justify-between rounded-xl bg-white/[0.03] p-3 backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition-shadow hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.06] text-[10px] font-bold text-muted-foreground">
            {partner.avatar}
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">{partner.name}</p>
            <p className="text-xs text-muted-foreground">
              {formatSlotDate(session.startTime)} &middot;{' '}
              {formatSlotTime(session.startTime)} &mdash;{' '}
              {formatSlotTime(session.endTime)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {session.status === 'approved' && !past && (
            <Link
              href={`/meeting/${session.id}`}
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500 px-2.5 py-1.5 text-[11px] font-medium text-white transition-all hover:bg-emerald-600 active:scale-[0.98]"
            >
              <Video className="h-3 w-3" />
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
                className="rounded-lg bg-emerald-500 p-1.5 text-white transition-all hover:bg-emerald-600 active:scale-[0.98]"
              >
                <Check className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => handleReject(session.id)}
                className="rounded-lg bg-white/[0.06] p-1.5 text-muted-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition-all hover:bg-white/[0.1] hover:text-foreground active:scale-[0.98]"
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
      <h1 className="text-lg font-medium tracking-tight text-foreground">Sessions</h1>

      {incomingRequests.length > 0 && (
        <section className="mt-6">
          <div className="flex items-center gap-2">
            <Inbox className="h-4 w-4 text-emerald-500" />
            <h2 className="text-xs font-medium text-muted-foreground">
              Incoming requests ({incomingRequests.length})
            </h2>
          </div>
          <div className="mt-3 flex flex-col gap-2">
            {incomingRequests.map((req) => {
              const session = sessions.find((s) => s.id === req.sessionId);
              if (!session) return null;
              return <SessionCard key={req.id} session={session} isHost />;
            })}
          </div>
        </section>
      )}

      <section className="mt-6">
        <h2 className="text-xs font-medium text-muted-foreground">
          Upcoming ({hosted.filter((s) => s.status !== 'cancelled').length + participating.filter((s) => s.status !== 'cancelled').length})
        </h2>
        <div className="mt-3 flex flex-col gap-2">
          {[...hosted, ...participating]
            .filter((s) => s.status !== 'cancelled')
            .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
            .map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                isHost={session.hostId === currentUser.id}
              />
            ))}
          {[...hosted, ...participating].filter((s) => s.status !== 'cancelled').length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-2xl bg-white/[0.02] px-6 py-14 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
              <p className="text-sm font-medium text-muted-foreground">No upcoming sessions</p>
              <p className="mt-1 text-xs text-muted-foreground/60">
                Find someone on the calendar and request to join.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
