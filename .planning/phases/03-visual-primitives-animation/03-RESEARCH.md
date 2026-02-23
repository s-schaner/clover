# Phase 3: Visual Primitives & Animation - Research

**Researched:** 2026-02-22
**Domain:** SVG fractal pattern components, CSS mask-image, framer-motion 12 viewport animations, stagger orchestration, hover micro-interactions, CSS draw animation with stroke-dasharray
**Confidence:** HIGH (all Framer Motion API details verified from installed node_modules type definitions; SVG techniques verified from MDN/CSS-Tricks; stagger deprecation confirmed from motion-dom source)

---

## Summary

Phase 3 builds three categories of visual primitives: (1) SVG fractal background pattern components with CSS mask-image edge fade, (2) framer-motion 12 animation wrapper components for scroll-triggered and stagger animations, and (3) hover micro-interaction primitives. All are built in isolation and validated before Phase 5 wires them into sections.

The single most important API finding is that `staggerChildren` is **deprecated** in framer-motion 12 (motion-dom). The replacement is `delayChildren: stagger(interval, { from: ... })`. Additionally, framer-motion's `stagger()` does not support 2D grid origins — it only accepts `"first"`, `"last"`, `"center"`, or a flat index number. The top-left diagonal cascade effect requires computing per-card delay manually using `(row + col) * interval` passed via the `custom` prop to variant functions.

The hero pattern draw uses pure CSS keyframes on `stroke-dashoffset` — explicitly locked in CONTEXT.md as "no Framer Motion or GSAP for the hero". The draw animation sets `stroke-dasharray` and `stroke-dashoffset` equal to the path length, then animates `stroke-dashoffset` to `0`. `prefers-reduced-motion` must skip the animation and show the final state directly (opacity set to final value, no keyframe).

The viewport/scroll animation system uses framer-motion's `whileInView` prop with `viewport={{ once: false, amount: 0.2 }}` (once: false because animations replay every time a section re-enters viewport per CONTEXT.md). All motion components must be in `'use client'` files — they cannot live in Server Components. `SectionWrapper.tsx` remains a Server Component; animation wrappers are separate client components that SectionWrapper can accept as children.

**Primary recommendation:** Build three categories of client components — `GridPattern`/`GeometryAccent` (SVG, no animation except hero draw), `FadeInOnScroll`/`StaggerChildren` (framer-motion `whileInView`), and `HoverLift` (framer-motion `whileHover`). Use `useReducedMotion()` inside each motion component to gate all animation. Keep `SectionWrapper.tsx` as a pure Server Component.

---

## Standard Stack

### Core (already installed)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| framer-motion | 12.34.3 | `motion.*` components, `whileInView`, `whileHover`, `useReducedMotion`, `stagger()` | Already installed; covers all animation requirements |
| React | 19.2.3 | `'use client'` wrapper components, `useRef`, `useCallback` | Required for all interactive/animated components |
| TypeScript | 5.9.3 | Props interfaces for all components | Project standard |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| CSS custom properties (globals.css) | built-in | `--duration-fast`, `--duration-slow`, `--ease-premium`, `--pattern-opacity-dark`, `--pattern-opacity-light` | All animation timing values reference these tokens |
| SVG native | built-in | `<pattern>`, `<line>`, `<path>` | Fractal grid pattern rendering |
| CSS `mask-image` | built-in | Edge gradient fade on pattern | All modern browsers; no prefix needed for evergreen browsers |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| framer-motion `whileInView` | IntersectionObserver + CSS class toggle (like `fade-in-scroll` in globals.css) | CSS-only approach exists in globals.css already but lacks stagger orchestration and `useReducedMotion` hook integration; framer-motion is already installed and the right choice for motion wrappers |
| CSS `stroke-dashoffset` keyframe | framer-motion animate | CONTEXT.md explicitly locks hero to CSS keyframes + SVG only, no Framer Motion |
| CSS pseudo-element underline | framer-motion `scaleX` | Both valid; CSS approach avoids a motion import for a simple transform. CSS wins for link underline. |

**Installation:** No new packages required. framer-motion 12.34.3 is already in dependencies.

---

## Architecture Patterns

### Recommended Component Structure

