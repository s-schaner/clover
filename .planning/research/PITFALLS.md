# PITFALLS — Clover Labs Skeleton Website

> Research dimension: Common mistakes in technology consultancy skeleton/framework websites.
> Scope: B&W design systems, scroll animations, Next.js project structure, small consultancy credibility.
> Consumer: Planning and roadmap phases to prevent mistakes before they happen.

---

## 1. Next.js Project Structure

### P1-1: Structuring for single-page now, ignoring the multi-page future

**What goes wrong:** Teams build a `page.tsx` monolith — one giant file with all sections as components imported directly into the root page. When the site graduates to separate pages (Services, Team, Case Studies, Contact), there is no logical seam to split along. Every section lives in the same component tree with shared state, shared scroll context, and no routing concept. The refactor cost is high and often deferred forever.

**Warning signs:**
- All section components imported directly into `app/page.tsx` with no route-level abstraction
- Scroll state or animation triggers stored in a single top-level context with no section isolation
- No `(sections)` or `(routes)` folder grouping in the `app/` directory
- Section anchors like `#services` are hardcoded strings with no routing constant file

**Prevention strategy:**
- Use Next.js route groups from day one. Group single-page sections under `app/(home)/` so the root page is an assembly of named section modules, not a flat import list.
- Define anchor IDs as exported constants in a `lib/navigation.ts` file. When routing splits happen, those constants become route paths with a single find-replace.
- Each section gets its own folder: `components/sections/hero/`, `components/sections/services/`, etc. This is the natural seam for future page extraction.
- Avoid any global scroll position state that crosses section boundaries — use Intersection Observer per-section instead.

**Phase:** Architecture / project scaffolding (before any UI code is written).

---

### P1-2: Skipping a component classification system

**What goes wrong:** Components accumulate in a flat `components/` folder. After 30+ components, nothing is findable. Primitive UI (a button, a divider line) lives next to a full section (Hero). Developers copy-paste instead of reusing. The design system never coheres.

**Warning signs:**
- `components/` folder contains both `Button.tsx` and `HeroSection.tsx` at the same level
- No `ui/`, `sections/`, `layout/` sub-folders
- Multiple slightly-different versions of the same component (e.g., `Card.tsx`, `CardAlt.tsx`, `ProjectCard.tsx` with shared logic)

**Prevention strategy:**
- Enforce a three-tier component taxonomy from project init:
  - `components/ui/` — atomic, reusable, design-system primitives (buttons, tags, dividers, typography wrappers)
  - `components/sections/` — full page sections, each in its own sub-folder with an `index.tsx` and any section-specific sub-components
  - `components/layout/` — structural wrappers (Navbar, Footer, PageShell, GridContainer)
- This taxonomy aligns with how a mature site will grow: sections become pages, ui primitives become a shared design library.

**Phase:** Project scaffolding.

---

### P1-3: Not establishing a design token layer before writing CSS

**What goes wrong:** Colors, spacing, and font sizes get hardcoded inline or scattered across Tailwind classes without a system. For a pure B&W site this feels harmless — how wrong can you go with black and white? But in practice: 12 shades of gray appear across the codebase, font sizes are inconsistent, and spacing has no rhythm. When the mature site adds a brand color or adjusts the gray scale, every component must be audited manually.

**Warning signs:**
- `text-gray-700`, `text-gray-800`, `text-gray-900`, and `text-zinc-900` all appear in different components for body text
- No `tailwind.config.ts` theme extension defining named semantic tokens (e.g., `surface`, `on-surface`, `border-subtle`)
- Spacing is a mix of `p-4`, `p-6`, `p-8`, `p-10` with no documented rhythm

**Prevention strategy:**
- Before writing any component, extend `tailwind.config.ts` with semantic color tokens mapped to the B&W palette:
  ```ts
  colors: {
    surface: '#000000',
    'surface-raised': '#0a0a0a',
    'surface-border': '#1a1a1a',
    'on-surface': '#ffffff',
    'on-surface-muted': '#888888',
    'on-surface-subtle': '#555555',
  }
  ```
