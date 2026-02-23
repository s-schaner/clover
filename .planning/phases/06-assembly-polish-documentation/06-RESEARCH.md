# Phase 6: Assembly, Polish & Documentation - Research

**Researched:** 2026-02-23
**Domain:** Responsive CSS audit, Lighthouse performance, section transitions, design system documentation
**Confidence:** HIGH (codebase read directly; external findings verified against official docs)

---

## Summary

Phase 6 is a polish and verification phase. Page assembly is already complete (page.tsx has all 5 sections). The work breaks into four concrete areas: (1) responsive audit and fixes for 375px mobile, 768px tablet, 1440px+ desktop; (2) section transition visual treatment; (3) Lighthouse 90+ performance; (4) design system documentation.

The current codebase is well-structured for this phase. The responsive concerns are localized to specific components — Team grid (sm:grid-cols-2 must become something that keeps 4 columns at 768px), Hero viewport fit (--text-hero clamp may need a lower minimum), and portfolio filter pill wrapping on mobile. Section transitions require no new libraries — a CSS/Tailwind technique using `::after` pseudo-elements or SVG dividers achieves the geometric separator effect without adding dependencies. Lighthouse 90+ is achievable: the stack (Next.js App Router + React Server Components + next/font) already handles the biggest wins (font self-hosting, no render-blocking, SSR HTML). The main risks are framer-motion client bundle size (~34kb gzipped) and potential TBT from hydration of multiple 'use client' components.

Documentation is plain Markdown — two files: DESIGN_SYSTEM.md (tokens, color, typography, spacing) and COMPONENTS.md (component API reference) — targeted at the 4 founders and future contractors, not a Storybook setup.

**Primary recommendation:** Audit visually in browser DevTools at 375/768/1440, fix the Team grid breakpoint first (most likely to be wrong), then run Lighthouse in production build mode (`next build && next start`) to get accurate scores before optimizing.

---

## Standard Stack

No new dependencies needed for Phase 6. All work uses existing stack.

### Core (already installed)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js | 16.1.6 | App Router, SSR, next/font, bundle optimization | Already in use; provides Lighthouse wins out of box |
| Tailwind CSS | v4.2.0 | Responsive utility classes, breakpoints | Already in use; mobile-first by default |
| Framer Motion | 12.34.3 | Animation (FadeInOnScroll, StaggerItem, HoverLift) | Already in use; existing components |
| TypeScript | 5.9.3 | Type safety | Already in use |

### Supporting (already installed)
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| clsx | 2.1.1 | Conditional class merging | Used in Navigation; available for polish tweaks |
| lucide-react | 0.575.0 | Menu/X icons in Navigation | Already in use |

### No New Dependencies Required
Phase 6 deliberately uses no new libraries. All responsive fixes are Tailwind utility changes. Lighthouse optimization is configuration changes (next.config.ts) and code structure. Section transitions use CSS only.

**Do not install:**
- `@next/bundle-analyzer` — useful for investigation but not required for a 90+ score on this site
- Shape divider libraries — hand-roll the geometric separator with SVG/CSS (it is 5 lines of code)
- Any new animation library — Framer Motion 12 is already present

---

## Architecture Patterns

### Current Component Topology (from codebase read)

```
app/layout.tsx           Server Component — html/body, next/font loading, Navigation
app/page.tsx             Server Component — thin fragment, 5 section imports
app/globals.css          Tailwind v4 @theme + :root clamp() tokens

components/
  layout/
    Navigation.tsx       'use client' — scroll-spy, mobile overlay, hamburger
  sections/
    HeroSection.tsx      Server Component — SectionWrapper + GeometryAccent + FadeInOnScroll
    ServicesSection.tsx  Server Component — SectionWrapper + StaggerChildren
    PortfolioSection.tsx 'use client' — filter state (useState)
    TeamSection.tsx      Server Component — SectionWrapper + StaggerChildren
    ContactSection.tsx   Server Component — SectionWrapper + ContactForm
  ui/
    SectionWrapper.tsx   Server Component — section + theme class + scroll-margin-top
    GeometryAccent.tsx   'use client' — SVG clover draw animation (useEffect getTotalLength)
    FadeInOnScroll.tsx   'use client' — motion.div whileInView
    StaggerChildren.tsx  'use client' — StaggerItem per-card delay
    HoverLift.tsx        'use client' — motion.div whileHover scale
    GridPattern.tsx      'use client' — SVG fractal grid (useId)
  cards/
    ServiceCard.tsx      'use client' — wraps HoverLift
    PortfolioCard.tsx    'use client' — wraps HoverLift
    TeamCard.tsx         'use client' — wraps HoverLift
    ContactForm.tsx      'use client' — readOnly form visual
```

