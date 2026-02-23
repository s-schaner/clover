# Phase 6: Assembly, Polish & Documentation - Context

**Gathered:** 2026-02-23
**Status:** Ready for planning

<domain>
## Phase Boundary

Assemble the page into a single scroll experience, verify responsiveness across all breakpoints (375px, 768px, 1440px+), tune section transitions for visual coherence, achieve Lighthouse 90+ performance, and write design system documentation for handoff.

**Note:** Page assembly (originally roadmap item 06-01) is already complete — Phase 5 plan 05-04 replaced page.tsx with the production orchestration file (5 section imports in correct render order). This phase focuses on responsive audit/fixes, performance tuning, and documentation.

</domain>

<decisions>
## Implementation Decisions

### Responsive Strategy — Mobile (375px)
- Hero section MUST fit the viewport — tagline, subheading, and CTA all visible without scrolling on 375px screens
- Text scales down aggressively as needed to achieve viewport fit
- Cards go full-width edge-to-edge on mobile — minimal horizontal padding for maximum content space
- Grid collapse to single column on mobile is standard behavior (already set via Tailwind breakpoints)

### Responsive Strategy — Tablet (768px)
- Team grid stays 4-across on tablet — cards scale down to fit rather than collapsing to 2x2
- This means the current `sm:grid-cols-2 lg:grid-cols-4` may need adjustment (e.g., `sm:grid-cols-4` or `md:grid-cols-4`)
- Compact but all 4 founders visible at once in one row

### Responsive Strategy — Portfolio Filter Pills
- Evaluate actual render first: if pill wrapping to 2-3 rows looks clean at 375px, keep it
- If wrapping looks messy, switch to horizontal scroll strip
- Decision deferred to implementation time based on visual inspection

### Claude's Discretion
- Section transition visual treatment (hard cuts between dark/light sections vs gradient bleed vs geometric dividers) — choose what produces the cleanest dark-light-dark-light rhythm
- Documentation scope and depth for DESIGN_SYSTEM.md and COMPONENTS.md — pragmatic level for the 4 founders and potential future contractors
- Lighthouse optimization techniques (image optimization, font loading, bundle splitting)
- Navigation responsive adjustments at each breakpoint
- Contact form mobile layout within single-column stacked view
- Font scaling approach (clamp values, viewport units, etc.) as long as hero viewport-fit constraint is met

</decisions>

<specifics>
## Specific Ideas

No specific requirements — open to standard approaches. Key constraint is the hero viewport-fit rule: all hero content visible without scrolling at 375px.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 06-assembly-polish-documentation*
*Context gathered: 2026-02-23*