- Define a spacing scale extension if the design uses a non-standard rhythm (e.g., an 8-point or 10-point grid).
- Even for a skeleton site with placeholder content, the token layer is not scope-creeep — it is the skeleton's primary deliverable.

**Phase:** Design system setup (before first component).

---

## 2. Pure Black and White Design Systems

### P2-1: Confusing "no color" with "no visual hierarchy"

**What goes wrong:** Removing color as a tool removes a major hierarchy signal. Teams compensate with bold or heavy fonts everywhere, creating a page that shouts uniformly. Or they go the opposite way — everything is light gray on white or white on dark — and nothing reads. The B&W constraint requires more discipline about hierarchy, not less.

**Warning signs:**
- Hero headline, section headlines, body text, and labels are all the same visual weight when squinting at the page
- The only differentiation between section types is font size; weight, spacing, and value contrast are not used
- Background sections all use pure `#000000` or `#ffffff` with no mid-tone variation to separate zones

**Prevention strategy:**
- Build a deliberate hierarchy using four tools: value (lightness), weight, size, and spacing — in that priority order.
- Map out section backgrounds before building: alternating between `#000` and `#0a0a0a` (near-black) creates a zone separation that reads as distinct without introducing color.
- Reserve pure white (`#ffffff`) for the highest-priority typographic elements only. Supporting text should be `#888` or lower, creating a three-tier text hierarchy: primary, secondary, tertiary.
- Test every section by converting to grayscale — it already is grayscale, but verify that hierarchy survives at the extremes (pure black monitor vs. bright office display).

**Phase:** Design system setup; reviewed again during section-by-section build.

---

### P2-2: Circuit/grid patterns that overwhelm rather than support

**What goes wrong:** Circuit board and grid textures are a strong motif. The common mistake is making them too prominent — high-opacity SVG patterns compete with text, create visual noise, and make the page feel like a gaming site or a crypto landing page rather than a premium consultancy. The other mistake is making them so subtle they disappear entirely, adding build complexity for zero visual payoff.

**Warning signs:**
- Pattern opacity above 8–10% on dark backgrounds or above 5% on light backgrounds
- Pattern used as a full-bleed section background behind body text
- Circuit pattern is the same across all sections (no variation in density, scale, or placement)
- Pattern is a raster PNG rather than an SVG — it pixelates on retina displays and cannot be styled dynamically

**Prevention strategy:**
- Implement all patterns as inline SVG or CSS-generated patterns (using `background-image: repeating-linear-gradient` or SVG `<pattern>` elements) so they scale perfectly and can be adjusted with CSS variables.
- Use patterns as accent elements, not backgrounds: positioned absolutely in corners, as decorative elements adjacent to section headings, or as borders on feature cards.
- Establish a pattern opacity budget: define one value and hold it. If it needs to be higher to be seen, the pattern design needs to be more refined, not more opaque.
- The circuit motif should read as a texture, not a graphic. If a visitor's eye goes to the pattern before the headline, the pattern is too prominent.

**Phase:** Visual identity / design system; pattern implementation reviewed in every section build.

---

### P2-3: Typography doing insufficient work in the absence of color

**What goes wrong:** Typography is the primary expressive tool when color is removed. Teams choose one safe sans-serif (often Inter or Geist) and use it at standard weights, resulting in a clean but characterless page. For a consultancy branding itself as elite and edgy, generic typography undercuts the premium signal.

**Warning signs:**
- Only one typeface family in use, at weights 400 and 700 only
- Headlines are large but not distinctive — they could belong to any SaaS site
- No use of variable font features, optical sizing, or deliberate tracking/leading choices
- All text is left-aligned; no asymmetric typographic moments that reflect the "minimalist geometry" design direction