### Pattern 1: Tailwind v4 Responsive Class Audit

**What:** Tailwind v4 uses the same mobile-first breakpoint system as v3. All classes without prefix apply at all sizes. Prefixed classes apply at that breakpoint and up.

**Default breakpoints (confirmed from tailwindcss.com/docs/responsive-design):**
- `sm` = 40rem = 640px
- `md` = 48rem = 768px
- `lg` = 64rem = 1024px
- `xl` = 80rem = 1280px

**Key Issue — Team Grid:**
```
Current:  grid-cols-1 sm:grid-cols-2 lg:grid-cols-4
Problem:  At 768px (tablet), renders as 2 columns.
Decision: Must stay 4 columns at 768px (md breakpoint).
Fix:      grid-cols-1 md:grid-cols-4  (drop sm:grid-cols-2, use md instead)
          OR: grid-cols-2 md:grid-cols-4  (2-col on 640-767px, 4-col at 768px+)
```

**Key Issue — Services Grid:**
```
Current:  grid-cols-1 sm:grid-cols-2 lg:grid-cols-3
Note:     This is fine — 2 cols at 640px+ is reasonable for service cards.
          No locked decision to change this.
```

**Pattern for Tailwind v4 custom breakpoints (if needed):**
```css
/* In globals.css @theme block */
@theme {
  --breakpoint-tablet: 48rem; /* Already the md default — not needed */
}
```

### Pattern 2: Hero Viewport Fit at 375px

**What:** The hero MUST show tagline, subheading, and CTA without scrolling at 375px.

**Current tokens:**
```css
:root {
  --text-hero: clamp(3rem, 8vw, 7rem);   /* 3rem minimum = 48px */
  --section-padding-y: clamp(5rem, 10vw, 10rem);  /* min 80px top+bottom = 160px */
  --section-padding-x: clamp(1.5rem, 5vw, 6rem);  /* min 24px */
  --nav-height: 80px;
}
```

**At 375px:**
- Nav: 80px
- Section padding top: ~80px (5rem at min)
- Hero text (h1): 48px font-size, tagline is 8 words = ~3 lines = ~192px
- Subheading: text-lg (18px), ~2-3 lines = ~80px
- mt-6 gap: 24px
- CTA link: ~20px + mt-8 gap (32px)
- Section padding bottom: ~80px

Total estimate: 80 (nav) + 80 (top pad) + 192 (h1) + 24 + 80 (sub) + 32 + 20 + 80 = ~588px

iPhone SE viewport: 667px. iPhone 13 mini: 812px. Standard 375px test: ~667px is the common height at 375px width.

**The minimum is likely already sufficient, but verify.** If h1 wraps to 4 lines at 375px the math tightens. Fix: lower --text-hero minimum, or reduce section-padding-y minimum.

**Verified fix pattern if needed:**
```css
:root {
  /* Tighter minimum to fit 375px viewport */
  --text-hero: clamp(2.5rem, 8vw, 7rem);  /* was 3rem */
  --section-padding-y: clamp(4rem, 10vw, 10rem);  /* was 5rem */
}
```

**dvh vs vh:** Modern mobile browsers (Chrome 94+, Safari 15.4+) support `100dvh` (dynamic viewport height that accounts for browser chrome). The current `min-h-screen` in Tailwind uses `100vh`. For hero viewport fit, this is rarely an issue on a static page with no soft keyboard interaction, but if needed:
```css
/* Tailwind v4 approach for dvh */
min-h-[100dvh]  /* supported via arbitrary value */
```

### Pattern 3: Section Transition Visual Treatment

**What:** Hard cuts between dark/light sections are the cleanest B&W treatment. Geometric diagonal dividers add visual interest. The decision is at Claude's discretion.

**Option A: Hard cut (current state)**
- Status quo — sections abut with a hard horizontal color boundary
- Perfectly acceptable for a B&W design system
- Zero CSS changes needed
- Risk: may feel abrupt

**Option B: Thin geometric divider line**
- A single `::after` pseudo-element on section boundaries
- 1px line with angled clip-path or a diamond SVG
- Matches the existing line-diamond-line geometric accent pattern used in headings
- No new components needed

