import { turso } from '@/lib/turso';
import { NextRequest, NextResponse } from 'next/server';
import type { TimeSlot } from '@/types';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'userId required' }, { status: 400 });
  }

  try {
    const result = await turso.execute({
      sql: 'SELECT * FROM time_slots WHERE user_id = ? AND status != ?',
      args: [userId, 'cancelled'],
    });

    const slots: TimeSlot[] = result.rows.map((row) => ({
      id: String(row.id),
      userId: String(row.user_id),
      userName: String(row.user_name || ''),
      userAvatar: String(row.user_avatar || ''),
      userImage: String(row.user_image || ''),
      startTime: String(row.start_time),
      endTime: String(row.end_time),
      status: row.status as TimeSlot['status'],
      createdAt: Number(row.created_at),
    }));

    return NextResponse.json({ timeSlots: slots });
  } catch (error) {
    console.error('Error fetching time slots:', error);
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: TimeSlot = await request.json();

    await turso.execute({
      sql: `INSERT INTO time_slots (id, user_id, user_name, user_avatar, user_image, start_time, end_time, status, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        body.id,
        body.userId,
        body.userName,
        body.userAvatar,
        body.userImage,
        body.startTime,
        body.endTime,
        body.status,
        body.createdAt,
      ],
    });

    return NextResponse.json({ success: true, slot: body });
  } catch (error) {
    console.error('Error creating time slot:', error);
    return NextResponse.json({ error: 'Failed to create' }, { status: 500 });
  }
}