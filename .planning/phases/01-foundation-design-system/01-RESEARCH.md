# Phase 1: Foundation & Design System - Research

**Researched:** 2026-02-22
**Domain:** Next.js 16 project scaffolding, Tailwind CSS v4 @theme token system, next/font, TypeScript data contracts
**Confidence:** HIGH (all major findings verified against official docs and live npm registry)

---

## Summary

This phase establishes the project's technical and design foundation: a compiling Next.js project with a complete design language and typed data contracts. Three areas required deep Phase 1-specific investigation beyond what project-level research covered:

**First**, the version landscape has shifted significantly since project research was completed. The npm `latest` tag for `next` now resolves to **16.1.6**, not 15.x. React is at **19.2.4**, and `framer-motion` is at **12.34.3**. Next.js 16 has meaningful breaking changes for new projects: Turbopack is the default bundler (no flag needed), `next lint` is removed, `next build` no longer runs linting automatically, and `smooth-scroll` override behavior changed (requires `data-scroll-behavior="smooth"` attribute on `<html>`).

**Second**, Tailwind CSS v4 at **4.2.0** uses a purely CSS-native configuration model. There is no `tailwind.config.ts` for design tokens — all tokens are declared via `@theme {}` directives in `globals.css`. The `@import "tailwindcss"` replaces the old `@tailwind base/components/utilities` directives. PostCSS config uses `@tailwindcss/postcss` not `tailwindcss`. This is a breaking departure from v3 patterns.

**Third**, the data contracts in `lib/types.ts` and content in `lib/constants.ts` need to anticipate all downstream phase requirements (phases 2-6), not just phase 1 itself. These files are created once in phase 1 and consumed by all subsequent phases. Getting the shape right now prevents rework.

**Primary recommendation:** Use `npx create-next-app@latest clover --yes` (which gives Next.js 16 + Turbopack + TypeScript + Tailwind v4 + App Router as defaults), then define the complete design token system in `globals.css` using `@theme {}`, and define the full data contract surface in `lib/types.ts` and `lib/constants.ts` covering all six phases.

---

## Standard Stack

### Core (verified via npm registry 2026-02-22)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| next | 16.1.6 | Framework with App Router, SSG, image optimization, font loading | Current latest; Turbopack default; React 19.2 included |
| react | 19.2.4 | UI library | Required peer for Next.js 16 |
| react-dom | 19.2.4 | DOM rendering | Required peer for Next.js 16 |
| typescript | 5.9.3 | Type system | Minimum 5.1 required by Next.js 16 |
| tailwindcss | 4.2.0 | Utility CSS with @theme token system | v4 is current stable; CSS-native config |
| @tailwindcss/postcss | (bundled with tailwindcss) | PostCSS plugin for v4 | Required for v4 — replaces old `tailwindcss` PostCSS plugin |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| framer-motion | 12.34.3 | Scroll-triggered animations, whileInView | Phase 3 onwards; installed now as peer, used later |
| lucide-react | 0.575.0 | Geometric stroke icons | Phase 4 card components |
| clsx | 2.1.1 | Conditional className composition | Any component that merges classes |
| sharp | 0.34.5 | Next.js image optimization (peer dep) | Required for next/image in non-static builds |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Turbopack (default) | Webpack (`next dev --webpack`) | Turbopack is now stable and default; no reason to revert unless custom webpack plugins are needed |
| ESLint (direct CLI) | Biome | Next.js 16 supports both; ESLint flat config is now the default format |
| @theme in globals.css | tailwind.config.ts | In v4, @theme is the canonical approach; tailwind.config.ts still works for plugins but is not needed for tokens |

### Installation

**Scaffold (recommended — uses defaults for Next.js 16):**

```bash
npx create-next-app@latest clover --yes
```

The `--yes` flag accepts the recommended defaults: TypeScript, ESLint, Tailwind CSS, App Router, Turbopack, import alias `@/*`. This creates a project with Tailwind v4 pre-configured.

**Then install animation and utility libraries:**

```bash
npm install framer-motion lucide-react clsx
```

**Verify versions after install:**

```bash
npm view next version          # should be 16.x
npm view tailwindcss version   # should be 4.x
npm view react version         # should be 19.x
npm view framer-motion version # should be 12.x
```

---

## Architecture Patterns

### Recommended Project Structure

The project-level ARCHITECTURE.md defines the canonical structure. Phase 1 creates the following subset:

```
clover/
├── app/
│   ├── layout.tsx          # Root layout: HTML shell, font variable classes, globals.css import
│   ├── page.tsx            # Minimal placeholder (just renders <main>Hello</main>)
│   └── globals.css         # @import "tailwindcss"; @theme {}; CSS custom properties; base layer
│
├── lib/
│   ├── types.ts            # All TypeScript interfaces — covers ALL phases 1-6
│   └── constants.ts        # All static content — covers ALL phases 1-6
│
├── postcss.config.mjs      # @tailwindcss/postcss plugin (created by create-next-app)
├── next.config.ts          # Minimal config — no output:'export' initially
├── tsconfig.json           # strict: true, paths: @/* → ./src/*
└── package.json
```