```
components/
├── ui/
│   ├── SectionWrapper.tsx        # Server Component — unchanged from Phase 2
│   ├── GridPattern.tsx           # Client Component — SVG fractal grid + CSS mask fade
│   ├── GeometryAccent.tsx        # Client Component — hero draw animation variant
│   ├── FadeInOnScroll.tsx        # Client Component — framer-motion whileInView wrapper
│   ├── StaggerChildren.tsx       # Client Component — framer-motion stagger wrapper
│   └── HoverLift.tsx             # Client Component — framer-motion whileHover wrapper
```

No changes to `lib/types.ts` or `lib/constants.ts` are expected beyond potentially adding animation config constants. `PATTERN_CONFIG` already exists in `lib/constants.ts` and `lib/types.ts` with `opacityDark: 0.06`, `opacityLight: 0.04`, `sizePx: 40`.

### Pattern 1: framer-motion `whileInView` with `useReducedMotion`

**What:** A wrapper `'use client'` component that applies scroll-triggered animation using framer-motion's `whileInView` prop. Checks `useReducedMotion()` and renders with no animation when true.
**When to use:** FadeInOnScroll, StaggerChildren wrappers — any element that should animate on scroll.

```typescript
// Source: node_modules/framer-motion/dist/types/index.d.ts + motion-dom types
'use client';

import { motion, useReducedMotion } from 'framer-motion';

interface FadeInOnScrollProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function FadeInOnScroll({ children, className, delay = 0 }: FadeInOnScrollProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    // Show final state immediately — no animation, no opacity:0 flash
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.2 }}
      transition={{
        duration: 0.6,            // --duration-slow
        ease: [0.21, 0.47, 0.32, 0.98],  // --ease-premium
        delay,
      }}
    >
      {children}
    </motion.div>
  );
}
```

The `y: 40` value (40px bottom-up travel) is within the 32-48px range locked in CONTEXT.md. Use `y: 40` as default; planner can choose final value.

### Pattern 2: Diagonal Top-Left Grid Stagger via `custom` Prop

**What:** The framer-motion `stagger()` function only supports flat 1D ordering (`"first"`, `"last"`, `"center"`, flat index). For diagonal top-left cascade on a grid, delay must be computed as `(row + col) * interval` and passed via the `custom` prop to variant functions.
**When to use:** StaggerChildren wrapping card grids where items have known row/col positions.

```typescript
// Source: motion-dom/dist/index.d.ts — StaggerOrigin is "first"|"last"|"center"|number only
// Diagonal cascade requires manual delay calculation via custom prop

'use client';

import { motion, useReducedMotion } from 'framer-motion';

interface StaggerItemProps {
  children: React.ReactNode;
  row: number;
  col: number;
  className?: string;
}

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.21, 0.47, 0.32, 0.98],
      delay,
    },
  }),
};

export function StaggerItem({ children, row, col, className }: StaggerItemProps) {
  const shouldReduceMotion = useReducedMotion();
  // Stagger interval in Claude's discretion — recommend 0.08s
  const delay = (row + col) * 0.08;

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      variants={itemVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.1 }}
      custom={delay}
    >
      {children}
    </motion.div>
  );
}
```

The parent `StaggerChildren` wrapper does NOT need a framer-motion parent with `staggerChildren` — each child manages its own delay independently via `custom`. This is the correct approach for diagonal cascades in framer-motion 12 where `staggerChildren` is deprecated.

### Pattern 3: `viewport` Options API (Verified from motion-dom types)

```typescript
// Source: motion-dom/dist/index.d.ts — ViewportOptions interface
interface ViewportOptions {
  root?: { current: Element | null };  // custom scroll container
  once?: boolean;          // false = replay on re-entry (our requirement)
  margin?: string;         // rootMargin equivalent e.g. "0px 0px -50px 0px"
  amount?: "some" | "all" | number;  // 0.2 = 20% visible triggers animation
}

// Usage in whileInView:
<motion.div
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: false, amount: 0.2 }}
/>
```

`once: false` means the animation resets when the element leaves the viewport and replays on re-entry. This is our requirement from CONTEXT.md.

### Pattern 4: `useReducedMotion()` Return Type

