# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-02-22)

**Core value:** Visitors immediately perceive Clover Labs as world-class engineers who solve hard problems
**Current focus:** Phase 2 — Shell & Navigation (2/3 plans complete)

## Current Position

Phase: 2 of 6 (Shell & Navigation)
Plan: 2 of 3 in current phase
Status: In progress
Last activity: 2026-02-22 — Completed 02-02-PLAN.md (Navigation component + root layout wiring)

Progress: [████░░░░░░] ~28% (5/18 plans estimated)

## Performance Metrics

**Velocity:**
- Total plans completed: 5
- Average duration: ~6 min
- Total execution time: ~0.50 hours

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 01-foundation-design-system | 3/3 | 24 min | 8 min |
| 02-shell-navigation | 2/3 | ~7 min | ~3.5 min |

**Recent Trend:**
- Last 5 plans: 01-01 (14 min), 01-02 (8 min), 01-03 (2 min), 02-01 (~5 min), 02-02 (~2 min)
- Trend: Faster

*Updated after each plan completion*

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.
Recent decisions affecting current work:

- [Init]: Next.js 15 App Router + TypeScript strict + Tailwind CSS v4 + Framer Motion 11 chosen as stack
- [Init]: Pure B&W design system — no accent colors; geometric fractal SVG patterns as sole visual texture
- [Init]: Hybrid single-page scroll now, structured for multi-page split later (lib/constants.ts anchor IDs)
- [Init]: All content hardcoded in lib/constants.ts — real owner names (Mike Wong, Matt Drapp, Peter Kwon, Stefan Schaner) from day one
- [Init]: Geometric fractal patterns (not circuit board) — opacity under 8-10% on dark, under 5% on light
- [01-01]: framer-motion 12.x installed (not 11.x as originally noted — latest stable is 12.34.3)
- [01-01]: Actual Next.js version is 16.1.6 (not 15 as originally noted in decisions) — stack upgraded
- [01-01]: lint script uses `eslint` directly (next lint removed in Next.js 16)
- [01-01]: Turbopack is now default dev bundler in Next.js 16 — no flag needed
- [01-02]: @theme inline (not @theme) required for font family var() references in Tailwind v4 — without inline, font utilities don't resolve correctly
- [01-02]: data-scroll-behavior="smooth" data attribute on html (not style prop) — avoids React 19 hydration mismatch in Next.js 16
- [01-02]: Spacing/layout tokens using clamp() go in :root (not @theme) — Tailwind cannot statically analyze clamp() for utility generation
- [01-03]: PortfolioCategory is type alias (union) not interface — correct TypeScript pattern for discriminated unions
- [01-03]: TechTag kept as interface (not string) — preserves ability to add icon/color fields without breaking PortfolioItem
- [01-03]: Team member roles set to placeholder "Co-Founder & Principal Engineer" with comment — real names committed, titles pending owner confirmation
- [02-01]: Tailwind arbitrary value syntax py-[--section-padding-y] used for CSS custom property spacing — no var() wrapper needed in class names
- [02-01]: Hero section gets min-h-screen on SectionWrapper (outer) AND inner div; all other sections only on inner div
- [02-01]: SECTION_IDS.HERO used for hero conditional check (not string literal) — maintains single source of truth
- [02-02]: Mobile overlay rendered INSIDE <header> element — inherits z-50 stacking context, avoids z-index conflicts with page content
- [02-02]: aria-current="true" (not "page") for same-page anchor links — correct ARIA pattern for in-page navigation
- [02-02]: activeSection initialized to SECTION_IDS.HERO so no nav link highlighted on page load (Hero not in NAV_LINKS)

### Pending Todos

None yet.

### Blockers/Concerns

- [Research]: Hero signature visual moment implementation (CSS keyframe vs. GSAP SVG stroke vs. Framer Motion) must be decided before Phase 3 begins — it determines which animation tools Phase 3 must build and validate
- [Research]: Actual company email address must be confirmed before Phase 5 Contact section build (research flagged `hello@cloverlabs.io` as placeholder only)
- [Research]: Capability taxonomy for portfolio section (AI/ML, Cloud Infrastructure, etc.) is a business decision — must be confirmed by owners before Phase 5
- [01-03]: Team member roles (titles) pending owner confirmation — placeholder "Co-Founder & Principal Engineer" used for all four members

## Session Continuity

Last session: 2026-02-22
Stopped at: Completed 02-02-PLAN.md — Navigation component created and wired into root layout; all Phase 2 nav criteria met
Resume file: None
