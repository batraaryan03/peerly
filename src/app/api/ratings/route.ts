import { getDb } from '@/db/client';
import { ratings, users } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const db = getDb();

    await db.insert(ratings).values({
      id: body.id,
      sessionId: body.sessionId,
      fromUserId: body.fromUserId,
      toUserId: body.toUserId,
      score: body.score,
      comment: body.comment || '',
      createdAt: Date.now(),
    });

    // Update the rated user's average rating & count
    const stats = await db.select({
      avg: sql<number>`round(avg(${ratings.score}), 1)`,
      count: sql<number>`count(*)`,
    }).from(ratings).where(eq(ratings.toUserId, body.toUserId));

    const avg = stats[0]?.avg ?? body.score;
    const count = stats[0]?.count ?? 1;

    await db.update(users).set({
      rating: avg,
      ratingCount: count,
    }).where(eq(users.id, body.toUserId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error creating rating:', error);
    return NextResponse.json({ error: 'Failed to create rating' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get('sessionId');
  if (!sessionId) return NextResponse.json({ error: 'sessionId required' }, { status: 400 });

  try {
    const db = getDb();
    const rows = await db.select().from(ratings).where(eq(ratings.sessionId, sessionId));
    return NextResponse.json({ ratings: rows });
  } catch (error) {
    console.error('Error fetching ratings:', error);
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}
