# Phase 5: Section Builds - Research

**Researched:** 2026-02-23
**Domain:** Next.js 16 section component assembly, React client-side filter state, inline SVG composition, Tailwind v4 responsive grids, section heading accent patterns
**Confidence:** HIGH (primary sources: project codebase — all files read directly; no new external libraries required)

---

## Summary

Phase 5 assembles five content sections (Hero, Services, Portfolio, Team, Contact) as named component files under `components/sections/`. Each section replaces the inline function in `app/page.tsx` (written as Phase 3 validation artifacts) with a proper exported component that imports and composes the card atoms from Phase 4 and the UI primitives from Phase 3.

The most important finding is that **this phase is almost entirely composition, not construction**. All animation primitives, card atoms, design tokens, type interfaces, and content constants are already built. The Phase 3 inline section functions in `page.tsx` are working drafts that Phase 5 promotes to proper files — removing the placeholder copy, wiring in real card atoms, and adding the phase-specific interactions (portfolio category filter). The only net-new work requiring real decisions is: (1) the portfolio filter state pattern, (2) the section heading geometric accent SVG element, and (3) the contact section layout (Claude's discretion).

The portfolio category filter requires `'use client'` with `useState` in `PortfolioSection` — the only section that needs interactivity beyond what the card atoms and motion primitives already provide. The filter uses instant show/hide (no animation), driven by comparing `item.category` against the active filter string. The `data-category` attribute on `PortfolioCard` was built in Phase 4 specifically for this purpose, though at the section level it is cleaner to filter the array in React than to read DOM attributes.

**Primary recommendation:** Create `components/sections/` directory with five files. Extract each inline section function from `page.tsx`, wire in real card atoms and constants, add `'use client'` only to `PortfolioSection` (for filter state), keep all others as Server Components. Update `app/page.tsx` to import the five named section components.

---

## Standard Stack

### Core (all already installed — no new installs required)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| React | 19.2.3 | Server Components for static sections; `useState` for PortfolioSection filter | Project standard |
| Next.js | 16.1.6 | App Router — sections are children of `app/page.tsx`, rendered inside `<main>` from layout.tsx | Project standard |
| framer-motion | 12.34.3 | FadeInOnScroll, StaggerItem — consumed indirectly via existing primitives | Already wired |
| TypeScript strict | 5.9.3 | All section props typed; filter state typed as `PortfolioCategory \| 'All'` | Project standard |
| Tailwind v4 | ^4 | Responsive grid, spacing tokens, dark/light section utilities | Project standard |

### Explicitly NOT needed (important constraint)

| Package | Reason |
|---------|--------|
| lucide-react (installed: 0.575.0) | Section heading accent is a hand-crafted inline SVG element (dot, line, or mini-clover) — not an icon library import |
| Any state management library | Portfolio filter uses local `useState` only — no global state, no context, no zustand |
| Any animation library beyond framer-motion | Instant filter swap per decision: no transition on category change |

**Installation:**
```bash
# No new packages required
```

---

## Architecture Patterns

### Recommended Project Structure After Phase 5

```
components/
├── ui/                              # Phase 3 — untouched
│   ├── SectionWrapper.tsx
│   ├── GridPattern.tsx
│   ├── GeometryAccent.tsx
│   ├── FadeInOnScroll.tsx
│   ├── StaggerChildren.tsx
│   └── HoverLift.tsx
├── cards/                           # Phase 4 — untouched
│   ├── ServiceCard.tsx
│   ├── PortfolioCard.tsx
│   ├── TeamCard.tsx
│   └── ContactForm.tsx
├── sections/                        # Phase 5 — new directory
│   ├── HeroSection.tsx              # Server Component
│   ├── ServicesSection.tsx          # Server Component
│   ├── PortfolioSection.tsx         # 'use client' — filter state
│   ├── TeamSection.tsx              # Server Component
│   └── ContactSection.tsx          # Server Component
└── layout/
    └── Navigation.tsx               # Phase 2 — untouched

app/
└── page.tsx                         # Updated: imports 5 section components
```

### Pattern 1: Server Component Section (Hero, Services, Team, Contact)

**What:** Section component files that contain no client-side state. No `'use client'` directive needed. Imports from `lib/constants.ts` (static data), uses `SectionWrapper`, `GridPattern`, `FadeInOnScroll`, `StaggerChildren/StaggerItem`, and card atoms.

**When to use:** Every section except Portfolio.

```typescript
// components/sections/ServicesSection.tsx
// No 'use client' — Server Component
// FadeInOnScroll and StaggerItem are 'use client' themselves but can be used
// inside Server Components — Next.js App Router supports this composition.

import SectionWrapper from '@/components/ui/SectionWrapper';
import { GridPattern } from '@/components/ui/GridPattern';
import { FadeInOnScroll } from '@/components/ui/FadeInOnScroll';
import { StaggerChildren, StaggerItem } from '@/components/ui/StaggerChildren';
import { ServiceCard } from '@/components/cards/ServiceCard';
import { SECTION_IDS, SERVICES } from '@/lib/constants';

export function ServicesSection() {
  return (
    <SectionWrapper id={SECTION_IDS.SERVICES} theme="light">
      <div className="relative mx-auto max-w-7xl px-[--section-padding-x] py-[--section-padding-y]">
        <GridPattern theme="light" />
        <FadeInOnScroll>
          {/* Section heading with geometric accent */}
          <div className="text-center mb-16">
            {/* geometric accent SVG — Claude's discretion */}
            <h2 className="font-display text-[length:--text-section] font-bold text-on-surface-light">
              Services
            </h2>
            <p className="font-body text-on-surface-light-muted mt-4 max-w-2xl mx-auto">
              {/* 1-2 sentence intro copy — Claude's discretion */}
            </p>
          </div>
        </FadeInOnScroll>
        <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[--gap-grid]">
          {SERVICES.map((service, i) => (
            <StaggerItem key={service.id} index={i} columns={3}>
              <ServiceCard item={service} className="h-full" />
            </StaggerItem>
          ))}
        </StaggerChildren>
      </div>
    </SectionWrapper>
  );
}
```

**Key insight:** FadeInOnScroll and StaggerItem are `'use client'` components, but they can be rendered inside Server Component sections without making the section file itself `'use client'`. The Next.js App Router handles this — the client boundary is at the leaf component, not the parent.

### Pattern 2: Portfolio Section with Category Filter State

**What:** The one section that requires `'use client'`. Maintains `activeCategory` state as `PortfolioCategory | 'All'`. Filters `PORTFOLIO_ITEMS` array before rendering — simpler and more correct than using DOM attribute selectors.

**Decision from CONTEXT.md:** Instant swap — no animation when switching categories. Just show/hide cards immediately.

**Decision from CONTEXT.md:** "All" pill is active by default. Clicking a category narrows visible cards. The pills are a horizontal row above the card grid.

```typescript
// components/sections/PortfolioSection.tsx
'use client';

import { useState } from 'react';
import SectionWrapper from '@/components/ui/SectionWrapper';
import { GridPattern } from '@/components/ui/GridPattern';
import { FadeInOnScroll } from '@/components/ui/FadeInOnScroll';
import { StaggerChildren, StaggerItem } from '@/components/ui/StaggerChildren';
import { PortfolioCard } from '@/components/cards/PortfolioCard';
import {
  SECTION_IDS,
  PORTFOLIO_CATEGORIES,
  PORTFOLIO_ITEMS,
} from '@/lib/constants';
import type { PortfolioCategory } from '@/lib/types';

type ActiveFilter = PortfolioCategory | 'All';

export function PortfolioSection() {
  const [activeCategory, setActiveCategory] = useState<ActiveFilter>('All');

  const visibleItems =
    activeCategory === 'All'
      ? PORTFOLIO_ITEMS
      : PORTFOLIO_ITEMS.filter((item) => item.category === activeCategory);

  return (
    <SectionWrapper id={SECTION_IDS.PORTFOLIO} theme="dark">
      <div className="relative mx-auto max-w-7xl px-[--section-padding-x] py-[--section-padding-y]">
        <GridPattern theme="dark" />
        <FadeInOnScroll>
          <div className="text-center mb-8">
            <h2 className="font-display text-[length:--text-section] font-bold text-on-surface">
              Portfolio
            </h2>
            <p className="font-body text-on-surface-muted mt-4 max-w-2xl mx-auto">
              {/* 1-2 sentence intro — Claude's discretion */}
            </p>
          </div>
          {/* Pill filter row */}
          <div className="flex flex-wrap gap-2 justify-center mb-12">
            {(['All', ...PORTFOLIO_CATEGORIES] as ActiveFilter[]).map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={
                  activeCategory === cat
                    ? 'px-4 py-1.5 font-body text-sm border border-on-surface text-on-surface uppercase tracking-wide'
                    : 'px-4 py-1.5 font-body text-sm border border-on-surface-subtle/40 text-on-surface-muted uppercase tracking-wide'
                }
              >
                {cat}
              </button>
            ))}
          </div>
        </FadeInOnScroll>
        <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[--gap-grid]">
          {visibleItems.map((item, i) => (
            <StaggerItem key={item.id} index={i} columns={3}>
              <PortfolioCard item={item} className="h-full" />
            </StaggerItem>
          ))}
        </StaggerChildren>
      </div>
    </SectionWrapper>
  );
}
```

**Important:** With instant swap and no animation, the key re-indexing on StaggerItem (`index={i}` from filtered array) means the stagger delay re-calculates on each filter change. This is fine for initial load animation but may cause a flash when switching filters since StaggerItem uses `whileInView`. With `viewport.once = false`, previously visible cards will re-animate when re-entering view. This is a known quirk of using `whileInView` for filter patterns — see Pitfalls section.

### Pattern 3: Section Heading with Geometric Accent

**What:** Every non-hero section gets a centered heading with a small geometric SVG element near it. The exact form is Claude's discretion — options are: (1) two short horizontal lines flanking the heading, (2) a small dot below, (3) a tiny CloverAccentMini, (4) a single horizontal rule. The accent must match the blueprint stroke vocabulary.

**Recommendation (for planner to act on):** Use a pair of short flanking lines — `<hr>`-like thin SVG lines left and right of the heading, or a horizontal line + centered diamond. This is the most compositionally appropriate for a formal engineering aesthetic and requires zero new components (pure inline SVG or CSS border tricks).

```typescript
// Section heading pattern — centered with geometric accent
// Place inside a FadeInOnScroll above the card grid
<div className="text-center mb-16">
  {/* Geometric accent — example: small centered dot */}
  <div className="flex items-center justify-center gap-3 mb-4">
    <span className="block h-px w-12 bg-current opacity-30" />
    <span className="block w-1.5 h-1.5 border border-current opacity-60" />
    <span className="block h-px w-12 bg-current opacity-30" />
  </div>
  <h2 className="font-display text-[length:--text-section] font-bold">
    {heading}
  </h2>
  <p className="font-body text-on-surface-muted mt-4 max-w-2xl mx-auto text-base">
    {introText}
  </p>
</div>
```

This pattern uses only Tailwind utilities and `currentColor` — no SVG element needed, works in both dark and light themed sections, and stays on-brand.

### Pattern 4: Contact Section Layout (Claude's Discretion)

**What:** The contact section contains three elements: email mailto link, location with pin graphic, and ContactForm. CONTEXT.md gives Claude full discretion over the spatial arrangement.

**Recommendation:** Two-column layout on `lg:` and above; stacked on mobile.
- Left column: email + location (contact details, relatively compact)
- Right column: ContactForm (takes more vertical space)

```typescript
// Contact section inner layout recommendation
<div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
  {/* Left: contact details */}
  <div className="flex flex-col gap-8">
    {/* Email */}
    <div>
      <p className="font-body text-sm text-on-surface-muted uppercase tracking-wider mb-2">
        Email
      </p>
      <a
        href={`mailto:${CONTACT.email}`}
        className="link-underline font-body text-on-surface"
      >
        {CONTACT.email}
      </a>
    </div>
    {/* Location */}
    <div>
      <p className="font-body text-sm text-on-surface-muted uppercase tracking-wider mb-2">
        Location
      </p>
      <div className="flex items-center gap-2 text-on-surface">
        {/* Geometric SVG pin — inline, hand-crafted */}
        <svg width="12" height="16" viewBox="0 0 12 16" fill="none"
          stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
          <path d="M6 0 C2.7 0 0 2.7 0 6 C0 10.5 6 16 6 16 C6 16 12 10.5 12 6 C12 2.7 9.3 0 6 0 Z" />
          <circle cx="6" cy="6" r="2" />
        </svg>
        <span className="font-body">{CONTACT.location}</span>
      </div>
    </div>
  </div>
  {/* Right: form */}
  <ContactForm />
</div>
```

**On the geometric SVG pin:** The pin shape is a classic map-pin: pointed bottom, rounded top, with a small circle center. Matches the stroke-only blueprint vocabulary of all other section icons. The viewBox is 12x16 (taller than wide, like a real pin). strokeWidth 1.2 keeps it hairline at small size.

### Pattern 5: Hero Section — Minimal Changes from Phase 3

**What:** The Hero section in `page.tsx` is already correct per the Phase 5 success criteria. The Phase 5 task is to extract it into `components/sections/HeroSection.tsx` without structural changes. The GeometryAccent full-bleed background, FadeInOnScroll on copy, and the CTA as a `link-underline` text link are all already in place.

**The one constraint:** SectionWrapper does NOT add `position: relative`. The hero inner div needs `className="relative ..."` for GeometryAccent's `absolute inset-0` positioning to work. This is already present in the Phase 3 draft — just carry it through.

```typescript
// components/sections/HeroSection.tsx — Server Component
import SectionWrapper from '@/components/ui/SectionWrapper';
import { GeometryAccent } from '@/components/ui/GeometryAccent';
import { FadeInOnScroll } from '@/components/ui/FadeInOnScroll';
import { SECTION_IDS, HERO_CONTENT } from '@/lib/constants';

export function HeroSection() {
  return (
    <SectionWrapper id={SECTION_IDS.HERO} theme="dark" className="min-h-screen">
      <div className="relative min-h-screen flex items-center justify-center px-[--section-padding-x]">
        <GeometryAccent />
        <div className="relative z-10 max-w-4xl text-center">
          <FadeInOnScroll delay={0.1}>
            <h1 className="font-display text-[length:--text-hero] leading-tight font-bold">
              {HERO_CONTENT.tagline}
            </h1>
          </FadeInOnScroll>
          <FadeInOnScroll delay={0.25}>
            <p className="font-body text-on-surface-muted mt-6 text-lg max-w-2xl mx-auto">
              {HERO_CONTENT.subheading}
            </p>
          </FadeInOnScroll>
          <FadeInOnScroll delay={0.4}>
            <a
              href={HERO_CONTENT.ctaHref}
              className="link-underline font-body text-on-surface mt-8 inline-block text-sm tracking-widest uppercase"
            >
              {HERO_CONTENT.ctaLabel}
            </a>
          </FadeInOnScroll>
        </div>
      </div>
    </SectionWrapper>
  );
}
```

This is almost a literal extraction — the Phase 3 draft is already correct.

### Pattern 6: page.tsx After Phase 5

**What:** After extracting all five sections, `page.tsx` becomes a thin orchestration file — just imports and renders.

```typescript
// app/page.tsx — after Phase 5
import { HeroSection } from '@/components/sections/HeroSection';
import { ServicesSection } from '@/components/sections/ServicesSection';
import { PortfolioSection } from '@/components/sections/PortfolioSection';
import { TeamSection } from '@/components/sections/TeamSection';
import { ContactSection } from '@/components/sections/ContactSection';

export default function Home() {
  return (
    <>
      <HeroSection />
      <ServicesSection />
      <PortfolioSection />
      <TeamSection />
      <ContactSection />
    </>
  );
}
```

### Anti-Patterns to Avoid

- **Making ServicesSection, TeamSection, ContactSection `'use client'`:** Only PortfolioSection needs it (filter state). All other sections are pure Server Components — their animation children (FadeInOnScroll, StaggerItem) carry their own client boundaries.
- **Using DOM `querySelector('[data-category="AI/ML"]')` for filter logic:** Filter at the data layer (array filter on `PORTFOLIO_ITEMS`) not the DOM layer. The `data-category` attribute exists on PortfolioCard for CSS debugging, but React array filtering is cleaner, type-safe, and SSR-safe.
- **Animating the filter swap:** CONTEXT.md explicitly requires instant swap — "no animation when switching categories." Do not add a Framer Motion `AnimatePresence` or CSS transition on card visibility.
- **Using `display: none` / `visibility: hidden` to hide filtered cards:** Always render only the visible items array — don't render all cards and then hide non-matching ones. Rendering hidden cards bloats the DOM unnecessarily (especially with HoverLift's framer-motion wrappers on each card).
- **Adding section-level heading text without intro copy:** CONTEXT.md specifies every non-hero section gets heading + 1-2 sentence intro text. Skipping the intro copy violates the consistent rhythm decision.
- **Using `rounded-*` utilities anywhere in section markup:** The design system is entirely sharp-cornered. No border-radius on any card, pill, button, or container.
- **Putting `position: relative` on SectionWrapper via the wrapper itself:** SectionWrapper does not add `relative`. The inner content `<div>` inside each section must have `relative` when using GridPattern or GeometryAccent with absolute positioning.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Card hover micro-interaction | Custom CSS | `HoverLift` (already in ServiceCard, PortfolioCard, TeamCard) | HoverLift is built-in to card atoms — no wrapper needed at section level |
| Scroll-triggered section heading entrance | Custom IntersectionObserver | `FadeInOnScroll` from Phase 3 | Already handles reduced-motion, viewport tracking, and easing |
| Portfolio card entrance animation | Custom CSS | `StaggerChildren` + `StaggerItem` from Phase 3 | Diagonal cascade already tuned; `columns={3}` computes delay |
| Category filter tabs | Third-party tabs library | `useState<PortfolioCategory \| 'All'>` + button row | Five categories — custom is simpler than a library |
| Map pin icon | Icon library import | Inline SVG (12x16 viewBox, 2-path pin shape) | Single use; matches stroke-only blueprint vocabulary |
| Section geometric accent | Icon library import | Inline CSS or SVG (lines, dot, mini-clover) | Single use; must match existing blueprint aesthetic |
| Grid layout | CSS Grid library | Tailwind `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` | Already established in Phase 3 page.tsx |

