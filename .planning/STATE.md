# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-02-22)

**Core value:** Visitors immediately perceive Clover Labs as world-class engineers who solve hard problems
**Current focus:** Phase 6 complete — all 3 plans finished. Site documented and ready for handoff.

## Current Position

Phase: 6 of 6 (Assembly, Polish & Documentation)
Plan: 3 of 3 in current phase — PHASE COMPLETE
Status: All 6 phases complete — site built, polished, and documented
Last activity: 2026-02-23 — Completed 06-03 documentation (DESIGN_SYSTEM.md + COMPONENTS.md)

Progress: [████████████████████] 100% (18/18 plans complete)

## Performance Metrics

**Velocity:**
- Total plans completed: 15
- Average duration: ~5.1 min
- Total execution time: ~1.27 hours

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 01-foundation-design-system | 3/3 | 24 min | 8 min |
| 02-shell-navigation | 2/2 | ~7 min | ~3.5 min |
| 03-visual-primitives-animation | 3/3 | ~17 min | ~5.7 min |
| 04-card-components | 3/3 | ~17 min | ~5.7 min |
| 05-section-builds | 4/4 (complete) | ~12 min | ~3 min |
| 06-assembly-polish-documentation | 3/3 (complete) | ~20 min | ~7 min |

**Recent Trend:**
- Last 5 plans: 05-04 (~4 min), 06-01 (~8 min), 06-02 (~4 min), 06-03 (~8 min)
- Trend: All phases complete

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
- [05-01]: HeroSection inner div keeps px-[--section-padding-x] — flex-centered without max-w-7xl, needs horizontal padding for text column
- [05-01]: ServicesSection inner div has NO padding — SectionWrapper handles py/px; inner div is only relative + max-w-7xl centering
- [05-01]: Geometric heading accent pattern: line-diamond-line (span.h-px + span.rotate-45 border diamond + span.h-px) centered above h2
- [05-01]: All 5 SERVICES mapped in ServicesSection — no .slice() like Phase 3 validation placeholder
- [05-02]: 'All' prepended at component level in allFilters — PORTFOLIO_CATEGORIES in constants.ts does NOT include it
- [05-02]: visibleItems rendered via .filter() and mapped directly — non-matching items not rendered (not hidden with CSS)
- [05-02]: Security category shows empty grid — no empty state message; expected behavior (no Security items in PORTFOLIO_ITEMS)
- [05-02]: FadeInOnScroll wraps heading block and pill row together for unified entrance animation
- [05-03]: TeamSection uses lg:grid-cols-4 (not 3) — one column per founder; StaggerItem columns={4} for correct diagonal delay
- [05-03]: ContactSection two-column layout: contact details left, ContactForm right on lg+; stacked on mobile
- [05-03]: No intro paragraph in ContactSection per CONTEXT.md "Just the disabled form" constraint
- [05-03]: [&_form]:max-w-none wrapper overrides ContactForm baked-in max-w-lg — ContactForm has no className prop
- [05-03]: SVG map pin is inline hand-crafted (teardrop path + filled circle), 12x16 viewBox, stroke=currentColor
- [05-04]: page.tsx uses fragment (<>) not <main> — layout.tsx already wraps children in <main>; page root must not add another <main>
- [05-04]: page.tsx is purely declarative orchestration — 20 lines, no state/effects/logic, all 5 section components are self-contained
- [06-01]: TeamSection changed from lg:grid-cols-4 to grid-cols-2 md:grid-cols-4 — 2-col on mobile, 4-col at 768px tablet (note: supersedes [05-03] lg:grid-cols-4 entry)
- [06-01]: HeroSection changed from min-h-screen to min-h-[100dvh] — dvh accounts for mobile browser chrome (iOS Safari / Android Chrome address bar)
- [06-01]: globals.css --text-hero clamp min reduced 3rem→2.25rem and --section-padding-y min reduced 5rem→3.5rem — hero fits in viewport at 375px without scrolling
- [06-02]: optimizePackageImports for lucide-react in next.config.ts — tree-shakes icon library to only bundle Menu + X (2 of 500+ icons), isolated to single 15.5KB chunk
- [06-02]: next/font self-hosting confirmed deterministic — 17 woff2 files in .next/static/media/ at build time; no Google Fonts CDN requests by design
- [06-02]: Lighthouse CLI requires Chrome browser — not available in headless environments; manual audit via Chrome DevTools Lighthouse tab recommended (expected 90+)
- [06-03]: Documentation pattern: all values extracted from actual source (globals.css, TypeScript files) — not stale planning docs
- [06-03]: HoverLift built-in warning documented for ServiceCard/PortfolioCard/TeamCard — prevents double-wrapping bug
- [06-03]: Adding 5th team member requires TeamSection grid-cols update — grid-cols-4 breaks with 5 items
- [06-03]: ContactForm max-w-lg override uses [&_form]:max-w-none — no className prop exists on ContactForm

### Pending Todos

None — all phases complete.

### Blockers/Concerns

- [Research]: Actual company email address must be confirmed before Phase 5 Contact section build (research flagged `hello@cloverlabs.io` as placeholder only)
- [Research]: Capability taxonomy for portfolio section (AI/ML, Cloud Infrastructure, etc.) is a business decision — must be confirmed by owners before Phase 5
- [01-03]: Team member roles (titles) pending owner confirmation — placeholder "Co-Founder & Principal Engineer" used for all four members

## Session Continuity

Last session: 2026-02-23
Stopped at: Completed 06-02-PLAN.md — next.config.ts optimized, SUMMARY created.
Resume file: None
