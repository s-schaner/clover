# Project Research Summary

**Project:** Clover Labs LLC — Skeleton Website
**Domain:** Premium technology consultancy marketing site
**Researched:** 2026-02-22
**Confidence:** HIGH

## Executive Summary

Clover Labs is a 4-person technology consultancy (Mike Wong, Matt Drapp, Peter Kwon, Stefan Schaner) based in Ashburn, VA that needs a skeleton website projecting elite engineering credibility. Research across premium consultancy sites (Palantir, Thoughtworks, IDEO, Two Sigma) reveals a consistent pattern: the difference between a commodity consultancy site and an elite one is never about features — it is about execution density on a small, well-chosen set of signals. The correct approach is to build a hybrid single-page scroll site with a pure black-and-white visual system, circuit/grid geometric patterns as the visual identity, and purposeful scroll animations — all implemented with technical precision that itself signals engineering capability.

The recommended stack is Next.js 15 (App Router) + TypeScript 5 + Tailwind CSS v4 + Framer Motion 11, deployed to Vercel. This is not a close call. Next.js App Router is the current standard for React-based marketing sites, and the combination of server components (zero client JS for static sections), next/font (zero layout shift), and Vercel's edge CDN produces the fast, polished result that a technology firm must demonstrate on its own marketing property. Animation should be purposeful and restrained: Framer Motion handles scroll reveals and hover states; GSAP is available but reserved for SVG stroke animations and complex scroll-scrubbing if needed.

The primary risk is not technical — it is executional. The B&W constraint eliminates color as a hierarchy tool, which means typography, spacing, and value contrast must carry the entire visual language. Skeleton sites frequently defer hard design decisions ("we'll adjust this with real content"), resulting in a framework that actually answers none of the design questions the mature site will inherit. The mandate for this skeleton is to make every visual decision — even if some will be revised — so the mature site has a resolved design language to evolve from, not a blank slate to start over.

---

## Key Findings

### Recommended Stack

See `.planning/research/STACK.md` for full detail and version verification commands.

Next.js 15 with the App Router is the unambiguous framework choice. Static export capability (`output: 'export'`) means zero server cost for the skeleton; the App Router's server components default means near-zero client JavaScript for purely presentational sections. Tailwind CSS v4 is a meaningful upgrade over v3 for this project: CSS-native configuration via `@theme` blocks keeps the entire B&W design token system in a single CSS file, and CSS custom properties animate natively. Framer Motion 11 and GSAP 3 are used together deliberately — Framer Motion for React-native scroll reveals, GSAP for SVG stroke animations and timeline sequencing where Framer Motion is insufficient. No UI component library (shadcn, Chakra, etc.) is appropriate; the bespoke B&W design requires every component to be custom.

**Core technologies:**
- **Next.js 15 (App Router):** Framework — server components minimize client JS, static export capable, forward-compatible with multi-page split
- **TypeScript 5 (strict):** Language — signals engineering craft; typed component props prevent layout bugs; zero setup cost with Next.js 15
- **Tailwind CSS v4:** Styling — CSS-native design tokens, zero-config content detection, no runtime overhead
- **Framer Motion 11:** Scroll animations — `whileInView` with `viewport={{ once: true }}`, `useReducedMotion` built-in, SSR-safe
- **GSAP 3 (free tier):** Complex animations — SVG `stroke-dashoffset` draw-on effects, ScrollTrigger for pinning/scrubbing; secondary library only
- **Inline SVG + CSS:** Circuit/grid patterns — zero dependency, full control, animatable via CSS variables
- **next/font (Google Fonts):** Typography — zero layout shift, build-time download, same-origin serving
- **Vercel:** Deployment — zero-config Next.js, preview deployments per branch, sub-100ms TTFB on global CDN

**Font selections:** Space Grotesk (display/headings — geometric with technical character), Inter (body — maximum legibility), JetBrains Mono (code accents — technical credibility signal).

**Do not use:** Styled Components, Emotion, shadcn/ui, Three.js, Lottie, Animate.css, any global state library (Zustand/Redux), React Query/SWR, Storybook. All add complexity without proportional benefit at skeleton stage.

---

### Expected Features

See `.planning/research/FEATURES.md` for signal analysis and dependency map.

The core finding: elite consultancy sites are elite because of execution quality on a small feature set, not because they have more features. The skeleton must deliver the table-stakes features at premium execution quality.