```css
/* In globals.css @layer components */
.section-dark + .section-light::before,
.section-light + .section-dark::before {
  content: '';
  display: block;
  height: 1px;
  background: linear-gradient(
    to right,
    transparent,
    currentColor 30%,
    currentColor 70%,
    transparent
  );
  opacity: 0.12;
  margin: 0 auto;
  max-width: 7xl;
}
```

**Option C: Angled clip-path divider (more dramatic)**
- Applies `clip-path: polygon(...)` to create a diagonal bottom edge on each section
- Requires negative margin compensation to overlap sections
- More complex, may conflict with existing `absolute inset-0` elements (GeometryAccent, GridPattern)
- Not recommended given design system's minimal philosophy

**Recommendation:** Start with Option A (hard cut) — verify in browser. If hard cuts look abrupt, add Option B (thin divider line). Do NOT use clip-path angled dividers — they conflict with the absolute-positioned background elements.

### Pattern 4: Portfolio Filter Pills at 375px

**Current:** `flex flex-wrap gap-2 justify-center mb-12`

**At 375px with 6 pills (All, AI/ML, Cloud Infrastructure, Custom Software, Data Engineering, Security):**
- "Cloud Infrastructure" and "Data Engineering" are long strings — will definitely wrap
- `flex-wrap` handles this gracefully — 2-3 rows is acceptable for 6 short-to-medium labels
- If it looks messy: switch to horizontal scroll strip

**Horizontal scroll strip pattern:**
```tsx
<div className="flex gap-2 overflow-x-auto pb-2 mb-12 scrollbar-none">
  {/* pills */}
</div>
```

**Decision per CONTEXT.md:** Evaluate actual render first. Keep flex-wrap if clean; switch to scroll strip if not.

### Pattern 5: Lighthouse Performance — Next.js App Router

**Confirmed via official Next.js 16.1.6 docs (fetched 2026-02-20):**

next/font already handles the critical font optimizations:
- Self-hosts Google Fonts — no external network request to Google
- Inlines font-face CSS at build time — no render-blocking
- Generates size-adjusted fallback font that prevents CLS
- `display: 'swap'` with fallback size adjustment means near-zero CLS from font swap

**Current layout.tsx font loading is already optimal:**
```typescript
// Already correct — three fonts, all with display: 'swap' (default), latin subset
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '...', display: 'swap' });
const inter = Inter({ subsets: ['latin'], variable: '...', display: 'swap' });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '...', display: 'swap' });
```

**Lighthouse metric weights (confirmed via chrome.dev):**
- LCP: 25% — Largest Contentful Paint
- TBT: 30% — Total Blocking Time (most impactful for JS-heavy sites)
- CLS: 25% — Cumulative Layout Shift
- FCP: 10% — First Contentful Paint
- Speed Index: 10%

**For this site (no images, SSR via App Router, pure B&W CSS):**
- LCP will be the hero h1 text — good SSR timing expected
- CLS risk: font swap (mitigated by next/font fallback), FadeInOnScroll initial state (opacity:0 — but framer-motion sets this via JS, post-hydration — not a CLS issue for Lighthouse)
- TBT risk: framer-motion hydration + multiple 'use client' components

### Pattern 6: Framer Motion Bundle Optimization

**From Motion official docs (WebSearch confirmed):**
- Default `motion` component bundle: ~34kb gzipped
- LazyMotion with `domAnimation` + `m` components: ~4.6kb initial + lazy-loaded features
- LazyMotion with `domMax`: larger, includes drag/pan gestures (not needed)

**LazyMotion pattern (from motion.dev docs):**
```typescript
// Provider (in layout.tsx or a wrapper component)
import { LazyMotion, domAnimation } from 'framer-motion';
// OR from 'motion/react' if using the newer package name

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <LazyMotion features={domAnimation} strict>
          <Navigation />
          <main>{children}</main>
        </LazyMotion>
      </body>
    </html>
  );
}

// In each animation component, replace motion.div with m.div:
import * as m from 'framer-motion/m';
// Use <m.div> instead of <motion.div>
```

**IMPORTANT CAVEAT:** The `strict` prop throws if any `motion.div` remains. This requires updating ALL four animation components (FadeInOnScroll, StaggerChildren/StaggerItem, HoverLift, GeometryAccent). This is a meaningful refactor.