```typescript
// Source: node_modules/framer-motion/dist/types/index.d.ts line 1047
declare function useReducedMotion(): boolean | null;

// Returns:
// true  — prefers-reduced-motion: reduce is set
// false — prefers-reduced-motion: no-preference
// null  — SSR (server-side, media query not available yet)

// Guard pattern: treat null as false (animate by default)
const shouldReduceMotion = useReducedMotion();
if (shouldReduceMotion) { /* skip animation */ }
```

### Pattern 5: SVG Fractal Recursive Grid

**What:** A pure SVG component that renders a recursive grid using `<pattern>` nesting. Each recursion level adds subdivisions with decreasing `strokeWidth`. The outer SVG is positioned absolutely within its container, masked with CSS `mask-image` to fade edges.
**When to use:** GridPattern (all sections), GeometryAccent (hero signature).

```typescript
// Source: MDN SVG pattern, CSS-Tricks SVG techniques — HIGH confidence
// Recursive subdivision: level 0 = 40px grid (--pattern-size), level 1 = 20px, level 2 = 10px, level 3 = 5px

// Stroke widths by recursion depth (Claude's discretion range):
// Depth 0: 0.8px (primary grid — most visible)
// Depth 1: 0.5px
// Depth 2: 0.3px
// Depth 3: 0.15px (finest — barely visible, creates texture density)

// SVG pattern trick: nested <pattern> elements where each inner pattern
// tiles at half the size of the outer one
<svg>
  <defs>
    <pattern id="grid-lvl3" width="5" height="5" patternUnits="userSpaceOnUse">
      <path d="M 5 0 L 0 0 0 5" fill="none" stroke="currentColor" strokeWidth={0.15} />
    </pattern>
    <pattern id="grid-lvl2" width="10" height="10" patternUnits="userSpaceOnUse">
      <rect width="10" height="10" fill="url(#grid-lvl3)" />
      <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth={0.3} />
    </pattern>
    {/* ... continue up to primary grid at sizePx */}
  </defs>
  <rect width="100%" height="100%" fill="url(#grid-lvlN)" />
</svg>
```

### Pattern 6: CSS `mask-image` Edge Fade on SVG Pattern

**What:** The SVG container uses `mask-image` with a radial gradient to dissolve from visible in the interior to transparent at edges.
**When to use:** All pattern containers (accent positioning, not full section coverage).

```css
/* Applied inline or as Tailwind arbitrary value */
/* Fades from center (visible) to transparent at edges */
mask-image: radial-gradient(ellipse 80% 80% at center, black 40%, transparent 100%);

/* For corner placement (e.g. bottom-right corner accent): */
mask-image: radial-gradient(ellipse 60% 70% at 100% 100%, black 30%, transparent 80%);

/* For edge placement (e.g. top-right edge): */
mask-image: radial-gradient(ellipse 50% 80% at 100% 0%, black 30%, transparent 80%);
```

No vendor prefix needed for modern browsers (Chrome, Firefox, Safari, Edge all support unprefixed `mask-image`). Browser support: Baseline Available since 2017.

### Pattern 7: Hero SVG Draw Animation (CSS keyframes)

**What:** CSS-only `stroke-dashoffset` draw animation on SVG path. No framer-motion. Starts drawing immediately on page load. Must respect `prefers-reduced-motion`.

```css
/* In globals.css or as a <style> tag in the component */
@keyframes draw-path {
  from {
    stroke-dashoffset: var(--path-length);
  }
  to {
    stroke-dashoffset: 0;
  }
}

@keyframes settle-opacity {
  0% { opacity: 0.12; }   /* draw-in at noticeable opacity (10-15%) */
  100% { opacity: 0.06; } /* settle to standard dark pattern opacity */
}

/* Applied to the SVG path: */
.hero-fractal-path {
  stroke-dasharray: var(--path-length);
  stroke-dashoffset: var(--path-length);
  animation:
    draw-path 1.2s var(--ease-out) forwards,
    settle-opacity 0.6s var(--ease-in-out) 1.2s forwards;
  opacity: 0.12; /* initial opacity during draw */
}

@media (prefers-reduced-motion: reduce) {
  .hero-fractal-path {
    stroke-dashoffset: 0;
    opacity: 0.06; /* final settled state, no animation */
    animation: none;
  }
}
```

