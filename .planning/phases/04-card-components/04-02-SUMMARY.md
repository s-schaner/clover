---
phase: 04-card-components
plan: 02
subsystem: ui
tags: [portfolio-card, hover-lift, framer-motion, tailwind, typescript, dark-theme, data-attributes]

# Dependency graph
requires:
  - phase: 01-foundation-design-system
    provides: PortfolioItem type, TechTag interface, PortfolioCategory union from lib/types.ts
  - phase: 03-visual-primitives-animation
    provides: HoverLift component for hover scale micro-interaction wrapper

provides:
  - PortfolioCard component with full project anatomy (type badge, title, outcome metric, tech tags)
  - data-category attribute on article element for Phase 5 category filtering
  - font-mono (JetBrains Mono) tech tag pill styling

affects:
  - 05-portfolio-section (consumes PortfolioCard, implements category filter via data-category)
  - Phase 5 Services/Portfolio section layout (equal-height grid via className passthrough)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Card owns its HoverLift wrapper — consumers pass className for grid layout, not for wrapping"
    - "article element as semantic wrapper for self-contained content cards"
    - "data-category attribute on article for CSS/JS filter integration without component modification"
    - "mt-auto on tags row pushes tech tags to card bottom in flex-col layout"
    - "Conditional rendering pattern: {item.outcomeMetric && (...)} for optional card fields"

key-files:
  created:
    - components/cards/PortfolioCard.tsx
  modified: []

key-decisions:
  - "data-category holds raw PortfolioCategory string (e.g. 'AI/ML') — not slugified — Phase 5 matches against raw values"
  - "article element chosen over div — each portfolio card is semantically self-contained content"
  - "font-mono class on tags (not font-body) — JetBrains Mono as code accent font per design system"
  - "No border-radius on card or tags — sharp corners per B&W geometric design system"
  - "Dark section tokens used (on-surface*, not on-surface-light*) — Portfolio section is dark-themed"
  - "outcomeMetric rendered with italic — distinguishes metric text from title within same dark surface"

patterns-established:
  - "PortfolioCard: HoverLift wraps article with data-category for Phase 5 filter integration"
  - "Tags: font-mono + border border-on-surface-subtle/30 + sharp corners (no rounded-*)"

# Metrics
duration: 4min
completed: 2026-02-23
---

# Phase 4 Plan 02: PortfolioCard Summary

**Typed PortfolioCard atom with project type badge, title, optional outcome metric, JetBrains Mono tech tags, HoverLift wrapper, and data-category attribute for Phase 5 filter-readiness**

## Performance

- **Duration:** ~4 min
- **Started:** 2026-02-23
- **Completed:** 2026-02-23
- **Tasks:** 1 of 1
- **Files modified:** 1

## Accomplishments

- PortfolioCard component renders all four anatomy fields: project type badge (uppercase tracking-wider), title (font-display), outcome metric (conditional italic), tech tags (font-mono JetBrains Mono)
- All fields driven entirely by typed `PortfolioItem` props — zero hardcoded strings
- `data-category={item.category}` on article element enables Phase 5 category filter without touching this component
- TypeScript strict mode compiles cleanly with zero errors

## Task Commits

Each task was committed atomically:

1. **Task 1: Create PortfolioCard with full project anatomy and data-category attribute** - `4bbb888` (feat)

**Plan metadata:** (docs commit follows)

## Files Created/Modified

- `components/cards/PortfolioCard.tsx` - Self-contained portfolio card with project type badge, title, optional outcome metric, JetBrains Mono tech tag pills, HoverLift wrapper, and data-category filter readiness

## Decisions Made

- `data-category` stores raw `PortfolioCategory` string (e.g., `"AI/ML"`) — not slugified. Phase 5 will match against these raw values using data attribute selectors.
- `<article>` chosen as inner container element — semantically correct for self-contained content units.
- `font-mono` on tag spans for JetBrains Mono — code accent font per design system (not `font-body`).
- `mt-auto` on the tags flex container pushes tech tags to the bottom of the card in a flex-col layout, creating consistent visual alignment across cards of varying content height.
- Dark theme tokens (`on-surface`, `on-surface-muted`, `on-surface-subtle`) — Portfolio section is dark-themed.
- No `rounded-*` classes anywhere — sharp corners per B&W geometric design system.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- `PortfolioCard` is ready for Phase 5 portfolio section integration
- Accepts `PortfolioItem` typed props — consume directly from `lib/constants.ts` PORTFOLIO array
- `className` passthrough to HoverLift enables equal-height grid layouts via `h-full`
- `data-category` attribute on article is the hook for Phase 5 category filter buttons (no PortfolioCard changes needed)
- Blocker from previous phases still applies: capability taxonomy (AI/ML, Cloud Infrastructure, etc.) pending owner confirmation before real data populates constants

---
*Phase: 04-card-components*
*Completed: 2026-02-23*