**Key insight:** Phase 5 has no new infrastructure concerns. Every interaction, animation, and layout primitive was built in Phases 3-4. The only decision-bearing work is composing them correctly and writing the intro copy.

---

## Common Pitfalls

### Pitfall 1: StaggerItem Re-Animation on Filter Change

**What goes wrong:** When a category filter is applied in PortfolioSection, the StaggerItem `index` prop changes (filtered array is re-indexed from 0). On first render after filter change, if items are in viewport, `whileInView` with `viewport.once = false` will trigger the animation again — visible items flash from opacity 0 to 1.

**Why it happens:** `StaggerItem` uses `whileInView` with `viewport.once = false`. When the item re-mounts (because `visibleItems` array changes and React re-renders the grid), framer-motion re-triggers the entrance animation.

**How to avoid:** Two options:
1. Add `viewport.once = true` to StaggerItem — items only animate once on first viewport entry, never again. Filter change won't re-trigger. Trade-off: items that scroll out and back in won't re-animate (minor UX difference).
2. Keep `viewport.once = false` and accept the brief flash. Given the instant-swap decision (no animation on filter), option 1 is cleaner.

**Recommendation:** The existing StaggerItem uses `viewport.once = false`. For Phase 5, the portfolio grid should pass the StaggerItem items with `key={item.id}` (which Phase 3 already does) — React reconciles by key, so items that remain visible across filter changes keep their DOM node and don't re-mount. Only newly appearing items will animate in. This is acceptable behavior.