Note: `tailwind.config.ts` is NOT needed for Phase 1. Tailwind v4 reads all token definitions from the `@theme {}` block in `globals.css`.

### Pattern 1: Tailwind v4 Token Definition via @theme

**What:** All design tokens (colors, fonts, spacing, animations) declared as CSS custom properties inside `@theme {}` in `globals.css`. The `@theme` block both creates CSS variables AND generates Tailwind utility classes.

**When to use:** All design token declarations. Not for component-scoped styles (use `@layer components` for that).

**Example (complete globals.css for this project):**

```css
/* app/globals.css */
/* Source: https://tailwindcss.com/docs/theme + https://tailwindcss.com/docs/installation/framework-guides/nextjs */
@import "tailwindcss";

/* ============================================================
   THEME: Tailwind v4 token definitions
   @theme creates BOTH CSS variables AND utility classes
   e.g., --color-surface: #000 → bg-surface, text-surface, etc.
   ============================================================ */
@theme {
  /* --- B&W Color System: Semantic tokens (no raw hex in components) --- */
  /* Dark surface (dark sections, hero, portfolio, contact) */
  --color-surface:            #000000;   /* bg-surface */
  --color-surface-raised:     #0a0a0a;   /* bg-surface-raised — subtle card lift on dark */
  --color-surface-border:     #1a1a1a;   /* border-surface-border */
  --color-on-surface:         #ffffff;   /* text-on-surface */
  --color-on-surface-muted:   #888888;   /* text-on-surface-muted */
  --color-on-surface-subtle:  #555555;   /* text-on-surface-subtle */

  /* Light surface (services, team sections — section alternation) */
  --color-surface-light:      #f5f5f5;   /* bg-surface-light */
  --color-surface-light-raised: #ffffff; /* bg-surface-light-raised */
  --color-surface-light-border: #e0e0e0; /* border-surface-light-border */
  --color-on-surface-light:   #000000;   /* text-on-surface-light */
  --color-on-surface-light-muted: #555555; /* text-on-surface-light-muted */
  --color-on-surface-light-subtle: #888888; /* text-on-surface-light-subtle */

  /* Pure anchors */
  --color-black:              #000000;
  --color-white:              #ffffff;

  /* --- Font families (reference CSS vars set by next/font via layout.tsx) --- */
  /* These use @theme inline to reference the variables injected by next/font */
  --font-display:  var(--font-space-grotesk), sans-serif;  /* headings */
  --font-body:     var(--font-inter), sans-serif;           /* body copy */
  --font-mono:     var(--font-jetbrains-mono), monospace;   /* code, tech labels */

  /* --- Animation durations --- */
  --duration-fast:    150ms;
  --duration-base:    300ms;
  --duration-slow:    600ms;
  --ease-out:         cubic-bezier(0.0, 0.0, 0.2, 1);
  --ease-in-out:      cubic-bezier(0.4, 0.0, 0.2, 1);
  --ease-premium:     cubic-bezier(0.21, 0.47, 0.32, 0.98);
}

/* ============================================================
   NON-THEME CSS CUSTOM PROPERTIES
   These are NOT Tailwind tokens (they don't generate utilities).
   Used in CSS rules only (spacing, pattern opacity, nav height).
   ============================================================ */
:root {
  /* Navigation */
  --nav-height: 80px;

  /* Section spacing rhythm */
  --section-padding-y:  clamp(5rem, 10vw, 10rem);    /* ~80–160px */
  --section-padding-x:  clamp(1.5rem, 5vw, 6rem);

  /* Card internals */
  --card-padding:   2rem;
  --gap-grid:       1.5rem;

  /* Typography (fluid, non-utility scale for hero/headings) */
  --text-hero:      clamp(3rem, 8vw, 7rem);
  --text-section:   clamp(1.75rem, 4vw, 3rem);

  /* Pattern opacity budget (LOCKED — do not exceed) */
  --pattern-opacity-dark:   0.06;  /* geometric fractals on dark bg: max 0.08 */
  --pattern-opacity-light:  0.04;  /* geometric fractals on light bg: max 0.05 */
  --pattern-size:           40px;
}

/* ============================================================
   BASE LAYER: Global resets and defaults
   ============================================================ */
@layer base {
  * {
    box-sizing: border-box;
  }

  html {
    /* Next.js 16 REMOVED automatic smooth scroll override.
       Add data-scroll-behavior="smooth" to <html> in layout.tsx
       to retain smooth anchor navigation. Do NOT set scroll-behavior
       here — it will apply globally and interfere with Next.js routing. */
  }

  body {
    background-color: var(--color-surface);
    color: var(--color-on-surface);
    font-family: var(--font-body);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  /* Focus rings — work without color for B&W accessibility */
  :focus-visible {
    outline: 2px solid var(--color-on-surface);
    outline-offset: 2px;
  }
}

/* ============================================================
   COMPONENT LAYER: Reusable CSS class patterns
   ============================================================ */
@layer components {
  /* Section variants */
  .section-dark {
    background-color: var(--color-surface);
    color: var(--color-on-surface);
  }

  .section-light {
    background-color: var(--color-surface-light);
    color: var(--color-on-surface-light);
  }

  /* Scroll-triggered animation classes (used by motion/ wrappers) */
  .fade-in-scroll {
    opacity: 0;
    transform: translateY(24px);
    transition:
      opacity  var(--duration-slow) var(--ease-out),
      transform var(--duration-slow) var(--ease-out);
  }

  .fade-in-scroll.is-visible {
    opacity: 1;
    transform: translateY(0);
  }

  @media (prefers-reduced-motion: reduce) {
    .fade-in-scroll {
      opacity: 1;
      transform: none;
      transition: none;
    }
  }
}
```

