# Clover Labs Component Reference

Reference documentation for every component and the data layer. Written for the 4 founders and any contractor working on this codebase. All props and interfaces are extracted directly from the TypeScript source files — not from planning documents.

---

## 1. Architecture Overview

### Component Topology

```
app/layout.tsx                  [Server Component]
  <html> + <body> + fonts + Navigation
  └── <main>{children}</main>

app/page.tsx                    [Server Component — thin orchestrator]
  <> (React fragment — NOT <main>)
  ├── HeroSection
  ├── ServicesSection
  ├── PortfolioSection         [only Client section — has filter state]
  ├── TeamSection
  └── ContactSection

components/layout/
  └── Navigation.tsx           [Client Component]

components/sections/
  ├── HeroSection.tsx          [Server Component]
  ├── ServicesSection.tsx      [Server Component]
  ├── PortfolioSection.tsx     [Client Component — useState for filter]
  ├── TeamSection.tsx          [Server Component]
  └── ContactSection.tsx       [Server Component]

components/ui/
  ├── SectionWrapper.tsx       [Server Component]
  ├── FadeInOnScroll.tsx       [Client Component — framer-motion]
  ├── StaggerChildren.tsx      [Client Component — framer-motion]
  ├── HoverLift.tsx            [Client Component — framer-motion]
  ├── GridPattern.tsx          [Client Component — useId]
  └── GeometryAccent.tsx       [Client Component — useRef, useEffect]

components/cards/
  ├── ServiceCard.tsx          [Client Component — HoverLift]
  ├── PortfolioCard.tsx        [Client Component — HoverLift]
  ├── TeamCard.tsx             [Client Component — HoverLift]
  └── ContactForm.tsx          [Client Component — readOnly form]

lib/
  ├── types.ts                 [TypeScript interfaces only — no logic]
  └── constants.ts             [All static content — single source of truth]
```

### Page Composition Pattern

`app/page.tsx` is a thin orchestrator — 20 lines with no state, effects, or logic. It imports and renders the 5 section components in order. All complexity lives inside the section components.

`app/layout.tsx` wraps `children` in `<main>`. Therefore `app/page.tsx` must use a React fragment `<>` at its root, not `<main>` — nesting two `<main>` elements violates the HTML spec.

---

## 2. Layout Components

### Navigation

**File:** `components/layout/Navigation.tsx`
**Type:** Client Component (`'use client'`)
**Props:** None — reads all data from `lib/constants.ts`

**Behavior:**
- Fixed to the top of the viewport (`position: fixed`), `z-50`, height `--nav-height` (80px)
- Dark surface background (`bg-surface`, `border-surface-border`)
- **Scroll-spy:** Uses `IntersectionObserver` to track which section is in view. Sets `activeSection` state which drives the active nav link style. Root margin offsets for the nav height.
- **Desktop nav links:** Visible at `md+` breakpoint. Links styled with `font-body text-sm`. Active link: `text-on-surface font-medium`. Inactive: `text-on-surface-muted hover:text-on-surface`.
- **Mobile hamburger:** Visible below `md`. Opens a full-viewport overlay dialog.
- **Mobile overlay:** Full-screen dark overlay rendered inside `<header>` (inherits z-50). Nav links in large `font-display text-3xl` style. Closes on link click, Escape key, or close button.
- **Focus trap:** When the mobile overlay is open, Tab/Shift+Tab cycles focus within the overlay. Escape closes and returns focus to the hamburger button.
- **Body scroll lock:** When mobile overlay is open, `document.body.style.overflow = 'hidden'` prevents background scrolling.
- `aria-current="true"` on the active link (not `"page"` — correct ARIA pattern for anchor navigation).
- `activeSection` initializes to `SECTION_IDS.HERO` so no nav link appears highlighted on first load (Hero is not in `NAV_LINKS`).

**Data consumed from `lib/constants.ts`:**
- `NAV_LINKS` — array of `{ label, href, sectionId }` for the 4 nav links (Services, Portfolio, Team, Contact)
- `COMPANY.name` — "Clover Labs" for the wordmark
- `NAV_HEIGHT_PX` — 80, used in IntersectionObserver rootMargin
- `SECTION_IDS` — all section IDs for the scroll-spy observer

---

### SectionWrapper

**File:** `components/ui/SectionWrapper.tsx`
**Type:** Server Component (no `'use client'`)

