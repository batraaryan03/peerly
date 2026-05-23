import { turso } from '@/lib/turso';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    await turso.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        avatar TEXT,
        image_url TEXT,
        bio TEXT,
        rating REAL DEFAULT 0,
        rating_count INTEGER DEFAULT 0,
        status TEXT DEFAULT 'available',
        created_at INTEGER
      )
    `);

    await turso.execute(`
      CREATE TABLE IF NOT EXISTS time_slots (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        user_name TEXT,
        user_avatar TEXT,
        user_image TEXT,
        start_time TEXT NOT NULL,
        end_time TEXT NOT NULL,
        status TEXT DEFAULT 'available',
        created_at INTEGER,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
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