### Pattern 2: next/font with Variable Fonts

**What:** Load Space Grotesk, Inter, and JetBrains Mono via `next/font/google` in `app/layout.tsx`. Use the `variable` option to inject CSS custom properties that are then referenced in the `@theme` block.

**When to use:** Root layout only. All font loading happens once here.

**Critical detail:** The `@theme` font variables must reference the CSS vars that `next/font` injects, not hardcode font names. This is the `@theme inline` pattern.

```tsx
// app/layout.tsx
// Source: https://nextjs.org/docs/app/getting-started/fonts
import { Space_Grotesk, Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
  // Space Grotesk is a variable font — no weight needed
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  // Inter is a variable font — no weight array needed
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
  // JetBrains Mono is a variable font
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable}`}
      data-scroll-behavior="smooth"
      // data-scroll-behavior="smooth" is REQUIRED in Next.js 16 to enable
      // smooth anchor scroll behavior. The old automatic override was removed.
    >
      <body>{children}</body>
    </html>
  );
}
```

Then in `globals.css` `@theme`, reference those injected variables:

```css
@theme inline {
  /* The 'inline' modifier resolves the var() value, not a reference to it */
  --font-display:  var(--font-space-grotesk), sans-serif;
  --font-body:     var(--font-inter), sans-serif;
  --font-mono:     var(--font-jetbrains-mono), monospace;
}
```

### Pattern 3: next.config.ts for Next.js 16

**What:** Minimal `next.config.ts`. Key differences from prior research: `turbopack` is now top-level (not under `experimental`), `next lint` is removed so no ESLint config needed in next.config, `output: 'export'` is NOT recommended to start with (locks out Vercel image optimization).

```ts
// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Turbopack config (formerly experimental.turbopack) — top-level in Next.js 16
  // For this project, no custom Turbopack config is needed

  // Do NOT set output: 'export' unless you need pure static export.
  // Vercel native deployment (recommended) works without it.

  // Do NOT include eslint: {} — that option is removed in Next.js 16.
};

export default nextConfig;
```

### Pattern 4: TypeScript Data Contracts (All Phases)

**What:** `lib/types.ts` defines all interfaces that downstream phases will consume. `lib/constants.ts` provides the single source of truth for all content. Both must anticipate phases 2-6 completely.

**Required interfaces (derived from phases 2-6 requirements):**

```typescript
// lib/types.ts

// -------------------------
// Navigation (Phase 2)
// -------------------------

export interface NavLink {
  label: string;
  href: string;       // '#section-id' for single-page, '/route' when split
  sectionId: string;  // anchor ID without '#', used for scroll-spy matching
}

// -------------------------
// Services Section (Phase 4-5: SERV-01, SERV-02, SERV-03)
// -------------------------

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  iconName?: string;  // lucide-react icon name, optional placeholder
}

// -------------------------
// Portfolio Section (Phase 4-5: PORT-01, PORT-02, PORT-03)
// -------------------------

export type PortfolioCategory =
  | 'AI/ML'
  | 'Cloud Infrastructure'
  | 'Custom Software'
  | 'Data Engineering'
  | 'Security';

export interface TechTag {
  label: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  projectType: string;          // e.g., "System Architecture", "MVP Development"
  category: PortfolioCategory;
  outcomeMetric?: string;        // placeholder outcome, e.g., "3x throughput improvement"
  tags: TechTag[];
  status: 'placeholder';         // all skeleton items are placeholder
}

