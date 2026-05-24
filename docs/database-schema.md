# Database Schema

## Current Schema

### `users`

Synced from Clerk on sign-in. Stores only what's needed for display and matching.

| Column | Type | Constraints | Default | Description |
|--------|------|-------------|---------|-------------|
| `id` | TEXT | PRIMARY KEY | — | Clerk user ID |
| `name` | TEXT | NOT NULL | `''` | Full name from Clerk |
| `email` | TEXT | NOT NULL | `''` | Primary email from Clerk |
| `avatar` | TEXT | | `''` | Auto-generated initials (e.g., "AB") |
| `image_url` | TEXT | | `''` | Clerk profile image URL |
| `created_at` | INTEGER | NOT NULL | `0` | Unix timestamp of first sync |

**Upsert logic** (in `/api/users/sync`):
```sql
INSERT INTO users (id, name, email, avatar, image_url, created_at)
VALUES (?, ?, ?, ?, ?, ?)
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  email = excluded.email,
  avatar = excluded.avatar,
  image_url = excluded.image_url
```

---

### `time_slots`

Each row is a single hour-long availability slot created by the user.

| Column | Type | Constraints | Default | Description |
|--------|------|-------------|---------|-------------|
| `id` | TEXT | PRIMARY KEY | — | Generated client-side (`slot-{ts}-{random}`) |
| `user_id` | TEXT | NOT NULL | — | Clerk user ID who owns this slot |
| `user_name` | TEXT | NOT NULL | `''` | Display name (denormalized for fast queries) |
| `user_avatar` | TEXT | | `''` | Initials avatar (denormalized) |
| `user_image` | TEXT | | `''` | Profile image URL (denormalized) |
| `start_time` | TEXT | NOT NULL | — | ISO 8601 datetime |
| `end_time` | TEXT | NOT NULL | — | ISO 8601 datetime (1 hour after start) |
| `status` | TEXT | NOT NULL | `'available'` | One of: `available`, `booked`, `completed`, `cancelled` |
| `created_at` | INTEGER | NOT NULL | `0` | Unix timestamp of creation |

**Indexes:**

| Index Name | Columns | Purpose |
|-----------|---------|---------|
| `idx_time_slots_user_id` | `user_id` | Fast lookup of a user's slots |
| `idx_time_slots_start_time` | `start_time` | Range queries for calendar view |
| `idx_time_slots_status` | `status` | Filter by availability |

**Slots are created at 1-hour granularity.** A drag from 9 AM to 12 PM creates 3 rows (9-10, 10-11, 11-12). This is handled client-side in `createHourSlots()`.

---

## Future Tables

### `sessions` (planned)
Represents a confirmed peer matching session between two users.

```sql
CREATE TABLE sessions (
  id TEXT PRIMARY KEY,
  host_id TEXT NOT NULL,          -- REFERENCES users(id)
  participant_id TEXT,            -- REFERENCES users(id), nullable until accepted
  time_slot_id TEXT NOT NULL,     -- REFERENCES time_slots(id)
  start_time TEXT NOT NULL,
  end_time TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',  -- pending, approved, completed, cancelled
  room_name TEXT,                 -- Video room identifier
  created_at INTEGER NOT NULL DEFAULT 0,
  updated_at INTEGER NOT NULL DEFAULT 0
);
```

### `session_requests` (planned)
When a user wants to join another user's available slot.

```sql
CREATE TABLE session_requests (
  id TEXT PRIMARY KEY,
  slot_id TEXT NOT NULL,          -- REFERENCES time_slots(id)
  requester_id TEXT NOT NULL,     -- REFERENCES users(id)
  message TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'pending',  -- pending, accepted, rejected
  created_at INTEGER NOT NULL DEFAULT 0
);
```

---

## Future Vector Columns

For AI-powered peer matching, add vector embeddings to users:

```sql
ALTER TABLE users ADD COLUMN interests_embedding VECTOR(384);
-- Use a 384-dimensional embedding (e.g., from text-embedding-3-small)
```

Then query with:
```sql
SELECT u.id, u.name, vector_distance(u.interests_embedding, ?) AS distance
FROM users u
WHERE u.id != ?
ORDER BY distance ASC
LIMIT 5
```

The `vector_search` MCP tool can then be used:
```typescript
vector_search("users", "interests_embedding", [0.1, 0.2, ...], 5)
```

---

## Data Notes

- **No foreign key constraints** — Turso/libSQL supports them but they add overhead. Referential integrity is maintained at the application layer.
- **Denormalized user fields** — `user_name`, `user_avatar`, `user_image` are stored directly on `time_slots` to avoid JOINs during calendar queries. These are updated via the sync API if the user changes their profile.
- **Timestamps are Unix milliseconds** — stored as INTEGER for efficient sorting and range queries.
- **IDs are client-generated** — `time_slot.id` is generated with `Date.now() + random` for uniqueness without a round-trip to the database.
