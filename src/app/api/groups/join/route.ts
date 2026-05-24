import { getDb } from '@/db/client';
import { groupMembers } from '@/db/schema';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const db = getDb();

    await db.insert(groupMembers).values({
      groupId: body.groupId,
      userId: body.userId,
      role: 'member',
      joinedAt: Date.now(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error joining group:', error);
    return NextResponse.json({ error: 'Failed to join' }, { status: 500 });
  }
}
