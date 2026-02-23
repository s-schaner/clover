---
phase: 03-visual-primitives-animation
plan: 01
subsystem: ui
tags: [svg, css-animation, tailwind, react, keyframes, pattern, texture]

requires:
  - phase: 01-foundation-design-system
    provides: CSS custom properties --pattern-opacity-dark, --pattern-opacity-light, --pattern-size in :root; @layer components in globals.css
  - phase: 02-shell-navigation
    provides: SectionWrapper with absolute positioning context for pattern overlays

provides:
  - GridPattern client component: 4-level recursive SVG pattern with theme-aware opacity and mask-image edge fade
  - GeometryAccent client component: hero signature draw animation using CSS keyframes on stroke-dashoffset
  - .hero-pattern-draw CSS class with @keyframes hero-draw and hero-settle in globals.css

affects:
  - 03-02: ScrollReveal and Framer Motion scroll animations — will layer over GridPattern/GeometryAccent
  - 03-03: Section content components — consume GridPattern and GeometryAccent as background primitives
  - All future section plans — GridPattern used as section background texture

tech-stack:
  added: []
  patterns:
    - "useId() per instance for SVG pattern ID uniqueness — prevents DOM ID collision on multi-instance renders"
    - "getTotalLength() read in useEffect to set --hero-path-length CSS custom property at runtime"
    - "CSS mask-image radial gradient for soft edge dissolve on SVG overlays"
    - "stroke-dashoffset animation via CSS @keyframes (not Framer Motion) — locked by CONTEXT.md"
    - "currentColor strokes throughout — no hardcoded hex colors in SVG components"

key-files:
  created:
    - components/ui/GridPattern.tsx
    - components/ui/GeometryAccent.tsx
  modified:
    - app/globals.css

key-decisions:
  - "Named exports (not default) for GridPattern and GeometryAccent — consistent with future component library pattern"
  - "SVG path IDs prefixed with sanitized useId() output (colons replaced with 'gp') — colons are invalid in XML id attributes"
  - "FRACTAL_PATH defined as module-level constant — computed once, not re-created on every render"
  - "maskImage applied to wrapper div (not SVG) — CSS mask-image on SVG elements has inconsistent browser support"
  - "@media prefers-reduced-motion placed INSIDE @layer components — prevents specificity override by base layer"

patterns-established:
  - "Pattern: SVG decorative components use absolute inset-0 overflow-hidden pointer-events-none wrapper + aria-hidden"
  - "Pattern: Hero animation lives in CSS @keyframes, not Framer Motion — CONTEXT.md constraint honored"
  - "Pattern: CSS custom properties bridge globals.css and component logic (--pattern-opacity-*, --hero-path-length)"

duration: 3min
completed: 2026-02-23
---

# Phase 3 Plan 01: Visual Primitives (GridPattern + GeometryAccent) Summary

**4-level recursive SVG grid pattern with theme-aware opacity and a CSS-only hero stroke-dashoffset draw animation that respects prefers-reduced-motion**

## Performance

- **Duration:** ~3 min
- **Started:** 2026-02-23T04:49:15Z
- **Completed:** 2026-02-23T04:51:39Z
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments

- GridPattern renders a recursive 4-level SVG pattern (5/10/20/40px tile hierarchy) with `currentColor` strokes, CSS mask-image edge dissolve, and `useId()` per instance for ID safety
- GeometryAccent draws the hero fractal grid path using `stroke-dashoffset` CSS keyframes — draws in at 13% opacity over 1.2s, settles to 6% over 0.8s, and is fully static when prefers-reduced-motion is set
- globals.css extended with `.hero-pattern-draw`, `@keyframes hero-draw`, `@keyframes hero-settle`, and prefers-reduced-motion guard, all within `@layer components`

## Task Commits

Each task was committed atomically:

1. **Task 1: Create GridPattern recursive line grid SVG component** - `59ac1a4` (feat)
2. **Task 2: Create GeometryAccent hero draw animation and CSS keyframes** - `bb0225a` (feat)

**Plan metadata:** (docs commit follows)

## Files Created/Modified

- `components/ui/GridPattern.tsx` — 4-level nested SVG pattern component; theme prop, position prop (4 variants), useId() ID isolation, CSS mask-image edge fade
- `components/ui/GeometryAccent.tsx` — Hero fractal path component; getTotalLength() runtime measurement, CSS class-driven animation, SVG preserveAspectRatio="xMidYMid slice"
- `app/globals.css` — Added `.hero-pattern-draw` with keyframes and prefers-reduced-motion guard inside @layer components

## Decisions Made

- **Named exports** for both components (not default exports) — consistent with a future component library pattern where tree-shaking benefits named exports.
- **SVG id sanitization**: `useId()` in React returns values like `:r0:` — colons are invalid in XML/SVG `id` attributes. Replaced with `gp` prefix to produce valid IDs like `gpr0gp-l0`.
- **maskImage on wrapper div**, not on SVG element directly — `mask-image` on SVG elements has inconsistent browser support; applying to a wrapping div is the safe pattern.
- **FRACTAL_PATH as module constant** — the path string is static and never changes per render; hoisting it avoids recomputation on every component mount.
- **prefers-reduced-motion inside @layer components** — placing the media query at module level could lose the layer specificity context, causing it to be overridden.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None — both components compiled and built without errors on first attempt.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- GridPattern and GeometryAccent are ready to be consumed by any section component
- Both export named symbols — import as `{ GridPattern }` and `{ GeometryAccent }` from their respective paths
- The section wrapper's `position: relative` (or `absolute inset-0` context) must be present for patterns to overlay correctly — SectionWrapper does NOT add `relative` by default, so consuming sections must add it via className
- Plan 03-02 (ScrollReveal) and 03-03 (section content) can now proceed

---
*Phase: 03-visual-primitives-animation*
*Completed: 2026-02-23*