The `--path-length` CSS custom property must match the SVG path's `getTotalLength()` result. Set it as an inline style on the SVG element. For a static path, calculate once and hardcode as a constant.

### Pattern 8: HoverLift with Scale

```typescript
// Source: motion-dom types — whileHover is AnimationType
'use client';

import { motion, useReducedMotion } from 'framer-motion';

interface HoverLiftProps {
  children: React.ReactNode;
  className?: string;
  scale?: number;  // defaults to 1.025 (between 1.02-1.03 from CONTEXT.md)
}

export function HoverLift({ children, className, scale = 1.025 }: HoverLiftProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      whileHover={{ scale }}
      transition={{
        duration: 0.12,  // --duration-fast = 150ms, hover should feel instant
        ease: [0.0, 0.0, 0.2, 1],  // --ease-out
      }}
      style={{ willChange: 'transform' }}  // hint GPU to composite this layer
    >
      {children}
    </motion.div>
  );
}
```

### Pattern 9: CSS Underline Draw for Text Links

**What:** CSS pseudo-element approach using `scaleX(0)` to `scaleX(1)` transform on hover. No framer-motion needed for this simple interaction.

```css
/* In globals.css @layer components, or as Tailwind classes on the element */
.link-underline {
  position: relative;
  display: inline-block;
}

.link-underline::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 100%;
  height: 1px;
  background: currentColor;
  transform: scaleX(0);
  transform-origin: left center;
  transition: transform var(--duration-fast) var(--ease-out);
}

.link-underline:hover::after {
  transform: scaleX(1);
}
```

Tailwind v4 equivalent with arbitrary group-hover: applies `scale-x-0` by default, `scale-x-100` on hover, with `origin-left`.

### Anti-Patterns to Avoid

- **Using `staggerChildren` in transition:** Deprecated in framer-motion 12 (motion-dom). Use `delayChildren: stagger(interval)` for 1D sequences, or manual `custom` prop delays for 2D grids.
- **Putting motion components in Server Components:** All `motion.*` usage requires `'use client'` boundary. SectionWrapper stays as Server Component; animation wrappers are separate client components.
- **Animating non-GPU-composited properties:** Only animate `opacity`, `transform` (translate, scale, rotate). Never animate `width`, `height`, `top`, `left`, `background-color` in scroll animations — causes layout reflow.
- **Setting `opacity: 0` on initial state without reduced-motion guard:** Users with `prefers-reduced-motion: reduce` see blank content until scroll if the reduced-motion branch isn't handled. Always render visible final state when `shouldReduceMotion` is true.
- **Using `viewport={{ once: true }}`:** CONTEXT.md requires animations to replay every time a section re-enters the viewport. `once: false` is the correct setting.
- **Nesting motion.div inside motion.div unnecessarily for stagger:** The diagonal cascade uses individual `custom` prop delays, not parent-child stagger propagation. Keep stagger items self-contained.
- **Using framer-motion for the hero draw animation:** CONTEXT.md explicitly locks this to CSS keyframes + SVG only. Do not use `motion.path` with `pathLength`.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Viewport detection | Custom IntersectionObserver | framer-motion `whileInView` + `viewport` prop | Already handles threshold, root, cleanup, and state management; framer-motion is already installed |
| Reduced motion detection | Custom media query listener | framer-motion `useReducedMotion()` hook | Hook updates reactively when OS setting changes; handles SSR (returns null server-side) |
| Easing curves | Custom spring/tween math | framer-motion `transition.ease` with design token values | `--ease-premium: cubic-bezier(0.21, 0.47, 0.32, 0.98)` already defined in globals.css |
| Animation reset on re-entry | Manual visibility tracking | framer-motion `viewport={{ once: false }}` | Handles reset automatically when element leaves and re-enters viewport |
| GPU compositing hints | Manual `will-change` management | framer-motion handles internally for transform/opacity | Framer Motion already applies compositor promotion; only add `willChange` manually for `HoverLift` where element is not initially animated |