**Must have (table stakes — absence signals amateurism):**
- Hero / above-the-fold statement with positioning tagline and primary CTA
- Sticky navigation header with anchor links and mobile hamburger menu
- Services / capabilities section (3-6 capability areas with precise technical language)
- Team section with all 4 owner names from day one (no "Team Member" placeholders)
- Contact section with displayed email address, Ashburn VA location, and clearly disabled form submit
- Full responsiveness — mobile-alongside approach, not retrofitted after desktop
- Fast load performance — sub-2s, correct Next.js usage, minimal JS bundle
- Professional typography — deliberate type system; in B&W this carries the entire aesthetic

**Should have (differentiators that signal elite execution):**
- Scroll-triggered animations — purposeful, additive-only (opacity + transform), never more than 3 animated elements per viewport
- Geometric / technical visual language — circuit/grid SVG patterns as subtle background texture (opacity under 8-10% on dark, under 5% on light)
- Asymmetric, grid-breaking layouts — one or two moments per section, not every element offset
- Portfolio section with structured project cards — capability categories + placeholder cards with correct anatomy (title, type, tags)
- Micro-interactions — one or two consistent hover effects applied uniformly; restraint over variety
- Section transitions — angled cuts or inverted color blocks; black-to-white transitions with geometric angles
- Generous whitespace as a design element — section padding 120-160px; confidence signal
- One signature visual moment — animated circuit diagram in hero is the natural candidate

**Defer to mature site (anti-features for skeleton):**
- Blog / thought leadership (empty shelf)
- Client logos or "Trusted by" section (placeholder logos are a red flag)
- Awards / press mentions (placeholders signal absence of real credentials)
- Testimonials (cannot be credibly faked at this scale)
- Real contact form backend / email integration
- SEO metadata, OpenGraph, sitemap (premature until content is stable)
- Video backgrounds or embedded social feeds

---

### Architecture Approach

See `.planning/research/ARCHITECTURE.md` for full directory structure, component boundaries, data flow, and build order.

The architecture is a clean three-tier component system over a strict data-down, one-source-of-truth data layer. All content lives in `lib/constants.ts` — this file is the "CMS" for the skeleton, and replacing it with a real API later requires changing only the data-fetching layer in `app/page.tsx`, not any component. Sections are page-aware components; UI primitives (`ui/`) are context-free; animation wrappers (`motion/`) are pure wrappers that can be removed without touching wrapped components. This structure enables a clean single-page-to-multi-page migration: each section is already self-contained, and the navigation link targets are string constants that change from `#services` to `/services` in one place.

**Major components:**
1. `lib/constants.ts` — single source of truth for all content (section IDs, nav links, team data, service data, capability taxonomy)
2. `lib/types.ts` — TypeScript interfaces for all data shapes (`ServiceItem`, `PortfolioItem`, `TeamMember`)
3. `app/globals.css` — CSS custom properties layer (entire B&W token system: colors, typography scale, spacing rhythm, animation durations, grid pattern variables)
4. `components/layout/Navigation.tsx` — sticky header with anchor links, scroll-spy active section detection via IntersectionObserver, mobile menu state
5. `components/ui/SectionWrapper.tsx` — provides `id` anchor, `scroll-margin-top`, consistent vertical rhythm padding; used by every section
6. `components/ui/GridPattern.tsx` — SVG/CSS circuit-grid background texture; density and opacity as props
7. `components/sections/Hero.tsx` — first impression; hosts the signature animated visual moment
8. `components/sections/Services.tsx`, `Portfolio.tsx`, `Team.tsx`, `Contact.tsx` — primary content sections
9. `components/motion/FadeInOnScroll.tsx`, `StaggerChildren.tsx`, `HoverLift.tsx` — animation wrapper layer; isolated from content logic

**Section alternation pattern:** Hero (dark) → Services (light) → Portfolio (dark) → Team (light) → Contact (dark). This creates visual rhythm using value contrast alone, without color.

**State inventory (skeleton, minimal):** Active section (`Navigation.tsx`, `useState<string>`), mobile menu open (`Navigation.tsx`, `useState<boolean>`), contact form fields (`ContactForm.tsx`, `useState<FormData>`). No global state library needed.

**Build order (critical — do not skip):** Foundation (constants, types, globals.css, layout) → Shell (SectionWrapper, Navigation, Footer) → Visual Primitives (GridPattern, GeometryAccent, motion wrappers) → UI Primitives (cards, ContactForm) → Sections → Assembly (`app/page.tsx`). Sections are blocked until their UI primitive dependencies are complete; sections themselves can be built in parallel once unblocked.

---

### Critical Pitfalls

See `.planning/research/PITFALLS.md` for full detection signals and phase mapping.

1. **Building for single-page only, forgetting the multi-page future** — Use `lib/constants.ts` for all anchor IDs as exported constants; each section gets its own folder in `components/sections/`; no cross-section state. The migration path to multi-page must be a zero-component-change operation.

