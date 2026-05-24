import { getDb } from '@/db/client';
import { groups, groupMembers } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get('userId');
  if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 });

  try {
    const db = getDb();
    const rows = await db.select({
      id: groups.id,
      name: groups.name,
      description: groups.description,
      avatarUrl: groups.avatarUrl,
      createdBy: groups.createdBy,
      createdAt: groups.createdAt,
    })
    .from(groups)
    .innerJoin(groupMembers, eq(groups.id, groupMembers.groupId))
    .where(eq(groupMembers.userId, userId))
    .orderBy(groups.createdAt);

    return NextResponse.json({ groups: rows });
  } catch (error) {
    console.error('Error fetching groups:', error);
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const db = getDb();

    await db.insert(groups).values({
      id: body.id,
      name: body.name,
      description: body.description || '',
      avatarUrl: body.avatarUrl || '',
      createdBy: body.createdBy,
      createdAt: Date.now(),
    });

    await db.insert(groupMembers).values({
      groupId: body.id,
      userId: body.createdBy,
      role: 'admin',
      joinedAt: Date.now(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error creating group:', error);
    return NextResponse.json({ error: 'Failed to create' }, { status: 500 });
  }
}
