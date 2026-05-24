# Peerly — System Architecture

## Overview

Peerly is a calendar-based peer matching platform for focused work sessions. Built with Next.js 16, React 19, TypeScript, and Turso (libSQL) for the database layer.

**Health Score: 84/100 (Grade B)** — as measured by Depwire dependency analysis.

## Architecture Layers

```
┌─────────────────────────────────────────────────┐
│                  Client Layer                     │
│  (React 19 + Next.js App Router 'use client')     │
│  ┌──────────┐ ┌──────────┐ ┌──────────────────┐  │
│  │ Calendar  │ │ Sessions │ │ Marketing Pages   │  │
│  │   Page    │ │   Page   │ │ (Hero, Features,  │  │
│  │           │ │          │ │  Pricing, etc.)   │  │
│  └────┬─────┘ └────┬─────┘ └──────────────────┘  │
│       │             │                             │
│  ┌────▼─────────────▼──────────────────────────┐  │
│  │         Zustand Stores (Client State)         │  │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────────┐ │  │
│  │  │ Calendar │ │ Matching │ │    User       │ │  │
│  │  │  Store   │ │  Store   │ │    Store      │ │  │
│  │  └──────────┘ └──────────┘ └──────────────┘ │  │
│  └────────────────────┬────────────────────────┘  │
│                       │ fetch()                    │
├───────────────────────┼─────────────────────────┤
│               Server Layer (Next.js API Routes)    │
│                       │                            │
│  ┌────────────────────▼────────────────────────┐  │
│  │    /api/db/init    /api/users/sync           │  │
│  │    /api/time-slots /api/time-slots/[id]      │  │
│  └────────────────────┬────────────────────────┘  │
│                       │ getTurso()                 │
│  ┌────────────────────▼────────────────────────┐  │
│  │         @libsql/client (Turso Driver)         │  │
│  └────────────────────┬────────────────────────┘  │
├───────────────────────┼─────────────────────────┤
│              Database Layer (Turso Cloud)          │
│                       │                            │
│  ┌────────────────────▼────────────────────────┐  │
│  │      Turso (libSQL) — Distributed SQLite      │  │
│  │  ┌──────────┐  ┌──────────┐                  │  │
│  │  │  users   │  │time_slots│                  │  │
│  │  └──────────┘  └──────────┘                  │  │
│  └─────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────┘
```

## Directory Structure

```
src/
├── app/                          # Next.js App Router pages & API routes
│   ├── (app)/                    # Authenticated app layout
│   │   ├── calendar/             # Calendar page (main feature)
│   │   ├── sessions/             # Sessions/matching page
│   │   └── layout.tsx            # App shell (Clerk sync, navbar)
│   ├── (marketing)/              # Public marketing pages
│   ├── api/
│   │   ├── db/init/              # Database table creation
│   │   ├── time-slots/           # CRUD for time slots
│   │   └── users/sync/           # Clerk user sync
│   ├── meeting/[id]/             # Meeting room pages
│   ├── sign-in/                  # Clerk sign-in
│   └── sign-up/                  # Clerk sign-up
├── components/
│   ├── shared/                   # Shared components (GlassCard)
│   └── ui/                       # UI primitives (button, card, dialog, etc.)
├── features/
│   ├── app/layout/               # AppNavbar
│   ├── calendar/
│   │   ├── components/           # EventPopup, rbc-custom
│   │   ├── hooks/                # useRecurringSlots
│   │   ├── store/                # calendar.store, recurring.store
│   │   └── utils/                # date-utils
│   ├── marketing/                # Marketing page sections + layout
│   ├── matching/
│   │   ├── components/           # RequestJoinDialog
│   │   └── store/                # matching.store
│   ├── rating/                   # RatingDialog
│   └── user/
│       ├── components/           # IdentityDialog
│       └── store/                # user.store
├── lib/
│   ├── turso.ts                  # Turso client (lazy singleton)
│   ├── constants.ts              # App constants
│   └── utils.ts                  # Tailwind utility
├── types/                        # TypeScript interfaces
└── proxy.ts                      # Clerk middleware
```

## State Management

Three Zustand stores, all using `persist` middleware (localStorage):

| Store | Key Data | Persistence |
|-------|----------|-------------|
| `user.store` | `currentUser` (Clerk or local) | `peerly-user` |
| `calendar.store` | `timeSlots`, view state | `peerly-calendar` |
| `matching.store` | `sessions`, `requests` | `peerly-matching` |

The stores serve as an **optimistic local cache**. DB writes happen asynchronously after optimistic state updates.

## Authentication Flow

```
User → Clerk UI (Sign-in/Sign-up)
  → Clerk JWT session
  → AppLayout detects `isSignedIn`
  → POST /api/users/sync (stores user in Turso)
  → Sets `currentUser` in Zustand store
  → Calendar page calls `fetchTimeSlots(userId)`
  → Time slots loaded from Turso via GET /api/time-slots?userId=X
```

If Clerk is not available, the `IdentityDialog` provides a fallback name-entry flow.

## Dependency Analysis (Depwire)

- **95 files**, **845 symbols**, **73 cross-file edges**
- **Coupling: A** — average 0.3 connections per file
- **Cohesion: A** — 98% internal dependencies within directories
- **Circular deps: A** — no cycles detected
- **God files: D** — 2 files with >5 connections (HeroSection, Footer)
- **Orphans: F** — 60 orphan files (63%), 94% dead symbols
  - Orphans are primarily page-level components and UI primitives that connect at runtime
  - Many "dead" symbols are React component exports and shadcn/ui primitives

### Key Data Flow: Slot Creation
```
User drags on calendar
  → handleSelectSlot / handleConfirmTime
  → createHourSlots() collects all new slots
  → addTimeSlots(slots) — optimistic state update
  → POST /api/time-slots (batch, JSON array)
  → turso.execute() batch INSERT
  → Response → error logged if failed
```

### Key Data Flow: Slot Fetch on Load
```
CalendarPage mounts
  → useEffect calls fetchTimeSlots(userId)
  → GET /api/time-slots?userId=X
  → turso.execute() SELECT query
  → Response → set({ timeSlots })
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16.2.6 (App Router, Turbopack) |
| UI | React 19.2.4, Tailwind CSS 4 |
| Components | shadcn/ui, react-big-calendar, framer-motion |
| State | Zustand 5 (with persist middleware) |
| Auth | Clerk (@clerk/nextjs 7) |
| Database | Turso Cloud (libSQL/SQLite) |
| DB Driver | @libsql/client 0.17.3 |
| Animation | GSAP 3.15, framer-motion 12 |
| Icons | lucide-react, @tabler/icons-react |
| Language | TypeScript 5 |
| Linter | ESLint 9 |