// -------------------------
// Team Section (Phase 4-5: TEAM-01, TEAM-02, TEAM-03, TEAM-04)
// -------------------------

export interface SocialLink {
  platform: 'linkedin' | 'github' | 'twitter';
  href: string;        // placeholder href '#' until real links are known
}

export interface TeamMember {
  id: string;
  name: string;        // Real name from day one (not placeholder)
  role: string;        // placeholder title until confirmed
  bio?: string;        // placeholder bio or empty
  initials: string;    // For geometric avatar: e.g., "MW" for Mike Wong
  socialLinks: SocialLink[];
}

// -------------------------
// Contact Section (Phase 5: CONT-01, CONT-02, CONT-03)
// -------------------------

export interface ContactInfo {
  email: string;         // real company email
  location: string;      // "Ashburn, Virginia"
  locationShort: string; // "Ashburn, VA"
}

// -------------------------
// Section Configuration (Phase 2, 5: LAYT-01, LAYT-03)
// -------------------------

export interface SectionConfig {
  id: string;           // anchor ID (no '#') — used in href AND IntersectionObserver
  label: string;        // human-readable section name
  theme: 'dark' | 'light'; // section alternation pattern
}

// -------------------------
// Design System Metadata (Phase 1)
// -------------------------

export interface PatternConfig {
  opacityDark: number;    // max 0.08 — geometric fractals on dark backgrounds
  opacityLight: number;   // max 0.05 — geometric fractals on light backgrounds
  sizePx: number;         // base grid unit in pixels
}
```

**Required constants (lib/constants.ts):**

```typescript
// lib/constants.ts
import type {
  NavLink,
  ServiceItem,
  PortfolioItem,
  PortfolioCategory,
  TeamMember,
  ContactInfo,
  SectionConfig,
  PatternConfig,
} from './types';

// -------------------------
// Navigation
// -------------------------

export const SECTION_IDS = {
  HERO:      'hero',
  SERVICES:  'services',
  PORTFOLIO: 'portfolio',
  TEAM:      'team',
  CONTACT:   'contact',
} as const;

export const NAV_LINKS: NavLink[] = [
  { label: 'Services',  href: `#${SECTION_IDS.SERVICES}`,  sectionId: SECTION_IDS.SERVICES },
  { label: 'Portfolio', href: `#${SECTION_IDS.PORTFOLIO}`, sectionId: SECTION_IDS.PORTFOLIO },
  { label: 'Team',      href: `#${SECTION_IDS.TEAM}`,      sectionId: SECTION_IDS.TEAM },
  { label: 'Contact',   href: `#${SECTION_IDS.CONTACT}`,   sectionId: SECTION_IDS.CONTACT },
];

// -------------------------
// Section Metadata
// -------------------------

export const SECTIONS: SectionConfig[] = [
  { id: SECTION_IDS.HERO,      label: 'Hero',      theme: 'dark' },
  { id: SECTION_IDS.SERVICES,  label: 'Services',  theme: 'light' },
  { id: SECTION_IDS.PORTFOLIO, label: 'Portfolio', theme: 'dark' },
  { id: SECTION_IDS.TEAM,      label: 'Team',      theme: 'light' },
  { id: SECTION_IDS.CONTACT,   label: 'Contact',   theme: 'dark' },
];

// -------------------------
// Hero
// -------------------------

export const HERO_CONTENT = {
  tagline: 'We build the systems other firms call impossible.',
  subheading: 'Clover Labs is a technology consultancy that solves hard infrastructure, AI, and software problems for clients who cannot afford failure.',
  ctaLabel: 'See our work',
  ctaHref: `#${SECTION_IDS.PORTFOLIO}`,
} as const;

// -------------------------
// Services
// -------------------------

export const SERVICES: ServiceItem[] = [
  {
    id: 'ai-ml',
    title: 'AI & Machine Learning',
    description: 'Production ML systems, LLM integration, and custom model development for real-world constraints — latency, cost, and accuracy at scale.',
    iconName: 'cpu',
  },
  {
    id: 'cloud-infrastructure',
    title: 'Cloud Infrastructure',
    description: 'Kubernetes, Terraform, and cloud-native architecture for organizations that need reliability, not just availability.',
    iconName: 'cloud',
  },
  {
    id: 'custom-software',
    title: 'Custom Software Engineering',
    description: 'Full-stack systems designed from the data model outward. We build the thing correctly, not the thing quickly.',
    iconName: 'code',
  },
  {
    id: 'data-engineering',
    title: 'Data Engineering',
    description: 'Data pipelines, warehousing, and observability for teams whose business decisions depend on accurate, timely data.',
    iconName: 'database',
  },
  {
    id: 'security',
    title: 'Security Engineering',
    description: 'Threat modeling, secure architecture review, and security implementation for high-value systems.',
    iconName: 'shield',
  },
];