```typescript
interface SectionWrapperProps {
  id: string;           // required — becomes the <section id="..."> for anchor navigation
  theme?: 'dark' | 'light'; // default: 'dark'
  className?: string;   // optional — appended to the section element
  children: React.ReactNode;
}
```

**What it renders:** A `<section>` element with:
- `id={id}` — anchor target for nav links
- `class="section-dark"` or `class="section-light"` — applies background and text color
- `py-[--section-padding-y] px-[--section-padding-x]` — fluid section padding
- `style={{ scrollMarginTop: 'var(--nav-height)' }}` — offsets scroll-to-anchor by nav height so headings aren't hidden behind the fixed nav

**Important:** SectionWrapper does NOT add `position: relative`. Sections that use `GridPattern` or `GeometryAccent` (which are `absolute inset-0`) must add `relative` via `className` or on an inner div.

---

## 3. UI Primitives

### FadeInOnScroll

**File:** `components/ui/FadeInOnScroll.tsx`
**Type:** Client Component (`'use client'`, uses framer-motion)

```typescript
interface FadeInOnScrollProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;          // seconds, default 0
  y?: number;              // travel distance in px, default 40
  as?: React.ElementType;  // render as different element, default 'div'
}
```

**Behavior:** Wraps children in a `motion.div` (or `as` element). Animates from `opacity:0, y:{y}px` to `opacity:1, y:0` when the element enters the viewport (20% visible threshold). Animation replays each time the element re-enters (`viewport.once = false`). Duration 600ms, easing `--ease-premium`.

**Reduced-motion:** When `prefers-reduced-motion: reduce` is set, renders a plain `<Tag>` at full visibility immediately. No opacity flash, no transform.

**Note on `as` prop:** The `as` prop exists for flexibility but always renders a `motion.div` internally. If you need a specific semantic element wrapping the animation, nest FadeInOnScroll inside it rather than using `as`.

---

### StaggerChildren

**File:** `components/ui/StaggerChildren.tsx`
**Type:** Client Component (file is `'use client'`; `StaggerChildren` itself is a plain div)

```typescript
interface StaggerChildrenProps {
  children: React.ReactNode;
  className?: string;
}
```

**Behavior:** A plain `<div>` wrapper — no framer-motion. Provides semantic grouping for a grid of `StaggerItem` children. Apply your grid classes here (`grid grid-cols-3 gap-[--gap-grid]`).

---

### StaggerItem

**File:** `components/ui/StaggerChildren.tsx` (same file as StaggerChildren)
**Type:** Client Component (`'use client'`, uses framer-motion)

```typescript
interface StaggerItemProps {
  children: React.ReactNode;
  index: number;            // flat index in the grid (0-based)
  columns: number;          // number of columns in the grid layout
  className?: string;
  staggerInterval?: number; // seconds per diagonal step, default 0.08
}
```

**Behavior:** Each item independently tracks viewport entry via `whileInView`. Delay is computed as `(row + col) * staggerInterval` where `row = Math.floor(index / columns)` and `col = index % columns`. This produces a diagonal cascade from top-left. Items on the same diagonal (same `row + col` value) animate simultaneously.

**Why manual delay?** `staggerChildren` is deprecated in framer-motion 12. The `stagger()` utility only supports 1D ordering and cannot produce diagonal cascades.

**Reduced-motion:** Renders a plain `<div>` at full visibility immediately.

---

### HoverLift

**File:** `components/ui/HoverLift.tsx`
**Type:** Client Component (`'use client'`, uses framer-motion)

```typescript
interface HoverLiftProps {
  children: React.ReactNode;
  className?: string;
  scale?: number; // default 1.025
}
```

**Behavior:** Wraps children in a `motion.div`. On hover, scales up by `scale` (default 1.025x) with a 120ms ease-out transition. Uses `willChange: 'transform'` for GPU layer promotion.

**Does not set `cursor: pointer`** — consumers are responsible for pointer style based on child type.

**Reduced-motion:** Renders a plain `<div>` with no hover interaction.

**Important:** `HoverLift` is already built into `ServiceCard`, `PortfolioCard`, and `TeamCard`. Do not wrap those cards in HoverLift again — you will get nested scale transforms.

---

### GridPattern

**File:** `components/ui/GridPattern.tsx`
**Type:** Client Component (`'use client'`, uses `useId`)

