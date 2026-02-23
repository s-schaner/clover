# Roadmap: Clover Labs LLC Website

## Overview

The Clover Labs skeleton website is built in a strict dependency-driven order: design tokens and data contracts first, then layout shell and navigation, then visual primitives and animation vocabulary, then UI card atoms, then the five content sections, and finally assembly and polish. Each phase unblocks the next. The result is a pure black-and-white, geometric fractal-accented Next.js site that radiates engineering credibility — a resolved design language ready to evolve into the mature production site.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

- [x] **Phase 1: Foundation & Design System** - Scaffold Next.js, define all design tokens, type interfaces, and content constants
- [x] **Phase 2: Shell & Navigation** - Build sticky navigation, scroll-spy, mobile menu, section wrapper, and layout skeleton
- [x] **Phase 3: Visual Primitives & Animation** - Create geometric fractal patterns, geometry accents, and motion wrapper components
- [x] **Phase 4: Card Components** - Build all UI card atoms — service, portfolio, team, contact form, fractal hero element
- [ ] **Phase 5: Section Builds** - Implement all five content sections (Hero, Services, Portfolio, Team, Contact)
- [ ] **Phase 6: Assembly, Polish & Documentation** - Assemble page, verify responsiveness, tune section transitions, write design system docs

## Phase Details

### Phase 1: Foundation & Design System
**Goal**: The project compiles and the entire design language is defined — every color token, type scale value, spacing rhythm, and data shape is declared before any component is written
**Depends on**: Nothing (first phase)
**Requirements**: FNDN-01, FNDN-02, FNDN-03, FNDN-04, FNDN-05, FNDN-06
**Success Criteria** (what must be TRUE):
  1. `npm run dev` starts without errors and renders a blank Next.js App Router page
  2. The B&W color token system (surface, on-surface, border, muted values) is available as Tailwind utilities and CSS custom properties — no raw hex values anywhere in component code
  3. Space Grotesk, Inter, and JetBrains Mono load via next/font with zero layout shift on refresh
  4. All static content (section IDs, nav links, team names, service copy, capability categories) lives in `lib/constants.ts` and all data shapes are typed in `lib/types.ts`
**Plans**: 3 plans

Plans:
- [x] 01-01-PLAN.md — Scaffold Next.js 16 with TypeScript strict mode, App Router, Tailwind CSS v4, and supporting deps (Wave 1)
- [x] 01-02-PLAN.md — Define B&W design token system in globals.css, configure next/font loading in layout.tsx (Wave 2)
- [x] 01-03-PLAN.md — Define data contracts: lib/types.ts interfaces and lib/constants.ts content constants (Wave 2)

---

### Phase 2: Shell & Navigation
**Goal**: The site has a functioning navigation layer — sticky header with anchor links and scroll-spy, a mobile hamburger menu, and a section wrapper that every content section will use
**Depends on**: Phase 1
**Requirements**: NAV-01, NAV-02, NAV-03, NAV-04, NAV-05, LAYT-01, LAYT-03
**Success Criteria** (what must be TRUE):
  1. The "Clover Labs" wordmark and anchor links (Hero, Services, Portfolio, Team, Contact) are visible in a sticky header that remains fixed during scroll
  2. Clicking any nav anchor link smooth-scrolls to the correct section position with proper offset for the sticky header height
  3. The nav link for the currently visible section is highlighted — the active state updates automatically as the user scrolls
  4. On mobile, a hamburger icon opens a full-screen overlay menu; focus is trapped inside the overlay; Escape or a close tap dismisses it
**Plans**: 2 plans

Plans:
- [x] 02-01-PLAN.md — Build SectionWrapper component and wire placeholder sections into page.tsx (Wave 1)
- [x] 02-02-PLAN.md — Build Navigation component with scroll-spy, mobile hamburger overlay, focus trap, and wire into layout.tsx (Wave 2)

---

### Phase 3: Visual Primitives & Animation
**Goal**: The geometric fractal visual vocabulary and the complete animation wrapper library are built and validated in isolation — the opacity budget for patterns is locked, and animation behaviors are correct before being applied to any section
**Depends on**: Phase 1
**Requirements**: VISL-01, VISL-02, VISL-03, VISL-04, VISL-05, VISL-06, LAYT-04
**Success Criteria** (what must be TRUE):
  1. The geometric fractal SVG pattern component renders at correct opacity (under 8-10% on dark backgrounds, under 5% on light) and reads as texture rather than graphic
  2. Scroll-triggered fade-in animations activate on viewport entry — not on page mount — and are completely absent when `prefers-reduced-motion: reduce` is set
  3. Card grid stagger animations play in sequence rather than simultaneously when a grid enters the viewport
  4. Interactive elements visually lift or scale on hover via consistent micro-interaction, and the dark/light section alternation pattern (dark-light-dark-light rhythm) is validated as providing sufficient value contrast without color
**Plans**: 3 plans

Plans:
- [x] 03-01-PLAN.md — Build GridPattern recursive fractal SVG and GeometryAccent hero draw animation components (Wave 1)
- [x] 03-02-PLAN.md — Build FadeInOnScroll and StaggerChildren diagonal cascade motion wrappers (Wave 1)
- [x] 03-03-PLAN.md — Build HoverLift wrapper, link-underline CSS, and validate section alternation with all primitives (Wave 2)