// -------------------------
// Portfolio
// -------------------------

export const PORTFOLIO_CATEGORIES: PortfolioCategory[] = [
  'AI/ML',
  'Cloud Infrastructure',
  'Custom Software',
  'Data Engineering',
  'Security',
];

export const PORTFOLIO_ITEMS: PortfolioItem[] = [
  {
    id: 'port-001',
    title: 'Real-Time Inference Pipeline',
    projectType: 'ML Infrastructure',
    category: 'AI/ML',
    outcomeMetric: 'Placeholder — outcome metric here',
    tags: [{ label: 'PyTorch' }, { label: 'Kubernetes' }, { label: 'gRPC' }],
    status: 'placeholder',
  },
  {
    id: 'port-002',
    title: 'Multi-Region Platform Migration',
    projectType: 'Cloud Architecture',
    category: 'Cloud Infrastructure',
    outcomeMetric: 'Placeholder — outcome metric here',
    tags: [{ label: 'Terraform' }, { label: 'AWS' }, { label: 'Kubernetes' }],
    status: 'placeholder',
  },
  {
    id: 'port-003',
    title: 'Document Intelligence System',
    projectType: 'Custom Software',
    category: 'Custom Software',
    outcomeMetric: 'Placeholder — outcome metric here',
    tags: [{ label: 'Next.js' }, { label: 'PostgreSQL' }, { label: 'LLM' }],
    status: 'placeholder',
  },
  {
    id: 'port-004',
    title: 'Event-Driven Data Platform',
    projectType: 'Data Engineering',
    category: 'Data Engineering',
    outcomeMetric: 'Placeholder — outcome metric here',
    tags: [{ label: 'Kafka' }, { label: 'dbt' }, { label: 'Snowflake' }],
    status: 'placeholder',
  },
];

// -------------------------
// Team (real names from day one — FNDN-05)
// -------------------------

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'mike-wong',
    name: 'Mike Wong',
    role: 'Co-Founder & Principal Engineer',  // placeholder title — confirm
    initials: 'MW',
    socialLinks: [
      { platform: 'linkedin', href: '#' },
      { platform: 'github',   href: '#' },
    ],
  },
  {
    id: 'matt-drapp',
    name: 'Matt Drapp',
    role: 'Co-Founder & Principal Engineer',  // placeholder title — confirm
    initials: 'MD',
    socialLinks: [
      { platform: 'linkedin', href: '#' },
      { platform: 'github',   href: '#' },
    ],
  },
  {
    id: 'peter-kwon',
    name: 'Peter Kwon',
    role: 'Co-Founder & Principal Engineer',  // placeholder title — confirm
    initials: 'PK',
    socialLinks: [
      { platform: 'linkedin', href: '#' },
      { platform: 'github',   href: '#' },
    ],
  },
  {
    id: 'stefan-schaner',
    name: 'Stefan Schaner',
    role: 'Co-Founder & Principal Engineer',  // placeholder title — confirm
    initials: 'SS',
    socialLinks: [
      { platform: 'linkedin', href: '#' },
      { platform: 'github',   href: '#' },
    ],
  },
];

// -------------------------
// Contact
// -------------------------

export const CONTACT: ContactInfo = {
  email: 'hello@cloverlabs.io',      // placeholder — confirm real email
  location: 'Ashburn, Virginia',
  locationShort: 'Ashburn, VA',
};

// -------------------------
// Design System Constants
// -------------------------

export const PATTERN_CONFIG: PatternConfig = {
  opacityDark: 0.06,    // geometric fractal opacity on dark backgrounds (max 0.08)
  opacityLight: 0.04,   // geometric fractal opacity on light backgrounds (max 0.05)
  sizePx: 40,
};

export const NAV_HEIGHT_PX = 80;

