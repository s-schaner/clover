# ARCHITECTURE.md
## Next.js Skeleton Website — Clover Labs LLC
### Architecture Dimension Research

*Research type: Project Research — Architecture*
*Milestone: Greenfield — skeleton/framework site*
*Generated: 2026-02-22*

---

## 1. Project Directory Structure

The canonical Next.js App Router layout for a consultancy skeleton site. Every directory listed has a defined responsibility; nothing is added speculatively.

```
clover-site/
├── app/                          # Next.js App Router root
│   ├── layout.tsx                # Root layout: HTML shell, fonts, global CSS import
│   ├── page.tsx                  # Single-page entry: renders all section components in order
│   ├── globals.css               # CSS custom properties, reset, base typography
│   └── favicon.ico
│
├── components/                   # All React components
│   ├── layout/                   # Structural / persistent UI
│   │   ├── Navigation.tsx        # Fixed header, anchor links, mobile menu
│   │   └── Footer.tsx            # Bottom strip: links, legal, location
│   │
│   ├── sections/                 # One file per page section (the primary content units)
│   │   ├── Hero.tsx
│   │   ├── Services.tsx
│   │   ├── Portfolio.tsx
│   │   ├── Team.tsx
│   │   └── Contact.tsx
│   │
│   ├── ui/                       # Reusable, stateless primitives
│   │   ├── SectionWrapper.tsx    # Provides id anchor, scroll-margin, consistent padding
│   │   ├── GridPattern.tsx       # SVG/CSS circuit-grid background texture
│   │   ├── GeometryAccent.tsx    # Decorative line/angle SVG element
│   │   ├── ServiceCard.tsx       # Individual service tile
│   │   ├── PortfolioCard.tsx     # Project placeholder card
│   │   ├── TeamCard.tsx          # Team member profile card
│   │   └── ContactForm.tsx       # Static placeholder form (no submission)
│   │
│   └── motion/                   # Animation wrappers (isolated from UI logic)
│       ├── FadeInOnScroll.tsx    # Intersection Observer fade-in wrapper
│       ├── StaggerChildren.tsx   # Stagger delay wrapper for lists
│       └── HoverLift.tsx         # Hover micro-interaction wrapper
│
├── lib/                          # Non-component logic
│   ├── constants.ts              # Section IDs, nav links, team data, service data
│   ├── types.ts                  # Shared TypeScript interfaces
│   └── utils.ts                  # Pure utility functions (cn(), clsx helpers, etc.)
│
├── styles/                       # CSS modules (component-scoped overrides if needed)
│   └── (empty at skeleton stage — globals.css handles everything initially)
│
├── public/                       # Static assets
│   ├── fonts/                    # Self-hosted variable fonts (if applicable)
│   └── images/                   # Placeholder images / logos
│
├── next.config.ts                # Next.js configuration
├── tailwind.config.ts            # Tailwind configuration (if using Tailwind)
├── tsconfig.json
└── package.json
```

### Key Structural Decisions

**App Router over Pages Router.** The App Router is the current Next.js standard. It enables Server Components by default, supports layout nesting cleanly, and is forward-compatible with dynamic routes when the site splits into multi-page.

**`sections/` vs `ui/` separation.** Sections are page-aware (they know their position in the page, their anchor ID, their data). UI components are context-free primitives. This boundary is the most important one to maintain — it is what allows sections to be extracted into separate `app/[page]/page.tsx` routes later with zero changes to the underlying UI components.

**`motion/` as a dedicated layer.** Animation logic is isolated from content and layout logic. A `FadeInOnScroll` wrapper can be removed or replaced without touching the section it wraps. This also makes it easy to disable animations globally (e.g., for `prefers-reduced-motion`).

**`lib/constants.ts` as the single data source.** All hardcoded content (team members, service descriptions, nav links) lives here. Components receive data as props — they do not import content directly. This discipline makes the transition to a CMS or API a one-file change later.

---

## 2. Component Boundaries

### Component Responsibility Map

