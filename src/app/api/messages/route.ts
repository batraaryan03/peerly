import { getDb } from '@/db/client';
import { messages, notifications } from '@/db/schema';
import { and, lt, eq, or } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const groupId = params.get('groupId');
  const receiverId = params.get('receiverId');
  const senderId = params.get('senderId');
  const before = params.get('before');
  const limit = Math.min(Number(params.get('limit')) || 50, 100);

  try {
    const db = getDb();

    if (groupId) {
      const conditions = [eq(messages.groupId, groupId)];
      if (before) conditions.push(lt(messages.createdAt, Number(before)));

      const rows = await db.select()
        .from(messages)
        .where(and(...conditions))
        .orderBy(messages.createdAt)
        .limit(limit);

      return NextResponse.json({ messages: rows });
    }

    if (receiverId && senderId) {
      const conditions = [
        or(
          and(eq(messages.senderId, senderId), eq(messages.receiverId, receiverId)),
          and(eq(messages.senderId, receiverId), eq(messages.receiverId, senderId)),
        ),
      ];
      if (before) conditions.push(lt(messages.createdAt, Number(before)));

      const rows = await db.select()
        .from(messages)
        .where(and(...conditions))
        .orderBy(messages.createdAt)
        .limit(limit);

      return NextResponse.json({ messages: rows });
    }

    return NextResponse.json({ error: 'groupId or (senderId+receiverId) required' }, { status: 400 });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const db = getDb();

    await db.insert(messages).values({
      id: body.id,
      senderId: body.senderId,
      receiverId: body.receiverId || null,
      groupId: body.groupId || null,
      content: body.content,
      createdAt: Date.now(),
    });

    if (body.receiverId) {
      await db.insert(notifications).values({
        id: `${body.id}-notif`,
        userId: body.receiverId,
        type: 'message',
        title: 'New message',
        body: body.content.slice(0, 100),
        link: `/messages/dm/${body.senderId}`,
        isRead: 0,
        createdAt: Date.now(),
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json({ error: 'Failed to send' }, { status: 500 });
  }
}
