import { getDb } from '@/db/client';
import { sessions, users as usersTable } from '@/db/schema';
import { aliasedTable, eq, or } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const db = getDb();

    await db.insert(sessions).values({
      id: body.id,
      timeSlotId: body.timeSlotId,
      hostId: body.hostId,
      participantId: body.participantId,
      startTime: body.startTime,
      endTime: body.endTime,
      status: body.status,
      roomName: body.roomName || '',
      createdAt: body.createdAt,
      updatedAt: Date.now(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error creating session:', error);
    return NextResponse.json({ error: 'Failed to create' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get('userId');
  if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 });

  try {
    const db = getDb();

    const hostUser = aliasedTable(usersTable, 'host_user');
    const participantUser = aliasedTable(usersTable, 'participant_user');

    const rows = await db.select({
      id: sessions.id,
      timeSlotId: sessions.timeSlotId,
      hostId: sessions.hostId,
      hostName: hostUser.name,
      hostAvatar: hostUser.avatar,
      participantId: sessions.participantId,
      participantName: participantUser.name,
      participantAvatar: participantUser.avatar,
      startTime: sessions.startTime,
      endTime: sessions.endTime,
      status: sessions.status,
      roomName: sessions.roomName,
      createdAt: sessions.createdAt,
    })
    .from(sessions)
    .leftJoin(hostUser, eq(sessions.hostId, hostUser.id))
    .leftJoin(participantUser, eq(sessions.participantId, participantUser.id))
    .where(or(eq(sessions.hostId, userId), eq(sessions.participantId, userId)))
    .orderBy(sessions.startTime);

    return NextResponse.json({ sessions: rows });
  } catch (error) {
    console.error('Error fetching sessions:', error);
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}