**Decision guidance:** Only implement LazyMotion if Lighthouse TBT is failing. The site has no images and pure SSR — TBT from Framer Motion hydration may be acceptable without LazyMotion. Run Lighthouse first, optimize only if needed.

**Easier Lighthouse wins (no code refactor):**
1. Ensure `next build` + `next start` are used for testing (not `next dev`)
2. Add `optimizePackageImports: ['lucide-react']` to next.config.ts — lucide has hundreds of exports
3. Verify no `console.log` left in production code
4. Confirm `@tailwindcss/postcss` is properly tree-shaking unused CSS classes

### Pattern 7: next.config.ts Optimization

```typescript
// next.config.ts — recommended additions for Lighthouse
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ['lucide-react'],  // Tree-shake the icon library
  },
};

export default nextConfig;
```

**Note on React Compiler (Next.js 16 stable feature):**
Next.js 16 ships with React Compiler support stable. Enabling it via `reactCompiler: true` in next.config.ts can reduce unnecessary re-renders automatically. However, it requires the `babel-plugin-react-compiler` package. This is optional and may add complexity without clear benefit for a mostly-static site.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Font self-hosting | Download fonts to /public, write @font-face | next/font/google (already in use) | next/font handles self-hosting, fallback sizing, CLS prevention automatically |
| Breakpoint media queries in JS | `window.matchMedia` listeners in components | Tailwind utility classes only | CSS-only is simpler, more reliable, no hydration mismatch |
| Custom scroll position tracker for nav | IntersectionObserver from scratch | Navigation.tsx already has it | Already implemented correctly |
| Bundle analyzer UI | Custom webpack stats parsing | `npx next experimental-analyze` (built into Next.js 16.1) | Available in v16.1+ without any install |
| Section divider library | npm install [any shape divider package] | CSS ::after pseudo-element with gradient | 3 lines of CSS; no new dependency |
| Storybook for documentation | Storybook install + configuration | Two Markdown files (DESIGN_SYSTEM.md, COMPONENTS.md) | CONTEXT.md decision: pragmatic docs for 4 founders, not a full design system platform |

**Key insight:** This site's Lighthouse score will be dominated by TBT (Framer Motion hydration) and font performance (already handled). The temptation is to optimize everything; the reality is that the stack already does most things right out of the box.

---

## Common Pitfalls

### Pitfall 1: Testing Lighthouse on `next dev` Instead of Production Build
**What goes wrong:** `next dev` includes hot-reload code, unoptimized bundles, and source maps. Lighthouse scores in dev mode are ~30-40 points lower than production.
**Why it happens:** Developer runs Chrome DevTools Lighthouse without building first.
**How to avoid:** Always run `next build && next start` before Lighthouse audit. Test on localhost:3000 in production mode.
**Warning signs:** Lighthouse shows "serve static assets with an efficient cache policy" for all JS files — this only happens in dev mode.

### Pitfall 2: Horizontal Overflow From Fixed-Width Elements
**What goes wrong:** An element with a hardcoded pixel width wider than 375px causes horizontal scroll. Lighthouse doesn't flag this but it fails LAYT-02.
**Why it happens:** The current codebase uses mostly fluid/percentage widths, but SVG viewBox elements or fixed-size patterns could leak.
**How to avoid:** In Chrome DevTools, run in console:
```javascript
// Detect which element is wider than the viewport
[...document.querySelectorAll('*')].filter(el => el.offsetWidth > document.body.offsetWidth)
```
**Warning signs:** Horizontal scrollbar appears at 375px. SVG `width/height` attributes set to fixed numbers on non-scaled elements.

**Current risk candidates:**
- `GeometryAccent`: `width="100%" height="100%"` on SVG — safe, fills parent
- `GridPattern`: `width="100%" height="100%"` on SVG — safe
- `MonogramAvatar` in TeamCard: `viewBox="0 0 120 120"` with `className="w-full h-full"` — safe, CSS-sized
- Navigation: `px-[--section-padding-x]` uses clamp min 1.5rem — safe

### Pitfall 3: Team Grid 4-Wide at 768px Is Tight
**What goes wrong:** 4 TeamCards at 768px with gap-[--gap-grid] (1.5rem) = very narrow cards: (768 - 2*24px padding - 3*24px gap) / 4 ≈ 150px per card. The MonogramAvatar (aspect-square max-h-48) + text + social links at 150px wide may look cramped.
**Why it happens:** The CONTEXT.md decision is "4 across at tablet" — needs to be implemented and visually validated, not just assumed to work.
**How to avoid:** After implementing `md:grid-cols-4`, load at 768px in DevTools and verify card content doesn't overflow or look unacceptably small.
**Warning signs:** Social link icons wrap below role text; name text truncates.