```typescript
interface GridPatternProps {
  theme: 'dark' | 'light';
  position?: 'corner-br' | 'corner-tr' | 'edge-right' | 'full'; // default: 'corner-br'
  className?: string;
}
```

**Behavior:** Renders an `absolute inset-0` SVG fractal grid texture. Uses CSS `mask-image` for edge fade (different shapes per `position`). Opacity is set via `--pattern-opacity-dark` (0.06) or `--pattern-opacity-light` (0.04). Uses `useId()` to generate unique SVG `id` attributes per instance, preventing pattern ID collision when multiple instances render on the same page.

**The fractal grid** is a 4-level nested SVG `<pattern>`: 40px (primary), 20px, 10px, 5px. Stroke widths narrow at each level (0.8px → 0.5px → 0.3px → 0.15px).

**Parent must have `position: relative`** — GridPattern is `absolute inset-0` so it must be contained by a positioned ancestor.

---

### GeometryAccent

**File:** `components/ui/GeometryAccent.tsx`
**Type:** Client Component (`'use client'`, uses `useRef` and `useEffect`)

```typescript
interface GeometryAccentProps {
  className?: string;
}
```

**Behavior:** Renders the four-leaf clover brand animation in the Hero section. An `absolute inset-0` div containing an SVG. The clover path is generated at module load via `generateCloverPath()`. On mount, `getTotalLength()` measures the path and sets `--hero-path-length` as a CSS custom property, which drives the `stroke-dashoffset` draw animation (`.hero-pattern-draw` CSS class in globals.css).

**Animation:** Draws in over 1.2s (opacity 0.13), then settles to 0.06 opacity over 0.8s. Uses `--ease-out` for draw, `--ease-in-out` for settle.

**Reduced-motion:** CSS `@media (prefers-reduced-motion: reduce)` immediately sets `stroke-dashoffset: 0` and `opacity: 0.06` with no animation.

**Parent must have `position: relative`** — GeometryAccent is `absolute inset-0`.

Only used in `HeroSection`. Other sections use `GridPattern` instead.

---

## 4. Section Components

### HeroSection

**File:** `components/sections/HeroSection.tsx`
**Type:** Server Component
**Theme:** dark

```
SectionWrapper (id="hero", theme="dark", min-h-[100dvh])
  └── inner div (relative, min-h-[100dvh], flex centered)
        ├── GeometryAccent (absolute full-bleed background)
        └── content div (relative z-10, max-w-4xl, text-center)
              ├── FadeInOnScroll (delay=0.1) → <h1> tagline
              ├── FadeInOnScroll (delay=0.25) → <p> subheading
              └── FadeInOnScroll (delay=0.4) → <a> CTA link
```

**Data source:** `HERO_CONTENT` from `lib/constants.ts`
- `tagline`: h1 text
- `subheading`: p text
- `ctaLabel`: link text
- `ctaHref`: link destination (`#portfolio`)

**Layout note:** Hero does not use `max-w-7xl`. The inner div has its own `px-[--section-padding-x]` for text padding. `min-h-[100dvh]` (not `min-h-screen`) accounts for mobile browser chrome.

---

### ServicesSection

**File:** `components/sections/ServicesSection.tsx`
**Type:** Server Component
**Theme:** light
**Grid:** `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`

```
SectionWrapper (id="services", theme="light")
  └── inner div (relative, max-w-7xl, mx-auto)
        ├── GridPattern (light)
        ├── FadeInOnScroll → heading block
        │     ├── line-diamond-line geometric accent
        │     ├── <h2> "Services"
        │     └── <p> intro copy
        └── StaggerChildren (grid)
              └── SERVICES.map → StaggerItem (columns=3) → ServiceCard
```

**Data source:** `SERVICES` from `lib/constants.ts` (5 items)

**StaggerItem columns:** 3 (matches `lg:grid-cols-3` — stagger computes diagonal based on 3-column layout)

---

### PortfolioSection

**File:** `components/sections/PortfolioSection.tsx`
**Type:** Client Component (`'use client'` — has `useState` for filter)
**Theme:** dark
**Grid:** `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`

```
SectionWrapper (id="portfolio", theme="dark")
  └── inner div (relative, max-w-7xl, mx-auto)
        ├── GridPattern (dark)
        ├── FadeInOnScroll → heading + filter pills
        │     ├── line-diamond-line geometric accent
        │     ├── <h2> "Portfolio"
        │     ├── <p> intro copy
        │     └── filter pill buttons (All, AI/ML, Cloud Infrastructure, ...)
        └── StaggerChildren (grid)
              └── visibleItems.map → StaggerItem (columns=3) → PortfolioCard
```

