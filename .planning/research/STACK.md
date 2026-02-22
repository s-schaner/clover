# STACK.md — Clover Labs LLC Website
## Technology Stack Research

**Project:** Skeleton/framework website for a high-end technology consultancy
**Design direction:** Pure B&W, circuit/grid patterns, minimalist geometry, scroll animations
**Architecture:** Next.js, hybrid single-page scroll with anchor nav, static export capable
**Research date:** 2026-02-22
**Researcher note:** Bash, WebSearch, and WebFetch tools were unavailable during this research session. Versions are based on knowledge through August 2025 and marked with confidence levels. Before locking the project, run `npm view <package> version` for each entry marked [VERIFY].

---

## Version Verification Commands

Run these before starting the project to confirm current stable versions:

```bash
npm view next version
npm view react version
npm view react-dom version
npm view typescript version
npm view tailwindcss version
npm view framer-motion version
npm view gsap version
npm view @vercel/analytics version
npm view sharp version
npm view clsx version
npm view lucide-react version
```

---

## Stack Summary Table

| Layer | Choice | Version (verify) | Confidence |
|---|---|---|---|
| Framework | Next.js | 15.x | HIGH |
| Language | TypeScript | 5.x | HIGH |
| Styling | Tailwind CSS v4 | 4.x | HIGH |
| Animation (scroll) | Framer Motion | 11.x | HIGH |
| Animation (complex) | GSAP | 3.x | HIGH |
| SVG patterns | Inline SVG + CSS | — | HIGH |
| Deployment | Vercel | — | HIGH |
| Font | next/font (Google Fonts) | bundled | HIGH |
| Icons | Lucide React | 0.4x | MEDIUM |
| Image optimization | next/image + sharp | bundled / 0.3x | HIGH |

---

## 1. Framework — Next.js 15

**Package:** `next`
**Version:** `15.x` (15.1 or later) [VERIFY]
**Confidence:** HIGH

### Why Next.js 15

Next.js 15 is the correct choice for this project for several compounding reasons:

- **Static export is first-class.** `output: 'export'` in `next.config.js` produces a pure static site deployable to any CDN. For a skeleton consultancy site with no backend, this eliminates server cost and complexity entirely while preserving the option to add API routes and server components later.
- **App Router is now production-stable.** The App Router (introduced in Next.js 13, stabilized in 14, refined in 15) enables React Server Components, which means zero JavaScript sent to the client for purely presentational sections. The hero, services, and team sections on this site can render with zero client JS unless they have interactivity — this directly improves Lighthouse scores and perceived performance.
- **Turbopack is the default dev bundler.** Next.js 15 ships Turbopack as the default for `next dev`, delivering dramatically faster hot-module replacement than webpack. For a project being built rapidly, this materially reduces iteration time.
- **Partial Prerendering (PPR) is available.** Not needed for a skeleton site, but its presence means the architecture is forward-compatible with dynamic content when the mature site phase begins.
- **next/font eliminates layout shift.** Font loading is zero-layout-shift by design, which matters for a typographically-driven B&W design where font rendering quality is everything.
- **next/image handles SVG patterns safely.** The site will use circuit/grid SVG patterns as backgrounds. next/image with `unoptimized` flag handles SVGs, while raster hero images get automatic WebP conversion and lazy loading.

### Why NOT alternatives

- **Vite + React (no SSR):** Loses static generation, SEO metadata API, and font optimization. Fine for an app, wrong for a site.
- **Gatsby:** Effectively abandoned for new projects. Plugin ecosystem is stale, no investment from maintainers.
- **Astro:** Excellent for content sites but lacks the React ecosystem depth. The mature site phase will likely need React state, forms, and possibly auth — Astro would require a framework migration.
- **Remix:** Server-first; overkill for a skeleton static site. Brings deployment complexity without proportional benefit at this stage.

### Configuration notes

```js
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static export for skeleton phase
  // Remove when server features are needed in mature phase
  output: 'export',

  // Trailing slash for static hosting compatibility
  trailingSlash: true,

  // Image optimization (disable for pure static export, enable for Vercel)
  // images: { unoptimized: true }, // uncomment for static export
};

export default nextConfig;
```

**Architecture note:** The hybrid single-page scroll is implemented via `id` anchors on `<section>` elements and smooth scroll CSS. When splitting into multi-page later, each section becomes its own route. The App Router directory structure should mirror this from day one:

```
app/
  page.tsx           # single-page entry, composes all sections
  _sections/
    Hero.tsx
    Services.tsx
    Portfolio.tsx
    Team.tsx
    Contact.tsx
```

