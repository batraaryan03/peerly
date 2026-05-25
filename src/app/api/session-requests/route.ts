import { getDb } from '@/db/client';
import { sessionRequests, sessions, timeSlots, users, notifications } from '@/db/schema';
import { eq, or } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get('userId');
  if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 });

  try {
    const db = getDb();

    const rows = await db.select({
      id: sessionRequests.id,
      slotId: sessionRequests.slotId,
      requesterId: sessionRequests.requesterId,
      message: sessionRequests.message,
      status: sessionRequests.status,
      createdAt: sessionRequests.createdAt,
      sessionId: sessions.id,
      hostId: sessions.hostId,
    })
    .from(sessionRequests)
    .leftJoin(sessions, eq(sessionRequests.slotId, sessions.timeSlotId))
    .where(or(
      eq(sessionRequests.requesterId, userId),
      eq(sessions.hostId, userId),
    ))
    .orderBy(sessionRequests.createdAt);

    const enriched = rows.map((r) => ({
      id: r.id,
      sessionId: r.sessionId || r.slotId,
      timeSlotId: r.slotId,
      requesterId: r.requesterId,
      requesterName: '',
      requesterAvatar: '',
      message: r.message,
      hostId: r.hostId,
      status: r.status,
      createdAt: r.createdAt,
    }));

    return NextResponse.json({ requests: enriched });
  } catch (error) {
    console.error('Error fetching requests:', error);
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const db = getDb();

    await db.insert(sessionRequests).values({
      id: body.id,
      slotId: body.timeSlotId || body.slotId,
      requesterId: body.requesterId,
      message: body.message || '',
      status: 'pending',
      createdAt: Date.now(),
    });

    // Notify the slot owner about the new request
    const slot = await db.select({ userId: timeSlots.userId }).from(timeSlots).where(eq(timeSlots.id, body.timeSlotId || body.slotId)).limit(1);
    if (slot.length > 0 && slot[0].userId !== body.requesterId) {
      const requester = await db.select({ name: users.name }).from(users).where(eq(users.id, body.requesterId)).limit(1);
      await db.insert(notifications).values({
        id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        userId: slot[0].userId,
        type: 'session_request',
        title: 'New session request',
        body: `${requester[0]?.name || 'Someone'} wants to join your time slot`,
        link: '/sessions',
        isRead: 0,
        createdAt: Date.now(),
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error creating request:', error);
    return NextResponse.json({ error: 'Failed to create' }, { status: 500 });
  }
}
