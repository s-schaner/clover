---
phase: 01-foundation-design-system
plan: 02
subsystem: ui
tags: [tailwindcss, css-custom-properties, design-tokens, next-font, space-grotesk, inter, jetbrains-mono, typography]

# Dependency graph
requires:
  - phase: 01-01
    provides: Next.js 16 scaffold with Tailwind v4 configured via @tailwindcss/postcss
provides:
  - Complete B&W semantic color token system via Tailwind utilities (bg-surface, text-on-surface, etc.)
  - Three variable fonts loaded zero-FOUT via next/font (Space Grotesk, Inter, JetBrains Mono)
  - Spacing/layout CSS custom properties on :root (nav-height, section-padding, pattern-opacity)
  - Animation duration tokens and easing curves in @theme
  - Base CSS layer with body defaults and focus-visible outline
  - Component CSS layer with section-dark/light and fade-in-scroll utility classes
affects:
  - 01-03-data-contracts
  - all phase 2-6 component plans (every component uses these tokens)

# Tech tracking
tech-stack:
  added:
    - "next/font/google - Space_Grotesk, Inter, JetBrains_Mono with variable CSS injection"
  patterns:
    - "Tailwind v4 @theme block for design token → utility class generation"
    - "@theme inline for font families that reference var() from next/font"
    - "Semantic color token naming: surface/on-surface with dark and light surface variants"
    - "No raw hex values in component files — all design values via semantic token utilities"

key-files:
  created: []
  modified:
    - app/globals.css
    - app/layout.tsx
    - app/page.tsx

key-decisions:
  - "@theme inline (not @theme) required for font families that use var() references — without inline keyword, var() won't resolve for utility generation in Tailwind v4"
  - "data-scroll-behavior='smooth' on html element (Next.js 16 pattern — replaces removed automatic scroll behavior override)"
  - "Font CSS variables injected via html className, consumed by @theme inline — this is the correct next/font + Tailwind v4 integration pattern"
  - "10 :root custom properties defined outside @theme (not utilities) — spacing rhythm, pattern opacity, clamp() text sizes"

patterns-established:
  - "Design token pattern: semantic names (surface/on-surface) not descriptive names (black/white/gray) — enables theme swapping"
  - "Font loading pattern: next/font variable option → CSS var on html → @theme inline consumption → font-display/body/mono utilities"
  - "Layer pattern: @layer base for HTML element defaults, @layer components for reusable class utilities"

# Metrics
duration: 8min
completed: 2026-02-22
---

# Phase 1 Plan 02: Design Token System Summary

**Complete B&W semantic color token system with three next/font variable fonts (Space Grotesk, Inter, JetBrains Mono) defined in Tailwind v4 @theme — all semantic utilities available as bg-*, text-*, font-* classes**

## Performance

- **Duration:** ~8 min
- **Started:** 2026-02-22T00:10Z
- **Completed:** 2026-02-22T00:18Z
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments
- Replaced default Tailwind config with complete B&W semantic color token system in `@theme` (14 color tokens: 6 dark surface, 6 light surface, 2 pure anchors)
- Added `@theme inline` for font family resolution — enables font-display/body/mono utilities that correctly reference next/font CSS variables
- Added animation duration tokens (--duration-fast/base/slow) and three easing curves in `@theme`
- Defined 10 `:root` custom properties for non-utility spacing/layout values (clamp() sizes, pattern opacity, nav height)
- Replaced Geist font loading in layout.tsx with Space Grotesk, Inter, and JetBrains Mono via next/font/google
- Created token verification page.tsx proving all semantic utilities render correctly (fonts, colors, section classes)

## Task Commits

Each task was committed atomically:

1. **Task 1: Define complete design token system in globals.css** - `7597dc3` (feat)
2. **Task 2: Configure next/font loading and update layout.tsx** - `5bbb212` (feat)

**Plan metadata:** (docs commit follows)

## Files Created/Modified
- `app/globals.css` - Complete design token system: @theme colors/durations, @theme inline fonts, :root spacing, @layer base/components
- `app/layout.tsx` - Root layout with Space Grotesk, Inter, JetBrains Mono via next/font; data-scroll-behavior="smooth" on html
- `app/page.tsx` - Token verification page: all three fonts + all color token variants + section-light class rendered

## Decisions Made
- Used `@theme inline` (not plain `@theme`) for font families. This is critical for Tailwind v4 — the `inline` keyword tells Tailwind to resolve `var()` references at utility generation time rather than deferring to runtime. Without it, `font-display` would generate the literal string `var(--font-space-grotesk)` as the CSS value, which only works if that variable is defined before Tailwind processes it. With `@theme inline`, the CSS variable chain is correctly established.
- Used `data-scroll-behavior="smooth"` as a data attribute on the html element (not `style={{ scrollBehavior: 'smooth' }}`). In Next.js 16, React 19's strict hydration rules make inline styles on the html element cause hydration mismatches. The data attribute approach avoids this while the CSS `html[data-scroll-behavior="smooth"] { scroll-behavior: smooth; }` selector can be added if needed later.
- All 10 spacing/layout tokens go in `:root` (not `@theme`) because they use `clamp()` which Tailwind cannot statically analyze for utility generation. Only static values that map cleanly to utility classes belong in `@theme`.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- All semantic color token utilities are available: `bg-surface`, `text-on-surface`, `bg-surface-raised`, `bg-surface-light`, `text-on-surface-muted`, `text-on-surface-subtle`, and all light surface variants
- All font utilities available: `font-display` (Space Grotesk), `font-body` (Inter), `font-mono` (JetBrains Mono)
- Animation duration tokens and easing curves available in `@theme` for use in transition/animation CSS
- CSS custom properties available for patterns: `--pattern-opacity-dark`, `--pattern-opacity-light`, `--pattern-size`
- Plan 01-03 (data contracts) can proceed in parallel — no dependency on this plan
- Phase 2+ component plans can safely use any of these tokens — no raw hex values needed

---
*Phase: 01-foundation-design-system*
*Completed: 2026-02-22*
