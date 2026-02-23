# Clover Labs Design System

Reference documentation for the Clover Labs website design system. Written for the 4 founders and any contractor working on this codebase. All values in this document are extracted directly from `app/globals.css` and `app/layout.tsx` — they reflect the actual source, not a specification.

---

## 1. Design Philosophy

The Clover Labs visual language is pure black and white. No accent colors. No brand hues. No gradients on surfaces.

The aesthetic is intentionally engineering-first: sharp corners everywhere, precise geometric forms, and a monochrome palette that communicates technical rigor. Visitors should feel like they are looking at a blueprint, not a marketing site.

**The dark/light alternation rhythm:**

Every section alternates between dark and light surfaces in a deliberate sequence:

| Section   | Theme |
|-----------|-------|
| Hero      | dark  |
| Services  | light |
| Portfolio | dark  |
| Team      | light |
| Contact   | dark  |

This rhythm creates visual breathing room and prevents the page from feeling monotonous. Never break this alternation — if a new section is added, continue the pattern.

**Geometric fractal patterns are the only visual texture.** The site has no photography, no illustrations, no decorative icons beyond the structural SVG icons in service cards. The four-leaf clover in the Hero and the recursive fractal grid pattern in every section are the complete visual vocabulary for texture.

---

## 2. Color Tokens

All color tokens live in the `@theme` block in `app/globals.css`. They become Tailwind utility classes automatically (e.g., `bg-surface`, `text-on-surface`).

**Rule: Raw hex values must never appear in component code.** Always use the semantic token name. This ensures the design can be updated in one place.

### Dark Surface Group

Used in sections with `theme="dark"` (Hero, Portfolio, Contact).

| Token                    | Hex Value | Semantic Purpose                                   |
|--------------------------|-----------|----------------------------------------------------|
| `--color-surface`        | `#000000` | Section background — true black                    |
| `--color-surface-raised` | `#0a0a0a` | Raised card background within dark sections        |
| `--color-surface-border` | `#1a1a1a` | Borders, separators, nav bottom border             |
| `--color-on-surface`     | `#ffffff` | Primary text on dark backgrounds                   |
| `--color-on-surface-muted`  | `#888888` | Secondary/supporting text on dark backgrounds   |
| `--color-on-surface-subtle` | `#555555` | Tertiary text, de-emphasized labels on dark      |

### Light Surface Group

Used in sections with `theme="light"` (Services, Team).

| Token                           | Hex Value | Semantic Purpose                              |
|---------------------------------|-----------|-----------------------------------------------|
| `--color-surface-light`         | `#f5f5f5` | Section background — near-white               |
| `--color-surface-light-raised`  | `#ffffff`  | Raised card background within light sections  |
| `--color-surface-light-border`  | `#e0e0e0` | Borders, separators in light sections         |
| `--color-on-surface-light`      | `#000000` | Primary text on light backgrounds             |
| `--color-on-surface-light-muted`  | `#555555` | Secondary text on light backgrounds         |
| `--color-on-surface-light-subtle` | `#888888` | Tertiary text on light backgrounds          |

### Pure Anchors

| Token            | Hex Value | Purpose                                        |
|------------------|-----------|------------------------------------------------|
| `--color-black`  | `#000000` | Absolute reference — use sparingly             |
| `--color-white`  | `#ffffff` | Absolute reference — use sparingly             |

### Tailwind Usage

Tailwind v4 generates utilities from `@theme` tokens automatically:

```html
<!-- Background -->
<div class="bg-surface">          <!-- dark section bg -->
<div class="bg-surface-light">    <!-- light section bg -->
<div class="bg-surface-raised">   <!-- dark card bg -->

<!-- Text -->
<p class="text-on-surface">       <!-- primary dark-section text -->
<p class="text-on-surface-muted"> <!-- secondary dark-section text -->
<p class="text-on-surface-light"> <!-- primary light-section text -->

<!-- Border -->
<div class="border-surface-border">       <!-- dark section border -->
<div class="border-surface-light-border"> <!-- light section border -->
```

---

## 3. Typography

Three font families are loaded via `next/font/google` in `app/layout.tsx` with `display: 'swap'`. Each is assigned a CSS variable that flows into `@theme inline` for Tailwind utility generation.