**Key insight:** framer-motion is already installed and covers every animation requirement for this phase. The only custom code needed is the SVG structure and the CSS keyframe draw animation for the hero (explicitly locked in CONTEXT.md to CSS-only).

---

## Common Pitfalls

### Pitfall 1: Hydration Flash — `opacity: 0` on SSR

**What goes wrong:** `motion.div` with `initial={{ opacity: 0 }}` renders on server with `opacity: 0`. In the milliseconds before hydration and IntersectionObserver fires, content is invisible. On slow connections this is visible.
**Why it happens:** framer-motion renders the `initial` state on the server, so the HTML sent to the client has `opacity: 0` inline style.
**How to avoid:** Use `initial="hidden"` variant labels rather than inline values, or check that framer-motion's `LazyMotion` is not being used (it defers feature loading). For this project the standard `motion` component is correct. The real guard is ensuring `useReducedMotion` branch renders plain divs — which avoids opacity:0 entirely for reduced-motion users. Accept minor flash for normal users; it's within acceptable UX bounds.
**Warning signs:** Content invisible for >200ms after page paint on fast connections.

### Pitfall 2: `viewport={{ once: false }}` + Stagger Reset

**What goes wrong:** When `once: false` is set and each `StaggerItem` has its own `whileInView`, cards reset to hidden state as soon as they individually scroll out of viewport (even by 1px). This can cause "flickering" if cards are near the viewport edge.
**Why it happens:** Each card has independent viewport tracking. As the user scrolls, cards at the edge of visibility toggle in and out.
**How to avoid:** Set `amount: 0.1` (10% visible triggers animation) on child items, and consider wrapping the grid in a parent that tracks the whole grid. Alternative: Keep `amount: 0.2` but accept that near-edge cards may flicker. Test at different scroll speeds.
**Warning signs:** Cards rapidly appearing/disappearing as user scrolls past the grid section.

### Pitfall 3: SVG Pattern IDs Colliding Across Multiple Pattern Instances

**What goes wrong:** SVG `<pattern id="grid-lvl2">` uses a global DOM id. If two `GridPattern` components render on the same page, the second instance's pattern references will resolve to the first instance's pattern definition (whichever the browser encounters first in DOM order).
**Why it happens:** SVG `id` attributes are globally scoped in the HTML document.
**How to avoid:** Pass a unique `id` prefix prop to each `GridPattern` component: `id="pattern-hero"`, `id="pattern-services"`, etc. Use this prefix for all internal `<pattern id>` attributes within that SVG instance: `id={${prefix}-lvl0}`.
**Warning signs:** Pattern renders correctly for first section but wrong size/weight in subsequent sections.

### Pitfall 4: CSS `mask-image` Not Working on Positioned Elements

**What goes wrong:** `mask-image` applied to a `position: absolute` SVG container doesn't clip as expected, or the gradient doesn't align with the SVG bounds.
**Why it happens:** `mask-image` masks the element's painted area, which for `position: absolute` includes only the element box — not the positioned parent's overflow. The gradient needs to be sized relative to the SVG element's own dimensions.
**How to avoid:** Apply `mask-image` directly to the `<svg>` element (or its wrapper div), ensure the wrapper has explicit `width` and `height`, and use percentage units in the gradient. The pattern container must have `overflow: hidden` on the parent section if the SVG overflows.
**Warning signs:** Pattern visible at edges instead of fading; mask appears cropped unexpectedly.

### Pitfall 5: Hero Path Length Calculation

**What goes wrong:** `stroke-dasharray` and `stroke-dashoffset` set to an incorrect length cause the path to appear partially drawn at rest, or the animation ends before the full path is drawn.
**Why it happens:** The path length must exactly match `SVGPathElement.getTotalLength()`. If the SVG viewBox or scale changes, the path length changes.
**How to avoid:** For a static SVG path, calculate `getTotalLength()` once in a browser (console: `document.querySelector('path').getTotalLength()`) and hardcode as a constant. Alternatively, use `useEffect` + `useRef` to read it at runtime and set as CSS custom property on the element.
**Warning signs:** Draw animation ends before the path is complete, or path is partially invisible at rest state.

### Pitfall 6: framer-motion `staggerChildren` Still Works but Is Deprecated

