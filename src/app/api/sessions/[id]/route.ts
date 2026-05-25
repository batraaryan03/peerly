import { getDb } from '@/db/client';
import { sessions, users, notifications } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const db = getDb();

    // Fetch session before updating to get participant/host info
    const existing = await db.select({
      hostId: sessions.hostId,
      participantId: sessions.participantId,
    }).from(sessions).where(eq(sessions.id, id)).limit(1);

    await db.update(sessions).set({
      status: body.status,
      updatedAt: Date.now(),
    }).where(eq(sessions.id, id));

    // Create notification for participant on approve or reject
    if (existing.length > 0 && (body.status === 'approved' || body.status === 'cancelled')) {
      const sessionData = existing[0];

      // Notify the participant (host is the actor approving/rejecting)
      if (sessionData.participantId) {
        // Show host name in the notification
        const hostName = sessionData.hostId
          ? (await db.select({ name: users.name }).from(users).where(eq(users.id, sessionData.hostId)).limit(1))[0]?.name
          : null;

        await db.insert(notifications).values({
          id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          userId: sessionData.participantId,
          type: body.status === 'approved' ? 'session_approved' : 'session_rejected',
          title: body.status === 'approved' ? 'Session confirmed' : 'Session declined',
          body: body.status === 'approved'
            ? `Your session with ${hostName || 'a peer'} has been confirmed!`
            : `Your session request with ${hostName || 'a peer'} was declined`,
          link: '/sessions',
          isRead: 0,
          createdAt: Date.now(),
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating session:', error);
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}
