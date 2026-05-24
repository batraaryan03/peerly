import { getTurso } from '@/lib/turso';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, email, imageUrl } = body;

    if (!id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const turso = getTurso();

    const avatar = name
      ?.split(' ')
      .map((n: string) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || '?';

    await turso.execute({
      sql: `INSERT INTO users (id, name, email, avatar, image_url, created_at)
            VALUES (?, ?, ?, ?, ?, ?)
            ON CONFLICT(id) DO UPDATE SET
              name = excluded.name,
              email = excluded.email,
              avatar = excluded.avatar,
              image_url = excluded.image_url`,
      args: [id, name || '', email || '', avatar, imageUrl || '', Date.now()],
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error syncing user:', error);
    return NextResponse.json({ error: 'Failed to sync user' }, { status: 500 });
  }
}
