# Peerly

**Find your focus partner.**

A calendar-based peer matching platform for focused work sessions. Block time, discover peers, and ship together — one session at a time.

## Business Context

Procrastination is universal. The hardest part of focused work is starting. Peerly solves this by connecting you with a peer who's committed to working at the same time.

The **shared calendar** is the global source of truth. Every user blocks time slots when they're available. Others can see who's free and request to join their slot. The host approves, and when the time comes, a video call opens with one click.

**Core loop:**
1. Block a time slot on the calendar
2. Browse who else is available
3. Request to join someone's slot (or wait for requests on yours)
4. Host approves the match
5. Join the video call at session time
6. Rate each other afterward

**Key features:**
- Shared weekly calendar with drag-to-block time slots
- Peer matching with request/approve flow
- Jitsi-powered video calls (no account needed)
- Post-session peer ratings
- Minimal, borderless UI in black, white, and purple

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | **Next.js 16** (App Router, Turbopack) |
| Language | **TypeScript** |
| Styling | **Tailwind CSS v4** + **shadcn/ui** |
| State Management | **Zustand** (persisted to localStorage) |
| Calendar | **Custom** (date-fns + CSS Grid) |
| Video Calls | **Jitsi Meet iframe API** |
| Package Manager | **bun** |

> **Note:** Phase 1 uses mock data (Zustand stores persisted to localStorage). No server or database required. Authentication and backend persistence come in Phase 2.

## Design Philosophy

- **Minimalism** — every pixel has a purpose
- **Essentialism** — the calendar is the source of truth
- **Intentionalism** — every session has a purpose
- **Colors:** Black, white, and purple (`#7C3AED`)
- **No borders, no gradients, no fluff**
- **Developer-oriented** — think Linear.app energy

## Getting Started

```bash
bun install
bun dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── app/
│   ├── (marketing)/        # Public pages (Home, Pricing, About, Contact, Terms, Privacy)
│   ├── (app)/              # App pages (Calendar, Sessions)
│   │   └── calendar/       # Main calendar view
│   │   └── sessions/       # Session management
│   └── meeting/[id]/       # Video call room
├── components/
│   ├── ui/                 # shadcn/ui primitives
│   └── layout/             # Navbar, Footer
├── features/               # Feature modules (decoupled)
│   ├── calendar/           # Calendar grid, slot creation, date utils
│   ├── matching/           # Request/approve flow, session management
│   ├── video-call/         # Jitsi integration
│   ├── rating/             # Post-session ratings
│   └── user/               # Identity management
├── lib/                    # Utilities, constants
├── store/                  # Global Zustand stores
└── types/                  # TypeScript type definitions
```

## Pages

| Route | Purpose |
|-------|---------|
| `/` | Marketing landing |
| `/calendar` | Main calendar app |
| `/sessions` | Session management + requests |
| `/meeting/[id]` | Video call room |
| `/pricing` | Pricing tiers |
| `/about` | About Peerly |
| `/contact` | Contact form |
| `/terms` | Terms of service |
| `/privacy` | Privacy policy |

## Commands

```bash
bun dev          # Development server
bun run build    # Production build
bun run lint     # ESLint
```

## Future Roadmap

- [ ] Authentication via Clerk
- [ ] MongoDB + Prisma for persistence
- [ ] Real-time notifications
- [ ] Team workspaces
- [ ] Custom WebRTC (replace Jitsi)
- [ ] Session analytics
- [ ] Mobile responsive
