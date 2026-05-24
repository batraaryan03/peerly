import { getDb } from '@/db/client';
import { timeSlots } from '@/db/schema';
import { and, gte, lte, ne } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const startDate = params.get('start');
  const endDate = params.get('end');

  if (!startDate || !endDate) {
    return NextResponse.json({ error: 'start and end date params required' }, { status: 400 });
  }

  try {
    const db = getDb();
    const rows = await db.select().from(timeSlots).where(
      and(
        gte(timeSlots.date, startDate),
        lte(timeSlots.date, endDate),
        ne(timeSlots.status, 'cancelled'),
      ),
    ).orderBy(timeSlots.startTime);

    return NextResponse.json({ timeSlots: rows });
  } catch (error) {
    console.error('Error fetching time slots:', error);
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const db = getDb();
    const items: Record<string, unknown>[] = Array.isArray(body) ? body : [body];

    for (const s of items) {
      const startTime = String(s.startTime);
      await db.insert(timeSlots).values({
        id: String(s.id),
        userId: String(s.userId),
        userName: String(s.userName || ''),
        userAvatar: s.userAvatar ? String(s.userAvatar) : null,
        userImage: s.userImage ? String(s.userImage) : null,
        startTime,
        endTime: String(s.endTime),
        date: s.date ? String(s.date) : startTime.slice(0, 10),
        status: String(s.status || 'available'),
        createdAt: Number(s.createdAt) || Date.now(),
      });
    }

    return NextResponse.json({ success: true, count: items.length });
  } catch (error) {
    console.error('Error creating time slot:', error);
    return NextResponse.json({ error: 'Failed to create' }, { status: 500 });
  }
}
