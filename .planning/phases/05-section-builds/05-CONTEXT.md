# Phase 5: Section Builds - Context

**Gathered:** 2026-02-23
**Status:** Ready for planning

<domain>
## Phase Boundary

Assemble all five content sections (Hero, Services, Portfolio, Team, Contact) as fully populated, responsive, content-populated components. Each section uses the card atoms from Phase 4 and the motion/visual primitives from Phase 3. The page is functionally complete after this phase — real names, real capability descriptions, and real placeholder structure throughout.

Sections replace the Phase 3 validation placeholders in page.tsx. Each section becomes its own component file under `components/sections/`.

</domain>

<decisions>
## Implementation Decisions

### Hero visual hierarchy
- **Refined & centered** — tagline is large but not oversized, generous whitespace, quiet confidence
- **Tagline + subheading + CTA** — keep the HERO_CONTENT.subheading below the tagline, then the CTA below that
- **CTA is a subtle text link** — small uppercase tracking-wide text with link-underline style, not a button. The tagline is the star
- **GeometryAccent is full-bleed background** — clover pattern extends edge to edge behind the text at subtle opacity, immersive

### Portfolio filter interaction
- **Horizontal pill tabs** — row of category names as clickable pills/chips, active one gets a border or fill treatment
- **"All" default** — all projects visible by default with an "All" pill active; clicking a category narrows the view
- **Instant swap on filter** — no animation when switching categories, cards just appear/disappear immediately for snappy feel
- **Heading + subheading + pills** — brief descriptor text between the section heading and the filter pills

### Contact section composition
- **Layout: Claude's Discretion** — Claude decides the spatial arrangement of email, location, and form (two-column split vs stacked)
- **Geometric SVG pin** — simple geometric map pin shape (triangle + circle) in the same stroke style as other section icons, hand-crafted inline SVG
- **Email at normal size** — standard body-sized text alongside the location, equal weight to other contact details (not hero-sized)
- **Just the disabled form** — no additional explanatory text; the "Coming Soon" button label is sufficient context

### Section headings & intro copy
- **Consistent pattern** — every non-hero section gets: large heading + 1-2 sentence intro text (uniform rhythm)
- **Centered headings** — all section headings centered in the section for formal, balanced feel
- **With geometric accent** — a small geometric element (line, dot, or clover) near the heading as a visual marker
- **Technical & precise tone** — short, direct, engineering-flavored copy matching the "elite engineers" positioning

### Claude's Discretion
- Contact section layout arrangement (two-column vs stacked)
- Exact geometric accent element for section headings (line, dot, clover — whatever fits the design system)
- Grid column counts for service cards and team cards at each breakpoint
- Services section intro copy wording
- Team section intro copy wording
- Contact section intro copy wording

</decisions>

<specifics>
## Specific Ideas

- Hero should feel like quiet confidence — the engineering speaks for itself, no need to shout
- Portfolio filter should feel snappy and immediate — no animation delay when switching categories
- All section intro copy should sound like engineers wrote it, not marketers
- Section headings get a small geometric accent — this ties the sections visually to the geometric vocabulary (GridPattern, GeometryAccent, CloverAccentMini) without being heavy-handed

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 05-section-builds*
*Context gathered: 2026-02-23*
