---
phase: 03-visual-primitives-animation
plan: 03
subsystem: ui
tags: [framer-motion, hover, css, animation, reduced-motion, grid-pattern, section-alternation]

# Dependency graph
requires:
  - phase: 03-visual-primitives-animation/03-01
    provides: GridPattern and GeometryAccent components, hero-pattern-draw keyframes in globals.css
  - phase: 03-visual-primitives-animation/03-02
    provides: FadeInOnScroll and StaggerChildren/StaggerItem components for section wiring
provides:
  - HoverLift client component — card scale micro-interaction wrapper via framer-motion whileHover (1.025x, 120ms)
  - .link-underline CSS utility class — ::after pseudo-element underline draw effect via scaleX transform
  - page.tsx with all 5 sections wired: GridPattern overlays, GeometryAccent hero, FadeInOnScroll, StaggerChildren, HoverLift, link-underline
  - GeometryAccent modified to render four-leaf clover pattern (brand identity for Clover Labs)
affects:
  - phase-04-fractal-patterns (HoverLift and link-underline available for card/link composition)
  - phase-05-content-sections (all primitives validated and ready for real content composition)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "HoverLift: whileHover with willChange:'transform' GPU hint — promotes layer before interaction begins"
    - "CSS ::after pseudo-element for text decoration animation — avoids framer-motion overhead for simple draw effects"
    - "prefers-reduced-motion: media query in globals.css for CSS utility classes (complements useReducedMotion hook for JS components)"
    - "currentColor for underline — adapts to both dark and light section text colors automatically"

key-files:
  created:
    - components/ui/HoverLift.tsx
  modified:
    - app/globals.css
    - app/page.tsx
    - components/ui/GeometryAccent.tsx

key-decisions:
  - "GeometryAccent hero pattern changed from fractal grid to four-leaf clover — brand identity for Clover Labs (user-requested during checkpoint)"
  - "HoverLift uses willChange:'transform' hint for GPU compositing on whileHover — framer-motion may not auto-promote non-initially-animated elements"
  - "link-underline uses CSS ::after pseudo-element (not framer-motion) — simpler for text decoration, no JS overhead"

patterns-established:
  - "HoverLift wrapper pattern: plain div fallback for reduced-motion, motion.div with whileHover for animation — same guard pattern as FadeInOnScroll/StaggerItem"
  - "CSS utility classes for simple hover effects: ::after pseudo-element + scaleX transform, prefers-reduced-motion: reduce disables transition only"

# Metrics
duration: 5min
completed: 2026-02-23
---

# Phase 3 Plan 03: HoverLift and Section Validation Summary

**HoverLift framer-motion card-scale wrapper, .link-underline CSS draw utility, all 5 sections wired with GridPattern/GeometryAccent/FadeInOnScroll/StaggerChildren — full Phase 3 visual vocabulary validated; GeometryAccent four-leaf clover pattern adopted as Clover Labs brand mark**

## Performance

- **Duration:** ~5 min
- **Started:** 2026-02-23T00:00:00Z
- **Completed:** 2026-02-23T00:05:00Z
- **Tasks:** 3 (including human-verify checkpoint)
- **Files modified:** 4

## Accomplishments

- HoverLift: 1.025x scale on hover with 120ms ease-out transition, GPU-hinted via willChange:'transform', fully absent for reduced-motion users
- .link-underline: CSS ::after pseudo-element draws from left on hover, retracts on leave, instant for reduced-motion, uses currentColor for dark/light adaptability
- All 5 sections (Hero, Services, Portfolio, Team, Contact) wired with GridPattern overlays, FadeInOnScroll wrappers, and example HoverLift/link-underline — dark/light alternation visually validated
- GeometryAccent hero pattern updated from fractal grid to four-leaf clover — brand identity aligned with project name "Clover Labs"

## Task Commits

Each task was committed atomically:

1. **Task 1: Create HoverLift wrapper and link-underline CSS utility** - `60195d9` (feat)
2. **Task 2: Wire GridPattern into all 5 sections and validate dark/light alternation** - `106d96e` (feat)
3. **Post-checkpoint: Replace fractal grid with four-leaf clover hero pattern** - `fb52623` (feat)

**Plan metadata:** _(docs commit follows)_

## Files Created/Modified

- `components/ui/HoverLift.tsx` — Card hover scale micro-interaction: 'use client', useReducedMotion guard, motion.div whileHover {scale:1.025}, 120ms ease-out transition, willChange:'transform' GPU hint
- `app/globals.css` — Added .link-underline class: ::after pseudo-element, scaleX(0→1) draw from left, currentColor, prefers-reduced-motion: reduce disables transition
- `app/page.tsx` — All 5 sections wired: GeometryAccent on hero, GridPattern on all sections, FadeInOnScroll on content, StaggerChildren/StaggerItem on Portfolio grid, HoverLift on service/portfolio cards, link-underline on CTA links
- `components/ui/GeometryAccent.tsx` — SVG pattern replaced from fractal grid to four-leaf clover (Clover Labs brand mark, user-requested during checkpoint review)

## Decisions Made

- **Four-leaf clover brand mark:** During checkpoint visual review, user requested the fractal grid pattern in GeometryAccent be replaced with a four-leaf clover pattern to align with the "Clover Labs" brand identity. This is a permanent brand decision.
- **HoverLift willChange:'transform':** Added GPU compositing hint because framer-motion whileHover elements are not initially animated — without the hint, the browser may not promote the layer ahead of the interaction, causing a first-hover jank on some GPUs.
- **CSS for link-underline (not framer-motion):** A CSS ::after pseudo-element with scaleX transform is the canonical approach for text underline draw effects. Framer-motion adds JS overhead for a decoration that CSS handles natively and accessibly.

## Deviations from Plan

### User-Requested Modifications

**1. GeometryAccent: four-leaf clover replaces fractal grid**
- **Found during:** Human verification checkpoint (Task 3 review)
- **Request:** User viewed the hero pattern and requested it be changed from a fractal/recursive grid to a four-leaf clover shape — brand identity for Clover Labs
- **Fix:** Rewrote the SVG path data in GeometryAccent.tsx to render a four-leaf clover using bezier curves
- **Files modified:** `components/ui/GeometryAccent.tsx`
- **Commit:** `fb52623`

---

**Total deviations:** 1 user-requested modification (brand identity change)
**Impact on plan:** Pattern swap was additive and isolated to GeometryAccent.tsx. All other plan deliverables completed as specified.

## Issues Encountered

None during automated tasks — TypeScript compiled cleanly, component wiring succeeded on first pass. The only modification was the user-requested clover pattern change during checkpoint review.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Full Phase 3 visual primitive library is complete and validated: GridPattern, GeometryAccent, FadeInOnScroll, StaggerChildren/StaggerItem, HoverLift, .link-underline
- All components follow the established client-wrapper pattern with useReducedMotion guards
- Four-leaf clover brand mark is committed and ready for use across the site
- Dark/light section alternation rhythm is visually validated across all 5 sections
- Phase 4 (fractal patterns / card components) can compose HoverLift and link-underline directly
- Phase 5 (content sections) can use the validated page.tsx structure as a reference implementation
- No new blockers introduced

---
*Phase: 03-visual-primitives-animation*
*Completed: 2026-02-23*