**Data source:**
- `PORTFOLIO_ITEMS` from `lib/constants.ts` (4 items, all `status: 'placeholder'`)
- `PORTFOLIO_CATEGORIES` from `lib/constants.ts` (5 categories)

**Filter behavior:**
- `activeCategory` state starts at `'All'`
- `'All'` is prepended at component level — it is NOT in `PORTFOLIO_CATEGORIES`
- `visibleItems` computed via `.filter()` — non-matching items are not rendered (not hidden with CSS)
- Selecting "Security" shows an empty grid — no empty state message

**StaggerItem columns:** 3

---

### TeamSection

**File:** `components/sections/TeamSection.tsx`
**Type:** Server Component
**Theme:** light
**Grid:** `grid-cols-2 md:grid-cols-4`

```
SectionWrapper (id="team", theme="light")
  └── inner div (relative, max-w-7xl, mx-auto)
        ├── GridPattern (light)
        ├── FadeInOnScroll → heading block
        │     ├── line-diamond-line geometric accent
        │     ├── <h2> "Team"
        │     └── <p> intro copy
        └── StaggerChildren (grid)
              └── TEAM_MEMBERS.map → StaggerItem (columns=4) → TeamCard
```

**Data source:** `TEAM_MEMBERS` from `lib/constants.ts` (4 founders: Mike Wong, Matt Drapp, Peter Kwon, Stefan Schaner)

**StaggerItem columns:** 4 (matches `md:grid-cols-4` — one column per founder)

---

### ContactSection

**File:** `components/sections/ContactSection.tsx`
**Type:** Server Component
**Theme:** dark
**Grid:** `grid-cols-1 lg:grid-cols-2`

```
SectionWrapper (id="contact", theme="dark")
  └── inner div (relative, max-w-7xl, mx-auto)
        ├── GridPattern (dark)
        ├── FadeInOnScroll → heading block
        │     ├── line-diamond-line geometric accent
        │     └── <h2> "Contact"
        └── two-column grid (lg:grid-cols-2)
              ├── left — email mailto link + location with SVG pin
              └── right — ContactForm (max-w-lg override via [&_form]:max-w-none)
```

**Data source:** `CONTACT` from `lib/constants.ts`
- `email`: displayed and used in `mailto:` link
- `location`: full location string ("Ashburn, Virginia")

**Form override:** `ContactForm` has `max-w-lg` baked into its `<form>` element and accepts no `className` prop. The parent div uses `[&_form]:max-w-none` to override it.

**No intro paragraph** under the heading — intentional per design decision.

---

## 5. Card Components

### ServiceCard

**File:** `components/cards/ServiceCard.tsx`
**Type:** Client Component (contains HoverLift)

```typescript
interface ServiceCardProps {
  item: ServiceItem;  // from lib/types.ts
  className?: string; // applied to HoverLift wrapper (use for h-full in grids)
}
```

**Renders:** Icon (from `ICON_MAP`) + title (`font-display text-lg font-semibold`) + description (`font-body text-sm`). Light theme — uses `text-on-surface-light*` tokens. Border: `border-on-surface-light-subtle/20`.

**Icon system:** Inline SVG icons stored in `ICON_MAP` within the component file (keyed by `ServiceItem.iconName`). Available keys: `'cpu'`, `'cloud'`, `'code'`, `'database'`, `'shield'`. All icons share `viewBox="0 0 24 24"`, `32x32` rendered size, and `strokeWidth="1.5"`.

**HoverLift built in.** Do NOT wrap `<ServiceCard>` in `<HoverLift>`.

**To add a new service icon:** Add an SVG constant to the `ICON_MAP` in `ServiceCard.tsx`, then reference its key in the new `ServiceItem.iconName` field in `constants.ts`.

---

### PortfolioCard

**File:** `components/cards/PortfolioCard.tsx`
**Type:** Client Component (contains HoverLift)

```typescript
interface PortfolioCardProps {
  item: PortfolioItem;  // from lib/types.ts
  className?: string;   // applied to HoverLift wrapper (use for h-full in grids)
}
```

**Renders:** Project type badge (uppercase, `text-xs`) + title + optional outcome metric (italic, only when `item.outcomeMetric` is present) + tech tags (`font-mono`, bottom of card via `mt-auto`). Dark theme — uses `text-on-surface*` tokens, `bg-surface-raised` card background.

