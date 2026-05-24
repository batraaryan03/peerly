import { getTurso } from '@/lib/turso';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST() {
  try {
    const turso = getTurso();

    await turso.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL DEFAULT '',
        email TEXT NOT NULL DEFAULT '',
        avatar TEXT DEFAULT '',
        image_url TEXT DEFAULT '',
        created_at INTEGER NOT NULL DEFAULT 0
      )
    `);

    await turso.execute(`
      CREATE TABLE IF NOT EXISTS time_slots (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        user_name TEXT NOT NULL DEFAULT '',
        user_avatar TEXT DEFAULT '',
        user_image TEXT DEFAULT '',
        start_time TEXT NOT NULL,
        end_time TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'available',
        created_at INTEGER NOT NULL DEFAULT 0
      )
    `);

    await turso.execute(`CREATE INDEX IF NOT EXISTS idx_time_slots_user_id ON time_slots(user_id)`);
    await turso.execute(`CREATE INDEX IF NOT EXISTS idx_time_slots_start_time ON time_slots(start_time)`);
    await turso.execute(`CREATE INDEX IF NOT EXISTS idx_time_slots_status ON time_slots(status)`);

    return NextResponse.json({ success: true, message: 'Database initialized' });
  } catch (error) {
    console.error('Database initialization error:', error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