This makes the split-to-multipage migration a matter of moving files into `app/services/page.tsx` etc., not a rewrite.

---

## 2. Language — TypeScript 5

**Package:** `typescript`
**Version:** `5.x` (5.4 or later) [VERIFY]
**Confidence:** HIGH

### Why TypeScript

TypeScript is non-negotiable for a project that presents Clover Labs as elite engineers. A consultancy site written in plain JavaScript sends the wrong signal — TypeScript in the repository communicates craft. Beyond signaling:

- Component props are typed, preventing silent layout bugs from wrong types on animation values, section configs, etc.
- The team section (4 owners) has a clear data shape: `{ name: string; role: string; bio: string; image: string }`. Typing this array means adding or editing team members is refactor-safe.
- Next.js 15 ships with full TypeScript support out of the box — there is zero setup cost.

### tsconfig.json key settings

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
  }
}
```

`strict: true` is required. No exceptions.

---

## 3. Styling — Tailwind CSS v4

**Package:** `tailwindcss`
**Version:** `4.x` [VERIFY — v4 reached stable in early 2025]
**Confidence:** HIGH

### Why Tailwind CSS v4

Tailwind v4 is a ground-up rewrite that matters specifically for this project's design direction:

- **CSS-native configuration.** v4 replaces `tailwind.config.js` with CSS variables and `@theme` blocks. For a B&W site, the entire design token system lives in a single CSS file — no JavaScript config to maintain.
- **CSS custom properties for design tokens.** The circuit/grid pattern colors, spacing scale, and typographic scale are all expressed as CSS variables, making them trivially overridable and animation-friendly (CSS transitions on custom properties work natively).
- **Zero-config content detection.** v4 scans source files automatically — no `content` array to configure.
- **Smaller output.** v4's engine generates only the CSS actually used, with further reduction from the new CSS layer architecture.
- **`@apply` works cleanly.** For SVG pattern classes and repeated animation states, `@apply` in component CSS modules remains available and performant.

### For the B&W design system

```css
/* app/globals.css */
@import "tailwindcss";

@theme {
  /* Pure B&W palette — no accent colors */
  --color-ink: #0a0a0a;
  --color-paper: #f5f5f5;
  --color-void: #000000;
  --color-white: #ffffff;

  /* Circuit grid opacity values */
  --opacity-grid-subtle: 0.04;
  --opacity-grid-visible: 0.08;

  /* Typography scale */
  --font-display: "Space Grotesk", sans-serif;
  --font-body: "Inter", sans-serif;
  --font-mono: "JetBrains Mono", monospace;

  /* Animation durations */
  --duration-slow: 800ms;
  --duration-medium: 400ms;
  --duration-fast: 200ms;
}
```

### Why NOT alternatives

- **Vanilla CSS / CSS Modules:** Perfectly valid technically, but utility classes directly in JSX dramatically reduce the context-switch cost during rapid skeleton development. The B&W constraint means no color system complexity — Tailwind's overhead is minimal.
- **Styled Components / Emotion:** CSS-in-JS runtime cost is unnecessary for a static site. Both libraries add JavaScript bundle weight and complicate static export. The trend away from runtime CSS-in-JS is clear and correct.
- **Vanilla Extract / Linaria (zero-runtime CSS-in-JS):** Solid choices technically, but Tailwind v4 covers the same ground with a vastly larger ecosystem, better Next.js integration, and lower learning curve for future contributors.
- **Sass/SCSS:** Redundant with Tailwind v4. CSS nesting is now native, CSS variables replace Sass variables, and `@apply` replaces most Sass mixin use cases.

---

## 4. Scroll Animation — Framer Motion 11

**Package:** `framer-motion`
**Version:** `11.x` [VERIFY]
**Confidence:** HIGH

### Why Framer Motion for scroll animations

For a Next.js React project, Framer Motion is the correct primary animation library. The key reasons:

- **`useInView` and `whileInView`.** The declarative scroll-triggered animation API is exactly what this site needs: elements that fade in, slide up, or reveal on scroll entry. No manual IntersectionObserver setup required.
- **`useScroll` and `useTransform`.** Parallax effects on the hero background pattern, sticky header opacity transitions, and section-level scroll progress are all first-class Framer Motion primitives.
- **React-native API.** Animations are colocated with components. There is no imperative DOM manipulation — everything is declarative and type-safe.
- **Reduced Motion support is built-in.** `useReducedMotion()` hook returns true when the user prefers reduced motion. For accessibility compliance on a professional consultancy site, this is not optional.
- **Layout animations.** If the nav ever needs to animate between states (e.g., mobile menu open/close), `layout` prop handles it without manual calculations.
- **Framer Motion 11 dropped legacy dependencies** and reduced bundle size. It is the most performant version to date.

### Pattern for scroll reveals

```tsx
// components/RevealOnScroll.tsx
'use client';

