# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-02-22)

**Core value:** Visitors immediately perceive Clover Labs as world-class engineers who solve hard problems
**Current focus:** Phase 1 — Foundation & Design System

## Current Position

Phase: 1 of 6 (Foundation & Design System)
Plan: 3 of 3 in current phase
Status: Phase complete
Last activity: 2026-02-22 — Completed 01-03-PLAN.md (TypeScript types & constants)

Progress: [███░░░░░░░] ~17% (3/18 plans estimated)

## Performance Metrics

**Velocity:**
- Total plans completed: 3
- Average duration: 8 min
- Total execution time: 0.40 hours

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 01-foundation-design-system | 3/3 | 24 min | 8 min |

**Recent Trend:**
- Last 5 plans: 01-01 (14 min), 01-02 (8 min), 01-03 (2 min)
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

### Pending Todos

None yet.

### Blockers/Concerns

- [Research]: Hero signature visual moment implementation (CSS keyframe vs. GSAP SVG stroke vs. Framer Motion) must be decided before Phase 3 begins — it determines which animation tools Phase 3 must build and validate
- [Research]: Actual company email address must be confirmed before Phase 5 Contact section build (research flagged `hello@cloverlabs.io` as placeholder only)
- [Research]: Capability taxonomy for portfolio section (AI/ML, Cloud Infrastructure, etc.) is a business decision — must be confirmed by owners before Phase 5
- [01-03]: Team member roles (titles) pending owner confirmation — placeholder "Co-Founder & Principal Engineer" used for all four members

## Session Continuity

Last session: 2026-02-22T23:58:43Z
Stopped at: Completed 01-03-PLAN.md — Phase 1 (Foundation & Design System) fully complete, all 3/3 plans done
Resume file: None