| Component | Owns | Does NOT own |
|-----------|------|--------------|
| `app/layout.tsx` | HTML root, font loading, global CSS, `<Navigation>`, `<Footer>` | Page content |
| `app/page.tsx` | Section rendering order, section-level data passing | Section internals |
| `Navigation.tsx` | Anchor link list, active-section highlighting, mobile menu state | Section content |
| `SectionWrapper.tsx` | `id` anchor, `scroll-margin-top`, vertical rhythm padding | Content inside the section |
| `Hero.tsx` | Tagline, subheading, CTA, `GridPattern` background | Any other section's data |
| `Services.tsx` | Services heading, list of `ServiceCard` components | Card internals |
| `ServiceCard.tsx` | Icon (placeholder), title, description | Services list ordering |
| `Portfolio.tsx` | Capability category groupings, list of `PortfolioCard` components | Card internals |
| `PortfolioCard.tsx` | Project placeholder name, tech tags, status badge | Portfolio grouping logic |
| `Team.tsx` | Team heading, list of `TeamCard` components | Card internals |
| `TeamCard.tsx` | Name, role, placeholder avatar, placeholder bio | Team list ordering |
| `Contact.tsx` | Section heading, `ContactForm`, email display, location display | Form submission logic |
| `ContactForm.tsx` | Form fields (name, email, message), submit button | Any actual submission (out of scope) |
| `GridPattern.tsx` | SVG/CSS circuit-grid rendering, density/opacity props | Placement (caller positions it) |
| `GeometryAccent.tsx` | Decorative line/angle SVG, variant prop (corner, divider, etc.) | Placement (caller positions it) |
| `FadeInOnScroll.tsx` | Intersection Observer lifecycle, applies CSS class on entry | What its children render |
| `StaggerChildren.tsx` | Injects animation delay multiplier onto each child | Child component identity |
| `HoverLift.tsx` | CSS transform on hover via class toggle | Child component identity |

### Boundary Rules

1. **Sections pass data down; they never import from sibling sections.**
2. **UI primitives (`ui/`) accept only props; they never read from `lib/constants.ts` directly.**
3. **Motion wrappers are pure wrappers; they render `children` and nothing else.**
4. **`Navigation.tsx` reads the section ID list from `lib/constants.ts`, not from section components.**

---

## 3. Data Flow

### Flow Diagram (text representation)

```
lib/constants.ts
      │
      │  (imported by)
      ▼
app/page.tsx  ──────────────────────────────────────────────────────────────────────────────────┐
      │                                                                                         │
      │  props                                                                                  │
      ▼                                                                                         │
sections/Hero.tsx                                                                               │
sections/Services.tsx  ──► ui/ServiceCard.tsx                                                  │
sections/Portfolio.tsx ──► ui/PortfolioCard.tsx                                                │
sections/Team.tsx      ──► ui/TeamCard.tsx                                                     │
sections/Contact.tsx   ──► ui/ContactForm.tsx                                                  │
      │                                                                                         │
      │  all wrapped in                                                                         │
      ▼                                                                                         │
ui/SectionWrapper.tsx (provides id anchor)                                                      │
      │                                                                                         │
      │  optional animation wrapping                                                            │
      ▼                                                                                         │
motion/FadeInOnScroll.tsx                                                                       │
motion/StaggerChildren.tsx                                                                      │
                                                                                                │
app/layout.tsx ◄────────────────────────────────────────────────────────────────────────────────┘
      │
      ├──► components/layout/Navigation.tsx  (reads section IDs from lib/constants.ts)
      └──► components/layout/Footer.tsx
```

### Data Flow Rules

- **Direction is strictly downward.** Parent components pass data to children as props. No child modifies parent state.
- **No cross-section data dependencies.** The Hero section knows nothing about the Team section.
- **Navigation state (active section) flows up via Intersection Observer, then down to Navigation.** This is the only upward data flow in the system. It is managed in `Navigation.tsx` itself using a local `useState` + `useEffect` with `IntersectionObserver` watching each section's `id`.
- **All content data originates in `lib/constants.ts`.** At the skeleton stage, this file is the "CMS." When content moves to a real CMS or API later, only `app/page.tsx`'s data-fetching layer changes — components remain unchanged.

