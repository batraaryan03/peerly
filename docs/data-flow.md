# Data Flow

## Overview

Data flows through three layers: **Client (React/Zustand)** → **Server (Next.js API)** → **Database (Turso)**. The Zustand stores act as an optimistic local cache with async persistence to Turso.

---

## Flow 1: User Authentication & Sync

```
Browser                               Server (Next.js)              Turso
  │                                       │                          │
  │  1. User signs in via Clerk UI        │                          │
  │     ──────────────────────────→       │                          │
  │                                       │                          │
  │  2. POST /api/db/init (fire & forget) │                          │
  │     ──────────────────────────→       │                          │
  │                                       │  CREATE TABLE IF NOT EXISTS...
  │                                       │  ──────────────────────→  │
  │                                       │  ←── { success: true }   │
  │     ←── { success: true }             │                          │
  │                                       │                          │
  │  3. POST /api/users/sync              │                          │
  │     { id, name, email, imageUrl }     │                          │
  │     ──────────────────────────→       │                          │
  │                                       │  INSERT ... ON CONFLICT  │
  │                                       │  ──────────────────────→  │
  │                                       │  ←── { success: true }   │
  │     ←── { success: true }             │                          │
  │                                       │                          │
  │  4. setCurrentUser(syncedUser)        │                          │
  │     (Zustand store updated)           │                          │
  │                                       │                          │
```

---

## Flow 2: Calendar Load

```
Browser                               Server (Next.js)              Turso
  │                                       │                          │
  │  1. Page mounts                       │                          │
  │     fetchTimeSlots(userId)            │                          │
  │     ──────────────────────────→       │                          │
  │                                       │  SELECT * FROM time_slots │
  │                                       │  WHERE user_id = ?        │
  │                                       │  AND status != 'cancelled'│
  │                                       │  ──────────────────────→  │
  │                                       │  ←── rows[]              │
  │     ←── { timeSlots: [...] }          │                          │
  │                                       │                          │
  │  2. set({ timeSlots })                │                          │
  │     (Zustand store updated)           │                          │
  │                                       │                          │
  │  3. useMemo converts to CalendarEvent[]                           │
  │     Filter by status !== 'cancelled'  │                          │
  │     Map to CalendarEvent format       │                          │
  │     Calculate peerCount per slot      │                          │
  │                                       │                          │
  │  4. react-big-calendar renders        │                          │
  │                                       │                          │
```

---

## Flow 3: Create Slots (Bulk)

```
Browser                               Server (Next.js)              Turso
  │                                       │                          │
  │  1. User drags: 9 AM → 12 PM         │                          │
  │                                       │                          │
  │  2. createHourSlots()                 │                          │
  │     Snap to hours: [9-10, 10-11, 11-12]                           │
  │     Check hasOverlap() for each       │                          │
  │     Skip overlapped slots             │                          │
  │     Collect in newSlots[]            │                          │
  │                                       │                          │
  │  3. addTimeSlots(newSlots)            │                          │
  │     ──── optimistic update ────       │                          │
  │     set({ timeSlots: [...existing, ...new] })                     │
  │                                       │                          │
  │  4. POST /api/time-slots (array)      │                          │
  │     ──────────────────────────→       │                          │
  │                                       │  INSERT INTO time_slots   │
  │                                       │  (x3, once per slot)     │
  │                                       │  ──────────────────────→  │
  │                                       │  ←── { success, count }  │
  │     ←── { success: true, count: 3 }  │                          │
  │                                       │                          │
  │  5. On error: console.error           │                          │
  │     (No rollback — data visible optimistically)                   │
```

---

## Flow 4: Delete Slot

```
Browser                               Server (Next.js)              Turso
  │                                       │                          │
  │  1. User clicks × on slot             │                          │
  │                                       │                          │
  │  2. removeTimeSlot(id)                │                          │
  │     ──── optimistic update ────       │                          │
  │     filter out from timeSlots         │                          │
  │                                       │                          │
  │  3. DELETE /api/time-slots/{id}       │                          │
  │     ──────────────────────────→       │                          │
  │                                       │  DELETE FROM time_slots   │
  │                                       │  WHERE id = ?            │
  │                                       │  ──────────────────────→  │
  │                                       │  ←── { success: true }   │
  │     ←── { success: true }             │                          │
```

