# Peerly Design System

## Brand Identity

| Attribute | Value |
|-----------|-------|
| **Primary Color** | `#CB6CE6` (Purple) |
| **Text Primary** | `#27272a` (Zinc-800) |
| **Text Secondary** | `#71717a` (Zinc-500) |
| **Background** | `#ffffff` (White) |
| **Border** | `#e4e4e7` (Zinc-200) |
| **Border Accent** | `rgba(203, 108, 230, 0.15)` |
| **Font** | System font stack (Inter via Tailwind) |

## Visual Language

- **Sharp corners** (no border-radius on cards/buttons) — clean, modern, architectural
- **Translucent overlays** — `backdrop-blur` with white/opacity for modal backgrounds
- **Purple accent** — used sparingly for CTAs, active states, and brand elements
- **Subtle shadows** — `shadow-[inset_0_1px_0_rgba(255,255,255,...)]` for depth
- **Uppercase tracking** — small labels use `uppercase tracking-wider` for clarity
- **Monochrome zinc palette** — grays from zinc-50 through zinc-800

## Component Architecture

```
src/components/
├── shared/          # Cross-feature shared components
│   └── GlassCard.tsx
└── ui/              # Base UI primitives (shadcn/ui style)
    ├── avatar.tsx
    ├── badge.tsx
    ├── bento-grid.tsx
    ├── button.tsx
    ├── card.tsx
    ├── dialog.tsx
    ├── dropdown-menu.tsx
    ├── focus-cards.tsx
    ├── hero-highlight.tsx
    ├── input.tsx
    ├── magnetic-button.tsx
    ├── select.tsx
    ├── separator.tsx
    ├── sheet.tsx
    ├── textarea.tsx
    ├── tooltip.tsx
    └── animated-tooltip.tsx
```

UI primitives follow the **shadcn/ui pattern**:
- Single-file components with inline `cva()` variants
- Re-exported from barrel files where applicable
- No separate `.styles.ts` files (unlike feature components)
- Use `class-variance-authority` + `tailwind-merge` + `clsx`

## Feature Component Pattern

Feature components follow a **modular directory structure**:

```
FeatureSection/
├── index.ts              # Barrel export
├── FeatureSection.tsx    # Main component
├── FeatureSection.hooks.ts   # (optional) Custom hooks
└── FeatureSection.styles.ts  # (optional) Style constants
```

This is used by: HeroSection, ProblemSection, FeaturesSection, TestimonialSection, HowItWorksSection, CTASection, Navbar, Footer.

## Tailwind Configuration

The project uses **Tailwind CSS v4** with the new CSS-based configuration:
- No `tailwind.config.ts` — classes are configured via CSS `@theme` directives
- PostCSS with `@tailwindcss/postcss` plugin
- `tw-animate-css` for animation utilities

## Calendar Components

The calendar uses `react-big-calendar` v1 with custom overrides:

| Component | Overrides |
|-----------|-----------|
| `CustomToolbar` | Date navigation, view switcher (week/day) |
| `CustomHeader` | Day header labels |
| `CustomDateHeader` | Month view date cells |
| `EventPopup` | Context menu on slot click (join, delete, meet) |
| `WeekEvent` | Custom event rendering for week/day view |
| `MonthEvent` | Compact event rendering for month view |

Calendar is wrapped with `react-big-calendar/lib/addons/dragAndDrop` for drag-to-create and drag-to-reschedule.

## Animation Stack

| Library | Usage |
|---------|-------|
| **framer-motion** | Page transitions, micro-interactions, modals |
| **GSAP** | Marketing page scroll animations (Hero scroll, stagger reveals) |
| **@gsap/react** | GSAP + React integration hook |
| **motion** | Simplified animation API (subset of framer-motion) |

## Icons

Two icon libraries coexist:
- `lucide-react` — primary (Calendar, Users, Clock, Plus, Check, X, etc.)
- `@tabler/icons-react` — supplementary (marketing-specific icons)

## Theming Approach

- **No dark mode** currently — pure white background throughout
- **No CSS variables** — inline Tailwind classes and occasional inline `style` objects
- **Minimal inline styles** — used only for dynamic gradient backgrounds (e.g., the purple glossy button `style` prop in IdentityDialog)
- **Consistent spacing** — uses Tailwind's default scale (4px base): `gap-2` = 8px, `p-6` = 24px, etc.