### State Inventory (skeleton site — minimal)

| State | Location | Type | Description |
|-------|----------|------|-------------|
| Active section | `Navigation.tsx` | `useState<string>` | Which section is currently in the viewport |
| Mobile menu open | `Navigation.tsx` | `useState<boolean>` | Mobile nav drawer open/closed |
| Contact form fields | `ContactForm.tsx` | `useState<FormData>` | Controlled form inputs (no submission) |

No global state management library is needed at skeleton stage. React local state covers every case.

---

## 4. CSS / Styling Architecture for B&W Theme System

### Strategy: CSS Custom Properties + Tailwind (or pure CSS modules)

The B&W constraint is an asset architecturally — it keeps the token system small and the theming trivial to maintain.

#### Token Layer (in `app/globals.css`)

```css
:root {
  /* --- Palette (B&W only — no hue tokens permitted) --- */
  --color-black:       #000000;
  --color-white:       #ffffff;
  --color-gray-900:    #0a0a0a;   /* near-black backgrounds */
  --color-gray-800:    #1a1a1a;   /* card/panel backgrounds */
  --color-gray-700:    #2a2a2a;   /* subtle borders */
  --color-gray-400:    #666666;   /* muted text */
  --color-gray-200:    #e0e0e0;   /* light border on white bg */
  --color-gray-100:    #f5f5f5;   /* light section backgrounds */

  /* --- Semantic aliases (what components reference) --- */
  --bg-page:           var(--color-black);
  --bg-surface:        var(--color-gray-800);
  --bg-surface-hover:  var(--color-gray-700);
  --text-primary:      var(--color-white);
  --text-secondary:    var(--color-gray-400);
  --border-default:    var(--color-gray-700);
  --border-strong:     var(--color-gray-200);

  /* --- Typography scale --- */
  --font-display:      'Inter', 'Helvetica Neue', sans-serif;
  --font-mono:         'JetBrains Mono', 'Fira Code', monospace;
  --text-hero:         clamp(3rem, 8vw, 7rem);
  --text-section:      clamp(1.75rem, 4vw, 3rem);
  --text-card:         1.125rem;
  --text-body:         1rem;
  --text-caption:      0.875rem;

  /* --- Spacing rhythm --- */
  --section-padding-y: clamp(5rem, 10vw, 10rem);
  --section-padding-x: clamp(1.5rem, 5vw, 6rem);
  --card-padding:      2rem;
  --gap-grid:          1.5rem;

  /* --- Animation --- */
  --duration-fast:     150ms;
  --duration-base:     300ms;
  --duration-slow:     600ms;
  --ease-out:          cubic-bezier(0.0, 0.0, 0.2, 1);
  --ease-in-out:       cubic-bezier(0.4, 0.0, 0.2, 1);

  /* --- Grid/Circuit pattern --- */
  --grid-color:        rgba(255, 255, 255, 0.04);
  --grid-size:         40px;
}
```

#### Section Alternation Pattern

The B&W design uses inverted sections to create rhythm without color. Even sections use black backgrounds with white text; odd sections (or selected feature sections) invert.

```css
/* Base section — dark */
.section-dark {
  background: var(--bg-page);
  color: var(--text-primary);
}

/* Inverted section — light (for contrast rhythm) */
.section-light {
  background: var(--color-gray-100);
  color: var(--color-black);
}
```

This maps to: Hero (dark), Services (light), Portfolio (dark), Team (light), Contact (dark).

#### Circuit/Grid Pattern Implementation

```css
/* In GridPattern.tsx — applied as an absolutely positioned background layer */
.grid-pattern {
  background-image:
    linear-gradient(var(--grid-color) 1px, transparent 1px),
    linear-gradient(90deg, var(--grid-color) 1px, transparent 1px);
  background-size: var(--grid-size) var(--grid-size);
  pointer-events: none;
  position: absolute;
  inset: 0;
  z-index: 0;
}

/* Circuit node dots at grid intersections — SVG-based variant */
/* Rendered as an SVG pattern in GridPattern.tsx for finer control */
```