---

## Flow 5: Update Slot Status (Book/Cancel)

```
Browser                               Server (Next.js)              Turso
  │                                       │                          │
  │  1. User clicks "Cancel" on own slot  │                          │
  │     or joins another user's slot      │                          │
  │                                       │                          │
  │  2. updateSlotStatus(id, 'cancelled') │                          │
  │     ──── optimistic update ────       │                          │
  │     map: update matching slot         │                          │
  │                                       │                          │
  │  3. PATCH /api/time-slots/{id}        │                          │
  │     { status: 'cancelled' }           │                          │
  │     ──────────────────────────→       │                          │
  │                                       │  UPDATE time_slots        │
  │                                       │  SET status = ?          │
  │                                       │  WHERE id = ?            │
  │                                       │  ──────────────────────→  │
  │                                       │  ←── { success: true }   │
  │     ←── { success: true }             │                          │
```

---

## Flow 6: Event Drag & Drop (Reschedule)

```
Browser                               Server (Next.js)              Turso
  │                                       │                          │
  │  1. User drags slot to new time       │                          │
  │                                       │                          │
  │  2. handleEventDrop()                 │                          │
  │     Snap new times to hour            │                          │
  │     Check hasOverlap()                │                          │
  │                                       │                          │
  │  3. removeTimeSlot(old_id)            │                          │
  │     ──── optimistic ────              │                          │
  │     DELETE /api/time-slots/{old_id}   │                          │
  │                                       │                          │
  │  4. addTimeSlot(new_slot)             │                          │
  │     ──── optimistic ────              │                          │
  │     POST /api/time-slots (single)     │                          │
  │                                       │                          │
  │  Note: Two API calls (delete + create) because IDs are regenerated│
```

---

## Flow 7: Database Initialization

```
Browser                               Server (Next.js)              Turso
  │                                       │                          │
  │  On every app mount (fire & forget):  │                          │
  │                                       │                          │
  │  POST /api/db/init                    │                          │
  │  ──────────────────────────→          │                          │
  │                                       │  CREATE TABLE IF NOT EXISTS users
  │                                       │  CREATE TABLE IF NOT EXISTS time_slots
  │                                       │  CREATE INDEX ... x3
  │                                       │  ──────────────────────→  │
  │                                       │  ←── { success: true }   │
  │  ←── { success: true }                │                          │
  │                                       │                          │
  │  Idempotent: IF NOT EXISTS means no error on re-run               │
```

---

## API Route Summary

| Method | Route | Input | Output | Purpose |
|--------|-------|-------|--------|---------|
| POST | `/api/db/init` | — | `{ success, message }` | Create tables if not exist |
| POST | `/api/users/sync` | `{ id, name, email, imageUrl }` | `{ success }` | Upsert Clerk user |
| GET | `/api/time-slots?userId=X` | Query param | `{ timeSlots: [...] }` | Fetch user slots |
| POST | `/api/time-slots` | Slot object or array | `{ success, count }` | Create slot(s) |
| DELETE | `/api/time-slots/{id}` | Path param | `{ success }` | Delete a slot |
| PATCH | `/api/time-slots/{id}` | `{ status }` | `{ success }` | Update slot status |

## Error Handling Strategy

| Layer | Strategy |
|-------|----------|
| **Zustand stores** | Optimistic updates with `try/catch`, errors logged to console |
| **API routes** | `try/catch` wrapping every DB call, returns `{ error }` with 500 status |
| **`apiCall` helper** | Reads response body as text if `!res.ok`, throws `Error("API error: ${message}")` |
| **Layout** | `fetch().catch(() => {})` — DB init failures are silently ignored on mount |

## Depwire Dependency Map

The dependency graph shows:

- **24 cross-file edges** connecting 95 files
- **Feature directories are isolated** — calendar, matching, user stores don't import each other directly
- **UI primitives are leaf nodes** — no imports from other project files
- **API routes depend only on `src/lib/turso.ts`** — clean separation from client code
