CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY, name TEXT NOT NULL DEFAULT '', email TEXT NOT NULL DEFAULT '',
  avatar TEXT DEFAULT '', image_url TEXT DEFAULT '', created_at INTEGER NOT NULL DEFAULT 0,
  last_seen_at INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS time_slots (
  id TEXT PRIMARY KEY, user_id TEXT NOT NULL, user_name TEXT NOT NULL DEFAULT '',
  user_avatar TEXT DEFAULT '', user_image TEXT DEFAULT, start_time TEXT NOT NULL,
  end_time TEXT NOT NULL, date TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'available',
  created_at INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY, time_slot_id TEXT NOT NULL, host_id TEXT NOT NULL, participant_id TEXT,
  start_time TEXT NOT NULL, end_time TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'pending',
  room_name TEXT DEFAULT '', created_at INTEGER NOT NULL DEFAULT 0,
  updated_at INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS session_requests (
  id TEXT PRIMARY KEY, slot_id TEXT NOT NULL, requester_id TEXT NOT NULL,
  message TEXT DEFAULT '', status TEXT NOT NULL DEFAULT 'pending',
  created_at INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS groups (
  id TEXT PRIMARY KEY, name TEXT NOT NULL, description TEXT DEFAULT '',
  avatar_url TEXT DEFAULT '', created_by TEXT NOT NULL,
  created_at INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS group_members (
  group_id TEXT NOT NULL, user_id TEXT NOT NULL, role TEXT NOT NULL DEFAULT 'member',
  joined_at INTEGER NOT NULL DEFAULT 0, PRIMARY KEY (group_id, user_id)
);

CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY, sender_id TEXT NOT NULL, receiver_id TEXT, group_id TEXT,
  content TEXT NOT NULL DEFAULT '', created_at INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS notifications (
  id TEXT PRIMARY KEY, user_id TEXT NOT NULL, type TEXT NOT NULL DEFAULT 'info',
  title TEXT NOT NULL DEFAULT '', body TEXT DEFAULT '', link TEXT DEFAULT '',
  is_read INTEGER NOT NULL DEFAULT 0, created_at INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_slots_user_id ON time_slots(user_id);
CREATE INDEX IF NOT EXISTS idx_slots_date ON time_slots(date);
CREATE INDEX IF NOT EXISTS idx_slots_status ON time_slots(status);
CREATE INDEX IF NOT EXISTS idx_slots_start_end ON time_slots(start_time, end_time);
CREATE INDEX IF NOT EXISTS idx_messages_group ON messages(group_id, created_at);
CREATE INDEX IF NOT EXISTS idx_messages_receiver ON messages(receiver_id, created_at);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, is_read, created_at);