#### Tailwind Configuration (if using Tailwind)

```ts
// tailwind.config.ts
export default {
  content: ['./app/**/*.tsx', './components/**/*.tsx'],
  theme: {
    extend: {
      colors: {
        'bw-black':   '#000000',
        'bw-white':   '#ffffff',
        'bw-gray-900':'#0a0a0a',
        'bw-gray-800':'#1a1a1a',
        'bw-gray-700':'#2a2a2a',
        'bw-gray-400':'#666666',
      },
      fontFamily: {
        display: ['Inter', 'Helvetica Neue', 'sans-serif'],
        mono:    ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
    },
  },
}
```

**Decision point:** Tailwind is the faster path for a skeleton site. Pure CSS custom properties + CSS Modules is cleaner for long-term maintenance. The token layer above works with either approach. The recommendation for this project: use Tailwind with the custom color extensions above, referencing CSS custom properties for animation and spacing where Tailwind's utilities are insufficient.

---

## 5. Hybrid Single-Page / Multi-Page Architecture

### Current State: Single-Page Scroll

`app/page.tsx` renders all sections sequentially. Navigation uses anchor links (`href="#services"`) that correspond to `id` attributes on each `SectionWrapper`. Smooth scrolling is enabled globally via CSS.

```tsx
// app/page.tsx (skeleton)
import Hero      from '@/components/sections/Hero'
import Services  from '@/components/sections/Services'
import Portfolio from '@/components/sections/Portfolio'
import Team      from '@/components/sections/Team'
import Contact   from '@/components/sections/Contact'

export default function Home() {
  return (
    <>
      <Hero />
      <Services />
      <Portfolio />
      <Team />
      <Contact />
    </>
  )
}
```

```tsx
// components/ui/SectionWrapper.tsx
interface SectionWrapperProps {
  id: string          // anchor ID — matches nav href
  className?: string
  children: React.ReactNode
}

export default function SectionWrapper({ id, className, children }: SectionWrapperProps) {
  return (
    <section
      id={id}
      className={`section-wrapper ${className ?? ''}`}
      style={{ scrollMarginTop: 'var(--nav-height, 80px)' }}
    >
      {children}
    </section>
  )
}
```

### Future State: Multi-Page Split

When the time comes to split into separate pages, the migration path is:

1. Create `app/services/page.tsx` — move `<Services />` import here, wrap in layout.
2. Create `app/portfolio/page.tsx` — move `<Portfolio />` import here.
3. Create `app/team/page.tsx` — move `<Team />` import here.
4. Create `app/contact/page.tsx` — move `<Contact />` import here.
5. Update `lib/constants.ts` nav links from `#services` to `/services`.
6. `Navigation.tsx` already conditionally highlights active link — just update the detection logic.
7. **Zero changes to section components or UI primitives.** They are already self-contained.

### Structural Rules That Enable This

- **Each section component is a standalone React component.** It receives data via props and renders itself completely. It has no dependency on adjacent sections.
- **`SectionWrapper` provides the anchor; it does not provide page-level layout.** `app/layout.tsx` provides the page shell.
- **Navigation link targets are defined in `lib/constants.ts` as strings.** Changing `#services` to `/services` is a one-line change per link.

```ts
// lib/constants.ts
export const NAV_LINKS = [
  { label: 'Services',  href: '#services'  },   // ← change to '/services' when splitting
  { label: 'Portfolio', href: '#portfolio' },
  { label: 'Team',      href: '#team'      },
  { label: 'Contact',   href: '#contact'   },
]
```

---

## 6. Animation / Interaction Layer Organization

### Guiding Principle

Animations are a presentation concern, not a content concern. They are applied as wrappers around content, not embedded in it. Every animation should be removable without touching the component it wraps.

### Layer 1: CSS Transitions (always-on, no JavaScript)

Applied via CSS custom properties and class toggles. Used for:
- Hover states on cards and buttons
- Color transitions on navigation links
- Border/outline transitions on form fields