**What goes wrong:** Using deprecated `staggerChildren: 0.1` in transition — it still functions but the types are marked `@deprecated` in motion-dom 12. Future updates may break it.
**Why it happens:** The API exists for backward compatibility but is not the recommended path.
**How to avoid:** Use `delayChildren: stagger(0.08)` for 1D sequences. Use manual `custom` prop delays for diagonal grid cascades. The planner should generate tasks using the new API.
**Warning signs:** TypeScript deprecation warnings in the editor.

---

## Code Examples

### Complete FadeInOnScroll Component

```typescript
// Source: Verified against motion-dom/dist/index.d.ts ViewportOptions, useReducedMotion type
// components/ui/FadeInOnScroll.tsx
'use client';

import { motion, useReducedMotion } from 'framer-motion';

interface FadeInOnScrollProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;  // travel distance, default 40px (within 32-48px range)
}

export function FadeInOnScroll({ children, className, delay = 0, y = 40 }: FadeInOnScrollProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.2 }}
      transition={{
        duration: 0.6,
        ease: [0.21, 0.47, 0.32, 0.98],  // --ease-premium from globals.css
        delay,
      }}
    >
      {children}
    </motion.div>
  );
}
```

### Diagonal Grid Stagger Item

```typescript
// Source: Verified — stagger() "from" only accepts "first"|"last"|"center"|number (1D)
// Diagonal cascade requires manual row+col delay calculation
// components/ui/StaggerItem.tsx
'use client';

import { motion, useReducedMotion } from 'framer-motion';

interface StaggerItemProps {
  children: React.ReactNode;
  row: number;         // 0-based row index
  col: number;         // 0-based column index
  className?: string;
  staggerInterval?: number;  // seconds per diagonal step; default 0.08s
}

export function StaggerItem({ children, row, col, className, staggerInterval = 0.08 }: StaggerItemProps) {
  const shouldReduceMotion = useReducedMotion();
  const delay = (row + col) * staggerInterval;

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.1 }}
      transition={{
        duration: 0.6,
        ease: [0.21, 0.47, 0.32, 0.98],
        delay,
      }}
    >
      {children}
    </motion.div>
  );
}
```

### HoverLift Component

```typescript
// Source: motion-dom AnimationType includes "whileHover"; verified from types
// components/ui/HoverLift.tsx
'use client';

import { motion, useReducedMotion } from 'framer-motion';

interface HoverLiftProps {
  children: React.ReactNode;
  className?: string;
  scale?: number;
}

export function HoverLift({ children, className, scale = 1.025 }: HoverLiftProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      whileHover={{ scale }}
      transition={{ duration: 0.12, ease: [0.0, 0.0, 0.2, 1] }}
      style={{ willChange: 'transform' }}
    >
      {children}
    </motion.div>
  );
}
```

### GridPattern SVG Component Structure

