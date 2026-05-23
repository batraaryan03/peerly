-- Calendar time slots table
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
);

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  avatar TEXT,
  bio TEXT,
  rating REAL DEFAULT 0,
  rating_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'available',
  created_at INTEGER
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_time_slots_user_id ON time_slots(user_id);
CREATE INDEX IF NOT EXISTS idx_time_slots_start_time ON time_slots(start_time);
CREATE INDEX IF NOT EXISTS idx_time_slots_status ON time_slots(status);