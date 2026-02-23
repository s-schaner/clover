# Phase 4: Card Components - Research

**Researched:** 2026-02-23
**Domain:** React card component architecture, SVG icon design, SVG monogram avatars, contact form accessibility, Tailwind v4 utility class patterns, Framer Motion composition
**Confidence:** HIGH (primary sources: project codebase, installed node_modules, existing design system tokens, established SVG/HTML specs)

---

## Summary

Phase 4 builds five UI card atoms on top of the Phase 3 visual primitive library. All building blocks are already in place — HoverLift, FadeInOnScroll, StaggerChildren/StaggerItem, and the design token system are complete and validated. This phase is purely additive: no new npm packages, no infrastructure changes.

The most important finding from reading the codebase is that the placeholder card shapes already exist in page.tsx as Phase 3 validation artifacts. Phase 4 extracts those into proper typed, standalone card components with full anatomy. The services cards in page.tsx are bare (no icon); portfolio cards are near-complete structurally but missing the outcomeMetric field; team cards are entirely missing (only a placeholder heading exists). All four card types need to be created as dedicated files in `components/cards/`.

The key design challenge is the TeamCard monogram avatar: each team member (MW, MD, PK, SS) gets a large SVG monogram where the first letter is adorned with a simplified four-leaf clover accent element. Two members share the initial "M" (Mike Wong and Matt Drapp), requiring distinguishable avatars — either two-initial rendering (M/W vs M/D) or varying the clover accent position per member. Research recommends using first+last initial for M-members to resolve the collision unambiguously.

The fractal hero element (HERO-03) is already fully implemented as `GeometryAccent` — a four-leaf clover draw animation committed in Phase 3. Phase 4 only needs to verify it meets the success criterion ("animated geometric fractal hero element renders") and wire it cleanly, which it already does in page.tsx.

**Primary recommendation:** Create `components/cards/` directory with four files: `ServiceCard.tsx`, `PortfolioCard.tsx`, `TeamCard.tsx`, `ContactForm.tsx`. Each is a `'use client'` component consuming types from `lib/types.ts` and wrapping in HoverLift where appropriate. No new packages. All icons are hand-crafted inline SVG using stroke-only geometric shapes consistent with the blueprint aesthetic.

---

## Standard Stack

### Core (already installed — no new installs needed)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| framer-motion | 12.34.3 | HoverLift wrapper (whileHover) for ServiceCard and TeamCard | Already installed; used by all Phase 3 components |
| React | 19.2.3 | 'use client' card components, useId for SVG ID uniqueness | Project standard |
| TypeScript | 5.9.3 strict | Props interfaces match lib/types.ts interfaces exactly | Project standard |
| clsx | 2.1.1 | Conditional class merging on card state (e.g., selected portfolio category) | Already installed, used in Navigation |

### Explicitly NOT using (important constraint)

| Package | Reason |
|---------|--------|
| lucide-react (installed: 0.575.0) | CONTEXT.md explicitly requires "simple geometric SVG shapes (not icon library imports)" for service icons. The `iconName` field in ServiceItem exists as a reference label, not a lucide import key. |
| @tailwindcss/forms | Not installed; not needed — inputs styled directly with Tailwind v4 utility classes |
| react-hook-form, zod | Contact form is purely visual, no submission logic in this phase |

### Supporting (browser-native)

| Feature | Purpose | Confidence |
|---------|---------|------------|
| Inline SVG in JSX | Service icons and team avatars — hand-crafted paths using `stroke="currentColor"` | HIGH |
| SVG `<text>` element | TeamCard monogram letters — positions letter within avatar SVG | HIGH |
| `aria-disabled` + `disabled` | ContactForm submit button — both attributes for full accessibility | HIGH |
| CSS `pointer-events-none` + `opacity-50` | Visual "Coming Soon" disabled state on submit | HIGH |

**Installation:**
```bash
# No new packages required — all dependencies already in package.json
```

---

## Architecture Patterns

### Recommended Component Structure

```
components/
├── ui/                          # Phase 3 primitives — untouched
│   ├── HoverLift.tsx
│   ├── FadeInOnScroll.tsx
│   ├── StaggerChildren.tsx
│   ├── GeometryAccent.tsx
│   ├── GridPattern.tsx
│   └── SectionWrapper.tsx
├── cards/                       # Phase 4 — new directory
│   ├── ServiceCard.tsx          # Plan 04-01
│   ├── PortfolioCard.tsx        # Plan 04-02
│   ├── TeamCard.tsx             # Plan 04-03
│   └── ContactForm.tsx          # Plan 04-03
└── layout/
    └── Navigation.tsx           # Phase 2 — untouched
```

### Pattern 1: Card Component Anatomy