2. **Skipping the design token layer before writing any component** — The B&W constraint does not reduce token complexity; it changes it. Without semantic tokens (`surface`, `on-surface-muted`, `border-subtle`), 12 slightly different grays appear across the codebase with no system. Define all tokens in `globals.css` and `tailwind.config.ts` before the first component is written.

3. **Animations triggering on mount rather than on viewport entry** — Never set `opacity: 0` in server-rendered HTML. Use `IntersectionObserver` with `once: true` as the trigger. Restrict to GPU-composited properties only (transform + opacity). Cap simultaneous animated elements at 3 per viewport. Implement `prefers-reduced-motion` from the start, not as a retrofit.

4. **Circuit/grid patterns that overwhelm rather than support** — Opacity must stay under 8-10% on dark backgrounds, under 5% on light. Patterns are accent elements, not backgrounds. Use them in corners or adjacent to headings, not as full-bleed section fills. Implement as inline SVG or CSS `background-image` (not raster PNG) so they scale perfectly and can be adjusted via CSS variables.

5. **Skeleton that cannot be handed off** — TypeScript interfaces on all component props are non-negotiable. Mark all placeholder content with a `data-placeholder` attribute that is machine-queryable. Write `DESIGN_SYSTEM.md` alongside the code (color tokens, type scale, spacing rhythm, pattern usage rules). The skeleton's documentation artifacts are as important as its code.

6. **Generic placeholder language that poisons the design** — Use actual owner names (Mike Wong, Matt Drapp, Peter Kwon, Stefan Schaner) and Ashburn VA from day one. Write directional skeleton headlines specific to Clover Labs' actual positioning. Size sections around realistic copy lengths from reference sites (Thoughtworks, Atomic Object), not lorem ipsum.

---

## Implications for Roadmap

Based on combined research, the skeleton website has a clear, dependency-driven build order. The architecture research defines it explicitly. This should translate directly into roadmap phases.

### Phase 1: Foundation and Design System

**Rationale:** Architecture research identifies `lib/constants.ts`, `lib/types.ts`, and `app/globals.css` as Phase 0 — nothing else can be built until these exist. Pitfalls research confirms that deferring the token layer causes cascading problems (12 gray shades, no rhythm). This is not plumbing — the token system IS the primary skeleton deliverable.
**Delivers:** Project scaffolding (`create-next-app`), TypeScript config, Tailwind v4 with semantic color tokens, CSS custom properties (full B&W palette, type scale, spacing rhythm, animation durations, grid pattern variables), `lib/constants.ts` with all section IDs and static content, `lib/types.ts` with all data shape interfaces, `app/layout.tsx` with font loading.
**Features from FEATURES.md:** Professional typography system, spacing scale, design token layer.
**Avoids:** P1-2 (no component classification), P1-3 (no token layer), P2-1 (no visual hierarchy), P2-3 (typography doing insufficient work).

### Phase 2: Shell and Navigation

**Rationale:** Navigation and layout shell must exist before sections, because sections depend on the anchor ID system and `SectionWrapper`. Navigation's scroll-spy active section logic is the trickiest implementation detail (per architecture research) and should be built and tested with dummy scroll targets before sections exist.
**Delivers:** `components/ui/SectionWrapper.tsx` (anchor + scroll-margin), `components/layout/Navigation.tsx` (sticky header, scroll-spy, mobile hamburger with proper overlay/focus trap), `components/layout/Footer.tsx`.
**Uses:** NAV_HEIGHT CSS variable established here; used by all scroll-trigger rootMargin calculations.
**Avoids:** P3-3 (scroll animations conflicting with sticky nav), P4-4 (mobile navigation as afterthought — hamburger menu requires dedicated design).

### Phase 3: Visual Primitives and Animation Layer

**Rationale:** GridPattern, GeometryAccent, and the motion wrapper components are dependencies for all section components. Building these in isolation ensures the circuit pattern aesthetic is validated and the animation vocabulary is locked before being applied across sections. Pitfall P2-2 (patterns that overwhelm) must be resolved here, not during section builds.
**Delivers:** `components/ui/GridPattern.tsx` (SVG/CSS circuit-grid, opacity and density props), `components/ui/GeometryAccent.tsx` (decorative SVG angles/lines), `components/motion/FadeInOnScroll.tsx` (IntersectionObserver + CSS, prefers-reduced-motion handled), `components/motion/StaggerChildren.tsx`, `components/motion/HoverLift.tsx`. Pattern opacity budget locked here.
**Uses:** Framer Motion 11 (`whileInView`, `useReducedMotion`) or native IntersectionObserver per architecture recommendation.
**Avoids:** P2-2 (pattern opacity too high), P3-1 (animations triggering on mount), P3-2 (animations adding latency), P3-4 (bundle bloat from multiple animation libraries).