| Tailwind Class  | CSS Variable         | Font Family      | Use Case                              |
|-----------------|----------------------|------------------|---------------------------------------|
| `font-display`  | `--font-display`     | Space Grotesk    | Headings, brand text, hero tagline, nav wordmark, card titles |
| `font-body`     | `--font-body`        | Inter            | Body text, paragraphs, labels, nav links, form elements |
| `font-mono`     | `--font-mono`        | JetBrains Mono   | Tech tags on portfolio cards, code accents |

**How fonts load:** `app/layout.tsx` declares three `next/font/google` instances, each injecting a CSS variable onto the `<html>` element. The `@theme inline` block in `globals.css` maps those runtime variables to Tailwind font-family tokens. Without `inline`, Tailwind v4 cannot resolve `var()` references in utility generation.

```tsx
// layout.tsx attaches these to <html>:
// --font-space-grotesk, --font-inter, --font-jetbrains-mono

// globals.css maps them:
@theme inline {
  --font-display: var(--font-space-grotesk), sans-serif;
  --font-body:    var(--font-inter), sans-serif;
  --font-mono:    var(--font-jetbrains-mono), monospace;
}
```

**Body default:** `app/layout.tsx` applies `font-body` as the default on `<body>`. Components that need `font-display` or `font-mono` must apply those classes explicitly.

---

## 4. Spacing Tokens

Spacing tokens live in `:root` (not `@theme`) because they use `clamp()` for fluid scaling. Tailwind v4 cannot statically analyze `clamp()` values to generate utility classes — so these tokens are used via Tailwind's arbitrary value syntax: `py-[--section-padding-y]`.

| Token                  | Value                          | Controls                                           |
|------------------------|--------------------------------|----------------------------------------------------|
| `--nav-height`         | `80px`                         | Fixed navigation bar height; used for `scroll-margin-top` on all sections |
| `--section-padding-y`  | `clamp(3.5rem, 8vw, 10rem)`    | Top/bottom padding on every section; scales from 56px at narrow viewports to 160px at wide |
| `--section-padding-x`  | `clamp(1.5rem, 5vw, 6rem)`     | Left/right padding on sections and nav; scales from 24px to 96px |
| `--card-padding`       | `2rem` (32px)                  | Internal padding on all cards (ServiceCard, PortfolioCard, TeamCard content area) |
| `--gap-grid`           | `1.5rem` (24px)                | Gap between grid cells in section card grids       |
| `--text-hero`          | `clamp(2.25rem, 8vw, 7rem)`    | Hero h1 font size; scales from 36px to 112px       |
| `--text-section`       | `clamp(1.75rem, 4vw, 3rem)`    | Section h2 font size; scales from 28px to 48px     |

**Usage pattern in Tailwind:**

```html
<!-- Section padding — SectionWrapper applies these -->
<section class="py-[--section-padding-y] px-[--section-padding-x]">

<!-- Card internal padding -->
<div class="p-[--card-padding]">

<!-- Hero headline -->
<h1 class="text-[length:--text-hero]">

<!-- Section headings -->
<h2 class="text-[length:--text-section]">
```

Note: `text-[length:--text-hero]` requires the `length:` prefix in Tailwind v4 to disambiguate from color utilities when using a CSS custom property.

---

## 5. Animation Tokens

Animation tokens live in `@theme` in `app/globals.css`. They become CSS custom properties and can be referenced directly in inline styles or Tailwind arbitrary values.

### Duration

| Token              | Value  | Use Case                                     |
|--------------------|--------|----------------------------------------------|
| `--duration-fast`  | `150ms`| Hover state transitions (link underline, nav link color) |
| `--duration-base`  | `300ms`| Navigation color transitions                 |
| `--duration-slow`  | `600ms`| Scroll-triggered fade-in animations          |

### Easing

| Token             | Value                            | Character                                  |
|-------------------|----------------------------------|--------------------------------------------|
| `--ease-out`      | `cubic-bezier(0.0, 0.0, 0.2, 1)` | Fast start, gradual end — used for exits and scale-up hovers |
| `--ease-in-out`   | `cubic-bezier(0.4, 0.0, 0.2, 1)` | Balanced — used for the hero settle animation |
| `--ease-premium`  | `cubic-bezier(0.21, 0.47, 0.32, 0.98)` | Slightly springy, high-quality feel — used for scroll-triggered fade-in and stagger animations |