**`data-category` attribute:** The inner `<article>` has `data-category={item.category}` — stores the raw category string (e.g., `"AI/ML"`).

**HoverLift built in.** Do NOT wrap `<PortfolioCard>` in `<HoverLift>`.

---

### TeamCard

**File:** `components/cards/TeamCard.tsx`
**Type:** Client Component (contains HoverLift)

```typescript
interface TeamCardProps {
  member: TeamMember;   // from lib/types.ts
  className?: string;   // applied to HoverLift wrapper (use for h-full in grids)
}
```

**Renders:**
- `MonogramAvatar`: SVG with blueprint outer frame, two-character initials (Space Grotesk bold), and `CloverAccentMini` at top-right (`cx=88, cy=28` in `120x120` viewBox)
- Name (`font-display text-base font-semibold`)
- Role + social links inline on one row (`justify-between`): role text left, icons flex-shrink-0 right
- Social icons: inline SVG, 16x16, monochrome, `opacity-60` with `hover:opacity-100`

**Light theme** — uses `text-on-surface-light*` tokens.

**HoverLift built in.** Do NOT wrap `<TeamCard>` in `<HoverLift>`.

**Social platforms supported:** `'linkedin'`, `'github'`, `'twitter'` (each has a hand-crafted SVG icon).

---

### ContactForm

**File:** `components/cards/ContactForm.tsx`
**Type:** Client Component (`'use client'`, has `onSubmit` handler)
**Props:** None

**Renders:** A visually complete but non-functional contact form: Name input, Email input, Message textarea, Submit button ("Coming Soon", `disabled`). All inputs are `readOnly` (not `disabled`) — they are focusable and feel like a real form.

**No submission logic.** `onSubmit` calls `e.preventDefault()`. No state. No validation.

**`max-w-lg` on the `<form>` element.** Override in the parent with `[&_form]:max-w-none` if the form needs to fill a wider container.

---

## 6. Data Layer

### lib/types.ts

All TypeScript interfaces for the data layer. No logic — only type definitions.

| Export              | Kind      | Fields                                                          |
|---------------------|-----------|-----------------------------------------------------------------|
| `NavLink`           | interface | `label: string`, `href: string`, `sectionId: string`           |
| `ServiceItem`       | interface | `id: string`, `title: string`, `description: string`, `iconName?: string` |
| `PortfolioCategory` | type alias| Union: `'AI/ML' \| 'Cloud Infrastructure' \| 'Custom Software' \| 'Data Engineering' \| 'Security'` |
| `TechTag`           | interface | `label: string`                                                 |
| `PortfolioItem`     | interface | `id: string`, `title: string`, `projectType: string`, `category: PortfolioCategory`, `outcomeMetric?: string`, `tags: TechTag[]`, `status: 'placeholder'` |
| `SocialLink`        | interface | `platform: 'linkedin' \| 'github' \| 'twitter'`, `href: string` |
| `TeamMember`        | interface | `id: string`, `name: string`, `role: string`, `bio?: string`, `initials: string`, `socialLinks: SocialLink[]` |
| `ContactInfo`       | interface | `email: string`, `location: string`, `locationShort: string`   |
| `SectionConfig`     | interface | `id: string`, `label: string`, `theme: 'dark' \| 'light'`      |
| `PatternConfig`     | interface | `opacityDark: number`, `opacityLight: number`, `sizePx: number` |

---

### lib/constants.ts

Single source of truth for all static content. Every component that displays content reads from here — content is never hardcoded in JSX.