### Pitfall 4: FadeInOnScroll Creates CLS False Positive
**What goes wrong:** FadeInOnScroll sets `initial={{ opacity: 0, y: 40 }}` — elements start invisible. This can confuse Lighthouse's CLS measurement if elements shift after the initial paint.
**Why it happens:** Framer Motion applies these styles via JavaScript after hydration. The browser's first paint shows the SSR HTML (visible), then JS hides it (opacity: 0), then animates back in.
**How to avoid:** This is standard framer-motion behavior and typically does not affect CLS score because CLS only measures layout shifts — opacity changes are not layout shifts. Monitor actual CLS score in Lighthouse; if > 0.1, investigate with Chrome DevTools Layout Shift Regions.
**Warning signs:** CLS > 0.1 in Lighthouse report.

### Pitfall 5: Running Lighthouse From a Dev Machine With Extensions
**What goes wrong:** Chrome extensions (ad blockers, dark mode, etc.) inject scripts that increase TBT and modify CLS. Lighthouse reports inaccurate scores.
**How to avoid:** Run Lighthouse in Chrome Incognito mode, or use the `lighthouse` CLI: `npx lighthouse http://localhost:3000 --output=html --view --preset=desktop` and `--preset=perf`.

### Pitfall 6: Section Transition Clip-Path Conflicts With Absolute-Positioned Backgrounds
**What goes wrong:** Applying `clip-path` to `.section-dark` or `.section-light` clips the absolute-positioned GeometryAccent and GridPattern elements — they get clipped at the diagonal line.
**Why it happens:** `clip-path` on a parent clips all children including `absolute inset-0` descendants.
**How to avoid:** Do NOT use `clip-path` on SectionWrapper. Use `::before`/`::after` pseudo-elements on the boundary instead, which operate outside the clipping context.

### Pitfall 7: Tailwind v4 `@theme` Does Not Work With clamp()
**What goes wrong:** Moving spacing/clamp values into `@theme` block breaks them — Tailwind v4 cannot statically analyze `clamp()` expressions in `@theme`.
**Why it happens:** This is a known Tailwind v4 constraint — `@theme` tokens must be static values. Dynamic CSS functions like `clamp()` must stay in `:root`.
**How to avoid:** Keep all clamp() values in `:root` (as they currently are). Only put static values (colors, font families) in `@theme`.
**Warning signs:** Tailwind ignores the token or generates incorrect CSS.

---

## Code Examples

### Verified: Team Grid Fix (4 columns at 768px)

```tsx
// Source: CONTEXT.md decision + tailwindcss.com/docs/responsive-design (md = 48rem = 768px)
// In TeamSection.tsx, change:
<StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[--gap-grid]">
// To:
<StaggerChildren className="grid grid-cols-2 md:grid-cols-4 gap-[--gap-grid]">
// Explanation: 2-col on 375-767px (phone landscape / small tablet), 4-col at 768px+
```

### Verified: next.config.ts With lucide-react Optimization

```typescript
// Source: Next.js 16.1.6 official docs (https://nextjs.org/docs/app/building-your-application/optimizing/bundle-analyzer)
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
};

export default nextConfig;
```

### Verified: Bundle Analysis Command

```bash
# Source: Next.js 16.1.6 official docs — available in v16.1+, no install needed
npx next experimental-analyze
# Opens interactive treemap in browser
# Filter by "client" to see what ships to the browser
```

### Verified: Lighthouse Production Audit

```bash
# Source: Standard Next.js production workflow
next build && next start
# Then in Chrome Incognito: DevTools -> Lighthouse -> Performance
# OR via CLI:
npx lighthouse http://localhost:3000 --output=html --view
```

### Verified: Overflow Debug Script

```javascript
// Source: Polypane blog + CSS-Tricks — standard technique
// Run in Chrome DevTools console at 375px viewport:
[...document.querySelectorAll('*')].filter(
  el => el.offsetWidth > document.body.offsetWidth
).forEach(el => console.log(el, el.offsetWidth));
```

### Verified: Hero Viewport Fit — Conservative clamp() Reduction

