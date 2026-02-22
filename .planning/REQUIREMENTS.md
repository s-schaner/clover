# Requirements: Clover Labs LLC Website

**Defined:** 2026-02-22
**Core Value:** Visitors immediately perceive Clover Labs as world-class engineers who solve hard problems

## v1 Requirements

Requirements for the skeleton/framework site. Each maps to roadmap phases.

### Foundation & Design System

- [ ] **FNDN-01**: Next.js 15 project scaffolded with TypeScript strict mode and App Router
- [ ] **FNDN-02**: Tailwind CSS v4 configured with B&W semantic color tokens (surface, on-surface, border, muted values)
- [ ] **FNDN-03**: Typography scale defined — Space Grotesk (headings), Inter (body), JetBrains Mono (code accents) via next/font
- [ ] **FNDN-04**: Spacing rhythm and design tokens defined as CSS custom properties in globals.css
- [ ] **FNDN-05**: All static content centralized in lib/constants.ts as single source of truth
- [ ] **FNDN-06**: TypeScript interfaces for all data shapes in lib/types.ts (ServiceItem, PortfolioItem, TeamMember, etc.)

### Navigation

- [ ] **NAV-01**: Sticky header with anchor links to each section (Hero, Services, Portfolio, Team, Contact)
- [ ] **NAV-02**: Scroll-spy active state — nav highlights current section based on scroll position
- [ ] **NAV-03**: Mobile hamburger menu with overlay and proper focus management
- [ ] **NAV-04**: Logo/wordmark ("Clover Labs") displayed in navigation header
- [ ] **NAV-05**: Smooth scroll behavior on anchor link clicks

### Hero

- [ ] **HERO-01**: Full-viewport-height hero section as the landing visual
- [ ] **HERO-02**: Bold positioning tagline that communicates elite engineering capability
- [ ] **HERO-03**: Animated geometric fractal background as signature visual moment (SVG-based, viewport-triggered)

### Services

- [ ] **SERV-01**: 3-6 capability area cards displaying what Clover Labs builds
- [ ] **SERV-02**: Technical descriptions for each capability — precise engineering language, not marketing fluff
- [ ] **SERV-03**: Minimal geometric icons or visual indicators per capability card

### Portfolio

- [ ] **PORT-01**: Capability category groupings (e.g., AI/ML, Cloud Infrastructure, Custom Software)
- [ ] **PORT-02**: Placeholder project cards with correct anatomy — title, type, outcome metric, tech tags
- [ ] **PORT-03**: Category filtering — click a category to filter visible project cards

### Team

- [ ] **TEAM-01**: Profile cards for all 4 owners — Mike Wong, Matt Drapp, Peter Kwon, Stefan Schaner (real names from day one)
- [ ] **TEAM-02**: Geometric or initial-based avatar placeholders (not stock photos)
- [ ] **TEAM-03**: Role/title display for each owner (placeholder titles)
- [ ] **TEAM-04**: Social/LinkedIn link icons per profile (placeholder href values)

### Contact

- [ ] **CONT-01**: Contact form with name, email, and message fields — submit visually disabled with clear "Coming Soon" label
- [ ] **CONT-02**: Company email address displayed as clickable mailto link
- [ ] **CONT-03**: Location display showing Ashburn, Virginia with minimal pin graphic or geographic element

### Visual & Animation

- [ ] **VISL-01**: Pure black & white color system — no accent colors, contrast and typography carry hierarchy
- [ ] **VISL-02**: Geometric fractal SVG patterns as subtle background textures (controlled opacity, accent not wallpaper)
- [ ] **VISL-03**: Scroll-triggered fade-in animations on viewport entry (not on mount), respects prefers-reduced-motion
- [ ] **VISL-04**: Staggered children animations for card grids and list items
- [ ] **VISL-05**: Hover lift/scale micro-interactions on interactive elements (cards, buttons, links)
- [ ] **VISL-06**: Section alternation pattern — dark/light/dark/light rhythm using value contrast

### Layout & Responsive

- [ ] **LAYT-01**: Hybrid single-page scroll with anchor navigation (structured for future multi-page split)
- [ ] **LAYT-02**: Fully responsive across desktop (1440px+), tablet (768px), and mobile (375px)
- [ ] **LAYT-03**: Section wrapper component providing consistent vertical rhythm, anchor IDs, and scroll-margin-top
- [ ] **LAYT-04**: Minimalist geometry — clean lines, sharp angles, asymmetric layout moments, generous whitespace (120-160px section padding)

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
| FNDN-01 | — | Pending |
| FNDN-02 | — | Pending |
| FNDN-03 | — | Pending |
| FNDN-04 | — | Pending |
| FNDN-05 | — | Pending |
| FNDN-06 | — | Pending |
| NAV-01 | — | Pending |
| NAV-02 | — | Pending |
| NAV-03 | — | Pending |
| NAV-04 | — | Pending |
| NAV-05 | — | Pending |
| HERO-01 | — | Pending |
| HERO-02 | — | Pending |
| HERO-03 | — | Pending |
| SERV-01 | — | Pending |
| SERV-02 | — | Pending |
| SERV-03 | — | Pending |
| PORT-01 | — | Pending |
| PORT-02 | — | Pending |
| PORT-03 | — | Pending |
| TEAM-01 | — | Pending |
| TEAM-02 | — | Pending |
| TEAM-03 | — | Pending |
| TEAM-04 | — | Pending |
| CONT-01 | — | Pending |
| CONT-02 | — | Pending |
| CONT-03 | — | Pending |
| VISL-01 | — | Pending |
| VISL-02 | — | Pending |
| VISL-03 | — | Pending |
| VISL-04 | — | Pending |
| VISL-05 | — | Pending |
| VISL-06 | — | Pending |
| LAYT-01 | — | Pending |
| LAYT-02 | — | Pending |
| LAYT-03 | — | Pending |
| LAYT-04 | — | Pending |

**Coverage:**
- v1 requirements: 37 total
- Mapped to phases: 0 (pending roadmap)
- Unmapped: 37

---
*Requirements defined: 2026-02-22*
*Last updated: 2026-02-22 after initial definition*