**Warning signs:** All portfolio cards flash visible (opacity: 0 → 1) when clicking a filter pill.

### Pitfall 2: 'use client' Infection via Import Chain

**What goes wrong:** If ServicesSection imports PortfolioSection (or any 'use client' file at the module level), it may incorrectly become a client component.

**Why it happens:** In Next.js App Router, the `'use client'` directive propagates through the import graph — anything imported by a 'use client' file is treated as client code.

**How to avoid:** Keep section files independent. `page.tsx` imports all five sections independently. No section file imports another section file. `PortfolioSection` is the only `'use client'` file; its boundary is self-contained.

**Warning signs:** Build warnings about unexpected client boundaries, or Server Component features (e.g., async data fetching) breaking.

### Pitfall 3: Portfolio "All" Pill Not in PORTFOLIO_CATEGORIES

**What goes wrong:** `PORTFOLIO_CATEGORIES` in constants.ts contains only the real category strings — `['AI/ML', 'Cloud Infrastructure', ...]` without `'All'`. Spreading it directly as the pill list omits the default state.

**Why it happens:** `'All'` is a filter-only UI concept, not a data category. Constants correctly omit it.

**How to avoid:** The ActiveFilter type is `PortfolioCategory | 'All'`. The pill list is `['All', ...PORTFOLIO_CATEGORIES]` — prepend 'All' at the component level, not in constants.ts.

