---
phase: 03-visual-primitives-animation
plan: 02
subsystem: ui
tags: [framer-motion, animation, scroll, viewport, reduced-motion, stagger]

# Dependency graph
requires:
  - phase: 01-foundation-design-system
    provides: CSS design tokens (--ease-premium, --duration-slow) that animation values replicate
provides:
  - FadeInOnScroll client component — scroll-triggered fade-in wrapper via framer-motion whileInView
  - StaggerChildren client component — plain grid wrapper for semantic clarity
  - StaggerItem client component — per-item diagonal cascade animation with manual delay computation
affects:
  - phase-05-content-sections (all content sections will compose FadeInOnScroll and StaggerChildren/StaggerItem)
  - phase-04-fractal-patterns (may use FadeInOnScroll for pattern reveal)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "useReducedMotion guard: always call hook, branch to plain element when truthy — no animation, no opacity flash"
    - "whileInView for scroll-trigger: self-contained per component, no IntersectionObserver boilerplate"
    - "viewport.once: false — scroll animations always replay on viewport re-entry"
    - "Diagonal stagger via manual (row + col) * interval delay — replaces deprecated staggerChildren"
    - "GPU-composited only: animate opacity and transform exclusively, never layout properties"

key-files:
  created:
    - components/ui/FadeInOnScroll.tsx
    - components/ui/StaggerChildren.tsx
  modified: []

key-decisions:
  - "framer-motion 12 staggerChildren is deprecated — use manual (row + col) * staggerInterval delay per StaggerItem for diagonal cascade"
  - "StaggerChildren is a plain div (no framer-motion) — animation entirely in StaggerItem, each self-managing viewport tracking"
  - "useReducedMotion returns boolean | null (null on SSR) — truthy check covers both true and null safely"
  - "viewport.amount: 0.1 for StaggerItem (smaller elements) vs 0.2 for FadeInOnScroll (section-level elements)"

patterns-established:
  - "Client animation wrapper pattern: 'use client', useReducedMotion guard, motion.div with whileInView"
  - "Diagonal grid cascade: StaggerChildren + StaggerItem pair, index + columns props computed to row/col internally"

# Metrics
duration: 6min
completed: 2026-02-22
---

# Phase 3 Plan 02: Scroll Animation Wrappers Summary

**Framer-motion whileInView wrappers for bottom-up fade (FadeInOnScroll) and diagonal grid cascade (StaggerChildren/StaggerItem) with full reduced-motion accessibility and replay-on-re-entry behavior**

## Performance

- **Duration:** ~6 min
- **Started:** 2026-02-22T00:00:00Z
- **Completed:** 2026-02-22T00:06:00Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments

- FadeInOnScroll: 40px bottom-up fade with 600ms --ease-premium timing, replays every viewport re-entry
- StaggerChildren/StaggerItem: diagonal top-left cascade via (row + col) * 0.08s delay, no deprecated API
- Both components fully absent for prefers-reduced-motion users — content renders at final state immediately

## Task Commits

Each task was committed atomically:

1. **Task 1: Create FadeInOnScroll motion wrapper component** - `d703d11` (feat)
2. **Task 2: Create StaggerChildren and StaggerItem diagonal cascade components** - `cd565c1` (feat)

**Plan metadata:** _(docs commit follows)_

## Files Created/Modified

- `components/ui/FadeInOnScroll.tsx` — Scroll-triggered fade-in wrapper: opacity 0→1, y 40→0, whileInView, once:false, useReducedMotion guard
- `components/ui/StaggerChildren.tsx` — Grid wrapper (StaggerChildren plain div) + animated item (StaggerItem with diagonal delay computation)

## Decisions Made

- **framer-motion 12 staggerChildren deprecated:** The plan noted this and we confirmed it. Manual `(row + col) * staggerInterval` delay is the correct framer-motion 12 pattern for diagonal cascades. `stagger()` from motion-dom only supports 1D ordering.
- **StaggerChildren as plain div:** No framer-motion in the wrapper — all animation in StaggerItem. Each item independently tracks viewport via its own `whileInView`. This avoids parent-child stagger propagation issues.
- **useReducedMotion null handling:** Hook returns `boolean | null` (null during SSR). Truthy check (`if (shouldReduceMotion)`) handles both `true` and any future null case safely.
- **viewport amount thresholds:** 0.2 for FadeInOnScroll (section-level, larger elements), 0.1 for StaggerItem (individual cards are smaller — lower threshold prevents flickering at viewport edge).

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None — both components compiled cleanly on first pass. TypeScript strict mode satisfied with zero errors.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- FadeInOnScroll and StaggerChildren/StaggerItem are ready for composition in Phase 5 content sections
- Both components follow the established client-wrapper pattern and can be imported from `@/components/ui/`
- Animation vocabulary is consistent: bottom-up 40px travel, --ease-premium easing, replay-on-re-entry
- No blockers for Phase 3 Plan 03 (hover micro-interactions) or Phase 4 (fractal patterns)

---
*Phase: 03-visual-primitives-animation*
*Completed: 2026-02-22*