export const COMPANY = {
  name: 'Clover Labs',
  fullName: 'Clover Labs LLC',
  tagline: 'We build the systems other firms call impossible.',
} as const;
```

### Anti-Patterns to Avoid

- **Using `tailwind.config.ts` for color tokens in v4:** Not wrong but unnecessary for token definitions. Use `@theme {}` in globals.css instead. `tailwind.config.ts` is only needed for plugins (if any are added later).
- **Setting `--color-*` in `:root` instead of `@theme`:** `:root` variables do NOT generate utility classes. Only `@theme` creates both CSS vars AND `bg-`, `text-`, `border-` utilities.
- **Using `@tailwind base/components/utilities` directives:** These are v3 syntax. v4 uses `@import "tailwindcss"` only.
- **Using `next lint` in package.json scripts:** This command is removed in Next.js 16. Use `eslint` directly.
- **Setting `scroll-behavior: smooth` in CSS globally:** Next.js 16 no longer overrides this during navigation, which can cause smooth scroll to apply to page transitions. Use `data-scroll-behavior="smooth"` on `<html>` instead.
- **Hardcoding font names in @theme without `@theme inline`:** Without the `inline` modifier, Tailwind generates `var(--font-inter)` references in CSS, which resolve correctly only if the variable is present. Use `@theme inline` for vars that reference other CSS vars.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Font loading with zero layout shift | Custom `<link>` tags with preload hints | `next/font/google` | next/font self-hosts, eliminates FOUT, handles display strategy |
| Image optimization | Custom `<img>` with srcset | `next/image` | Automatic WebP, lazy loading, size hints, aspect ratio enforcement |
| Class merging | String concatenation or template literals | `clsx` | Handles conditional classes, deduplication, undefined handling |
| TypeScript strict null handling | Custom type guards | `strict: true` in tsconfig | Compiler enforces nullability everywhere |
| Icon SVGs | Hand-drawn SVG components for common icons | `lucide-react` | Tree-shakeable, consistent 1px stroke geometry, TypeScript props |

**Key insight:** Phase 1 has very few "don't hand-roll" problems because this phase is mostly configuration and declarations, not logic. The one area where this matters most is font loading — `next/font` is significantly better than manual alternatives.

---

## Common Pitfalls

### Pitfall 1: Using Next.js 15 Patterns in a Next.js 16 Project

**What goes wrong:** The existing project research (STACK.md, ARCHITECTURE.md) was written when Next.js 15.x was current. Creating the project with `create-next-app@latest` now installs **Next.js 16**. Multiple patterns from the research docs are wrong or deprecated.

**Why it happens:** npm's `latest` tag now resolves to 16.1.6, not 15.x. The next.config.ts examples, lint configuration, and scroll behavior guidance in STACK.md are outdated.

**Specific outdated patterns to avoid:**
- `turbopack` under `experimental` → now top-level
- `--no-turbopack` flag → Turbopack is default, use `--webpack` to opt out
- `"lint": "next lint"` in package.json → `next lint` command is removed; use `"lint": "eslint"` directly
- `eslint: {}` in next.config.ts → removed option, throws error
- Relying on automatic `scroll-behavior: smooth` override → removed; use `data-scroll-behavior="smooth"` attribute

**How to avoid:** Use the documentation from nextjs.org/docs with version selector set to 16. The upgrade guide at `/docs/app/guides/upgrading/version-16` is authoritative.

**Warning signs:** Build errors mentioning removed options; `next lint` not found; smooth scrolling not working on anchor clicks.

---

### Pitfall 2: @theme Variables Not Generating Utility Classes

**What goes wrong:** Colors defined in `:root {}` instead of `@theme {}` don't generate Tailwind utility classes (`bg-surface`, `text-on-surface`, etc.). The CSS variables work in custom CSS rules, but you cannot use them as Tailwind class names.

**Why it happens:** Tailwind v4's `@theme` is special syntax — it's not the same as `:root`. Only properties inside `@theme {}` instruct the compiler to generate utilities.

**How to avoid:** All design tokens that should be usable as utility classes MUST be in `@theme {}`. Non-token variables (nav height, pattern opacity, fluid spacing values not tied to Tailwind) go in `:root {}`.

**Warning signs:** `bg-surface` class not applying, TypeScript LSP not autocompleting Tailwind classes you defined.

---

### Pitfall 3: Font Variables Not Connected to @theme

**What goes wrong:** `next/font` injects CSS variables (`--font-space-grotesk`) into `<html>`, but if `@theme` doesn't reference them with `@theme inline`, the Tailwind `font-display` utility class won't work.

**Why it happens:** `@theme { --font-display: var(--font-space-grotesk) }` without `inline` stores the variable reference, not the resolved value. Tailwind generates the utility correctly, but whether it renders depends on timing. Using `@theme inline` resolves this.

**How to avoid:** Use `@theme inline {}` for font family declarations that reference other CSS variables:

```css
@theme inline {
  --font-display: var(--font-space-grotesk), sans-serif;
  --font-body: var(--font-inter), sans-serif;
  --font-mono: var(--font-jetbrains-mono), monospace;
}
```

**Warning signs:** `font-display` Tailwind class not rendering Space Grotesk.

---

### Pitfall 4: data-scroll-behavior Missing from html Element

**What goes wrong:** Anchor link clicks (`href="#services"`) don't smooth-scroll to the target section. The page jumps instantly.

**Why it happens:** Next.js 16 removed the automatic `scroll-behavior: smooth` override that Next.js 15 applied during client-side navigation. The global CSS `scroll-behavior: smooth` now applies to all scrolling including route changes, which causes issues. The new approach is the `data-scroll-behavior="smooth"` attribute on `<html>`.

**How to avoid:** Add `data-scroll-behavior="smooth"` to the `<html>` tag in `app/layout.tsx`. Do NOT set `scroll-behavior: smooth` in CSS.

**Warning signs:** Clicking nav anchor links jumps to section without animation.

---

### Pitfall 5: lib/constants.ts Only Contains Phase 1 Data

**What goes wrong:** Phase 1 creates `lib/constants.ts` with only what's needed for the compile check. Later phases have to modify this file, creating merge conflicts or missed exports. The whole point of `lib/constants.ts` is to be the single source of truth — it must be fully populated in Phase 1.

**Why it happens:** Temptation to defer team content ("we'll add real bios later"), portfolio content ("we'll figure out categories in Phase 4"), or contact info ("confirm the email address later").

**How to avoid:** Populate ALL content in Phase 1, even if it's placeholder-quality. Real names (Mike Wong, Matt Drapp, Peter Kwon, Stefan Schaner) must appear immediately. Placeholder role titles and bios are fine but must be present so Phase 4-5 components have data to render.

**Warning signs:** Phase 4 build tasks that modify `lib/constants.ts` — this is a red flag that Phase 1 was incomplete.

---

### Pitfall 6: PostCSS Config Missing @tailwindcss/postcss

**What goes wrong:** Tailwind v4 requires `@tailwindcss/postcss` as the PostCSS plugin, not the legacy `tailwindcss` plugin. If `postcss.config.mjs` uses the old pattern, Tailwind classes won't be processed.

**Why it happens:** The v3 PostCSS config was `{ plugins: { tailwindcss: {} } }`. v4 requires `{ plugins: { "@tailwindcss/postcss": {} } }`.

**How to avoid:** `create-next-app@latest` generates the correct v4 PostCSS config automatically. Only an issue if setting up manually or if a developer edits the PostCSS config.

**Correct config:**
```js
// postcss.config.mjs
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
export default config;
```

**Warning signs:** `@import "tailwindcss"` not working, Tailwind utility classes not applied.

---

## Code Examples

Verified patterns from official sources:

### Complete globals.css @theme block for B&W System

```css
/* Source: https://tailwindcss.com/docs/theme */
/* Source: https://nextjs.org/docs/app/getting-started/fonts */
@import "tailwindcss";

