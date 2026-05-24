# Peerly — Business Logic & Domain Model

## Core Concept

Peerly is a **calendar-based peer matching platform** where users declare their availability for focused work sessions and get matched with peers who overlap.

## Domain Entities

### User
A person using the platform. Can be authenticated via Clerk or use the app locally.

| Property | Source | Notes |
|----------|--------|-------|
| `id` | Clerk (or generated) | Primary identifier |
| `name` | Clerk/User input | Display name throughout app |
| `email` | Clerk | For notifications, account management |
| `avatar` | Generated | Two-letter initials |
| `imageUrl` | Clerk | Profile photo |
| `bio`, `rating`, `ratingCount`, `status` | Zustand only | Not persisted to Turso (yet) |

### TimeSlot
A block of time a user is available for a session. Always 1 hour, snapped to the hour.

| Property | Business Rule |
|----------|--------------|
| `status: 'available'` | Slot is open for requests |
| `status: 'booked'` | Someone has requested and been accepted |
| `status: 'completed'` | The session happened |
| `status: 'cancelled'` | Owner cancelled — hidden from calendar |

**Constraints:**
- Slots cannot overlap (checked client-side in `hasOverlap()`)
- Slots are always 1-hour blocks snapped to :00 minutes
- Users can only interact with their own slots (create, delete, move)
- Other users' slots are read-only

### Session (planned in DB, exists in types)
A confirmed pairing between two users for a specific time slot.

| Phase | Description |
|-------|-------------|
| `pending` | Request sent, awaiting approval |
| `approved` | Host accepted, session confirmed |
| `completed` | Session finished, ratings pending |
| `cancelled` | Either party cancelled |

### SessionRequest (planned in DB, exists in types)
A request from one user to join another user's available slot.

| Property | Business Rule |
|----------|--------------|
| `message` | Optional note from requester |
| `status: pending` | Awaiting host response |
| `status: accepted` | Host approved → creates Session |
| `status: rejected` | Host declined |

---

## Business Flows

### 1. User Onboarding
```
Sign in with Clerk
  → POST /api/users/sync (Turso)
  → Zustand store updated
  → Calendar page loads → fetchTimeSlots(userId)
  → No slots yet → empty state
```

### 2. Creating Availability
```
User drags on calendar (e.g., Mon 9 AM → 12 PM)
  → createHourSlots() generates 3 slots (9-10, 10-11, 11-12)
  → Overlap check: skip any that conflict
  → addTimeSlots() — optimistic state update
  → POST /api/time-slots (bulk JSON array)
  → All slots visible immediately
```

### 3. Peer Discovery
```
Calendar shows all users' slots on the same view
  → Peer count calculated client-side by overlapping time ranges
  → Users can see who else is available at the same time
  → Tooltip shows peer names/avatars
```

### 4. Session Request (future)
```
User clicks another user's slot → EventPopup
  → "Request to join" → SessionRequest created
  → Host receives notification
  → Accept → Session created, slot status = 'booked'
  → Reject → Request status = 'rejected'
```

### 5. Focus Session (future)
```
Both users join a video room
  → Session status = 'in_progress'
  → Session ends → status = 'completed'
  → Rating prompt for both parties
```

---

## Recurring Availability

Users can set recurring rules (e.g., "available every Mon-Wed 9-11 AM") via `useRecurringSlots`:

1. Create a `RecurringRule` with day of week + time range
2. On each calendar load, `useRecurringSlots` checks rules
3. For any matching day that doesn't have a slot yet, auto-create it
4. Applied once per rule per day (tracked via `appliedRef`)

Recurring rules are stored in Zustand (`recurring.store`) with persist middleware.

---

## Data Ownership

| Entity | Owner | Can Read | Can Write |
|--------|-------|----------|-----------|
| TimeSlot | Creator | Everyone | Creator only |
| Session | Both participants | Both participants | System |
| SessionRequest | Requester + Host | Both | Requester (create), Host (accept/reject) |
| User | Self | Everyone | Self only |

---

## State Sync Strategy

| Operation | Optimistic | DB | Rollback |
|-----------|-----------|-----|----------|
| Create slot | ✅ Immediate in store | POST on background | Error logged, no rollback |
| Delete slot | ✅ Immediate in store | DELETE on background | Error logged, no rollback |
| Update status | ✅ Immediate in store | PATCH on background | Error logged, no rollback |
| Fetch slots | ❌ Replace all | GET on mount | — |

The optimistic update pattern means the UI feels instant. If the DB write fails, the error is logged but the data remains in the store (it'll be corrected on next fetch).

---

## Planned Improvements

1. **Persist matching to Turso** — Move sessions/requests from Zustand-only to database tables
2. **Server-side auth checks** — Verify slot ownership in API routes via Clerk session
3. **Real-time updates** — Use Turso's `sync` protocol for live peer availability changes
4. **Vector matching** — Embed user interests/skills, recommend compatible peers
5. **Notifications** — Email/in-app notifications for session requests
