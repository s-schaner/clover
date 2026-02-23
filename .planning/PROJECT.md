# Clover Labs LLC

## What This Is

Skeleton business website for Clover Labs LLC — a small, high-end technology consultancy in Ashburn, Virginia. A pure black-and-white, geometric fractal-accented Next.js site with five content sections (Hero, Services, Portfolio, Team, Contact), sticky navigation with scroll-spy, and a four-leaf clover brand animation. The design language, section structure, and visual identity are established as a framework for the mature production site.

## Core Value

Visitors immediately perceive Clover Labs as world-class engineers who solve hard problems — the site radiates technical depth and premium craftsmanship.

## Requirements

### Validated

- Hero section with bold tagline ("We build the systems other firms call impossible") and animated four-leaf clover SVG background — v1.0
- Services section with 5 capability cards (AI/ML, Cloud Infrastructure, Custom Software, Data Engineering, Security) and hand-crafted geometric SVG icons — v1.0
- Portfolio section with 5 category filter pills and placeholder project cards with correct anatomy (title, type, metric, tech tags) — v1.0
- Team section with SVG monogram avatars for 4 owners (Mike Wong, Matt Drapp, Peter Kwon, Stefan Schaner) and social link icons — v1.0
- Contact section with disabled "Coming Soon" form, mailto link (hello@cloverlabs.io), and Ashburn, VA location with SVG pin — v1.0
- Pure B&W design system — 14 semantic color tokens, no accent colors, contrast and typography carry hierarchy — v1.0
- Geometric fractal SVG patterns as subtle background textures (6% dark, 4% light opacity) — v1.0 (evolved from circuit board to four-leaf clover brand mark)
- Minimalist geometry — clean lines, generous whitespace, clamp() responsive spacing — v1.0
- Scroll-triggered animations (fade-in, diagonal stagger, hover lift), respects prefers-reduced-motion — v1.0
- Hybrid single-page scroll with anchor navigation, structured for future multi-page split — v1.0
- Sticky navigation with scroll-spy, mobile hamburger with focus trap — v1.0
- Fully responsive across 375px mobile, 768px tablet, 1440px+ desktop — v1.0
- Next.js 16 + TypeScript strict + Tailwind CSS v4 + Framer Motion 12 — v1.0

### Active

(No active requirements — next milestone not yet planned)

### Out of Scope

- Backend API / server-side logic — skeleton site only, no functional backend
- Real contact form submission — form is visual placeholder, no email/webhook
- CMS or content management — content hardcoded in lib/constants.ts
- SEO optimization (metadata, OpenGraph, sitemap) — deferred to mature site
- Analytics / tracking — not needed for skeleton
- Blog section — deferred until real content exists
- OAuth / authentication — no user accounts needed
- Color accent / branding colors — pure B&W design constraint for v1
- Mobile app — web only
- Dark mode toggle — B&W inversion deferred to v2
- Client logos / testimonials — require real clients
- Case study detail pages — require real project write-ups

## Context

- **Company:** Clover Labs LLC, 4-person ownership (Mike Wong, Matt Drapp, Peter Kwon, Stefan Schaner)
- **Location:** Ashburn, Virginia
- **Business:** High-end technology consultancy building end-to-end custom solutions for exclusive clients
- **Shipped:** v1.0 skeleton site (2026-02-23)
- **Codebase:** 2,313 lines TypeScript/CSS source + 869 lines documentation, Next.js 16.1.6 / React 19.2.3 / Tailwind CSS v4.2.0 / Framer Motion 12.34.3
- **Design direction:** "Geometric fractal engineering" — four-leaf clover brand mark, recursive grid patterns, B&W with typography-driven hierarchy
- **Team profiles:** Placeholder titles ("Co-Founder & Principal Engineer") — real bios, photos, titles pending owner confirmation
- **Portfolio:** 5 capability categories (AI/ML, Cloud Infrastructure, Custom Software, Data Engineering, Security) with 4 placeholder project cards
- **Contact:** Email placeholder (hello@cloverlabs.io) pending real domain confirmation
- **Known tech debt:** 2 orphaned constants (PATTERN_CONFIG, SECTIONS), manual NAV_HEIGHT sync, ContactForm custom focus style

## Constraints

- **Tech stack**: Next.js 16 + TypeScript strict + Tailwind CSS v4 + Framer Motion 12
- **Design**: Pure black & white only — no accent colors permitted
- **Scope**: Skeleton/framework site — placeholder content is expected and acceptable
- **Architecture**: Hybrid single-page scroll now, must be structured to split into multi-page later
- **Fonts**: Space Grotesk (headings), Inter (body), JetBrains Mono (code accents) via next/font self-hosting
- **Animation**: CSS keyframes for hero (SSR-safe), Framer Motion for scroll/hover (client-side)

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Next.js 16 + TypeScript strict | Static site capability with room to grow; latest stable versions | Good — clean DX, fast builds |
| Pure B&W, no accent color | Maximum contrast, typography-driven design, premium engineering aesthetic | Good — distinctive, clean |
| Hybrid single-page scroll | Quick to build, modern feel, structured for multi-page split later | Good — works well for skeleton |
| Placeholder content throughout | Skeleton site — real content in mature site phase | Good — framework validated |
| Four-leaf clover brand mark | Evolved from circuit board during Phase 3; clover = Clover Labs brand identity | Good — unique, memorable |
| Tailwind CSS v4 with @theme inline | New syntax for font family var() references; clamp() tokens in :root not @theme | Revisit — v4 still maturing |
| Framer Motion 12 manual stagger | staggerChildren deprecated in v12; manual (row+col)*interval delay per item | Good — diagonal cascade works |
| CSS keyframes for hero animation | SSR-safe, no hydration mismatch, no JS overhead for signature visual | Good — performs well |
| HoverLift built into card atoms | Prevents double-wrapping in sections; section components stay simple | Good — clean composition |
| data-scroll-behavior + CSS rule | Next.js 16 reads data attribute for router; CSS rule needed separately for browser | Revisit — confusing API |
| 100dvh for hero height | dvh accounts for mobile browser chrome (iOS Safari address bar) | Good — hero fits viewport |
| optimizePackageImports for lucide-react | Tree-shakes 500+ icons to only Menu + X (15.5KB chunk) | Good — significant bundle savings |

---
*Last updated: 2026-02-23 after v1.0 milestone*