**Warning signs:** Filter pills don't include an "All" option; clicking any category hides the others but there's no way to reset.

### Pitfall 4: Security Category Has No Portfolio Item

**What goes wrong:** `PORTFOLIO_CATEGORIES` includes `'Security'` but `PORTFOLIO_ITEMS` has no item with `category: 'Security'` (only 4 items: AI/ML, Cloud Infrastructure, Custom Software, Data Engineering). Clicking the Security pill shows zero cards — an empty grid.

**Why it happens:** STATE.md notes: "PORTFOLIO_ITEMS: 4 items (only 4, not 5 — no Security category item)." This is a known data gap — placeholder content only.

**How to avoid:** This is expected behavior for placeholder data. The filter correctly returns an empty array for Security. The section should render gracefully with an empty grid (no explicit empty state message needed per phase scope). Document this as a known placeholder data state so the planner doesn't create a task to add a Security item (that's content, not code).

**Warning signs:** Developer wonders why Security filter shows nothing — it's intentional.

### Pitfall 5: SectionWrapper Applies py-[--section-padding-y] — Don't Double-Apply

**What goes wrong:** SectionWrapper already applies `py-[--section-padding-y] px-[--section-padding-x]` to the outer `<section>` element. If the inner content div also applies section-level padding, vertical spacing doubles.

