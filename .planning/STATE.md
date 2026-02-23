# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-02-22)

**Core value:** Visitors immediately perceive Clover Labs as world-class engineers who solve hard problems
**Current focus:** Phase 5 — Section Builds (Phase 4 verified complete — all card atoms built)

## Current Position

Phase: 5 of 6 (Section Builds)
Plan: 0 of 5 in current phase
Status: Ready for Phase 5 — Phase 4 verified complete (5/5 must-haves passed)
Last activity: 2026-02-23 — Phase 4 verified and closed

Progress: [██████████] ~61% (11/18 plans estimated)

## Performance Metrics

**Velocity:**
- Total plans completed: 11
- Average duration: ~5.4 min
- Total execution time: ~0.99 hours

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 01-foundation-design-system | 3/3 | 24 min | 8 min |
| 02-shell-navigation | 2/2 | ~7 min | ~3.5 min |
| 03-visual-primitives-animation | 3/3 | ~17 min | ~5.7 min |
| 04-card-components | 3/3 | ~17 min | ~5.7 min |

**Recent Trend:**
- Last 5 plans: 03-02 (~6 min), 03-03 (~5 min), 04-01 (~5 min), 04-02 (~4 min), 04-03 (~8 min)
- Trend: Stable

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
- [02-verify]: data-scroll-behavior="smooth" is a Next.js 16 router signal only — must also add CSS rule `html[data-scroll-behavior="smooth"] { scroll-behavior: smooth }` for actual smooth scrolling
- [02-verify]: page.tsx uses fragment (<>) not <main> — layout.tsx already wraps children in <main>, avoiding nested <main> HTML spec violation
- [03-01]: SVG pattern id attributes must not contain colons — useId() output (":r0:") sanitized by replacing colons with "gp" prefix
- [03-01]: maskImage applied to wrapper div (not SVG element directly) — CSS mask-image on SVG elements has inconsistent browser support
- [03-01]: Hero draw animation uses CSS @keyframes (not Framer Motion) — CONTEXT.md constraint: hero visual locked to CSS+SVG only
- [03-01]: SectionWrapper does NOT add position: relative — consuming sections that use GridPattern/GeometryAccent must add it via className
- [03-02]: framer-motion 12 staggerChildren is deprecated — use manual (row + col) * staggerInterval delay per StaggerItem for diagonal cascade
- [03-02]: StaggerChildren is a plain div (no framer-motion) — animation entirely in StaggerItem, each self-managing viewport tracking
- [03-02]: useReducedMotion returns boolean | null (null on SSR) — truthy check handles both true and null safely
- [03-02]: viewport.amount 0.1 for StaggerItem (card-sized) vs 0.2 for FadeInOnScroll (section-level) — prevents flickering at edge
- [03-03]: GeometryAccent hero pattern changed from fractal grid to four-leaf clover — brand identity for Clover Labs (user-requested during checkpoint review)
- [03-03]: HoverLift uses willChange:'transform' hint for GPU compositing on whileHover elements — framer-motion may not auto-promote non-initially-animated layers
- [03-03]: link-underline uses CSS ::after pseudo-element (not framer-motion) — simpler for text decoration, no JS overhead
- [04-01]: ICON_MAP uses inline SVG (no lucide-react) — hand-crafted geometric shapes per CONTEXT.md constraint
- [04-01]: HoverLift built into ServiceCard atom — Phase 5 consumers render <ServiceCard item={...} /> with no wrapper
- [04-01]: HERO-03 verified satisfied by GeometryAccent — animated four-leaf clover draw via CSS stroke-dashoffset, no new hero component needed
- [04-01]: Icon color via text-on-surface-light-subtle wrapper div — currentColor resolves correctly without hardcoding
- [04-02]: data-category holds raw PortfolioCategory string (e.g. "AI/ML") — not slugified — Phase 5 matches against raw values
- [04-02]: article element chosen as inner container — semantically correct for self-contained portfolio content units
- [04-02]: font-mono on tech tag spans (JetBrains Mono code accent) — distinguishes tech stack from prose text in dark-themed card
- [04-02]: mt-auto on tags row pushes tech tags to card bottom in flex-col layout — consistent alignment across variable-height cards
- [04-03]: Two-character initials (MW, MD, PK, SS) for MonogramAvatar — resolves M/M collision between Mike Wong and Matt Drapp
- [04-03]: CloverAccentMini positioned at cx=88 cy=28 in 120x120 viewBox — top-right of letter cluster, same cubic bezier petal formula as GeometryAccent
- [04-03]: Social icons layout: flex justify-between on role row — role text left, social icons flex-shrink-0 right (CONTEXT.md inline integration)
- [04-03]: ContactForm uses readOnly on inputs (not disabled) — only submit is disabled; preserves focusability for preview feel

### Pending Todos

None yet.

### Blockers/Concerns

- [Research]: Actual company email address must be confirmed before Phase 5 Contact section build (research flagged `hello@cloverlabs.io` as placeholder only)
- [Research]: Capability taxonomy for portfolio section (AI/ML, Cloud Infrastructure, etc.) is a business decision — must be confirmed by owners before Phase 5
- [01-03]: Team member roles (titles) pending owner confirmation — placeholder "Co-Founder & Principal Engineer" used for all four members

## Session Continuity

Last session: 2026-02-23
Stopped at: Phase 4 verified complete. Ready for Phase 5 (Section Builds)
Resume file: None
