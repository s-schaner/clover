# Phase 3: Visual Primitives & Animation - Context

**Gathered:** 2026-02-22
**Status:** Ready for planning

<domain>
## Phase Boundary

Build the geometric fractal visual vocabulary and complete animation wrapper library in isolation. This phase delivers reusable SVG pattern components, scroll-triggered motion wrappers, hover interaction primitives, and the animated hero fractal element. All visual/motion primitives are validated independently before being composed into sections (Phase 5).

</domain>

<decisions>
## Implementation Decisions

### Fractal pattern style
- Recursive line grid pattern (not Sierpinski, Voronoi, or circuit board)
- Lines weighted by recursion depth: primary grid heavier, each subdivision progressively thinner
- 4+ recursion levels (dense texture) — use lower opacity to keep it as texture, not wallpaper
- Accent positioning, not full section coverage — pattern appears in specific areas (e.g., corner, edge) with consistent placement across all sections
- Gradient fade at edges (CSS mask-image) — pattern dissolves smoothly into the background, not hard cropped
- Pattern reveals on scroll (draw/fade-in as section enters viewport), then stays static once visible
- Applied to ALL sections (both dark and light), respecting opacity budgets: 6-8% dark, 4-5% light

### Hero signature moment
- SVG stroke-dasharray/dashoffset draw technique + CSS keyframes — no Framer Motion or GSAP for the hero
- Immediate draw on page load — starts drawing as soon as page renders, no delay
- Fast duration: 1-1.5 seconds for the full draw
- End state: draws in at noticeable opacity (10-15%), then fades down to standard pattern opacity (6-8%) — dramatic entrance, then settles
- Must respect prefers-reduced-motion (skip animation, show final state)

### Motion vocabulary
- Dramatic & premium personality — generous motion, larger travel distances (32-48px), confident entrance animations
- Bottom-up only for scroll-triggered elements — everything slides up from below, consistent and cohesive
- Top-left cascade for staggered card grids — cards animate from top-left corner, cascading diagonally
- Animations replay every time a section re-enters the viewport (not play-once)
- All scroll animations completely absent when prefers-reduced-motion: reduce is set

### Hover micro-interactions
- Cards: scale up (1.02-1.03x) on hover — modern, contained, no layout shift
- Text links: underline draw effect — thin line draws in from left on hover, retracts on leave
- Hover transition speed: instant-feeling (100-150ms) — snappy and responsive
- Fractal pattern reacts to card hover: subtle opacity pulse near the hovered card — creates connection between card and background texture

### Claude's Discretion
- Exact recursion depth and line weights for the fractal grid (within the 4+ level constraint)
- Specific accent position per section (consistent placement, Claude picks the position)
- Exact easing curves for scroll and hover animations
- SVG path complexity for the hero fractal draw
- Implementation of the pattern opacity pulse on card hover (CSS approach vs JS)
- Stagger interval timing for card cascades

</decisions>

<specifics>
## Specific Ideas

- Pattern should feel like an engineering blueprint that fractals inward — recursive subdivision of a clean grid
- Hero draw animation is the "signature moment" — the first visual impact a visitor gets. Fast but dramatic: draws in bright, settles into texture.
- The gradient fade on pattern edges should make the texture feel integrated into the section, not pasted on top
- "Dramatic & premium" doesn't mean slow — it means generous travel distance with confident timing. Things move far but arrive quickly.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 03-visual-primitives-animation*
*Context gathered: 2026-02-22*