```css
/* In globals.css */
.interactive {
  transition: transform var(--duration-base) var(--ease-out),
              opacity  var(--duration-base) var(--ease-out);
}

.hover-lift:hover {
  transform: translateY(-4px);
}

.hover-dim:hover {
  opacity: 0.7;
}
```

### Layer 2: Scroll-Triggered Animations (Intersection Observer, no library dependency)

`FadeInOnScroll.tsx` uses the browser's native `IntersectionObserver` API. No GSAP, Framer Motion, or AOS library required at skeleton stage. This keeps the bundle small and the dependency count low.

```tsx
// components/motion/FadeInOnScroll.tsx
'use client'
import { useEffect, useRef } from 'react'

interface FadeInOnScrollProps {
  children: React.ReactNode
  threshold?: number      // 0–1, default 0.15
  delay?: number          // ms, default 0
}

export default function FadeInOnScroll({
  children,
  threshold = 0.15,
  delay = 0,
}: FadeInOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.transitionDelay = `${delay}ms`
          el.classList.add('is-visible')
          observer.unobserve(el)
        }
      },
      { threshold }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold, delay])

  return (
    <div ref={ref} className="fade-in-scroll">
      {children}
    </div>
  )
}
```

```css
/* In globals.css */
.fade-in-scroll {
  opacity: 0;
  transform: translateY(24px);
  transition:
    opacity  var(--duration-slow) var(--ease-out),
    transform var(--duration-slow) var(--ease-out);
}

.fade-in-scroll.is-visible {
  opacity: 1;
  transform: translateY(0);
}

@media (prefers-reduced-motion: reduce) {
  .fade-in-scroll {
    opacity: 1;
    transform: none;
    transition: none;
  }
}
```

### Layer 3: Stagger Animations (list items)

```tsx
// components/motion/StaggerChildren.tsx
import React from 'react'

interface StaggerChildrenProps {
  children: React.ReactNode
  staggerMs?: number    // delay between each child, default 100ms
}

export default function StaggerChildren({ children, staggerMs = 100 }: StaggerChildrenProps) {
  return (
    <>
      {React.Children.map(children, (child, i) => (
        <FadeInOnScroll delay={i * staggerMs}>
          {child}
        </FadeInOnScroll>
      ))}
    </>
  )
}
```

### Layer 4: Hero / Entrance Animations (CSS keyframes, no JS)

The Hero section is the exception — it triggers on page load, not on scroll. CSS keyframes handle this without JavaScript.

```css
/* In globals.css */
@keyframes slide-up-fade {
  from { opacity: 0; transform: translateY(32px); }
  to   { opacity: 1; transform: translateY(0);   }
}

.hero-animate {
  animation: slide-up-fade 0.8s var(--ease-out) forwards;
}

.hero-animate-delay-1 { animation-delay: 0.2s; }
.hero-animate-delay-2 { animation-delay: 0.4s; }
.hero-animate-delay-3 { animation-delay: 0.6s; }
```

### Animation Library Decision

For the skeleton site: **no external animation library.** Native `IntersectionObserver` + CSS transitions covers all stated requirements (scroll animations, hover effects, smooth transitions). If Framer Motion is introduced later for more complex interactions, the `motion/` components are the only files that change — sections and UI primitives remain untouched.

---

## 7. Component Build Order

The following order minimizes blocked work — each step depends only on completed prior steps.

### Phase 0: Foundation (no component dependencies)
1. `lib/constants.ts` — define all section IDs, nav links, static content data
2. `lib/types.ts` — define `ServiceItem`, `PortfolioItem`, `TeamMember` interfaces
3. `app/globals.css` — all CSS custom properties, resets, animation classes
4. `app/layout.tsx` — HTML shell, font imports (no child components yet)

### Phase 1: Shell (depends on Phase 0)
5. `components/ui/SectionWrapper.tsx` — anchor + padding shell (used by all sections)
6. `components/layout/Navigation.tsx` — reads from `lib/constants.ts`; no section components needed
7. `components/layout/Footer.tsx` — static content; no dependencies

