---
phase: 05-section-builds
plan: 01
subsystem: ui
tags: [nextjs, react, tailwind, framer-motion, server-components, sections]

# Dependency graph
requires:
  - phase: 03-visual-primitives-animation
    provides: GeometryAccent, GridPattern, FadeInOnScroll, StaggerChildren, HoverLift primitives
  - phase: 04-card-components
    provides: ServiceCard atom with built-in HoverLift
  - phase: 01-foundation-design-system
    provides: HERO_CONTENT, SERVICES, SECTION_IDS constants from lib/constants.ts

provides:
  - HeroSection Server Component — full-viewport hero with GeometryAccent, tagline, subheading, CTA
  - ServicesSection Server Component — 5-card light-theme grid with geometric heading accent and StaggerChildren

affects:
  - 05-02-plan (PortfolioSection)
  - 05-03-plan (TeamSection)
  - 05-04-plan (ContactSection)
  - 05-05-plan (page.tsx integration — imports HeroSection and ServicesSection)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Server Component sections: section files have no 'use client'; animation boundaries live in primitive child components"
    - "Sections directory pattern: components/sections/ holds composed section files, components/cards/ holds atoms"
    - "Inner div pattern: SectionWrapper handles py/px padding; inner div provides only relative + max-w-7xl for content sizing"
    - "Hero inner div exception: retains px-[--section-padding-x] because hero is flex-centered without max-w-7xl constraint"

key-files:
  created:
    - components/sections/HeroSection.tsx
    - components/sections/ServicesSection.tsx
  modified: []

key-decisions:
  - "HeroSection inner div keeps px-[--section-padding-x] — hero is flex-centered, no max-w-7xl, needs horizontal padding for text centering"
  - "ServicesSection inner div has NO padding — SectionWrapper already handles py/px, inner div only max-w-7xl + relative"
  - "All 5 SERVICES items mapped — no .slice() like Phase 3 validation placeholder"
  - "Geometric heading accent uses line-diamond-line pattern (span.h-px + span.rotate-45 diamond + span.h-px)"

patterns-established:
  - "Section files import SectionWrapper as default and all others as named — matches component export patterns"
  - "GeometryAccent requires parent with relative class — hero inner div provides this"
  - "GridPattern requires parent with relative class — services inner div provides this"
  - "ServiceCard h-full for equal-height grid cards in flex-col layout"

# Metrics
duration: 6min
completed: 2026-02-23
---

# Phase 5 Plan 01: HeroSection and ServicesSection Summary

**Two Server Component section files composing Phase 3/4 primitives into full-viewport hero with GeometryAccent draw animation and 5-card services grid with diagonal StaggerChildren cascade**

## Performance

- **Duration:** ~6 min
- **Started:** 2026-02-23T00:00:00Z
- **Completed:** 2026-02-23T00:06:00Z
- **Tasks:** 2
- **Files modified:** 2 (created)

## Accomplishments

- HeroSection Server Component with GeometryAccent four-leaf clover draw animation, three staggered FadeInOnScroll wrappers (tagline, subheading, CTA text link), and HERO_CONTENT constants
- ServicesSection Server Component with GridPattern texture, geometric line-diamond-line heading accent, intro copy, and 5-card StaggerChildren diagonal cascade grid using ServiceCard atoms
- Both sections follow the correct padding contract: SectionWrapper handles outer padding, inner divs only provide relative positioning context and max-w-7xl centering

## Task Commits

Each task was committed atomically:

1. **Task 1: Create HeroSection component** - `bfce877` (feat)
2. **Task 2: Create ServicesSection component** - `5e7d41b` (feat)

**Plan metadata:** (pending docs commit)

## Files Created/Modified

- `components/sections/HeroSection.tsx` - Full-viewport dark hero: GeometryAccent background, FadeInOnScroll tagline/subheading/CTA, imports SECTION_IDS + HERO_CONTENT
- `components/sections/ServicesSection.tsx` - Light services section: GridPattern texture, geometric heading accent, 5-card StaggerChildren grid with ServiceCard atoms

## Decisions Made

- **HeroSection padding exception:** Hero inner div keeps `px-[--section-padding-x]` because it uses flex centering without `max-w-7xl`. SectionWrapper applies outer section padding; the inner div needs its own horizontal padding for the centered text column. This is intentionally different from other sections.
- **ServicesSection no inner padding:** Inner div only uses `relative mx-auto max-w-7xl` — SectionWrapper already handles `py-[--section-padding-y] px-[--section-padding-x]`. Adding padding again would double it.
- **All 5 SERVICES mapped:** Phase 3 used `.slice(0, 3)` as a validation stub. Phase 5 maps the full array.
- **Geometric heading accent:** Line-diamond-line pattern (`span.h-px w-8 opacity-25` + `span.w-1.5 h-1.5 border rotate-45 opacity-50` + `span.h-px w-8 opacity-25`) centered above h2. Clean, consistent with design system geometric vocabulary.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- `components/sections/HeroSection.tsx` and `components/sections/ServicesSection.tsx` are ready for import in Phase 5 plans 02-05 and final page.tsx integration
- Phase 5 Plan 02 (PortfolioSection) can begin — needs filter interaction (client-side pill tabs per CONTEXT.md)
- Phase 5 Plan 03 (TeamSection) can begin — needs TeamCard atoms from Phase 4
- Phase 5 Plan 04 (ContactSection) can begin — needs ContactForm atom from Phase 4
- Phase 5 Plan 05 (page.tsx integration) replaces placeholder section functions with imports from components/sections/

---
*Phase: 05-section-builds*
*Completed: 2026-02-23*
