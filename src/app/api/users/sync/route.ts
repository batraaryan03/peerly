import { getDb } from '@/db/client';
import { users } from '@/db/schema';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, email, imageUrl } = body;

    if (!id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const db = getDb();

    const avatar = name
      ?.split(' ')
      .map((n: string) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || '?';

    await db.insert(users).values({
      id,
      name: name || '',
      email: email || '',
      avatar,
      imageUrl: imageUrl || '',
      createdAt: Date.now(),
    }).onConflictDoUpdate({
      target: users.id,
      set: {
        name: name || '',
        email: email || '',
        avatar,
        imageUrl: imageUrl || '',
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error syncing user:', error);
    return NextResponse.json({ error: 'Failed to sync user' }, { status: 500 });
  }
}