**Why it happens:** The Phase 3 page.tsx inner divs add `py-[--section-padding-y]` on the inner div (in addition to SectionWrapper's outer padding). This was intentional in Phase 3 as a layout validation artifact, but should be cleaned up in Phase 5.

**Read the actual SectionWrapper code:** `SectionWrapper` adds `py-[--section-padding-y] px-[--section-padding-x]` on `<section>`. The inner `<div className="relative mx-auto max-w-7xl px-[--section-padding-x] py-[--section-padding-y]">` from Phase 3 also adds both. This means horizontal padding is doubled (section + inner div both apply it) in the Phase 3 draft.

**How to avoid:** In Phase 5 section components, the inner `max-w-7xl` content div should NOT re-apply `py-[--section-padding-y]` or `px-[--section-padding-x]`. SectionWrapper already handles the outer padding. The inner div only needs `relative mx-auto max-w-7xl` for content constraints and GridPattern positioning context.

**Exception — Hero:** Hero section explicitly needs `min-h-screen` on the inner div for full-viewport centering, and uses `flex items-center justify-center px-[--section-padding-x]` — this is intentional for the centered hero layout (SectionWrapper sets the outer section min-h-screen, inner div also needs it for flex centering to work).

**Warning signs:** Sections have excessive top/bottom whitespace; consistent test is to inspect the outer `<section>` vs inner `<div>` padding in DevTools.

### Pitfall 6: GridPattern Needs Parent to Have `position: relative`

**What goes wrong:** GridPattern uses `absolute inset-0` positioning. If its parent doesn't have `position: relative`, GridPattern overflows the document or covers other elements.

**Why it happens:** SectionWrapper does NOT add `position: relative` (documented in STATE.md). GridPattern must always be inside a `relative` container.

**How to avoid:** The inner content `<div>` of each section must have `relative` class. Every Phase 3 draft already has `className="relative ..."` on the inner div. Carry this through to Phase 5 section files.

**Warning signs:** GridPattern SVG fills the entire page instead of its section; visible section backgrounds bleed into adjacent sections.

### Pitfall 7: ContactForm max-w-lg Must Fit Within Contact Section Layout

**What goes wrong:** `ContactForm` renders with `max-w-lg` (32rem) by default. In the recommended two-column layout, the right column may be narrower than `max-w-lg` at some breakpoints, causing the form to overflow or appear oddly constrained.

**Why it happens:** `max-w-lg` on the form is absolute; the grid column is percentage-based. At narrow viewport widths above lg breakpoint (1024px), the right column is `50vw - padding`, which may be less than `max-w-lg`.

**How to avoid:** In the two-column layout, set `max-w-none` or `w-full` on the ContactForm wrapper div to let the form fill its grid column naturally. The `max-w-lg` in ContactForm.tsx is a standalone default that works well in stacked layouts but should be overridden at section level.

**Warning signs:** Form appears narrower than its column; right-side whitespace on the form.

---

## Code Examples

### Portfolio Filter State (Complete Pattern)

```typescript
// Source: React 19 useState hook pattern + PORTFOLIO_CATEGORIES from lib/constants.ts
// components/sections/PortfolioSection.tsx

'use client';

import { useState } from 'react';
import type { PortfolioCategory } from '@/lib/types';
import { PORTFOLIO_CATEGORIES, PORTFOLIO_ITEMS } from '@/lib/constants';

type ActiveFilter = PortfolioCategory | 'All';

// Inside PortfolioSection component:
const [activeCategory, setActiveCategory] = useState<ActiveFilter>('All');

const visibleItems =
  activeCategory === 'All'
    ? PORTFOLIO_ITEMS
    : PORTFOLIO_ITEMS.filter((item) => item.category === activeCategory);

// Pill row:
const allFilters: ActiveFilter[] = ['All', ...PORTFOLIO_CATEGORIES];
```

### Geometric Map Pin SVG (Contact Section)

```typescript
// Source: SVG path specification — hand-crafted
// 12x16 viewBox: taller than wide (pin shape)
// Two paths: outer teardrop shape + inner circle center dot
// stroke="currentColor" — adapts to dark section text color automatically

<svg
  width="12"
  height="16"
  viewBox="0 0 12 16"
  fill="none"
  stroke="currentColor"
  strokeWidth="1.2"
  strokeLinecap="round"
  strokeLinejoin="round"
  aria-hidden="true"
>
  {/* Outer pin — teardrop: circle top, pointed bottom */}
  <path d="M6 1 C3.24 1 1 3.24 1 6 C1 9.5 6 15 6 15 C6 15 11 9.5 11 6 C11 3.24 8.76 1 6 1 Z" />
  {/* Inner dot — center marker */}
  <circle cx="6" cy="6" r="1.5" fill="currentColor" stroke="none" />
</svg>
```

### Section Heading Accent Pattern (Recommended)

```typescript
// Source: Established design vocabulary — CSS lines + small square dot
// Works in both dark and light sections via currentColor / opacity modifiers
// No new SVG component needed — uses Tailwind spans

<div className="flex items-center justify-center gap-3 mb-6" aria-hidden="true">
  <span className="block h-px w-8 bg-current opacity-25" />
  <span className="block w-1.5 h-1.5 border border-current opacity-50 rotate-45" />
  <span className="block h-px w-8 bg-current opacity-25" />
</div>
<h2 className="font-display text-[length:--text-section] font-bold text-center">
  {heading}
</h2>
<p className="font-body text-center mt-4 max-w-2xl mx-auto text-base opacity-70">
  {introText}
</p>
```

The diamond shape (rotated square) ties directly to the geometric vocabulary without needing a CloverAccentMini (which belongs to the TeamCard avatar only). The flanking lines create formal balance around the heading.

### Dark Section Token Reference

```typescript
// Source: app/globals.css @theme block — confirmed token names
// Dark sections: Hero, Portfolio, Contact

// Text:
// text-on-surface          #ffffff  — primary text
// text-on-surface-muted    #888888  — secondary text
// text-on-surface-subtle   #555555  — tertiary / label text

// Borders:
// border-on-surface-subtle/20   — card borders (20% opacity of #555555)
// border-on-surface-subtle/30   — form input borders

// Backgrounds:
// bg-surface               #000000
// bg-surface-raised        #0a0a0a  — card backgrounds

// Light sections: Services, Team
// text-on-surface-light         #000000
// text-on-surface-light-muted   #555555
// text-on-surface-light-subtle  #888888
// border-on-surface-light-subtle/20  — card borders
// bg-surface-light              #f5f5f5
// bg-surface-light-raised       #ffffff
```

### Pill Button Active/Inactive States

```typescript
// Source: CONTEXT.md decision — pills/chips with active border or fill treatment
// Using border treatment (active = solid border, inactive = muted border)
// No border-radius — consistent with sharp-cornered design system

// Active pill:
"px-4 py-1.5 font-body text-sm border border-on-surface text-on-surface uppercase tracking-wider"

// Inactive pill:
"px-4 py-1.5 font-body text-sm border border-on-surface-subtle/40 text-on-surface-muted uppercase tracking-wider"

// Hover state (inactive → highlight):
// Add hover:border-on-surface/60 hover:text-on-surface/80 transition-colors
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `staggerChildren` in framer-motion | Per-item manual delay in StaggerItem | framer-motion 12 | Already solved in Phase 3 — StaggerItem with `index` and `columns` props |
| DOM-level filtering with CSS `display:none` | Array filter on React state | Modern React pattern | Type-safe, SSR-safe, no DOM pollution |
| Making all sections `'use client'` | Server Components + selective `'use client'` boundaries | Next.js App Router | Better performance; only PortfolioSection needs client |
| SectionWrapper providing `position: relative` | Consumer sections add `relative` on inner div | Phase 3 decision (STATE.md) | Consumers control their stacking context |
| `py-[--section-padding-y]` duplicated on inner div | SectionWrapper owns outer padding; inner div is `relative mx-auto max-w-7xl` only | Phase 5 cleanup | Removes double padding from Phase 3 validation artifacts |

**Deprecated/outdated:**
- Phase 3 inline section functions in `page.tsx`: These are validation artifacts. Phase 5 replaces them with proper component files in `components/sections/`. The `page.tsx` placeholder section functions should not be modified — they should be deleted and replaced.
- `HoverLift` as a section-level wrapper: In Phase 3, service cards used `<HoverLift><div ...></div></HoverLift>`. In Phase 5, `ServiceCard` already includes HoverLift internally — never double-wrap.

---

## Open Questions

1. **SectionWrapper double padding — should it be fixed?**
   - What we know: SectionWrapper applies `py-[--section-padding-y] px-[--section-padding-x]` to the outer `<section>`. The Phase 3 inner divs also applied both, creating double horizontal padding (though the `max-w-7xl` constrained the width, mitigating horizontal doubling).
   - What's unclear: Whether the Phase 3 layout is intentionally double-padded (for a wider gutter feel) or accidentally doubled.
   - Recommendation: In Phase 5 section components, the inner div should NOT re-apply `px-[--section-padding-x]` since SectionWrapper already handles it. The `max-w-7xl` constraint on the inner div is still appropriate. Planner should explicitly include "remove duplicate px from inner div" as a task note.

2. **Portfolio empty state for Security category**
   - What we know: Security category has no items in `PORTFOLIO_ITEMS`. Clicking Security pill shows empty grid.
   - What's unclear: Whether the phase should add a placeholder Security item, or leave the empty grid as-is.
   - Recommendation: Leave as-is. The task is a section build, not content creation. The empty grid is an honest representation of placeholder data. No empty state message is needed in this phase.

3. **StaggerItem `viewport.once` for portfolio grid**
   - What we know: Current StaggerItem uses `once: false`. Filter changes cause re-indexing and potential re-animation.
   - What's unclear: Whether the brief re-animation flash on filter change is acceptable UX.
   - Recommendation: Since filter is instant-swap (per decision), items that appear after filtering will animate in once from the initial position. This is fine. Key reconciliation by `item.id` ensures already-visible items don't re-mount. No change to StaggerItem needed — the phase 3 component is correct as-is.

4. **Intro copy content for Services, Team, Contact sections**
   - What we know: CONTEXT.md gives Claude discretion over the exact wording. Copy must be "technical & precise tone, short, direct, engineering-flavored."
   - What's unclear: Whether the planner should include draft copy in the plan or leave it to the implementor.
   - Recommendation: Include draft copy in the plan as concrete suggestions. This avoids the implementor stalling on copy decisions. Suggested drafts:
     - Services: "We architect and deliver at the intersection of infrastructure, AI, and custom software — engineered for production, not proof-of-concept."
     - Team: "Four engineers with deep expertise across AI systems, cloud infrastructure, and custom software development."
     - Contact: "Ashburn, Virginia. Available for distributed teams worldwide."
     - Portfolio: "Representative capability areas. Client details available under NDA."

---

## Sources

### Primary (HIGH confidence)

- `C:\Users\sscha\OneDrive\Desktop\clover\app\page.tsx` — Phase 3 validation drafts for all five sections; template for Phase 5 extraction
- `C:\Users\sscha\OneDrive\Desktop\clover\app\globals.css` — All design tokens, utility class names, `.section-dark`, `.section-light`, `.link-underline`, `.hero-pattern-draw`
- `C:\Users\sscha\OneDrive\Desktop\clover\lib\constants.ts` — SERVICES (5 items), PORTFOLIO_CATEGORIES (5), PORTFOLIO_ITEMS (4, no Security item), TEAM_MEMBERS (4 members), CONTACT (email + location)
- `C:\Users\sscha\OneDrive\Desktop\clover\lib\types.ts` — PortfolioCategory union type, PortfolioItem, TeamMember, ContactInfo interfaces
- `C:\Users\sscha\OneDrive\Desktop\clover\components\ui\SectionWrapper.tsx` — Confirmed: adds `py-[--section-padding-y] px-[--section-padding-x]` to outer section, does NOT add `position: relative`
- `C:\Users\sscha\OneDrive\Desktop\clover\components\ui\GridPattern.tsx` — Confirmed: uses `absolute inset-0` — parent must have `position: relative`
- `C:\Users\sscha\OneDrive\Desktop\clover\components\ui\GeometryAccent.tsx` — Confirmed: uses `absolute inset-0` — parent must have `position: relative`
- `C:\Users\sscha\OneDrive\Desktop\clover\components\ui\FadeInOnScroll.tsx` — Confirmed: `'use client'` with `useReducedMotion`; `viewport.once = false`; safe to use in Server Component parent files
- `C:\Users\sscha\OneDrive\Desktop\clover\components\ui\StaggerChildren.tsx` — Confirmed: `'use client'`; `viewport.once = false`; diagonal cascade by `(row + col) * staggerInterval`
- `C:\Users\sscha\OneDrive\Desktop\clover\components\ui\HoverLift.tsx` — Confirmed: `whileHover` scale 1.025; `willChange: 'transform'`; built into card atoms
- `C:\Users\sscha\OneDrive\Desktop\clover\components\cards\ServiceCard.tsx` — Confirmed: HoverLift internal; uses `border-on-surface-light-subtle/20` (light section tokens); `p-[--card-padding]`
- `C:\Users\sscha\OneDrive\Desktop\clover\components\cards\PortfolioCard.tsx` — Confirmed: `data-category={item.category}` attribute present; `article` element; dark theme tokens
- `C:\Users\sscha\OneDrive\Desktop\clover\components\cards\TeamCard.tsx` — Confirmed: HoverLift internal; MonogramAvatar with CloverAccentMini; social links inline with role
- `C:\Users\sscha\OneDrive\Desktop\clover\components\cards\ContactForm.tsx` — Confirmed: `max-w-lg`; readOnly inputs; disabled submit with "Coming Soon"; `onSubmit` prevents default
- `C:\Users\sscha\OneDrive\Desktop\clover\.planning\phases\05-section-builds\05-CONTEXT.md` — Locked decisions: Hero visual hierarchy, Portfolio filter (instant pill swap), Contact layout (Claude's discretion), Section heading pattern (centered + geometric accent)
- `C:\Users\sscha\OneDrive\Desktop\clover\.planning\STATE.md` — SectionWrapper position:relative absence, staggerChildren deprecation, HoverLift in card atoms, dark/light alternation order
- `C:\Users\sscha\OneDrive\Desktop\clover\package.json` — Confirmed versions: next 16.1.6, react 19.2.3, framer-motion 12.34.3, typescript ^5, tailwindcss ^4

### Secondary (MEDIUM confidence)

- `C:\Users\sscha\OneDrive\Desktop\clover\.planning\phases\04-card-components\04-RESEARCH.md` — Prior research confirming card atom design decisions; data-category pattern; ContactForm readOnly vs disabled rationale
- Next.js App Router documentation (training knowledge, HIGH confidence for this version-stable feature): Server Components can use 'use client' child components; client boundary is at the leaf, not the parent

### Tertiary (LOW confidence)

- None — all findings are sourced directly from the project codebase and established architectural decisions. No unverified WebSearch claims.

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — no new packages; all verified from package.json
- Architecture (section structure, Server vs client): HIGH — based on reading actual component files and Next.js App Router model
- Portfolio filter pattern: HIGH — `useState` array filter is standard React; instant swap per locked decision
- Hero section: HIGH — nearly a direct extraction from Phase 3 draft; no structural changes
- Section heading accent: MEDIUM — recommendation is derived from established design vocabulary; exact form is Claude's discretion (planner should decide)
- Contact section layout: MEDIUM — two-column recommendation is architecturally sound but discretionary; planner should commit to one layout
- Intro copy wording: MEDIUM — draft suggestions provided but these are content decisions

**Research date:** 2026-02-23
**Valid until:** 2026-03-23 (stack is frozen; all architectural decisions locked)