```css
/* Source: CSS clamp() specification — if hero overflows at 375px */
/* In globals.css :root block — change only if visual inspection shows overflow */
:root {
  --text-hero: clamp(2.25rem, 7vw, 7rem);   /* was clamp(3rem, 8vw, 7rem) */
  --section-padding-y: clamp(3.5rem, 8vw, 10rem); /* was clamp(5rem, 10vw, 10rem) */
}
```

### Verified: Mobile dvh for Hero (If Needed)

```tsx
// Source: MDN Web Docs (dvh supported Chrome 94+, Safari 15.4+)
// In HeroSection.tsx — if min-h-screen causes mobile browser chrome issues:
<SectionWrapper id={SECTION_IDS.HERO} theme="dark" className="min-h-[100dvh]">
  <div className="relative min-h-[100dvh] flex items-center justify-center px-[--section-padding-x]">
```

### Verified: Portfolio Filter Horizontal Scroll (If Wrap Looks Messy)

```tsx
// Source: Standard CSS overflow-x scroll pattern
// In PortfolioSection.tsx — replace flex-wrap with scroll:
<div className="flex gap-2 overflow-x-auto pb-2 mb-12 [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
  {allFilters.map((cat) => (
    // ... pills, same markup, remove justify-center
  ))}
</div>
```

### Verified: Geometric Section Divider (CSS Only, If Hard Cut Looks Abrupt)

```css
/* Source: CSS-Tricks + codegenes.net — CSS pseudo-element divider */
/* In globals.css @layer components — adds thin divider at dark/light boundaries */
/* This approach does NOT use clip-path on the section itself — safe for absolute children */
.section-dark + .section-light,
.section-light + .section-dark {
  position: relative;
}

.section-dark + .section-light::before,
.section-light + .section-dark::before {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: min(80%, 80rem);
  height: 1px;
  background: linear-gradient(
    to right,
    transparent 0%,
    currentColor 25%,
    currentColor 75%,
    transparent 100%
  );
  opacity: 0.1;
}
```

---

## Design System Documentation — Scope and Format