**Prevention strategy:**
- Select a primary display typeface for headlines that has personality — sharp geometry, technical feel — while keeping body text in a highly legible sans-serif. Two families maximum.
- Use letter-spacing (`tracking`) aggressively on uppercase labels and navigation items. Tight tracking on display headlines at large sizes. This is free visual character.
- Consider a variable font for the primary family so weight can be animated on scroll or hover without loading multiple font files.
- Establish typographic scale with a modular ratio (e.g., 1.25 or 1.333) rather than arbitrary sizes. Document it in the design token file.

**Phase:** Design system setup; enforce in component builds.

---

### P2-4: Accessibility failures hidden by "it's just black and white"

**What goes wrong:** Pure B&W sounds WCAG-compliant by default. In practice: gray-on-black text at low contrast fails, placeholder text in form fields is too light, and hover states use color that isn't perceptible without color vision. Teams skip accessibility testing because they assume monochrome is inherently accessible.

**Warning signs:**
- Any text element using a gray darker than approximately `#767676` on a white background (fails WCAG AA 4.5:1)
- Any text element using a gray lighter than approximately `#767676` on a pure black background
- Focus states rely solely on color change (e.g., white border becomes gray on focus)
- Interactive elements (buttons, links) have hover states that change only opacity without changing shape or underline

**Prevention strategy:**
- Run every text color combination through a contrast checker during the token definition phase, not after.
- Focus states must have a visible ring that works without color: `outline: 2px solid white` on dark backgrounds, `outline: 2px solid black` on light — with an `outline-offset` to ensure it clears the element.
- Placeholder text in forms must meet at least 3:1 contrast (WCAG for non-text elements). Increase placeholder font weight if needed.
- Test with `prefers-contrast: high` media query — add at least a basic high-contrast mode override.

**Phase:** Design system setup (tokens); verified during section builds and final QA.

---

## 3. Scroll Animations

### P3-1: Animation triggering on page load rather than on scroll entry

**What goes wrong:** Scroll-triggered animations — fade-ins, slide-ups, reveal effects — are implemented with a library that triggers on mount rather than on viewport intersection. Everything animates simultaneously when the page loads, which defeats the sequential storytelling purpose. Alternatively, content below the fold is invisible until animated in, causing it to flash into view when JavaScript hydrates late.

**Warning signs:**
- Hero section animation and footer animation both fire simultaneously on first load
- Content below the fold is `opacity: 0` in the initial HTML (visible in browser dev tools / page source)
- Animations replay on every route change back to the home page
- `framer-motion` or similar library is applied globally without an `IntersectionObserver` gate