---

### Phase 4: Card Components
**Goal**: All UI card atoms are built, typed, and data-placeholder-attributed so that section components can be assembled by composing pre-built cards rather than building layout and content simultaneously
**Depends on**: Phase 3
**Requirements**: HERO-03, SERV-03, PORT-02, TEAM-02, CONT-01
**Success Criteria** (what must be TRUE):
  1. The animated geometric fractal hero element renders as an SVG-based visual component — the signature background visual that will anchor the hero section
  2. Service capability cards display a geometric icon placeholder alongside a title and description field
  3. Portfolio project cards render with the correct anatomy: title, project type, outcome metric field, and technology tag list — all driven by typed props
  4. Team profile cards show a geometric or initial-based avatar placeholder (not a stock photo) alongside name, role, and social link icons
  5. The contact form renders with name, email, and message fields; the submit button is visually disabled with a clear "Coming Soon" label
**Plans**: 3 plans

Plans:
- [x] 04-01-PLAN.md — Build ServiceCard with geometric SVG icon system, verify HERO-03 satisfied by GeometryAccent (Wave 1)
- [x] 04-02-PLAN.md — Build PortfolioCard with full project anatomy and data-category filter readiness (Wave 1)
- [x] 04-03-PLAN.md — Build TeamCard with SVG monogram avatar (clover accent) and ContactForm with disabled submit (Wave 1)

---

### Phase 5: Section Builds
**Goal**: All five content sections exist as fully assembled, responsive, content-populated components — the site is functionally complete and viewable, with real names, real capability descriptions, and real placeholder structure throughout
**Depends on**: Phase 2, Phase 4
**Requirements**: HERO-01, HERO-02, SERV-01, SERV-02, PORT-01, PORT-03, TEAM-01, TEAM-03, TEAM-04, CONT-02, CONT-03
**Success Criteria** (what must be TRUE):
  1. The hero section fills the full viewport height and displays a bold, elite-engineering positioning tagline with the animated geometric fractal background as the signature visual moment
  2. The services section lists 3-6 capability areas with precise technical language (not marketing copy) and geometric icon indicators per card
  3. The portfolio section shows capability category groupings (e.g., AI/ML, Cloud Infrastructure, Custom Software) with placeholder project cards underneath each, and clicking a category filters the visible cards
  4. The team section shows profile cards for Mike Wong, Matt Drapp, Peter Kwon, and Stefan Schaner — each with geometric avatar, placeholder role title, and social link icons (placeholder hrefs)
  5. The contact section displays a clickable mailto email link, an Ashburn, Virginia location indicator with minimal pin graphic, and the disabled contact form
**Plans**: 4 plans

Plans:
- [ ] 05-01-PLAN.md — Build HeroSection and ServicesSection components (Wave 1)
- [ ] 05-02-PLAN.md — Build PortfolioSection with category filter pills (Wave 1)
- [ ] 05-03-PLAN.md — Build TeamSection and ContactSection components (Wave 1)
- [ ] 05-04-PLAN.md — Wire page.tsx with section imports and verify build (Wave 2)

---

### Phase 6: Assembly, Polish & Documentation
**Goal**: The page is assembled into a single scroll experience, all section transitions are polished, responsiveness is verified across all breakpoints, and design system documentation is written so the skeleton can be handed off or evolved
**Depends on**: Phase 5
**Requirements**: LAYT-02
**Success Criteria** (what must be TRUE):
  1. The site renders correctly at 375px (mobile), 768px (tablet), and 1440px+ (desktop) — no horizontal overflow, no broken layouts, no illegible text
  2. Scrolling through the full page produces a visually coherent dark-light-dark-light section rhythm with clean geometric transitions between sections
  3. A Lighthouse performance audit returns a score of 90+ with no render-blocking resources and correct next/font behavior
**Plans**: TBD

Plans:
- [ ] 06-01: Assemble app/page.tsx — compose all sections in correct render order with section alternation
- [ ] 06-02: Responsive audit across 375px, 768px, and 1440px — fix any breakpoint failures
- [ ] 06-03: Performance audit and design system documentation (DESIGN_SYSTEM.md, COMPONENTS.md)

---

## Progress

**Execution Order:**
Phases execute in numeric order: 1 -> 2 -> 3 -> 4 -> 5 -> 6
(Note: Phase 2 and Phase 3 have no inter-dependency — they can run in parallel if desired)

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation & Design System | 3/3 | Complete | 2026-02-22 |
| 2. Shell & Navigation | 2/2 | Complete | 2026-02-22 |
| 3. Visual Primitives & Animation | 3/3 | Complete | 2026-02-23 |
| 4. Card Components | 3/3 | Complete | 2026-02-23 |
| 5. Section Builds | 0/4 | Not started | - |
| 6. Assembly, Polish & Documentation | 0/3 | Not started | - |

---
*Roadmap created: 2026-02-22*
*Last updated: 2026-02-23 after Phase 4 execution complete*
