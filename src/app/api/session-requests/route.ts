import { getDb } from '@/db/client';
import { sessionRequests } from '@/db/schema';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const db = getDb();

    await db.insert(sessionRequests).values({
      id: body.id,
      slotId: body.slotId,
      requesterId: body.requesterId,
      message: body.message || '',
      status: 'pending',
      createdAt: Date.now(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error creating request:', error);
    return NextResponse.json({ error: 'Failed to create' }, { status: 500 });
  }
}
