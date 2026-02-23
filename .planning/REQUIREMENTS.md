# Requirements: Clover Labs LLC Website

**Defined:** 2026-02-22
**Core Value:** Visitors immediately perceive Clover Labs as world-class engineers who solve hard problems

## v1 Requirements

Requirements for the skeleton/framework site. Each maps to roadmap phases.

### Foundation & Design System

- [x] **FNDN-01**: Next.js 16 project scaffolded with TypeScript strict mode and App Router
- [x] **FNDN-02**: Tailwind CSS v4 configured with B&W semantic color tokens (surface, on-surface, border, muted values)
- [x] **FNDN-03**: Typography scale defined — Space Grotesk (headings), Inter (body), JetBrains Mono (code accents) via next/font
- [x] **FNDN-04**: Spacing rhythm and design tokens defined as CSS custom properties in globals.css
- [x] **FNDN-05**: All static content centralized in lib/constants.ts as single source of truth
- [x] **FNDN-06**: TypeScript interfaces for all data shapes in lib/types.ts (ServiceItem, PortfolioItem, TeamMember, etc.)

### Navigation

- [x] **NAV-01**: Sticky header with anchor links to each section (Hero, Services, Portfolio, Team, Contact)
- [x] **NAV-02**: Scroll-spy active state — nav highlights current section based on scroll position
- [x] **NAV-03**: Mobile hamburger menu with overlay and proper focus management
- [x] **NAV-04**: Logo/wordmark ("Clover Labs") displayed in navigation header
- [x] **NAV-05**: Smooth scroll behavior on anchor link clicks

### Hero

- [x] **HERO-01**: Full-viewport-height hero section as the landing visual
- [x] **HERO-02**: Bold positioning tagline that communicates elite engineering capability
- [x] **HERO-03**: Animated geometric fractal background as signature visual moment (SVG-based, viewport-triggered)

### Services

- [x] **SERV-01**: 3-6 capability area cards displaying what Clover Labs builds
- [x] **SERV-02**: Technical descriptions for each capability — precise engineering language, not marketing fluff
- [x] **SERV-03**: Minimal geometric icons or visual indicators per capability card

### Portfolio

- [x] **PORT-01**: Capability category groupings (e.g., AI/ML, Cloud Infrastructure, Custom Software)
- [x] **PORT-02**: Placeholder project cards with correct anatomy — title, type, outcome metric, tech tags
- [x] **PORT-03**: Category filtering — click a category to filter visible project cards

### Team

- [x] **TEAM-01**: Profile cards for all 4 owners — Mike Wong, Matt Drapp, Peter Kwon, Stefan Schaner (real names from day one)
- [x] **TEAM-02**: Geometric or initial-based avatar placeholders (not stock photos)
- [x] **TEAM-03**: Role/title display for each owner (placeholder titles)
- [x] **TEAM-04**: Social/LinkedIn link icons per profile (placeholder href values)

### Contact

- [x] **CONT-01**: Contact form with name, email, and message fields — submit visually disabled with clear "Coming Soon" label
- [x] **CONT-02**: Company email address displayed as clickable mailto link
- [x] **CONT-03**: Location display showing Ashburn, Virginia with minimal pin graphic or geographic element

### Visual & Animation

- [x] **VISL-01**: Pure black & white color system — no accent colors, contrast and typography carry hierarchy
- [x] **VISL-02**: Geometric fractal SVG patterns as subtle background textures (controlled opacity, accent not wallpaper)
- [x] **VISL-03**: Scroll-triggered fade-in animations on viewport entry (not on mount), respects prefers-reduced-motion
- [x] **VISL-04**: Staggered children animations for card grids and list items
- [x] **VISL-05**: Hover lift/scale micro-interactions on interactive elements (cards, buttons, links)
- [x] **VISL-06**: Section alternation pattern — dark/light/dark/light rhythm using value contrast

### Layout & Responsive

- [x] **LAYT-01**: Hybrid single-page scroll with anchor navigation (structured for future multi-page split)
- [x] **LAYT-02**: Fully responsive across desktop (1440px+), tablet (768px), and mobile (375px)
- [x] **LAYT-03**: Section wrapper component providing consistent vertical rhythm, anchor IDs, and scroll-margin-top
- [x] **LAYT-04**: Minimalist geometry — clean lines, sharp angles, asymmetric layout moments, generous whitespace (120-160px section padding)