### Phase 4: Card Components (UI Primitives)

**Rationale:** Section components (`Services.tsx`, `Portfolio.tsx`, `Team.tsx`) depend on their card sub-components. Cards must be designed to accept real content in the mature phase — the card anatomy (title, type, outcome metric, tech tags) must be locked and typed before sections are built.
**Delivers:** `components/ui/ServiceCard.tsx`, `components/ui/PortfolioCard.tsx`, `components/ui/TeamCard.tsx`, `components/ui/ContactForm.tsx` (disabled submit, clearly labelled non-functional). All with TypeScript props interfaces and `data-placeholder` attributes.
**Features from FEATURES.md:** Portfolio section "structured project cards with correct anatomy" — this is where that investment lives.
**Avoids:** P4-2 (premium signals that read as fake — card design must be credible, not enterprise-scale inflated), P5-1 (skeleton that cannot be handed off — props must be documented).

### Phase 5: Section Builds

**Rationale:** All dependencies are satisfied. Sections can be built in parallel (they have no inter-dependencies). Hero is the highest-priority section — it contains the signature visual moment and determines first impressions. Each section must be reviewed at mobile alongside desktop, not retrofitted.
**Delivers:** `components/sections/Hero.tsx` (tagline, CTA, animated circuit background — the signature moment), `components/sections/Services.tsx` (capability areas with precise technical language), `components/sections/Portfolio.tsx` (capability categories + placeholder project cards), `components/sections/Team.tsx` (Mike Wong, Matt Drapp, Peter Kwon, Stefan Schaner — real names from day one), `components/sections/Contact.tsx` (real email address displayed, location Ashburn VA, disabled form with tooltip).
**Features from FEATURES.md:** All table-stakes features delivered here. Differentiators (scroll animations, micro-interactions, section transitions, asymmetric layouts) applied per section.
**Avoids:** P4-1 (generic language), P4-3 (contact section that creates doubt), P4-4 (mobile as afterthought).

### Phase 6: Assembly, Polish, and Documentation

**Rationale:** `app/page.tsx` is trivially simple once all sections exist — it is a render-order file. The final phase is integration, cross-section review (section transitions, alternating dark/light rhythm), performance verification (Lighthouse, bundle size check), and documentation artifacts.
**Delivers:** `app/page.tsx` (assembly), section transition polish (angled CSS clip-path dividers between inverted sections), Lighthouse performance baseline, `DESIGN_SYSTEM.md` (token spec, pattern usage rules, spacing rhythm), `COMPONENTS.md` (component inventory with props). Any `TODO` comments cleaned or formalized.
**Avoids:** P5-1 (no handoff documentation), P5-2 (design decisions deferred).

### Phase Ordering Rationale

- **Foundation before everything:** The token system (`globals.css`) and data definitions (`constants.ts`, `types.ts`) are the true foundation. Architecture research confirms sections are blocked without them. This is the most common skeleton pitfall — teams skip straight to Hero.
- **Navigation before sections:** Scroll-spy logic needs real section anchors to test, but the component itself can be built with dummy targets first. Solving the sticky nav height offset (`NAV_HEIGHT`) here prevents it from breaking every scroll animation trigger later.
- **Visual primitives before cards:** Card components use motion wrappers and GridPattern. Building the animation vocabulary in isolation lets it be tested and tuned before it is applied to 15 different components.
- **Cards before sections:** Sections delegate their content rendering to card sub-components. Section component complexity drops dramatically when the cards are pre-built.
- **Sections in parallel:** Hero, Services, Portfolio, Team, Contact have zero inter-dependencies once their card and motion dependencies exist. This is a natural parallelization opportunity.
- **Assembly last:** `app/page.tsx` is trivial when all sections exist. The "assembly" work in Phase 6 is mostly polish and documentation.

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 3 (Visual Primitives):** Circuit pattern design is the most aesthetically critical and most open-ended deliverable. The research defines the approach (inline SVG, CSS `background-image`) and the constraints (opacity budget), but the actual circuit trace geometry requires design iteration. Recommend a dedicated design pass before implementation.
- **Phase 5, Hero Section:** The "signature visual moment" is intentionally left open. Whether it is a CSS grid animation, an SVG stroke draw-on, or a GSAP ScrollTrigger parallax determines which tools are pulled forward from Phase 3. Scope the hero signature moment explicitly before Phase 3 begins.