```typescript
// Source: SVG spec — nested <pattern> elements for recursive grid
// components/ui/GridPattern.tsx
'use client';  // needs useId for unique pattern IDs

import { useId } from 'react';

interface GridPatternProps {
  theme: 'dark' | 'light';
  position?: 'corner-br' | 'corner-tr' | 'edge-right' | 'full';
  className?: string;
}

export function GridPattern({ theme, position = 'corner-br', className }: GridPatternProps) {
  const id = useId();  // React 18+ — generates unique ID per component instance
  const opacity = theme === 'dark' ? 'var(--pattern-opacity-dark)' : 'var(--pattern-opacity-light)';

  // mask-image varies by position
  const maskByPosition = {
    'corner-br': 'radial-gradient(ellipse 60% 70% at 100% 100%, black 30%, transparent 80%)',
    'corner-tr': 'radial-gradient(ellipse 60% 70% at 100% 0%, black 30%, transparent 80%)',
    'edge-right': 'radial-gradient(ellipse 50% 80% at 100% 50%, black 30%, transparent 80%)',
    'full':       'radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)',
  };

  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className ?? ''}`}
      style={{ opacity, maskImage: maskByPosition[position] }}
      aria-hidden="true"
    >
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          {/* Level 3: finest grid — 5px tiles */}
          <pattern id={`${id}-l3`} width="5" height="5" patternUnits="userSpaceOnUse">
            <path d="M 5 0 L 0 0 0 5" fill="none" stroke="currentColor" strokeWidth="0.15" />
          </pattern>
          {/* Level 2: 10px tiles */}
          <pattern id={`${id}-l2`} width="10" height="10" patternUnits="userSpaceOnUse">
            <rect width="10" height="10" fill={`url(#${id}-l3)`} />
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.3" />
          </pattern>
          {/* Level 1: 20px tiles */}
          <pattern id={`${id}-l1`} width="20" height="20" patternUnits="userSpaceOnUse">
            <rect width="20" height="20" fill={`url(#${id}-l2)`} />
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" />
          </pattern>
          {/* Level 0: primary 40px grid (matches --pattern-size: 40px) */}
          <pattern id={`${id}-l0`} width="40" height="40" patternUnits="userSpaceOnUse">
            <rect width="40" height="40" fill={`url(#${id}-l1)`} />
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.8" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${id}-l0)`} />
      </svg>
    </div>
  );
}
```

Key detail: `useId()` from React 18+ generates a stable, unique id per instance. This solves the SVG pattern ID collision pitfall across multiple sections. The component is `'use client'` only because `useId` needs React (it works in both SSR and client). Alternatively this could be a Server Component if a unique prop is passed from the caller instead.

### Hero Draw Animation CSS

```css
/* Add to globals.css @layer components */
.hero-pattern-draw {
  stroke-dasharray: var(--hero-path-length, 2000);
  stroke-dashoffset: var(--hero-path-length, 2000);
  animation:
    hero-draw 1.2s cubic-bezier(0.0, 0.0, 0.2, 1) forwards,
    hero-settle 0.8s cubic-bezier(0.4, 0.0, 0.2, 1) 1.2s forwards;
  opacity: 0.13;
}

@keyframes hero-draw {
  to { stroke-dashoffset: 0; }
}

@keyframes hero-settle {
  to { opacity: 0.06; }  /* --pattern-opacity-dark */
}

@media (prefers-reduced-motion: reduce) {
  .hero-pattern-draw {
    stroke-dashoffset: 0;
    opacity: 0.06;
    animation: none;
  }
}
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `staggerChildren: 0.1` in transition | `delayChildren: stagger(0.08)` | framer-motion 12 (motion-dom) | `staggerChildren` is deprecated, marked `@deprecated` in types |
| `staggerDirection: -1` | `delayChildren: stagger(0.08, { from: "last" })` | framer-motion 12 | Same deprecation |
| Separate `useInView` + state + conditional class | `whileInView` prop directly on `motion.*` | framer-motion v7+ | Simpler, built-in, handles cleanup |
| Manual `requestAnimationFrame` loop | framer-motion handles internally | framer-motion v1+ | Never hand-roll animation loops |
| CSS `will-change: transform` blanket | Selective; only on elements with hover interactions | Performance best practice | Overuse of will-change promotes too many layers, increases memory |

**Deprecated/outdated:**
- `staggerChildren` in `Orchestration` transition: Use `delayChildren: stagger(interval)` instead
- `staggerDirection` in `Orchestration` transition: Use `delayChildren: stagger(interval, { from: "last" })` instead
- framer-motion `motion.path` + `pathLength` for draw: Valid but not used here; CSS keyframes are locked in CONTEXT.md for hero

---

## Open Questions

1. **Pattern accent position consistency across sections**
   - What we know: CONTEXT.md says "Claude picks the position" — accent appears in specific areas with consistent placement
   - What's unclear: Whether all sections use the same corner (e.g., always bottom-right) or whether each section gets a different corner based on its content layout
   - Recommendation: Use bottom-right corner for all sections as the default. The planner should document this as a decision in the plan.

2. **Hero path length calculation method**
   - What we know: `stroke-dashoffset` needs the exact path length; static hardcoding is simplest
   - What's unclear: The actual SVG path for the hero fractal hasn't been designed yet. The path will be determined during implementation.
   - Recommendation: Use a `useEffect` + `useRef` approach to read `getTotalLength()` at runtime and set `--hero-path-length` as an inline CSS custom property on the SVG element. This avoids hardcoding and survives design changes.