| Export                | Type               | Consumed By          | Description                                           |
|-----------------------|--------------------|----------------------|-------------------------------------------------------|
| `SECTION_IDS`         | const object       | Navigation, all sections | Map of section IDs: `{ HERO, SERVICES, PORTFOLIO, TEAM, CONTACT }` |
| `NAV_LINKS`           | `NavLink[]`        | Navigation           | 4 links: Services, Portfolio, Team, Contact           |
| `SECTIONS`            | `SectionConfig[]`  | (configuration only) | Section metadata including theme assignments          |
| `HERO_CONTENT`        | const object       | HeroSection          | `tagline`, `subheading`, `ctaLabel`, `ctaHref`        |
| `SERVICES`            | `ServiceItem[]`    | ServicesSection      | 5 service capability definitions                      |
| `PORTFOLIO_CATEGORIES`| `PortfolioCategory[]` | PortfolioSection  | 5 categories (does NOT include "All")                 |
| `PORTFOLIO_ITEMS`     | `PortfolioItem[]`  | PortfolioSection     | 4 portfolio items, all `status: 'placeholder'`        |
| `TEAM_MEMBERS`        | `TeamMember[]`     | TeamSection          | 4 founders with initials and social links             |
| `CONTACT`             | `ContactInfo`      | ContactSection       | Email (placeholder), location                         |
| `PATTERN_CONFIG`      | `PatternConfig`    | (reference)          | Pattern opacity and size constants                    |
| `NAV_HEIGHT_PX`       | `number`           | Navigation           | 80 — used in IntersectionObserver rootMargin          |
| `COMPANY`             | const object       | Navigation           | `name`, `fullName`, `tagline`                         |

---

## 7. Adding New Content

### How to Add a New Portfolio Item

1. Open `lib/constants.ts`
2. Add a new object to the `PORTFOLIO_ITEMS` array matching the `PortfolioItem` interface:

```typescript
// lib/constants.ts — PORTFOLIO_ITEMS array
{
  id: 'port-005',                    // unique ID, sequential
  title: 'Your Project Title',
  projectType: 'Project Type Label', // short descriptor shown as badge
  category: 'AI/ML',                 // must be one of: 'AI/ML' | 'Cloud Infrastructure' | 'Custom Software' | 'Data Engineering' | 'Security'
  outcomeMetric: 'Outcome here',     // optional — italic text below title; omit if not ready
  tags: [
    { label: 'Python' },
    { label: 'FastAPI' },
    { label: 'Redis' },
  ],
  status: 'placeholder',             // always 'placeholder' until live case studies are added
},
```

3. No component changes needed. `PortfolioSection` maps `PORTFOLIO_ITEMS` automatically.
4. The new item will appear in the "All" filter and the filter pill matching its `category`.

---

### How to Add a New Team Member

1. Open `lib/constants.ts`
2. Add a new object to the `TEAM_MEMBERS` array matching the `TeamMember` interface:

```typescript
// lib/constants.ts — TEAM_MEMBERS array
{
  id: 'jane-smith',              // unique ID, lowercase hyphenated name
  name: 'Jane Smith',
  role: 'Co-Founder & CTO',     // confirm actual title with the founder
  initials: 'JS',               // two characters — used in the MonogramAvatar SVG
  socialLinks: [
    { platform: 'linkedin', href: 'https://linkedin.com/in/janesmith' },
    { platform: 'github',   href: 'https://github.com/janesmith' },
    // platform options: 'linkedin' | 'github' | 'twitter'
  ],
},
```

3. No component changes needed. `TeamSection` maps `TEAM_MEMBERS` automatically.
4. Check the grid: `TeamSection` uses `md:grid-cols-4`. Adding a 5th member will cause the grid to wrap — you may need to change the grid to `md:grid-cols-3 lg:grid-cols-5` or similar. Update `StaggerItem columns={N}` to match.

---

### How to Add a New Service

1. Open `lib/constants.ts`
2. Add a new object to the `SERVICES` array matching the `ServiceItem` interface:

```typescript
// lib/constants.ts — SERVICES array
{
  id: 'new-service-id',          // unique, lowercase hyphenated
  title: 'Service Name',
  description: 'One to three sentences describing the service. Focus on the client outcome.',
  iconName: 'myicon',            // key that must exist in ICON_MAP in ServiceCard.tsx
},
```

3. Open `components/cards/ServiceCard.tsx`
4. Add a new inline SVG constant and add it to `ICON_MAP`:

```typescript
// components/cards/ServiceCard.tsx — add new icon
const IconMyIcon = (
  <svg
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {/* Your SVG paths here */}
  </svg>
);

// Add to ICON_MAP:
const ICON_MAP: Record<string, React.ReactNode> = {
  cpu:      IconCpu,
  cloud:    IconCloud,
  code:     IconCode,
  database: IconDatabase,
  shield:   IconShield,
  myicon:   IconMyIcon,  // add this line
};
```

5. The new service card will appear in the Services grid automatically.
6. Note: `ServicesSection` uses `lg:grid-cols-3`. 5 items produces a 3+2 layout. Adding a 6th produces a clean 3+3. Adjust grid cols as needed.
