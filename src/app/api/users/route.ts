import { getDb } from '@/db/client';
import { users } from '@/db/schema';
import { like } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const search = request.nextUrl.searchParams.get('search') || '';

  try {
    const db = getDb();
    const rows = search
      ? await db.select().from(users).where(like(users.name, `%${search}%`)).limit(20)
      : await db.select().from(users).limit(50);

    return NextResponse.json({ users: rows });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}