### Hover timing

`HoverLift` uses `120ms` with `--ease-out` directly (not via token) because framer-motion receives numeric seconds. The 120ms value is within the "instant-feeling" 100–150ms range.

### Reduced-Motion Policy

All animations in this codebase respect `prefers-reduced-motion: reduce`. The policy is enforced at two levels:

1. **CSS (globals.css):** `.fade-in-scroll` and `.hero-pattern-draw` classes have `@media (prefers-reduced-motion: reduce)` blocks that remove transitions and show final states immediately.
2. **Framer Motion components:** `FadeInOnScroll`, `StaggerItem`, and `HoverLift` each call `useReducedMotion()`. When it returns `true` (or `null` on SSR, which is treated as truthy for safety), the component renders a plain element at full visibility with no animation.

---

## 6. Pattern Tokens

The fractal grid texture uses three tokens in `:root`:

| Token                     | Value  | Purpose                                         |
|---------------------------|--------|-------------------------------------------------|
| `--pattern-opacity-dark`  | `0.06` | Grid opacity in dark sections (6%) — barely visible, just texture |
| `--pattern-opacity-light` | `0.04` | Grid opacity in light sections (4%) — even more subtle |
| `--pattern-size`          | `40px` | Primary grid cell size; fractal levels at 20px, 10px, 5px below |

The `GridPattern` component reads `--pattern-opacity-dark` or `--pattern-opacity-light` via `var()` on its wrapper div. The 4-level nested SVG `<pattern>` produces fractal density: the outermost grid lines are `0.8px` wide, narrowing to `0.15px` at the finest level. This creates the impression of an engineering blueprint.

The `GeometryAccent` (hero) uses `--hero-path-length` as a runtime CSS variable set by JavaScript via `getTotalLength()` — this is not a design token but a per-render measurement.

---

## 7. What Never Goes In

These are hard constraints for the design system. Adding any of these breaks the visual identity.

| Constraint              | Why It Exists                                                   |
|-------------------------|-----------------------------------------------------------------|
| **No border-radius**    | Sharp corners are fundamental to the engineering aesthetic. `rounded-*` classes must not be used anywhere — not on cards, buttons, inputs, tags, or nav elements. |
| **No accent colors**    | No brand hues, no blues, no greens, no reds. The palette is strictly black and white. Adding a color for "interaction states" or "success/error" violates the monochrome identity. |
| **No drop shadows**     | `shadow-*` classes are not used. The only depth cue is the `1.025x` scale on hover (`HoverLift`). Cards are separated by borders, not shadows. |
| **No surface gradients** | Section backgrounds are flat single-color fills. `bg-gradient-*` must not appear on section or card backgrounds. |
| **No external texture** | Photography, illustrations, and raster textures are not part of the design. The fractal SVG patterns are the complete texture vocabulary. |

---

## Token Quick Reference

```css
/* Colors — from app/globals.css @theme */
--color-surface: #000000
--color-surface-raised: #0a0a0a
--color-surface-border: #1a1a1a
--color-on-surface: #ffffff
--color-on-surface-muted: #888888
--color-on-surface-subtle: #555555

--color-surface-light: #f5f5f5
--color-surface-light-raised: #ffffff
--color-surface-light-border: #e0e0e0
--color-on-surface-light: #000000
--color-on-surface-light-muted: #555555
--color-on-surface-light-subtle: #888888

/* Animation — from @theme */
--duration-fast: 150ms
--duration-base: 300ms
--duration-slow: 600ms
--ease-out: cubic-bezier(0.0, 0.0, 0.2, 1)
--ease-in-out: cubic-bezier(0.4, 0.0, 0.2, 1)
--ease-premium: cubic-bezier(0.21, 0.47, 0.32, 0.98)

/* Spacing — from :root */
--nav-height: 80px
--section-padding-y: clamp(3.5rem, 8vw, 10rem)
--section-padding-x: clamp(1.5rem, 5vw, 6rem)
--card-padding: 2rem
--gap-grid: 1.5rem
--text-hero: clamp(2.25rem, 8vw, 7rem)
--text-section: clamp(1.75rem, 4vw, 3rem)

/* Patterns — from :root */
--pattern-opacity-dark: 0.06
--pattern-opacity-light: 0.04
--pattern-size: 40px
```