### Phase 2: Visual Primitives (depends on Phase 0)
8. `components/ui/GridPattern.tsx` — pure SVG/CSS; no dependencies
9. `components/ui/GeometryAccent.tsx` — pure SVG; no dependencies
10. `components/motion/FadeInOnScroll.tsx` — no UI dependencies
11. `components/motion/StaggerChildren.tsx` — depends on `FadeInOnScroll`
12. `components/motion/HoverLift.tsx` — pure CSS wrapper; no dependencies

### Phase 3: UI Primitives (depends on Phases 0, 2)
13. `components/ui/ServiceCard.tsx` — depends on `types.ts`, motion wrappers
14. `components/ui/PortfolioCard.tsx` — depends on `types.ts`, motion wrappers
15. `components/ui/TeamCard.tsx` — depends on `types.ts`, motion wrappers
16. `components/ui/ContactForm.tsx` — standalone; no external UI dependencies

### Phase 4: Sections (depends on Phases 1, 2, 3)
17. `components/sections/Hero.tsx` — uses `GridPattern`, `GeometryAccent`, motion classes
18. `components/sections/Services.tsx` — uses `SectionWrapper`, `ServiceCard`, `StaggerChildren`
19. `components/sections/Portfolio.tsx` — uses `SectionWrapper`, `PortfolioCard`, `StaggerChildren`
20. `components/sections/Team.tsx` — uses `SectionWrapper`, `TeamCard`, `StaggerChildren`
21. `components/sections/Contact.tsx` — uses `SectionWrapper`, `ContactForm`

### Phase 5: Assembly (depends on Phase 4)
22. `app/page.tsx` — imports all sections, assembles single-page layout, passes data from constants

### Dependency Graph (condensed)

```
constants.ts, types.ts, globals.css
        │
        ▼
SectionWrapper ─── Navigation ─── Footer
        │
        ▼
GridPattern, GeometryAccent, motion/*
        │
        ▼
ServiceCard, PortfolioCard, TeamCard, ContactForm
        │
        ▼
Hero, Services, Portfolio, Team, Contact
        │
        ▼
app/page.tsx (assembly)
```

---

## 8. Component Boundaries Summary (Quality Gate)

### What Talks to What

| From | To | Via | Notes |
|------|----|-----|-------|
| `app/page.tsx` | All section components | Props | Page is the only section assembler |
| `app/layout.tsx` | `Navigation`, `Footer` | Direct import | Persistent across all routes |
| `Navigation.tsx` | `lib/constants.ts` | Import | Nav links defined centrally |
| Section components | `SectionWrapper` | Composition | Every section uses the wrapper |
| Section components | UI primitives (`ui/`) | Props | Sections pass data down to cards |
| Section components | Motion wrappers (`motion/`) | Composition | Wrap content, no data passed |
| `motion/StaggerChildren` | `FadeInOnScroll` | Composition | Stagger delegates to fade |
| `GridPattern`, `GeometryAccent` | Nothing | — | Leaf nodes; pure visual output |
| `ContactForm` | Nothing | — | Leaf node; no submission logic |

### Data Flow Direction

```
lib/constants.ts  →  app/page.tsx  →  sections  →  ui/  →  DOM
                                                 ↘  motion/  →  DOM
lib/constants.ts  →  Navigation.tsx  →  DOM
```

All data flows **downward and outward**. No component reads from a sibling. No component writes to a parent.

### Build Order Implications for Roadmap

- **Phases 0–2 must complete before any section can be built.** The token system (`globals.css`) and data definitions (`constants.ts`, `types.ts`) are the true foundation — section components are blocked without them.
- **Sections can be built in parallel** (Hero, Services, Portfolio, Team, Contact have no inter-dependencies) once their UI primitive dependencies are satisfied.
- **`app/page.tsx` is last.** It is trivially simple when all sections exist — it is a render-order file, not a logic file.
- **Navigation active-section highlighting is the trickiest implementation detail** and should be built and tested independently in Phase 1 before sections exist, using dummy scroll targets.

---

*End of ARCHITECTURE.md*