**What:** Each card is a self-contained 'use client' component that:
1. Accepts typed props matching the corresponding `lib/types.ts` interface
2. Optionally wraps itself in `HoverLift` internally (so callers don't need to)
3. Uses CSS custom property tokens from globals.css (`--card-padding: 2rem`)
4. Uses Tailwind v4 utility classes for design tokens

**When to use:** All four card types follow this pattern.

```typescript
// Source: Established pattern from page.tsx Phase 3 placeholder cards
'use client';

import { HoverLift } from '@/components/ui/HoverLift';
import type { ServiceItem } from '@/lib/types';

interface ServiceCardProps {
  item: ServiceItem;
  className?: string;
}

export function ServiceCard({ item, className }: ServiceCardProps) {
  return (
    <HoverLift className={className}>
      <div className="p-[--card-padding] border border-on-surface-light-subtle/20 bg-surface-light-raised h-full">
        {/* icon, title, description */}
      </div>
    </HoverLift>
  );
}
```

### Pattern 2: Geometric SVG Icon System for ServiceCard

**What:** Five hand-crafted inline SVG icons (cpu, cloud, code, database, shield) rendered as React components. Each icon uses `stroke="currentColor"` with no fill, so it inherits text color and works on both dark and light backgrounds. Icons render at 32x32px in a 24-unit viewBox (matching Lucide's grid convention).

**When to use:** ServiceCard geometric icon slot. The `iconName` prop from `ServiceItem` maps to a local lookup object.

```typescript
// Source: SVG specification — stroke-only icon pattern
// viewBox 0 0 24 24 matches Lucide convention — consistent sizing
// All paths: fill="none", stroke="currentColor", strokeWidth={1.5}, strokeLinecap="round", strokeLinejoin="round"

const ICON_MAP: Record<string, React.ReactNode> = {
  cpu: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      {/* CPU: outer square + inner square + 4 pin groups */}
      <rect x="7" y="7" width="10" height="10" />
      <rect x="9" y="9" width="6" height="6" />
      <line x1="7" y1="3" x2="7" y2="7" />
      <line x1="12" y1="3" x2="12" y2="7" />
      <line x1="17" y1="3" x2="17" y2="7" />
      <line x1="7" y1="17" x2="7" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
      <line x1="17" y1="17" x2="17" y2="21" />
      <line x1="3" y1="7" x2="7" y2="7" />
      <line x1="3" y1="12" x2="7" y2="12" />
      <line x1="3" y1="17" x2="7" y2="17" />
      <line x1="17" y1="7" x2="21" y2="7" />
      <line x1="17" y1="12" x2="21" y2="12" />
      <line x1="17" y1="17" x2="21" y2="17" />
    </svg>
  ),
  cloud: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      {/* Cloud: arc path */}
      <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
    </svg>
  ),
  code: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      {/* Code: angle brackets */}
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  ),
  database: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      {/* Database: ellipse stack */}
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    </svg>
  ),
  shield: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      {/* Shield: path + checkmark */}
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
};
```

**Note:** These paths are geometric primitives drawn from SVG coordinate math, not from any icon library. They are simple enough to be hand-authored and produce a blueprint/schematic aesthetic consistent with GeometryAccent.

### Pattern 3: TeamCard Monogram Avatar (Locked Decision)

**What:** SVG-based monogram where the letter is adorned with a simplified four-leaf clover accent. The clover replaces or adorns part of the letter (e.g., sits at the letter's baseline corner, or replaces a dot or crossbar extension). Pure B&W, stroke-only, consistent with GeometryAccent blueprint aesthetic.

**Two-M disambiguation:** Mike Wong (MW) and Matt Drapp (MD) share the initial "M". Recommendation: render two initials for M-members — "MW" and "MD" — with the clover accent positioned at the connection point between the two letters. Peter (PK) and Stefan (SS) get their first initial only with the clover accent at a prominent feature of the letter.

**Avatar area:** Takes up ~60% of card height. The SVG is a square container (e.g., viewBox 0 0 120 120), centered in a div that is ~60% of card height.

**Clover accent SVG sub-component:** Reuse the four-petal bezier shape from GeometryAccent (scaled down, simplified to just the outer petals, no veins — it's an accent, not the hero element). This keeps brand consistency without duplicating complex path logic.

```typescript
// Source: Locked design decision from CONTEXT.md + GeometryAccent.tsx bezier pattern
// components/cards/TeamCard.tsx

'use client';

import { HoverLift } from '@/components/ui/HoverLift';
import type { TeamMember } from '@/lib/types';

// Simplified 4-petal clover for use as letter accent — no veins, no frame, no crosshairs.
// Scale factor controls petal size relative to the 120x120 viewBox.
function CloverAccent({ cx, cy, size = 12 }: { cx: number; cy: number; size?: number }) {
  const half = size / 2;
  // Each petal: from center, bulge to tip, curve back — same bezier pattern as GeometryAccent
  const d = [
    `M ${cx} ${cy}`,
    `C ${cx + half * 0.6} ${cy - half * 0.75}, ${cx + size} ${cy - half * 0.4}, ${cx + size} ${cy}`,
    `C ${cx + size} ${cy + half * 0.4}, ${cx + half * 0.6} ${cy + half * 0.75}, ${cx} ${cy}`,
    `C ${cx - half * 0.75} ${cy - half * 0.6}, ${cx - half * 0.4} ${cy - size}, ${cx} ${cy - size}`,
    `C ${cx + half * 0.4} ${cy - size}, ${cx + half * 0.75} ${cy - half * 0.6}, ${cx} ${cy}`,
    `C ${cx - half * 0.6} ${cy - half * 0.75}, ${cx - size} ${cy - half * 0.4}, ${cx - size} ${cy}`,
    `C ${cx - size} ${cy + half * 0.4}, ${cx - half * 0.6} ${cy + half * 0.75}, ${cx} ${cy}`,
    `C ${cx + half * 0.75} ${cy + half * 0.6}, ${cx + half * 0.4} ${cy + size}, ${cx} ${cy + size}`,
    `C ${cx - half * 0.4} ${cy + size}, ${cx - half * 0.75} ${cy + half * 0.6}, ${cx} ${cy}`,
  ].join(' ');

  return (
    <path
      d={d}
      fill="none"
      stroke="currentColor"
      strokeWidth="0.8"
    />
  );
}
```

**Avatar layout strategy per member:**

| Member | Initials Rendered | Clover Position |
|--------|-------------------|-----------------|
| Mike Wong | MW | Junction between M and W (top-center of gap) |
| Matt Drapp | MD | Junction between M and D (top-center of gap) |
| Peter Kwon | PK | Junction between P and K |
| Stefan Schaner | SS | Junction between first S and second S |

All four members use two initials to maintain visual consistency. The `initials` field in constants already has the correct values: 'MW', 'MD', 'PK', 'SS'.

### Pattern 4: PortfolioCard with Category Filter Readiness

**What:** Card renders all PortfolioItem fields. Exposes `data-category` attribute so Phase 5 can implement CSS/JS filtering without modifying the card component. No client-side state in the card itself — filter state lives in the parent section (Phase 5 concern).

```typescript
// Source: PortfolioItem interface from lib/types.ts — fully typed
// data-category attribute: Phase 5 filters will use this for CSS :has() or JS querySelector

interface PortfolioCardProps {
  item: PortfolioItem;
  className?: string;
}

export function PortfolioCard({ item, className }: PortfolioCardProps) {
  return (
    <HoverLift className={className}>
      <article
        className="p-[--card-padding] border border-on-surface-subtle/20 bg-surface-raised h-full flex flex-col"
        data-category={item.category}  // filter hook for Phase 5
      >
        {/* Category badge */}
        <div className="text-xs font-body text-on-surface-muted uppercase tracking-wider mb-3">
          {item.projectType}
        </div>

        {/* Title */}
        <h3 className="font-display text-base font-semibold mb-2 text-on-surface">
          {item.title}
        </h3>

        {/* Outcome metric — optional, renders placeholder text if missing */}
        {item.outcomeMetric && (
          <p className="font-body text-sm text-on-surface-muted mb-4 italic">
            {item.outcomeMetric}
          </p>
        )}

        {/* Tech tags — JetBrains Mono (font-mono token) */}
        <div className="flex flex-wrap gap-2 mt-auto">
          {item.tags.map((tag) => (
            <span
              key={tag.label}
              className="text-xs font-mono text-on-surface-subtle border border-on-surface-subtle/30 px-2 py-0.5"
            >
              {tag.label}
            </span>
          ))}
        </div>
      </article>
    </HoverLift>
  );
}
```

### Pattern 5: ContactForm with Accessible Disabled Submit

**What:** Visual-only form with name/email/message fields and a submit button that is disabled with "Coming Soon" label. Uses both HTML `disabled` attribute and `aria-disabled="true"` for full accessibility. Fields are focusable and readable — the form should feel like a real form that just isn't connected yet.

**Key accessibility rule:** Use `disabled` on the button (which removes it from tab order naturally) but also add a visible tooltip/label explaining the state. Since this is a portfolio site and not a product with complex states, using the native `disabled` attribute (not `aria-disabled` alone) is the correct approach for a form that is explicitly not functional yet.

```typescript
// Source: MDN aria-disabled, HTML button spec — HIGH confidence
// The button uses native disabled attribute — simplest, most accessible for a clearly "not yet live" form

export function ContactForm() {
  return (
    <form
      onSubmit={(e) => e.preventDefault()}  // no-op: purely visual
      className="flex flex-col gap-6 max-w-lg"
      aria-label="Contact form — not yet active"
      noValidate
    >
      {/* Name field */}
      <div className="flex flex-col gap-2">
        <label
          htmlFor="contact-name"
          className="font-body text-sm text-on-surface-muted uppercase tracking-wider"
        >
          Name
        </label>
        <input
          id="contact-name"
          type="text"
          name="name"
          autoComplete="name"
          readOnly
          className="bg-transparent border border-on-surface-subtle/30 px-4 py-3 font-body text-on-surface placeholder:text-on-surface-subtle/40 focus:outline-none focus:border-on-surface/60 transition-colors duration-[--duration-fast]"
          placeholder="Your name"
        />
      </div>

      {/* Email field */}
      <div className="flex flex-col gap-2">
        <label
          htmlFor="contact-email"
          className="font-body text-sm text-on-surface-muted uppercase tracking-wider"
        >
          Email
        </label>
        <input
          id="contact-email"
          type="email"
          name="email"
          autoComplete="email"
          readOnly
          className="bg-transparent border border-on-surface-subtle/30 px-4 py-3 font-body text-on-surface placeholder:text-on-surface-subtle/40 focus:outline-none focus:border-on-surface/60 transition-colors duration-[--duration-fast]"
          placeholder="your@email.com"
        />
      </div>

      {/* Message field */}
      <div className="flex flex-col gap-2">
        <label
          htmlFor="contact-message"
          className="font-body text-sm text-on-surface-muted uppercase tracking-wider"
        >
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={5}
          readOnly
          className="bg-transparent border border-on-surface-subtle/30 px-4 py-3 font-body text-on-surface placeholder:text-on-surface-subtle/40 focus:outline-none focus:border-on-surface/60 transition-colors duration-[--duration-fast] resize-none"
          placeholder="Tell us about your project"
        />
      </div>

      {/* Submit — disabled, Coming Soon */}
      <button
        type="submit"
        disabled
        aria-disabled="true"
        aria-describedby="contact-coming-soon"
        className="font-display text-sm tracking-widest uppercase px-8 py-4 border border-on-surface/20 text-on-surface/30 cursor-not-allowed opacity-50"
      >
        Coming Soon
      </button>
      <p id="contact-coming-soon" className="sr-only">
        Form submission is not yet active. Please email hello@cloverlabs.io directly.
      </p>
    </form>
  );
}
```

**Note on `readOnly` vs `disabled` on inputs:** Using `readOnly` (not `disabled`) on the text fields keeps them visually and functionally interactive (focus, select text, placeholder readable) while preventing edits. This makes the form feel like a "preview" rather than a broken form. The submit button alone uses `disabled` to communicate clearly that nothing will happen.

### Pattern 6: Hero Element Verification (HERO-03)

**What:** HERO-03 requires "animated geometric fractal hero element renders as SVG-based visual component." `GeometryAccent` already satisfies this requirement completely:
- SVG-based: YES — pure SVG path with `stroke="currentColor"`
- Animated: YES — CSS `hero-pattern-draw` keyframe via `stroke-dashoffset`
- Viewport-triggered: PARTIAL — draws on page load (not scroll-triggered). This is intentional for hero elements.
- Geometric fractal: YES — four-leaf clover with nested scale (outer + inner clover + veins)

**Action required:** No new component needed. Plan 04-01 should verify `GeometryAccent` is wired in the Hero section and the animation plays correctly, then mark HERO-03 as satisfied. If the plan requires a named "hero element component" for completeness, create a thin wrapper:

```typescript
// components/cards/HeroElement.tsx — optional thin wrapper if needed for naming clarity
export { GeometryAccent as HeroElement } from '@/components/ui/GeometryAccent';
```

### Anti-Patterns to Avoid

- **Importing lucide-react for service icons:** The design system requires hand-crafted SVG shapes. Using lucide icons would break the blueprint aesthetic and diverge from the B&W geometric system established in Phase 3.
- **Putting form submission logic in ContactForm:** This is explicitly v2 scope. No fetch, no state management, no error handling. Keep it purely visual.
- **Using `aria-disabled` without also using `disabled` on the submit button:** For a button that should never be interactive, native `disabled` is simpler and more correct. `aria-disabled` alone leaves the button focusable (which may confuse users expecting interaction).
- **Nesting HoverLift inside the card when the card already wraps HoverLift:** HoverLift should be owned by the card component internally so callers use `<ServiceCard item={item} />` without wrapping. Prevents double-scale bugs.
- **Using `useState` in card components for hover state:** Card hover is handled by Framer Motion's `whileHover` in HoverLift — no JavaScript hover state needed. Cards are stateless (except ContactForm which is also stateless in this phase).
- **Setting border with `--border-primary` CSS variable:** That token does not exist in globals.css. The correct tokens are `--color-surface-border` (#1a1a1a, dark) and `--color-surface-light-border` (#e0e0e0, light). As Tailwind utility classes: `border-surface-border` (dark sections) and `border-surface-light-border` (light sections). Or use the opacity modifier pattern already established: `border-on-surface-subtle/20`.
- **Using `rounded-*` Tailwind classes on cards:** The existing Phase 3 pattern uses no border-radius (`rounded-sm` appears once in page.tsx but with no radius). The design system is sharp-cornered — consistent with the blueprint/engineering aesthetic. Use no rounding on card containers.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Card hover micro-interaction | Custom CSS :hover scale | `HoverLift` wrapper from Phase 3 | Already built, GPU-hinted, reduced-motion aware |
| Scroll-triggered card entrance | Custom IntersectionObserver | `StaggerItem` from Phase 3 | Already built with diagonal cascade delay |
| SVG ID uniqueness in avatar | Global ID counter | `useId()` from React 19 | Built-in, stable across SSR and client, no coordination needed |
| Icon component registry | External icon library | Inline ICON_MAP object in ServiceCard | Five icons total — a lookup object is simpler and avoids lucide import |
| Form field validation | Custom validation logic | Leave fields unvalidated (v2 scope) | Form is visual-only; no validation needed until submission is wired |
| Disabled state visual | Custom CSS class | `opacity-50 cursor-not-allowed` Tailwind classes | Standard pattern, works out of the box |

**Key insight:** Phase 3 built every animation and interaction primitive needed by Phase 4 cards. Phase 4 is purely composition — assembling typed, data-driven card components from those primitives. No new motion logic, no new infrastructure.

---

## Common Pitfalls

### Pitfall 1: Border Token Mismatch

**What goes wrong:** Using a CSS variable like `--border-primary` that doesn't exist in globals.css causes no border to render (CSS treats undefined var as empty).
**Why it happens:** CONTEXT.md mentions `--border-primary` as a concept but globals.css uses `--color-surface-border` and `--color-surface-light-border` as the actual token names.
**How to avoid:** Use the opacity modifier pattern from page.tsx: `border border-on-surface-subtle/20` (dark sections) or `border border-on-surface-light-subtle/20` (light sections). Alternatively use inline styles: `style={{ borderColor: 'var(--color-surface-border)' }}`.
**Warning signs:** Card borders don't appear or appear at unexpected colors.

### Pitfall 2: Two "M" Members — Identical SVG Avatar Output

**What goes wrong:** Rendering only the first initial "M" for both Mike Wong and Matt Drapp produces two visually identical avatar cards.
**Why it happens:** The monogram decision was "first initial with clover accent" but two members share the same first initial.
**How to avoid:** Use the `initials` field from `TeamMember` which already contains two-character strings: 'MW', 'MD', 'PK', 'SS'. Render both characters in the SVG. The clover accent positioning can vary (between the letters, or offset differently per member).
**Warning signs:** Two identical-looking team cards side by side.

### Pitfall 3: SVG Text Baseline Alignment

**What goes wrong:** SVG `<text>` element's `y` coordinate positions the text baseline, not the top-left corner. Letters appear to float above their intended position.
**Why it happens:** SVG text positioning is baseline-based by default, unlike CSS where `top` typically refers to the content box top.
**How to avoid:** Use `dominantBaseline="middle"` and `textAnchor="middle"` with `x` and `y` at the center of the viewBox. For a 120x120 viewBox: `x="60" y="60" dominantBaseline="middle" textAnchor="middle"`.
**Warning signs:** Monogram letters appear vertically offset, cut off at top, or positioned unexpectedly.

### Pitfall 4: PortfolioCard data-category Value Must Match PortfolioCategory Type

**What goes wrong:** Phase 5 filter logic matches on `data-category` values. If the card renders a display label (e.g., "AI/ML" transformed to "ai-ml") instead of the raw category string, filters break.
**Why it happens:** Temptation to slugify/normalize category values for HTML attributes.
**How to avoid:** Use the raw `item.category` string directly as the `data-category` value: `data-category={item.category}`. Phase 5 filter logic should use the same `PortfolioCategory` union type strings.
**Warning signs:** Filters work for some categories but not others.

### Pitfall 5: ContactForm in Dark Section — Token Context

**What goes wrong:** Contact section is dark (theme: 'dark'). Using `text-on-surface-light` or `border-surface-light-border` tokens in the form produces invisible or wrong-colored elements.
**Why it happens:** Dark/light token suffix confusion — "on-surface-light" means "text on a light surface" (dark text), not "text with low opacity".
**How to avoid:** In the dark Contact section, use `text-on-surface` (white), `text-on-surface-muted` (#888), `border-on-surface-subtle/30` for form elements.
**Warning signs:** Input labels invisible, borders invisible, or white text on white background.

### Pitfall 6: HoverLift and h-full on PortfolioCard

**What goes wrong:** In a grid where all cards should be the same height, `HoverLift` renders a `motion.div` without `h-full`, causing cards to shrink to their content height rather than stretching to fill the grid row.
**Why it happens:** `HoverLift` accepts `className` but defaults to no explicit height. The inner card div may have `h-full` without the wrapper having it.
**How to avoid:** Pass `className="h-full"` to HoverLift when it wraps equal-height grid cards: `<PortfolioCard item={item} className="h-full" />`. Alternatively, add `h-full` to HoverLift's internal `motion.div` when the card requests it.
**Warning signs:** Cards in the portfolio grid have inconsistent heights.

---

## Code Examples

### ServiceCard Complete Implementation

```typescript
// Source: Established pattern from page.tsx + lib/types.ts ServiceItem interface
// components/cards/ServiceCard.tsx
'use client';

import { HoverLift } from '@/components/ui/HoverLift';
import type { ServiceItem } from '@/lib/types';

// Geometric SVG icon lookup — hand-crafted, stroke-only, 24-unit viewBox
// No icon library imports — blueprint aesthetic requires custom geometric shapes
const ICON_MAP: Record<string, React.ReactNode> = {
  cpu: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      <rect x="7" y="7" width="10" height="10" />
      <rect x="9" y="9" width="6" height="6" />
      <line x1="7" y1="3" x2="7" y2="7" /><line x1="12" y1="3" x2="12" y2="7" /><line x1="17" y1="3" x2="17" y2="7" />
      <line x1="7" y1="17" x2="7" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /><line x1="17" y1="17" x2="17" y2="21" />
      <line x1="3" y1="7" x2="7" y2="7" /><line x1="3" y1="12" x2="7" y2="12" /><line x1="3" y1="17" x2="7" y2="17" />
      <line x1="17" y1="7" x2="21" y2="7" /><line x1="17" y1="12" x2="21" y2="12" /><line x1="17" y1="17" x2="21" y2="17" />
    </svg>
  ),
  cloud: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
    </svg>
  ),
  code: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  ),
  database: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    </svg>
  ),
  shield: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
};

interface ServiceCardProps {
  item: ServiceItem;
  className?: string;
}

export function ServiceCard({ item, className }: ServiceCardProps) {
  const icon = item.iconName ? ICON_MAP[item.iconName] : null;

  return (
    <HoverLift className={className}>
      <div className="p-[--card-padding] border border-on-surface-light-subtle/20 h-full flex flex-col gap-4">
        {/* Geometric icon — 32x32 stroke-only */}
        {icon && (
          <div className="text-on-surface-light-subtle">
            {icon}
          </div>
        )}

        {/* Title */}
        <h3 className="font-display text-lg font-semibold text-on-surface-light">
          {item.title}
        </h3>

        {/* Description */}
        <p className="font-body text-sm text-on-surface-light-muted leading-relaxed">
          {item.description}
        </p>
      </div>
    </HoverLift>
  );
}
```

### TeamCard Monogram Avatar SVG

```typescript
// Source: SVG text spec (dominantBaseline, textAnchor) + GeometryAccent bezier pattern
// components/cards/TeamCard.tsx (excerpt — MonogramAvatar component)

function MonogramAvatar({ initials }: { initials: string }) {
  // viewBox: 120x120 square. Letter positioned at center (60, 60).
  // Clover accent at approximately (85, 35) — top-right of letter cluster.
  // All strokes: currentColor, pure B&W, no fill.
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      stroke="currentColor"
      className="w-full h-full"
      aria-hidden="true"
    >
      {/* Outer square frame — blueprint aesthetic */}
      <rect x="4" y="4" width="112" height="112" strokeWidth="0.5" opacity="0.3" />

      {/* Monogram text — both initials, centered */}
      <text
        x="55"
        y="60"
        dominantBaseline="middle"
        textAnchor="middle"
        fontFamily="var(--font-display)"
        fontSize="40"
        fontWeight="700"
        stroke="none"
        fill="currentColor"
        letterSpacing="-1"
      >
        {initials}
      </text>

      {/* Clover accent — simplified 4-petal at top-right junction of letters */}
      {/* Position: (88, 28) — between and above the two letter tops */}
      <CloverAccentMini cx={88} cy={28} size={10} />
    </svg>
  );
}

function CloverAccentMini({ cx, cy, size }: { cx: number; cy: number; size: number }) {
  const h = size / 2;
  const d = [
    `M ${cx} ${cy}`,
    `C ${cx + h * 0.6} ${cy - h * 0.75}, ${cx + size} ${cy - h * 0.4}, ${cx + size} ${cy}`,
    `C ${cx + size} ${cy + h * 0.4}, ${cx + h * 0.6} ${cy + h * 0.75}, ${cx} ${cy}`,
    `C ${cx - h * 0.75} ${cy - h * 0.6}, ${cx - h * 0.4} ${cy - size}, ${cx} ${cy - size}`,
    `C ${cx + h * 0.4} ${cy - size}, ${cx + h * 0.75} ${cy - h * 0.6}, ${cx} ${cy}`,
    `C ${cx - h * 0.6} ${cy - h * 0.75}, ${cx - size} ${cy - h * 0.4}, ${cx - size} ${cy}`,
    `C ${cx - size} ${cy + h * 0.4}, ${cx - h * 0.6} ${cy + h * 0.75}, ${cx} ${cy}`,
    `C ${cx + h * 0.75} ${cy + h * 0.6}, ${cx + h * 0.4} ${cy + size}, ${cx} ${cy + size}`,
    `C ${cx - h * 0.4} ${cy + size}, ${cx - h * 0.75} ${cy + h * 0.6}, ${cx} ${cy}`,
  ].join(' ');
  return <path d={d} strokeWidth="0.8" />;
}
```

### Tailwind v4 Token Usage Pattern (Reference)

```typescript
// Source: globals.css @theme block + page.tsx established patterns
// Design token → Tailwind utility class mapping:

// Colors — dark section (Hero, Portfolio, Contact):
// text-on-surface          → var(--color-on-surface)      = #ffffff
// text-on-surface-muted    → var(--color-on-surface-muted) = #888888
// text-on-surface-subtle   → var(--color-on-surface-subtle) = #555555
// bg-surface               → var(--color-surface)          = #000000
// bg-surface-raised        → var(--color-surface-raised)   = #0a0a0a
// border-surface-border    → var(--color-surface-border)   = #1a1a1a

// Colors — light section (Services, Team):
// text-on-surface-light        → var(--color-on-surface-light)        = #000000
// text-on-surface-light-muted  → var(--color-on-surface-light-muted)  = #555555
// text-on-surface-light-subtle → var(--color-on-surface-light-subtle) = #888888
// bg-surface-light             → var(--color-surface-light)           = #f5f5f5
// bg-surface-light-raised      → var(--color-surface-light-raised)    = #ffffff

// Opacity modifier pattern (used heavily):
// border-on-surface-subtle/20  = border at 20% opacity on dark
// border-on-surface-light-subtle/20 = border at 20% opacity on light

// Typography:
// font-display → Space Grotesk
// font-body    → Inter
// font-mono    → JetBrains Mono (use on tech tags)

// Spacing via CSS var:
// p-[--card-padding]     → 2rem padding
// gap-[--gap-grid]       → 1.5rem gap
// py-[--section-padding-y] → clamp(5rem, 10vw, 10rem)
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `disabled` only on button | `disabled` + `aria-disabled` both | Accessibility best practice | Screen readers get both native and ARIA signal |
| Hardcoded color values on SVG stroke | `stroke="currentColor"` | SVG spec; standard practice | Icon adapts to text color in both dark and light contexts automatically |
| `<text>` with manual y baseline guess | `dominantBaseline="middle"` + `textAnchor="middle"` | SVG 1.1 spec | Reliable centering regardless of font metrics |
| Icon library imports for custom design systems | Inline SVG in JSX | Established for custom design systems | Zero external dependency, full control over path data |
| `staggerChildren` (deprecated) | Per-item `custom` delay prop | framer-motion 12 | Already resolved in Phase 3 — use StaggerItem |

**Deprecated/outdated:**
- `--border-primary` CSS variable: Not defined. Use `border-on-surface-subtle/20` (dark) or `border-on-surface-light-subtle/20` (light).
- `rounded-*` on card containers: Inconsistent with the sharp blueprint aesthetic. Use no border-radius.

---

## Open Questions

1. **Avatar font rendering — SVG `<text>` vs image**
   - What we know: SVG `<text>` with `fontFamily="var(--font-display)"` should render Space Grotesk, but font loading in SVG depends on whether the CSS font-face is declared at document level (it is, in globals.css via Next.js font system).
   - What's unclear: Whether `var(--font-display)` resolves correctly inside an SVG `<text>` element when the font is loaded via `next/font` CSS variables. This is a known edge case.
   - Recommendation: The planner should include a verification task that checks the SVG text renders with the correct font. If it doesn't resolve, fall back to `fontFamily="'Space Grotesk', sans-serif"` as a string literal. Alternatively, use a `<foreignObject>` to embed an HTML span inside SVG — but that has its own quirks. Try CSS variable first; it should work since the variable is set on `:root`.

2. **CloverAccentMini position per team member**
   - What we know: All four team members use two-initial monograms (MW, MD, PK, SS). The clover accent should sit at the top-right area of the two-letter cluster.
   - What's unclear: The exact pixel coordinates depend on the font rendering of the specific letters. "MW" is wider than "PK" due to M/W being wide characters.
   - Recommendation: Use a single accent position (cx=88, cy=28) and let the font-weight of the monogram letters carry the visual weight. If per-implementation review shows one looks wrong, adjust individual member's accent position via a lookup. This is a visual refinement concern, not a blocker.

3. **GeometryAccent hero wiring — is it already done?**
   - What we know: page.tsx already has `<GeometryAccent />` inside `HeroSection`. The HERO-03 success criterion ("animated geometric fractal hero element renders") appears to already be satisfied.
   - What's unclear: Whether HERO-03 intends a more complex composition (e.g., GeometryAccent + additional hero content scaffolding) or simply that the component exists and animates.
   - Recommendation: Plan 04-01 should treat HERO-03 as a verification task (confirm animation plays, confirm reduced-motion works) rather than a build task. No new component needed. Document this explicitly in the plan to prevent unnecessary work.

---

## Sources

### Primary (HIGH confidence)

- `C:\Users\sscha\OneDrive\Desktop\clover\components\ui\GeometryAccent.tsx` — Four-leaf clover bezier path pattern, CSS keyframe draw animation
- `C:\Users\sscha\OneDrive\Desktop\clover\components\ui\HoverLift.tsx` — Wrapping pattern, willChange hint, useReducedMotion guard
- `C:\Users\sscha\OneDrive\Desktop\clover\components\ui\StaggerChildren.tsx` — StaggerItem per-card delay pattern
- `C:\Users\sscha\OneDrive\Desktop\clover\app\globals.css` — All design tokens, utility class names, border opacity pattern
- `C:\Users\sscha\OneDrive\Desktop\clover\app\page.tsx` — Established card placeholder patterns, Tailwind class naming conventions
- `C:\Users\sscha\OneDrive\Desktop\clover\lib\types.ts` — ServiceItem, PortfolioItem, TeamMember, SocialLink, ContactInfo interfaces
- `C:\Users\sscha\OneDrive\Desktop\clover\lib\constants.ts` — SERVICES (5 items, iconName values), PORTFOLIO_ITEMS (4 items), TEAM_MEMBERS (4 members with initials MW/MD/PK/SS)
- `C:\Users\sscha\OneDrive\Desktop\clover\.planning\phases\04-card-components\04-CONTEXT.md` — Locked decisions: TeamCard monogram style, card layout, social links, HoverLift wrap
- `C:\Users\sscha\OneDrive\Desktop\clover\package.json` — Confirmed: clsx 2.1.1 installed; lucide-react 0.575.0 installed (but not to be used for service icons)
- [MDN aria-disabled](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-disabled) — aria-disabled attribute spec and accessibility guidance
- SVG 1.1 specification — `dominantBaseline`, `textAnchor`, `<text>` positioning semantics

### Secondary (MEDIUM confidence)

- [Using inline SVG icons in React — Medium](https://medium.com/@neilmorgan.mail/using-inline-svg-icons-in-react-2cc9ac20bd6a) — Inline SVG pattern confirmed; `stroke="currentColor"` for adaptive coloring
- [Tailwind CSS v4 Complete Guide — DevToolbox](https://devtoolbox.dedyn.io/blog/tailwind-css-v4-complete-guide) — CSS-first @theme pattern confirmed (consistent with globals.css)

### Tertiary (LOW confidence)

- WebSearch results on portfolio filter patterns — Pattern of using `data-*` attributes for category filtering is common; confirmed via freecodecamp and Medium articles but not a single authoritative spec
- WebSearch results on SVG monogram design — Only craft/print resources found; engineering-aesthetic SVG monogram approach is derived from first principles based on GeometryAccent's established pattern

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all packages verified from package.json; no new installs needed
- Component architecture: HIGH — based on reading actual project files, established patterns clear
- Tailwind v4 class names: HIGH — verified from globals.css token definitions and page.tsx usage
- SVG icon paths: MEDIUM — paths are hand-authored geometric shapes, not verified against a visual tool; implementor should visually verify during build
- Monogram avatar SVG: MEDIUM — SVG text rendering with CSS variable font-family is a known edge case; verification task required
- Contact form accessibility: HIGH — native disabled + aria-disabled is well-documented MDN guidance
- HERO-03 satisfaction: HIGH — GeometryAccent clearly meets the criterion; confirmed by reading the component

**Research date:** 2026-02-23
**Valid until:** 2026-03-23 (stable stack — all libraries frozen; design decisions locked in CONTEXT.md)