@theme {
  /* B&W semantic color tokens */
  --color-surface:              #000000;
  --color-surface-raised:       #0a0a0a;
  --color-surface-border:       #1a1a1a;
  --color-on-surface:           #ffffff;
  --color-on-surface-muted:     #888888;
  --color-on-surface-subtle:    #555555;
  --color-surface-light:        #f5f5f5;
  --color-surface-light-raised: #ffffff;
  --color-surface-light-border: #e0e0e0;
  --color-on-surface-light:     #000000;
  --color-on-surface-light-muted:   #555555;
  --color-on-surface-light-subtle:  #888888;
  --color-black:                #000000;
  --color-white:                #ffffff;
}

@theme inline {
  /* Font families — reference next/font CSS vars injected via layout.tsx */
  --font-display: var(--font-space-grotesk), sans-serif;
  --font-body:    var(--font-inter), sans-serif;
  --font-mono:    var(--font-jetbrains-mono), monospace;
}

:root {
  --nav-height: 80px;
  --section-padding-y: clamp(5rem, 10vw, 10rem);
  --section-padding-x: clamp(1.5rem, 5vw, 6rem);
  --pattern-opacity-dark: 0.06;
  --pattern-opacity-light: 0.04;
  --pattern-size: 40px;
}
```

### next/font Setup in layout.tsx

```tsx
// Source: https://nextjs.org/docs/app/getting-started/fonts
import { Space_Grotesk, Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable}`}
      data-scroll-behavior="smooth"
    >
      <body className="font-body">{children}</body>
    </html>
  );
}
```

### Minimal app/page.tsx (Phase 1 compile check)

```tsx
// app/page.tsx
export default function Home() {
  return (
    <main className="min-h-screen bg-surface text-on-surface">
      <p className="font-display text-section p-8">
        Clover Labs — Foundation
      </p>
    </main>
  );
}
```

This page verifies: Tailwind utilities (`bg-surface`, `text-on-surface`) work, font family utilities (`font-display`) resolve, no compilation errors exist.