import { motion } from 'framer-motion';
import { useReducedMotion } from 'framer-motion';

interface RevealProps {
  children: React.ReactNode;
  delay?: number;
  direction?: 'up' | 'left' | 'right';
}

export function RevealOnScroll({ children, delay = 0, direction = 'up' }: RevealProps) {
  const prefersReduced = useReducedMotion();

  const variants = {
    hidden: {
      opacity: 0,
      y: direction === 'up' ? 24 : 0,
      x: direction === 'left' ? -24 : direction === 'right' ? 24 : 0,
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      transition: {
        duration: prefersReduced ? 0 : 0.6,
        delay: prefersReduced ? 0 : delay,
        ease: [0.21, 0.47, 0.32, 0.98], // custom ease for premium feel
      },
    },
  };

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
    >
      {children}
    </motion.div>
  );
}
```

---

## 5. Complex Animation — GSAP 3

**Package:** `gsap`
**Version:** `3.x` (3.12 or later) [VERIFY]
**Confidence:** HIGH

### Why GSAP as a secondary animation library

Framer Motion handles component-level scroll reveals. GSAP handles the genuinely complex animation work:

- **Circuit/grid pattern animations.** If grid lines or circuit traces need to animate (draw-on effect via `stroke-dashoffset`), GSAP's SVG capabilities are unmatched. Framer Motion does not handle SVG stroke animations natively.
- **ScrollTrigger plugin.** GSAP's ScrollTrigger is the industry standard for scroll-linked animations (pinning, scrubbing, horizontal scroll panels). If the portfolio section needs a horizontal scroll strip or the hero needs a parallax depth effect beyond Framer Motion's `useScroll`, GSAP handles it.
- **Timeline sequencing.** For an initial page load sequence (logo reveal → nav slides in → hero text staggered reveal), GSAP timelines are more controllable than Framer Motion's `staggerChildren`.
- **Performance.** GSAP uses `transform` and `opacity` for all animations, hardware-accelerated via the compositor thread. It is among the most performant JavaScript animation engines available.

### When to use GSAP vs Framer Motion

| Scenario | Library | Reason |
|---|---|---|
| Section fade-in on scroll | Framer Motion | Declarative, colocated, React-idiomatic |
| SVG circuit trace draw-on | GSAP | Native SVG stroke animation |
| Scroll-pinned horizontal strip | GSAP ScrollTrigger | Purpose-built for scrub/pin patterns |
| Page load stagger sequence | GSAP Timeline | Precise timing control |
| Button hover states | Framer Motion | `whileHover` is simplest |
| Mobile menu open/close | Framer Motion | Layout animation, React-native |

### GSAP + Next.js integration note

GSAP must be imported client-side only. In the App Router:

```tsx
'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
```

GSAP 3 (free tier) is sufficient for this project. The Club GreenSock plugins (SplitText, DrawSVG) are paid. The free `ScrollTrigger` plugin covers all needs for a skeleton site.

---

## 6. Visual Identity — Circuit/Grid Patterns

**Approach:** Inline SVG + CSS custom properties + Tailwind utility classes
**No additional library needed**
**Confidence:** HIGH

### Why inline SVG over a pattern library

The circuit/grid aesthetic is the core visual identity of the site. It must be:
1. Precisely controlled — pattern density, line weight, and opacity need exact tuning for B&W contrast
2. Animated — patterns that subtly pulse or trace on scroll are Clover Labs' differentiator
3. Zero-dependency — a pattern this central to the design should not be a third-party library

### Implementation approach

**CSS grid pattern (background texture):**

```css
/* Grid background via CSS — no SVG needed for simple grids */
.bg-grid-pattern {
  background-image:
    linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px);
  background-size: 40px 40px;
}
```

**Circuit trace SVG (decorative element):**

```tsx
// components/CircuitPattern.tsx
export function CircuitPattern({ opacity = 0.06 }: { opacity?: number }) {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity }}
      aria-hidden="true"
    >
      <defs>
        <pattern id="circuit" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
          {/* Horizontal trace */}
          <line x1="0" y1="40" x2="60" y2="40" stroke="currentColor" strokeWidth="0.5" />
          {/* Vertical trace */}
          <line x1="40" y1="0" x2="40" y2="60" stroke="currentColor" strokeWidth="0.5" />
          {/* Junction dot */}
          <circle cx="40" cy="40" r="2" fill="currentColor" />
          {/* Corner via */}
          <circle cx="0" cy="0" r="1.5" fill="none" stroke="currentColor" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#circuit)" />
    </svg>
  );
}
```

This approach gives full control with zero runtime cost.

---

## 7. Typography

**Package:** `next/font` (bundled with Next.js)
**Google Fonts:** Space Grotesk, Inter, JetBrains Mono
**Confidence:** HIGH

### Font selections for B&W engineering aesthetic

| Font | Role | Rationale |
|---|---|---|
| Space Grotesk | Display/headings | Geometric grotesque with slight technical character. Not overused like Inter for headings. Conveys precision without coldness. |
| Inter | Body copy | Industry standard for legibility, extensive weight range, excellent rendering across all DPI. |
| JetBrains Mono | Code snippets, accents | Technical credibility signal. Use for any monospaced accent text, tech stack labels, terminal-style decorative elements. |

### Implementation

```tsx
// app/layout.tsx
import { Space_Grotesk, Inter, JetBrains_Mono } from 'next/font/google';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});
```

next/font downloads fonts at build time, serves them from the same origin, and eliminates layout shift. No external font requests at runtime.

---

## 8. Icons — Lucide React

**Package:** `lucide-react`
**Version:** `0.4x` [VERIFY]
**Confidence:** MEDIUM

### Why Lucide React

Lucide is the spiritual successor to Feather Icons. For a minimalist B&W design:

- Clean, consistent 1px stroke geometry — matches the circuit/grid line aesthetic
- Tree-shakeable: only imported icons are bundled
- TypeScript-native with size and strokeWidth props
- Actively maintained (major releases regularly)

### Why NOT alternatives

- **Heroicons:** Heavier, two-style (outline/solid) system that introduces visual inconsistency risk
- **Phosphor:** Excellent library but higher visual complexity; Lucide's restraint matches B&W minimalism better
- **Font Awesome:** Bundle size, non-SVG rendering, wrong aesthetic entirely
- **react-icons:** Aggregator with no consistent style; mixing icon families breaks visual coherence

**Usage note:** Use sparingly. A premium engineering consultancy site should use very few icons. Text and whitespace communicate more credibly than icon decoration.

---

## 9. Deployment — Vercel

**Platform:** Vercel
**Tier:** Hobby (free) for skeleton phase, Pro when live
**Confidence:** HIGH

### Why Vercel

- **Zero-config Next.js deployment.** Vercel built Next.js. Every Next.js feature works on Vercel without configuration — App Router, static export, image optimization, edge middleware.
- **Preview deployments per branch/PR.** Every git push gets a unique preview URL. For a 4-person team iterating on design, this is immediately useful.
- **Edge network.** The site serves from Vercel's global CDN. For a static skeleton site, this means sub-100ms TTFB globally.
- **Custom domains with automatic HTTPS.** `cloverlab.com` or equivalent goes live in minutes.
- **Analytics built-in (optional).** `@vercel/analytics` is a lightweight script for understanding visitor patterns without a full third-party analytics platform.

### Static export vs Vercel hosting

There are two valid deployment modes:

**Option A: Vercel native (recommended for production)**
- Remove `output: 'export'` from next.config.js
- Vercel handles everything — image optimization, ISR, edge caching
- Cost: $0 on Hobby tier for skeleton traffic levels

**Option B: Static export to any CDN**
- Keep `output: 'export'`
- Deploy `out/` directory to Vercel, Cloudflare Pages, GitHub Pages, or S3+CloudFront
- No server-side features available
- Maximum portability and lowest cost

**Recommendation:** Start with Option A (Vercel native). The `output: 'export'` constraint can always be added later if portability is needed, but it forecloses features unnecessarily during development.

### Why NOT alternatives

- **Netlify:** Comparable feature set, but Next.js support requires the `@netlify/plugin-nextjs` adapter. Vercel has no adapter — it is the reference implementation. On Netlify, some Next.js features occasionally lag behind.
- **Cloudflare Pages:** Excellent CDN, but Next.js App Router support requires the `@cloudflare/next-on-pages` adapter, which has compatibility caveats with certain Next.js features. Worth considering for the mature site if edge computing becomes important.
- **AWS Amplify / S3:** Significant operational overhead for a skeleton site. The infrastructure-as-differentiation argument is not relevant for a consultancy's marketing site.
- **GitHub Pages:** No server-side features, limited build pipeline, not worth the constraints.

---

## 10. What NOT to Use

### Do not use

| Library | Why Not |
|---|---|
| Styled Components | Runtime CSS-in-JS kills static performance. Tailwind v4 covers all cases. |
| Emotion | Same as Styled Components. The trend is dead and correct. |
| Chakra UI / Mantine / shadcn/ui | UI component libraries impose their design system. The B&W circuit aesthetic is bespoke — every component must be custom. Shadcn/ui is the least bad option but still brings opinions that fight the design. |
| Three.js / React Three Fiber | WebGL overhead for a skeleton site. If 3D circuit effects are desired later, scope separately. |
| Lottie | File size, complexity. SVG animations via GSAP or CSS are lighter and more controllable. |
| Animate.css | Class-based animation library; dated approach, no scroll-trigger integration, wrong tool. |
| jQuery | Obsolete. Not worth documenting except to be explicit. |
| Bootstrap / Bulma | Grid system and component library simultaneously wrong for a bespoke B&W design. |
| next-auth | Not needed for skeleton. Add in mature phase only if authentication is scoped. |
| React Query / SWR | No data fetching on skeleton site. Add when API integrations are scoped. |
| Zustand / Redux | No global state management needed. Component-local state only. |
| Storybook | Valuable for mature phase, overhead for a skeleton with 6-8 sections. |

### Special note on shadcn/ui

shadcn/ui is widely recommended in 2025/2026 for its copy-paste component model and Tailwind/Radix foundation. For a standard business application, it would be the correct choice. For this project specifically, it is wrong because:

1. The design is fully bespoke B&W with no pre-built component aesthetic
2. Radix UI's unstyled primitives are useful; importing shadcn/ui's pre-styled versions means fighting styles rather than starting clean
3. The skeleton site has approximately 6 interactive elements total (nav, contact form, mobile menu, a few buttons) — using Radix primitives directly for those specific elements is the right call if accessible component primitives are needed at all

If unstyled accessible primitives are needed: use `@radix-ui/react-*` packages directly. Do not use the shadcn/ui wrapper.

---

## 11. Project Bootstrap Command

```bash
npx create-next-app@latest clover-labs \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*" \
  --no-turbopack