**Prevention strategy:**
- Use `IntersectionObserver` as the trigger, not component mount. The `once: true` option on most animation libraries (Framer Motion's `useInView`, GSAP ScrollTrigger) prevents replay.
- Never set initial `opacity: 0` in server-rendered HTML. Apply it only after hydration (use a mounted state flag or CSS that only activates when a JavaScript class is present on `<html>`).
- For the skeleton, prefer Framer Motion's `whileInView` with `viewport={{ once: true }}` — it handles SSR safely and does not require a separate `IntersectionObserver` setup.
- Test animations with JavaScript disabled: content must be fully visible and readable without JS.

**Phase:** Per-section component build; verified in integration and QA.

---

### P3-2: Animations that add latency instead of delight

**What goes wrong:** Every element animates in. Cards stagger. Text slides up. The background pattern fades. The page feels slow even when it is not — the user cannot interact with content that is still animating. On mobile, where GPU performance is constrained, simultaneous animations cause jank and frame drops.

**Warning signs:**
- More than 3 animated elements visible simultaneously in any scroll position
- Animations use `width`, `height`, `top`, `left`, or `margin` properties (forces layout reflow)
- Animation duration exceeds 600ms for any individual element
- No `prefers-reduced-motion` media query support

**Prevention strategy:**
- Restrict animations to GPU-composited properties only: `transform` (translate, scale, rotate) and `opacity`. Never animate layout properties.
- Apply the 3-element rule per viewport: a maximum of 3 elements should animate simultaneously at any scroll position.
- Duration budget: entrance animations 300–500ms, hover transitions 150–200ms, page-level transitions 400–600ms.
- Implement `prefers-reduced-motion` from the start. For users who request reduced motion, animations should either disable entirely or reduce to simple opacity fades with near-zero duration.
- Test on a mid-range Android device (not just iPhone), which exposes GPU budget issues that desktop Chrome DevTools throttling does not accurately simulate.

**Phase:** Animation system design (before implementation); enforced per component.

---

### P3-3: Scroll-linked animations that conflict with the sticky nav

**What goes wrong:** A sticky navigation header occupies 60–80px at the top of the viewport. Scroll-triggered animations that use viewport position as the trigger do not account for this offset. Section headings animate in 80px too early (they were "in view" but visually hidden behind the nav). Anchor navigation scrolls the section to the top of the viewport, hiding the section heading behind the sticky header.

**Warning signs:**
- Clicking a nav anchor scrolls the section to the absolute top, not accounting for header height
- IntersectionObserver root margin is not adjusted for the header height
- Active nav link highlighting triggers before the section visually appears under the header

**Prevention strategy:**
- Define `NAV_HEIGHT` as a CSS custom property (`--nav-height: 80px`) and a TypeScript constant. Use it consistently in:
  - `scroll-margin-top` on all anchor target elements
  - `IntersectionObserver` rootMargin (negative top margin equal to nav height)
  - Any `scrollTo` calculations
- The sticky nav should use a CSS `backdrop-filter: blur()` with a semi-transparent background rather than a solid background, so content scrolling behind it is visible and the transition feels natural.

**Phase:** Navigation and layout build; verified after each section adds its anchor.

---

### P3-4: Performance death by third-party animation library overhead

**What goes wrong:** A skeleton site loads Framer Motion (60kb+), GSAP (100kb+), and Lottie (150kb+ per animation) simultaneously to achieve effects that could be done with 20 lines of CSS transitions and a small Intersection Observer utility. The bundle bloat is visible in Lighthouse scores and real load times.

**Warning signs:**
- Multiple animation libraries installed (check `package.json` for framer-motion AND gsap AND aos simultaneously)
- Any Lottie animation file exceeding 50kb
- JavaScript bundle over 150kb before compression for a static marketing site
- `npm run build` output shows animation libraries as the largest chunks

**Prevention strategy:**
- Choose one animation approach and commit: CSS transitions + custom IntersectionObserver hook (zero library cost), OR Framer Motion (SSR-safe, React-native, worth the weight), OR GSAP (only if scroll-scrubbing or timeline-based effects are needed).
- For this skeleton, the recommendation is Framer Motion with `whileInView` — its weight is justified by SSR safety and React integration, and it eliminates the need for manual IntersectionObserver code.
- Avoid Lottie for the skeleton entirely. Any animated graphics should be CSS or SVG animations — they are smaller, faster, and controllable via `prefers-reduced-motion`.

**Phase:** Technology selection (before build starts).

---

## 4. Small Consultancy Credibility

### P4-1: Generic "technology consultancy" language that signals commodity

**What goes wrong:** Placeholder headlines default to phrases like "We build innovative digital solutions" or "Your trusted technology partner." Even as skeleton text, these phrases train the rest of the site's design to accommodate them — section sizes, headline lengths, and layout proportions are tuned to generic copy. When real copy is written later, the design has to stretch to fit specificity. More dangerously, stakeholders see the placeholder language and greenlight it into production.

**Warning signs:**
- Placeholder headlines include words: "innovative", "solutions", "partner", "leverage", "world-class", "cutting-edge"
- Placeholder text is `Lorem ipsum` (which hides copy-length problems — real headlines are shorter, real body text is longer)
- Team section placeholders say "Team Member" instead of actual owner names (which ARE known: Mike Wong, Matt Drapp, Peter Kwon, Stefan Schaner)

**Prevention strategy:**
- Use the actual owner names and Ashburn, VA location in all team and contact placeholders from day one.
- Write skeleton headlines that are specific to Clover Labs' actual positioning, even if rough: "We build the systems other firms call impossible" is a testable, directional placeholder that shapes design intent.
- Size sections around realistic copy length estimates — consult reference consultancy sites (ThoughtWorks, 8th Light, Atomic Object) for typical headline and body text lengths.
- Mark all placeholder text with a consistent visual indicator (e.g., a CSS class `[data-placeholder]` that adds a subtle underline in dev mode) so nothing slips to production unreviewed.

**Phase:** Content and copy planning (before section build); enforced in code via dev-mode indicators.

---

### P4-2: "Premium" signals that read as fake or overreaching

**What goes wrong:** Small consultancies try to look large and established by mimicking patterns from Fortune 500 sites: client logo grids (with "client" placeholders), award badges, press mention bars, and case studies with enterprise client names. On a 4-person consultancy site these signals create cognitive dissonance — visitors can tell the scale doesn't match the framing. The result is distrust, not prestige.

**Warning signs:**
- "Featured in" or "Trusted by" section with placeholder logo slots
- Award or certification badge placeholders in the hero or about section
- Case study descriptions written at enterprise scale ("deployed to 50,000 users across 12 countries") for a 4-person firm
- "Our Clients" section with more than 5–6 placeholder slots (implies a client roster the firm cannot credibly claim)

**Prevention strategy:**
- Small consultancy premium signals that are credible: technical depth (code-level specificity in service descriptions), named expertise (the actual owners and their real disciplines), and process transparency (a visible methodology or approach section).
- Replace client logos with capability categories (AI/ML, Cloud Infrastructure, Full-Stack) — this is already the project plan, and it is the right call. Capability demonstration is more credible than implied client scale at this size.
- Any case study section should use templated project cards with honest placeholder framing ("Case Study — Available Q3 2026") rather than fabricated project outcomes.
- The "Ashburn, VA" location is a specific credibility signal — it grounds the firm in reality. Use it early and specifically, not buried in the footer.

**Phase:** Content planning; section-by-section review during build.

---

### P4-3: Contact section that creates doubt instead of confidence

**What goes wrong:** A contact form with no context around it — no expected response time, no indication of who responds, no alternative contact method — reads as a black hole. For a high-end consultancy where clients are qualifying a potential vendor, this creates anxiety. The form being a placeholder makes this worse if it is not clearly indicated as non-functional in some visible way.

**Warning signs:**
- Contact form is the only contact method shown (no email address displayed)
- No text indicating what happens after submission ("We'll respond within 24 hours" or similar)
- Form submit button is active/clickable but wired to nothing — submitting shows no feedback
- Contact section is at the very bottom with no path back to any other content

**Prevention strategy:**
- Always display a real email address alongside the form. The project plan already requires this (`hello@cloverlabs.io` or similar). Obfuscate it against scrapers with CSS or JavaScript encoding, not by hiding it.
- Disable or clearly label the submit button as non-functional in the skeleton: `disabled` attribute with a tooltip "Contact form coming soon" is honest and prevents visitor confusion.
- Add a brief response-expectation line even in skeleton state — it shapes the tone of the mature site.
- Structure the contact section so it includes the location (Ashburn, VA) and one social/professional link (LinkedIn) as alternative contact signals.

**Phase:** Contact section build.

---

### P4-4: Mobile experience as an afterthought

**What goes wrong:** Desktop is built first, mobile is "responsive" via Tailwind breakpoint overrides applied after the fact. Scroll animations that feel premium on desktop are jank on mobile. Circuit patterns that look sophisticated at 1440px tile awkwardly at 390px. Navigation that is elegant as a horizontal sticky bar becomes a hamburger menu that was never designed.

**Warning signs:**
- Development and review happens primarily in a desktop browser window
- Mobile breakpoints are added in a final pass, not designed alongside desktop
- The hamburger menu is wired to a simple `display: block/none` toggle with no animation or overlay
- Circuit SVG patterns use fixed viewBox dimensions that do not adapt to mobile viewport

**Prevention strategy:**
- Design mobile breakpoints simultaneously with desktop, not after. For each section, define the mobile layout before finalizing the desktop layout — this prevents desktop-first decisions that are fundamentally non-responsive (e.g., 6-column grids that cannot collapse elegantly).
- The mobile navigation menu requires dedicated design: slide-in overlay, backdrop, focus trap, and escape key dismiss. This is a component in its own right, not an afterthought.
- Test scroll animations on a real mobile device at each section milestone. Use Chrome DevTools device emulation only for layout checks, not animation performance.
- Scale circuit pattern SVGs using `viewBox` with `preserveAspectRatio="xMidYMid slice"` or redesign the pattern density for mobile viewport widths.

**Phase:** Each section build (mobile-alongside approach), not a final phase.

---

## 5. Skeleton-Specific Pitfalls

### P5-1: Skeleton that cannot be handed off or picked up later

**What goes wrong:** The skeleton is built by one developer in a flow state. Component naming is intuitive to them but cryptic to others. There is no design token documentation, no component inventory, and no indication of what is placeholder vs. intentional. When the mature site phase begins (potentially months later, potentially by different contributors), the skeleton is a black box.

**Warning signs:**
- No `DESIGN_SYSTEM.md` or equivalent documenting color tokens, typography scale, spacing rhythm
- Component props are undocumented (no JSDoc or TypeScript prop interfaces with comments)
- Placeholder text and intentional empty states are visually indistinguishable
- `TODO` comments in code are informal and inconsistent

**Prevention strategy:**
- The skeleton's documentation artifacts are as important as its code. At minimum:
  - `DESIGN_SYSTEM.md` — color tokens, type scale, spacing rhythm, pattern usage rules
  - `COMPONENTS.md` — component inventory with props and usage notes
  - A `[data-placeholder]` attribute convention so any element that must be replaced before production is machine-queryable
- TypeScript interfaces on all component props are non-negotiable — they are the component's contract.
- After completing the skeleton, run a 30-minute walkthrough of the codebase as if you are a new developer. Every moment of confusion is a documentation gap.

**Phase:** Documentation written alongside code, not at the end.

---

### P5-2: Design language decisions deferred to "when we have real content"

**What goes wrong:** The skeleton is meant to nail down the design language, but teams leave hard decisions unresolved: "We'll figure out the section spacing when we have real copy." "The circuit pattern opacity can be adjusted later." "The animation timing can be tuned when we see how it feels with real content." When the mature site phase begins, every one of these decisions must be re-examined and the skeleton provides no answers.

**Warning signs:**
- CSS variables or tokens with placeholder values (`--spacing-section: 100px /* TODO */`)
- Animation durations as magic numbers commented with "adjust later"
- Multiple alternative implementations of the same component left in the codebase (commented-out variants)
- Design review meetings during skeleton build routinely end with "we'll revisit this"

**Prevention strategy:**
- The skeleton must make every visual decision, even if some will change later. A decided-and-potentially-wrong value is more useful than an undecided placeholder.
- Hold a design decision review at the midpoint of the skeleton build: go through every CSS variable, every animation timing, and every spacing value and confirm or reject it explicitly.
- Document the reasoning for key decisions in the `KEY_DECISIONS` section of `PROJECT.md`. This prevents revisiting decisions that were already consciously made.

**Phase:** Design system setup and skeleton build milestone review.

---

*Research completed: 2026-02-22. Covers: Next.js structure, B&W design systems, scroll animations, small consultancy credibility, skeleton-specific concerns. Each pitfall includes detection signals, prevention strategies, and phase mapping.*