### tsconfig.json (strict mode)

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `tailwind.config.ts` for all tokens | `@theme {}` in globals.css | Tailwind v4.0 (early 2025) | No JS config needed for tokens; CSS-native |
| `@tailwind base/components/utilities` | `@import "tailwindcss"` | Tailwind v4.0 | Single import replaces three directives |
| `tailwindcss` PostCSS plugin | `@tailwindcss/postcss` | Tailwind v4.0 | Different package name in postcss.config |
| `next lint` CLI command | `eslint` CLI directly | Next.js 16 (Oct 2025) | `next lint` removed; run ESLint via npm scripts |
| `next build` runs lint | Lint is separate step | Next.js 16 (Oct 2025) | Must add lint to CI separately |
| Automatic smooth scroll override | `data-scroll-behavior="smooth"` attribute | Next.js 16 (Oct 2025) | Must add attribute to `<html>` explicitly |
| `experimental.turbopack` | `turbopack` (top-level) | Next.js 16 (Oct 2025) | Config location changed |
| Next.js 15 as `latest` | Next.js **16.1.6** as `latest` | Oct 2025 | `create-next-app@latest` now installs v16 |
| React 18.x | React **19.2.4** | 2025 | New features: View Transitions, useEffectEvent |
| framer-motion 11.x | framer-motion **12.34.3** | 2025 | API compatibility — verify before Phase 3 |

**Deprecated/outdated:**

- `tailwindcss` as PostCSS plugin: replaced by `@tailwindcss/postcss`
- `tailwind.config.js/ts` for color/font tokens: replaced by `@theme {}` in CSS
- `next lint` command: removed in Next.js 16
- `eslint: {}` option in next.config.ts: removed in Next.js 16
- `middleware.ts` filename: deprecated in favor of `proxy.ts` (not relevant for this project)
- `serverRuntimeConfig` / `publicRuntimeConfig`: removed; use `.env` files

---

## Open Questions

### 1. Actual team roles and contact email

**What we know:** The four owner names are confirmed: Mike Wong, Matt Drapp, Peter Kwon, Stefan Schaner. The placeholder email `hello@cloverlabs.io` is used.

**What's unclear:** The real role titles for each owner and the confirmed company email address.

**Recommendation:** Use placeholder role titles in Phase 1. Flag the constants with `// placeholder — confirm before launch` comments. The build will succeed with placeholders; correction is a one-file change.

---

### 2. framer-motion 12.x API compatibility

**What we know:** framer-motion is now at 12.34.3 (vs 11.x assumed in prior research). The core `whileInView`, `motion.*`, and `useReducedMotion` APIs are expected to be stable across major versions.

**What's unclear:** Whether any Phase 3 animation patterns require API changes for v12.

**Recommendation:** Install framer-motion now but don't use it until Phase 3. When Phase 3 begins, verify the `whileInView` and `viewport={{ once: true }}` patterns against v12 documentation. Confidence is MEDIUM that these APIs are unchanged.

---

### 3. Clover Labs domain/email

**What we know:** Location is Ashburn, Virginia. Website is a marketing/skeleton site.

**What's unclear:** The actual domain (cloverlabs.io? cloverlabs.com?) and email format.

**Recommendation:** Use `hello@cloverlabs.io` as placeholder in constants.ts with a comment. This does not affect compilation or design system validation.

---

## Sources

### Primary (HIGH confidence)

- npm registry live queries (2026-02-22) — package versions for next, react, tailwindcss, framer-motion, typescript
- https://nextjs.org/blog/next-16 — Next.js 16 feature announcement and breaking changes
- https://nextjs.org/docs/app/guides/upgrading/version-16 — Official migration guide (doc-version: 16.1.6, last-updated: 2026-02-20)
- https://nextjs.org/docs/app/getting-started/installation — create-next-app current defaults (doc-version: 16.1.6)
- https://nextjs.org/docs/app/getting-started/fonts — next/font API (doc-version: 16.1.6, last-updated: 2026-02-20)
- https://tailwindcss.com/docs/theme — @theme directive documentation
- https://tailwindcss.com/docs/installation/framework-guides/nextjs — Tailwind v4 + Next.js installation
- https://tailwindcss.com/docs/adding-custom-styles — @layer and custom CSS in v4

### Secondary (MEDIUM confidence)

- https://tailwindcss.com/docs/configuration — v4 config overview (verified @theme is the standard)
- nextjs.org/docs/app/api-reference/config/next-config-js/output — output option docs (doc-version: 16.1.6)

### Tertiary (LOW confidence)

- None — all critical claims verified with official docs.

---

## Metadata

**Confidence breakdown:**

- Standard stack versions: HIGH — verified via live npm registry
- Tailwind v4 @theme syntax: HIGH — official Tailwind docs
- next/font integration: HIGH — official Next.js 16 docs
- Next.js 16 breaking changes: HIGH — official upgrade guide and release blog
- framer-motion 12.x API compatibility: MEDIUM — version confirmed, API stability assumed
- lib/types.ts interface shapes: HIGH — derived from REQUIREMENTS.md which is locked
- lib/constants.ts content: MEDIUM (structure HIGH, specific content values are placeholders)

**Research date:** 2026-02-22
**Valid until:** 2026-03-22 for stack versions (npm packages change); design token patterns are stable indefinitely