```

Then install animation libraries:

```bash
npm install framer-motion gsap lucide-react clsx
npm install -D @types/node
```

**Note on `--no-turbopack`:** Turbopack is the Next.js 15 default and is production-ready for dev. If you encounter any issues, pass `--no-turbopack` to fall back to webpack. Remove this flag if Turbopack is working cleanly by the time you bootstrap.

---

## 12. Confidence Summary

| Decision | Confidence | Primary Risk |
|---|---|---|
| Next.js 15 as framework | HIGH | None — this is the clear standard |
| TypeScript 5 | HIGH | None |
| Tailwind CSS v4 | HIGH | v4 migration from v3 is significant; verify v4 is stable at time of build |
| Framer Motion 11 | HIGH | None for this use case |
| GSAP 3 (free) | HIGH | Club plugins needed if DrawSVG animations are in scope |
| Inline SVG for patterns | HIGH | None — maximum control |
| next/font + Space Grotesk / Inter | HIGH | None |
| Lucide React | MEDIUM | Any icon library is substitutable; this is a low-stakes choice |
| Vercel deployment | HIGH | None for a Next.js project |
| No UI component library | HIGH | Requires more custom CSS work; correct tradeoff for bespoke design |

---

## 13. Architecture Decision: App Router vs Pages Router

**Decision: App Router**
**Confidence: HIGH**

The Pages Router is legacy. The App Router is the current and future direction of Next.js. For a new project started in 2026, the Pages Router should not be used.

Key App Router behaviors relevant to this project:

- **Server Components by default.** Every component is a React Server Component unless marked `'use client'`. For a mostly-static site, this means minimal JavaScript sent to the browser.
- **`'use client'` boundary placement.** Animation components (Framer Motion, GSAP) require `'use client'`. The pattern is to keep layout/structure as Server Components and push client boundaries to the leaf animation wrappers only.
- **Metadata API.** `export const metadata` in `layout.tsx` handles `<title>`, `<meta>`, and OpenGraph tags without a third-party library.
- **`loading.tsx` and `error.tsx`:** Built-in loading states. Not needed for a skeleton site but zero cost to have correct architecture from the start.

---

*End of STACK.md — Clover Labs LLC*
*Next artifact: ROADMAP.md (milestone plan) and DESIGN_SYSTEM.md (B&W token spec)*