## v2 Requirements

Deferred to mature site. Tracked but not in current roadmap.

### Content & Backend

- **BACK-01**: Real contact form submission (email/webhook integration)
- **BACK-02**: CMS integration for dynamic content management
- **BACK-03**: Blog / thought leadership section

### SEO & Analytics

- **SEO-01**: Full SEO metadata, OpenGraph tags, sitemap.xml
- **SEO-02**: Analytics integration (Google Analytics, Plausible, etc.)
- **SEO-03**: Performance monitoring and Core Web Vitals tracking

### Social Proof

- **SOCL-01**: Client logos / "Trusted By" section (requires real clients)
- **SOCL-02**: Testimonials section (requires real testimonials)
- **SOCL-03**: Case study detail pages with full project write-ups

### Advanced Visual

- **ADVS-01**: GSAP ScrollTrigger effects (parallax, pinning, scroll-scrubbing)
- **ADVS-02**: Page transition animations between multi-page routes
- **ADVS-03**: Dark mode toggle (invert the B&W system)

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| Backend API / server-side logic | Skeleton site only — no functional backend |
| Real contact form submission | Form is visual placeholder, no email/webhook processing |
| CMS or content management | Content is hardcoded placeholders in constants.ts |
| OAuth / authentication | No user accounts needed for marketing site |
| Blog section | Empty shelf problem — defer until real content exists |
| Client logos / testimonials | Placeholder logos/quotes signal absence of real credentials |
| Video backgrounds | Performance overhead, not aligned with minimalist B&W aesthetic |
| Mobile app | Web only |
| Color accent / branding colors | Pure B&W only for v1 — deliberate design constraint |
| Third-party UI component libraries | Bespoke design requires all custom components |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| FNDN-01 | Phase 1 | Complete |
| FNDN-02 | Phase 1 | Complete |
| FNDN-03 | Phase 1 | Complete |
| FNDN-04 | Phase 1 | Complete |
| FNDN-05 | Phase 1 | Complete |
| FNDN-06 | Phase 1 | Complete |
| NAV-01 | Phase 2 | Complete |
| NAV-02 | Phase 2 | Complete |
| NAV-03 | Phase 2 | Complete |
| NAV-04 | Phase 2 | Complete |
| NAV-05 | Phase 2 | Complete |
| HERO-01 | Phase 5 | Complete |
| HERO-02 | Phase 5 | Complete |
| HERO-03 | Phase 4 | Complete |
| SERV-01 | Phase 5 | Complete |
| SERV-02 | Phase 5 | Complete |
| SERV-03 | Phase 4 | Complete |
| PORT-01 | Phase 5 | Complete |
| PORT-02 | Phase 4 | Complete |
| PORT-03 | Phase 5 | Complete |
| TEAM-01 | Phase 5 | Complete |
| TEAM-02 | Phase 4 | Complete |
| TEAM-03 | Phase 5 | Complete |
| TEAM-04 | Phase 5 | Complete |
| CONT-01 | Phase 4 | Complete |
| CONT-02 | Phase 5 | Complete |
| CONT-03 | Phase 5 | Complete |
| VISL-01 | Phase 3 | Complete |
| VISL-02 | Phase 3 | Complete |
| VISL-03 | Phase 3 | Complete |
| VISL-04 | Phase 3 | Complete |
| VISL-05 | Phase 3 | Complete |
| VISL-06 | Phase 3 | Complete |
| LAYT-01 | Phase 2 | Complete |
| LAYT-02 | Phase 6 | Complete |
| LAYT-03 | Phase 2 | Complete |
| LAYT-04 | Phase 3 | Complete |

**Coverage:**
- v1 requirements: 37 total
- Mapped to phases: 37 (100%)
- Unmapped: 0

---
*Requirements defined: 2026-02-22*
*Last updated: 2026-02-23 after Phase 6 execution — LAYT-02 complete. All 37 v1 requirements satisfied.*