Phases with standard patterns (skip research-phase):
- **Phase 1 (Foundation):** `create-next-app` + TypeScript strict + Tailwind v4 is a fully documented, zero-ambiguity setup. The token system structure is defined in ARCHITECTURE.md.
- **Phase 2 (Navigation):** Sticky nav + IntersectionObserver scroll-spy is a well-documented pattern. The scroll-margin-top + NAV_HEIGHT CSS variable approach is explicitly defined in PITFALLS.md.
- **Phase 4 (Card Components):** Stateless presentational components with typed props. Standard React component work.
- **Phase 6 (Assembly):** Trivial once sections exist. Documentation writing is straightforward given the token system and component classification are already established.

---

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Next.js 15, TypeScript 5, Tailwind v4, Framer Motion 11, Vercel are all well-established. Versions flagged for verification via `npm view <package> version` before bootstrap. Only Lucide React version is MEDIUM (substitutable without impact). |
| Features | HIGH | Based on systematic analysis of premium consultancy sites (Palantir, Thoughtworks, IDEO, Two Sigma). Feature taxonomy (table stakes vs. differentiators vs. anti-features) is clear and well-reasoned. What constitutes "elite" execution is subjective but research-backed. |
| Architecture | HIGH | Next.js App Router patterns are well-documented. Three-tier component classification, data-down flow, and constants-as-CMS approach are proven patterns for this type of project. Build order derived from explicit dependency analysis. |
| Pitfalls | HIGH | Pitfalls are grounded in specific, observable failure modes with detection signals and phase-mapped prevention strategies. B&W design system pitfalls are particularly well-researched. |

**Overall confidence:** HIGH

### Gaps to Address

- **Circuit pattern design specifics:** Research defines constraints (opacity budget, SVG vs. CSS approach, accent-not-background positioning) but does not define the actual circuit trace geometry. This requires a design pass before Phase 3 implementation. Recommend drawing 2-3 candidate patterns in Figma or equivalent and validating against the "reads as texture, not graphic" criterion before committing.

- **Hero signature moment scope:** The research identifies the animated circuit hero as the candidate for the signature visual moment but explicitly defers the implementation decision. Whether this is a CSS keyframe animation, GSAP ScrollTrigger effect, or Framer Motion `useScroll` parallax should be decided before Phase 3 — it determines which animation tools must be present in Phase 3 and tested.

- **Capability taxonomy for portfolio section:** The portfolio section requires a "capability area taxonomy" before cards can be built. The research notes that Clover Labs' capabilities (AI/ML, Cloud, Full-Stack, etc.) must be defined before the Portfolio component can be correctly structured. This is a business decision that must be made by the owners, not inferred from the skeleton.

- **Tailwind v4 stability:** STACK.md notes Tailwind v4 reached stable in early 2025 but flags it for version verification. If v4 has breaking issues or ecosystem gaps at time of build, v3 is a valid fallback with minimal impact on the architecture (the token layer moves from CSS `@theme` blocks back to `tailwind.config.ts` theme extensions).

- **Contact email address:** The project plan references `hello@cloverlabs.io` as a placeholder. The actual email address must be confirmed before the Contact section is built. PITFALLS.md explicitly requires displaying a real email address (not a placeholder) in the contact section.

---

## Sources

### Primary (HIGH confidence)
- Next.js official documentation — App Router, static export, font optimization, metadata API
- Tailwind CSS v4 documentation — CSS-native configuration, `@theme` blocks, content detection
- Framer Motion documentation — `whileInView`, `useReducedMotion`, `useScroll`, `useTransform`
- GSAP documentation — ScrollTrigger, SVG stroke animation, timeline sequencing
- WCAG 2.1 AA contrast guidelines — text contrast ratios, focus state requirements

### Secondary (MEDIUM confidence)
- Premium consultancy site analysis (Palantir, Thoughtworks, IDEO, BCG Platinion, Two Sigma, Atomic Object) — feature taxonomy, elite execution signals, what "premium" means in practice
- Community consensus on Next.js App Router component patterns — three-tier classification, server/client component boundaries
- CSS IntersectionObserver documentation and MDN — scroll-triggered animation patterns

### Tertiary (LOW confidence / inferred)
- Library version numbers (all marked [VERIFY] in STACK.md) — based on knowledge through August 2025; must be verified with `npm view <package> version` before project bootstrap
- "3 simultaneous animated elements" rule — heuristic from animation performance research, not a formal specification; treat as a starting guideline subject to mobile device testing

---

*Research completed: 2026-02-22*
*Ready for roadmap: yes*