Per CONTEXT.md (Claude's discretion): documentation should be pragmatic for the 4 founders and potential future contractors.

**Recommended: Two Markdown files, no tooling**

### File 1: `docs/DESIGN_SYSTEM.md`

Sections:
1. **Design Philosophy** — B&W only, no accent colors, engineering aesthetic, sharp corners
2. **Color Tokens** — surface/on-surface dark + light semantic tokens, the exact hex values
3. **Typography** — Three fonts, when to use each (display/body/mono), `font-display`, `font-body`, `font-mono` Tailwind classes
4. **Spacing Tokens** — All `:root` clamp() values, what each controls
5. **Animation Tokens** — `--duration-fast/base/slow`, `--ease-out`, `--ease-premium`
6. **Dark/Light Alternation** — The section rhythm pattern, how SectionWrapper theme prop works
7. **What Never Goes In** — No border-radius, no accent colors, no drop shadows

### File 2: `docs/COMPONENTS.md`

Sections:
1. **Layout Components** — Navigation props, SectionWrapper props/API
2. **UI Primitives** — SectionWrapper, FadeInOnScroll, StaggerChildren/StaggerItem, HoverLift, GeometryAccent, GridPattern
3. **Section Components** — One entry per section: what it contains, theme, data source
4. **Card Components** — ServiceCard, PortfolioCard, TeamCard, ContactForm props and data types
5. **Data Layer** — lib/constants.ts structure, lib/types.ts types
6. **Adding New Content** — How to add a new portfolio item, team member, or service

**No Storybook, no MDX, no automated token generation tools.** Plain markdown that can be read in GitHub or any editor.

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Google Fonts via `<link>` tag | next/font/google self-hosting | Next.js 13+ | Eliminates render-blocking + CLS |
| `min-h-screen` = `100vh` | `min-h-[100dvh]` for dynamic viewport | Chrome 94, Safari 15.4 (2022) | Optional upgrade for mobile hero |
| `staggerChildren` in framer-motion | Manual per-item delay (StaggerItem pattern) | framer-motion 12 (motion-dom) | Already implemented correctly |
| `tailwind.config.js` | No config file for v4 — config in CSS | Tailwind v4 | Already correct |
| `sm:grid-cols-4` for 4-across at 640px | `md:grid-cols-4` for 4-across at 768px | Decision per CONTEXT.md | Fix Team grid |

**Not deprecated in this project's context:**
- `display: 'swap'` on next/font — still correct; next/font's fallback adjustment handles CLS
- `framer-motion` package name — v12 can still be imported as `framer-motion` (though canonical is now `motion`)

---

## Open Questions

1. **Will hero content fit at 375px without clamp adjustment?**
   - What we know: `--text-hero: clamp(3rem, 8vw, 7rem)` gives 48px minimum. Tagline is "We build the systems other firms call impossible." — 8 words, at 375px with 48px font, likely 3 lines.
   - What's unclear: Exact line-count depends on letter-spacing, word-break, and `max-w-4xl` constraint behavior at 375px.
   - Recommendation: Verify in DevTools first. Do not preemptively change clamp values.

2. **Will the Lighthouse TBT score pass 90+ without LazyMotion?**
   - What we know: 5 client component trees hydrate: Navigation, GeometryAccent, multiple FadeInOnScroll instances, StaggerItem instances, PortfolioSection, HoverLift instances (9 cards).
   - What's unclear: Whether combined hydration causes TBT > 300ms (the threshold for a low TBT score).
   - Recommendation: Run Lighthouse in production mode first. Only implement LazyMotion refactor if TBT is the failing metric.

3. **Do section transitions need visual treatment beyond hard cuts?**
   - What we know: The current state is hard cuts. CONTEXT.md says Claude's discretion.
   - What's unclear: Whether hard cuts look abrupt once the full page scrolls.
   - Recommendation: Review in browser at production build. The CSS divider option (Option B from Architecture Patterns) is low-risk if needed.

4. **Will TeamCard content be readable at ~150px card width on tablet?**
   - What we know: 4 cards at 768px with 1.5rem gaps = approximately 150px per card.
   - What's unclear: Whether `max-h-48` avatar + name + role + social links is legible at that width.
   - Recommendation: Visual inspection required. May need to reduce `max-h-48` to `max-h-32` or `max-h-40` on mobile/tablet if cards look too tall-and-narrow.

---

## Sources

### Primary (HIGH confidence)
- Next.js official docs (https://nextjs.org/docs/app/building-your-application/optimizing/fonts) - fetched 2026-02-20, version 16.1.6 confirmed
- Next.js official docs (https://nextjs.org/docs/app/building-your-application/optimizing/bundle-analyzer) - fetched 2026-02-20, v16.1 bundle analyzer confirmed
- Tailwind CSS official docs (https://tailwindcss.com/docs/responsive-design) - breakpoints confirmed, v4 CSS config approach
- Chrome Lighthouse docs (https://developer.chrome.com/docs/lighthouse/performance/performance-scoring) - metric weights confirmed (LCP 25%, TBT 30%, CLS 25%, FCP 10%, SI 10%)
- Direct codebase read — all component files, globals.css, package.json, layout.tsx, constants.ts

### Secondary (MEDIUM confidence)
- Motion/Framer Motion docs (https://motion.dev/docs/react-reduce-bundle-size) - LazyMotion bundle sizes (~34kb vs ~4.6kb) confirmed via WebSearch from official source
- Motion/Framer Motion docs (https://motion.dev/docs/react-lazy-motion) - LazyMotion API and `strict` prop behavior confirmed
- MDN Web Docs (https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/overflow-x) - overflow-x debugging approach
- Polypane blog (https://polypane.app/blog/strategies-for-dealing-with-horizontal-overflows/) - overflow detection JavaScript snippet

### Tertiary (LOW confidence)
- WebSearch results for Next.js Lighthouse optimization articles (multiple Medium/DEV articles) — directionally correct but not individually verified
- WebSearch results for section divider CSS techniques — standard CSS knowledge, not from a single authoritative source

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — verified from package.json and official docs
- Architecture (Team grid fix): HIGH — Tailwind breakpoints verified from official docs, CONTEXT.md decision locked
- Architecture (hero viewport fit): MEDIUM — math is estimated, must verify visually
- Architecture (section transitions): HIGH — CSS pseudo-element approach is well-established
- Architecture (Lighthouse): HIGH — metric weights from Chrome docs; next/font behavior from official docs
- Pitfalls: HIGH for known TypeScript/Tailwind constraints; MEDIUM for runtime visual issues
- Documentation scope: HIGH — per CONTEXT.md explicit decision

**Research date:** 2026-02-23
**Valid until:** 2026-03-23 (30 days — stable stack, no fast-moving dependencies in scope)
