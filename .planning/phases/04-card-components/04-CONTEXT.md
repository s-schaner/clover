# Phase 4 Context: Card Components

**Created:** 2026-02-23
**Phase goal:** All UI card atoms are built, typed, and data-placeholder-attributed so that section components can be assembled by composing pre-built cards rather than building layout and content simultaneously

## Team Card & Avatar Style

**Discussed with user — these decisions are locked.**

### Geometric Avatar Design

- **Style:** Monogram with clover motif — first initial letter with a simplified clover leaf as an accent element
- **Clover integration:** Clover as letter accent — the clover replaces or adorns a part of the letter (e.g., dot, crossbar, flourish) rather than being a separate background shape or container
- **Rendering:** SVG-based, pure B&W, consistent with the GeometryAccent hero element's engineering blueprint aesthetic
- **Per-member:** Each team member gets their first initial (M, M, P, S) with the clover accent — two members share "M" so the avatar must still be distinguishable at a glance (consider using first + last initial, or varying the clover accent position)

### Card Layout

- **Structure:** Large avatar emphasis — avatar/monogram area takes up the top ~60% of the card, with name and role tightly below
- **Visual weight:** The monogram is the hero of each card, not just an icon — it should feel like an identity mark
- **Alignment:** Name and role text below the avatar area, left-aligned or centered (Claude's discretion based on what looks best with the large avatar)

### Social Links

- **Placement:** Integrated inline — social/LinkedIn icons sit next to the name or role in the text flow, not as a separate row
- **Style:** Small monochrome icons that match the text color (currentColor), consistent with the B&W design system
- **Interaction:** Icons should use the link-underline or subtle opacity hover effect — no colored brand icons

### Card Chrome

- **Container:** Subtle border using the design system's `--border-primary` token
- **Background:** Default section surface (no raised surface needed — the border provides separation)
- **Hover:** Wrap in HoverLift for the 1.025x scale micro-interaction on hover

## Service Card (Claude's Discretion)

Not discussed — Claude decides during planning. Key constraints from roadmap:
- Must display a geometric icon placeholder alongside title and description
- Technical descriptions, not marketing copy
- Should use HoverLift wrapper
- Icons should be simple geometric SVG shapes (not icon library imports)

## Portfolio Card (Claude's Discretion)

Not discussed — Claude decides during planning. Key constraints from roadmap:
- Correct anatomy: title, project type, outcome metric field, tech tag list
- All driven by typed props from lib/types.ts (PortfolioItem interface)
- Tech tags should use JetBrains Mono (code accent font)
- Category structure must support the filtering that Phase 5 will implement

## Contact Form (Claude's Discretion)

Not discussed — Claude decides during planning. Key constraints from roadmap:
- Name, email, message fields
- Submit button visually disabled with clear "Coming Soon" label
- Form is purely visual — no submission logic (v2 requirement)
- Should feel like a real form that's just not connected yet

## Fractal Hero Element (Claude's Discretion)

Not discussed — the GeometryAccent component already exists from Phase 3 (four-leaf clover pattern with draw animation). Phase 4 requirement HERO-03 may just need to verify the existing component meets the "animated geometric fractal hero element" success criteria, or wrap it in a hero-specific composition component.

---

## Deferred Ideas

None captured during this discussion.

---
*Context gathered: 2026-02-23*
*Areas discussed: Team card & avatar style (1 of 4 areas)*
*Areas deferred to Claude: Service card, Portfolio card, Contact form, Fractal hero element*