3. **Pattern opacity pulse on card hover**
   - What we know: CONTEXT.md says "subtle opacity pulse near the hovered card" — implementation method is Claude's discretion
   - What's unclear: CSS-only approach (sibling selectors, limited) vs. JS approach (event listeners, more flexible)
   - Recommendation: Use a CSS approach within the card's `HoverLift` wrapper. The wrapper applies a CSS class on hover (via framer-motion `onHoverStart`/`onHoverEnd` callbacks setting state) that increases the nearby pattern opacity via a CSS custom property. This is self-contained within the card component and requires no global state.

4. **`viewport={{ once: false }}` performance with many animated elements**
   - What we know: `once: false` keeps IntersectionObserver active for every animated element indefinitely
   - What's unclear: At scale (many sections, many cards), whether this causes meaningful performance issues
   - Recommendation: Accept for now. framer-motion's IntersectionObserver usage is efficient. If profiling shows issues in Phase 5+, switch to `once: true`.

---

## Sources

### Primary (HIGH confidence)

- `node_modules/framer-motion/dist/types/index.d.ts` — `useReducedMotion`, `useInView`, `AnimatePresence`, `MotionConfig`, `ReducedMotionConfig` types
- `node_modules/motion-dom/dist/index.d.ts` — `ViewportOptions`, `MotionNodeViewportOptions`, `whileInView`, `staggerChildren` deprecation, `stagger()` function, `StaggerOrigin` type, `StaggerOptions`
- `node_modules/framer-motion/dist/types/client.d.ts` — All motion HTML/SVG component types
- `app/globals.css` (project) — `--duration-fast`, `--duration-slow`, `--ease-premium`, `--pattern-opacity-dark`, `--pattern-opacity-light`, `--pattern-size`, existing `.fade-in-scroll` pattern
- `lib/constants.ts` (project) — `PATTERN_CONFIG`, `SECTIONS` dark/light alternation
- `lib/types.ts` (project) — `PatternConfig` interface

### Secondary (MEDIUM confidence)

- [MDN mask-image](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/mask-image) — `mask-image` gradient syntax, browser support
- [CSS-Tricks: SVG Line Animation](https://css-tricks.com/svg-line-animation-works/) — `stroke-dasharray`/`stroke-dashoffset` technique
- [web.dev CSS masking](https://web.dev/articles/css-masking) — `mask-image` with gradients
- [motion.dev stagger docs](https://www.framer.com/motion/stagger/) — `stagger()` API, `from` options
- [motion.dev accessibility](https://motion.dev/docs/react-accessibility) — `useReducedMotion` pattern

### Tertiary (LOW confidence)

- [Animating Link Underlines (Tobias Ahlin)](https://tobiasahlin.com/blog/css-trick-animating-link-underlines/) — CSS pseudo-element underline draw pattern
- WebSearch results on diagonal grid stagger — no official source for this pattern; manual `custom` prop approach is inferred from framer-motion docs and confirmed correct by type inspection

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — framer-motion 12 types read directly from installed node_modules; all APIs verified
- Architecture: HIGH — component boundaries (Server vs Client) are clear; framer-motion `'use client'` requirement is documented
- Framer Motion API: HIGH — `ViewportOptions`, `useReducedMotion`, `stagger()`, deprecation all verified from motion-dom source
- SVG pattern approach: HIGH — SVG `<pattern>` nesting is a well-established SVG spec feature; verified via multiple sources
- CSS mask-image: HIGH — MDN official docs confirm gradient mask technique; browser support confirmed
- Diagonal stagger: MEDIUM — manual `custom` prop approach is correct but no single authoritative source for the exact pattern; inferred from type constraints (`StaggerOrigin` is 1D only)
- Hero draw animation: HIGH — `stroke-dasharray`/`dashoffset` is a well-documented technique; CSS keyframe approach is locked in CONTEXT.md
- Pattern ID collision fix: HIGH — `useId()` from React 18+ is the official solution; well-documented

**Research date:** 2026-02-22
**Valid until:** 2026-03-22 (stable libraries — 30 days)
