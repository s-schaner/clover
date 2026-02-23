---
phase: 04-card-components
plan: 03
subsystem: ui
tags: [react, svg, framer-motion, typescript, team-card, contact-form, monogram-avatar]

# Dependency graph
requires:
  - phase: 01-foundation-design-system
    provides: TypeScript types (TeamMember, SocialLink) in lib/types.ts; design tokens; font setup
  - phase: 03-visual-primitives-animation
    provides: HoverLift wrapper component; GeometryAccent bezier clover pattern reference
provides:
  - SVG monogram avatar system with four-petal clover bezier accent (CloverAccentMini)
  - TeamCard atom with two-character initials (MW, MD, PK, SS), social icons inline with role
  - ContactForm visual-only with three readOnly fields and disabled Coming Soon submit
affects:
  - 05-section-assembly (Team section consumes TeamCard, Contact section consumes ContactForm)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Internal SVG sub-components (CloverAccentMini, MonogramAvatar) kept non-exported — atoms own their visual building blocks"
    - "Social icon SVGs hand-crafted with currentColor stroke — zero icon library dependency"
    - "readOnly on inputs (not disabled) for form-preview UX — only submit button is disabled"
    - "aria-describedby links disabled button to sr-only explanation paragraph"

key-files:
  created:
    - components/cards/TeamCard.tsx
    - components/cards/ContactForm.tsx
  modified: []

key-decisions:
  - "Two-character initials (MW, MD, PK, SS) used for MonogramAvatar — resolves M/M collision between Mike Wong and Matt Drapp"
  - "CloverAccentMini built inline using same cubic bezier petal pattern as GeometryAccent — brand consistency without import coupling"
  - "Social links: role text left, icons right in a flex justify-between row — inline integration per CONTEXT.md"
  - "ContactForm: readOnly on inputs, disabled only on submit — preserves focusability for preview feel"
  - "Dark tokens on ContactForm (on-surface-*), light tokens on TeamCard (on-surface-light-*) — matches section themes"

patterns-established:
  - "MonogramAvatar pattern: SVG viewBox 0 0 120 120, text at x=55 y=62, CloverAccentMini at cx=88 cy=28"
  - "Form-preview pattern: all inputs readOnly, submit disabled with aria-describedby to sr-only context paragraph"

# Metrics
duration: 8min
completed: 2026-02-23
---

# Phase 4 Plan 03: TeamCard and ContactForm Summary

**SVG monogram avatar cards with two-character initials and four-petal clover bezier accent, plus visual-only contact form with readOnly fields and disabled Coming Soon submit**

## Performance

- **Duration:** ~8 min
- **Started:** 2026-02-23T00:00:00Z
- **Completed:** 2026-02-23T00:08:00Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments

- TeamCard renders large SVG monogram avatar (MonogramAvatar) with each member's two-character initials (MW, MD, PK, SS) — no two avatars look identical despite two M-initial members
- CloverAccentMini sub-component uses exact same cubic bezier petal formula as GeometryAccent's generateCloverPath() — brand identity mark appears consistently throughout the site
- Hand-crafted LinkedIn and GitHub SVG icons (16x16, currentColor stroke) sit inline with role text via flex justify-between layout
- ContactForm provides three fields (name, email, message) that are focusable and readOnly — feels like a real form preview, not a broken form
- Submit button disabled with proper ARIA (aria-disabled, aria-describedby) linking to sr-only explanation

## Task Commits

Each task was committed atomically:

1. **Task 1: Create TeamCard with SVG monogram avatar and clover accent** - `003c09a` (feat)
2. **Task 2: Create ContactForm with readOnly fields and disabled Coming Soon submit** - `652491c` (feat)

**Plan metadata:** _(docs commit follows)_

## Files Created/Modified

- `components/cards/TeamCard.tsx` - Team profile card with MonogramAvatar (SVG initials + CloverAccentMini), HoverLift wrapper, social icon links inline with role
- `components/cards/ContactForm.tsx` - Visual-only contact form, three readOnly fields, disabled Coming Soon submit with aria-describedby

## Decisions Made

- **Two-character initials for all members:** MW, MD, PK, SS — resolves the M/M collision between Mike Wong and Matt Drapp. The plan explicitly specified this approach.
- **CloverAccentMini positioned at cx=88 cy=28:** Top-right of the letter cluster within the 120x120 viewBox — creates visual balance with the large initials text centered around x=55 y=62.
- **Social icon layout:** `flex items-center justify-between` on the role row — role text takes available width, icons flex-shrink-0 on the right. This matches CONTEXT.md "integrated inline" requirement without crowding the role text.
- **readOnly vs disabled on form inputs:** The plan specified readOnly (not disabled) explicitly — readOnly inputs remain focusable and feel interactive, communicating "preview" rather than "broken".

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None - TypeScript compiled cleanly on first attempt with zero errors.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- All four card atoms are complete (ServiceCard, PortfolioCard, TeamCard, ContactForm) — Phase 5 section assembly can begin immediately
- Team section: import TEAM_MEMBERS from lib/constants.ts, map over it with TeamCard
- Contact section: drop ContactForm into the dark-themed contact section (tokens already dark-themed)
- Blockers carried forward: company email (hello@cloverlabs.io placeholder), team member role titles, and capability taxonomy still need owner confirmation before Phase 5 content finalization

---
*Phase: 04-card-components*
*Completed: 2026-02-23*
