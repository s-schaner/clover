# FEATURES.md — Premium Technology Consultancy Website

**Research Type:** Project Research — Features dimension
**Milestone:** Greenfield — What features do premium technology consultancy websites have?
**Project:** Clover Labs LLC skeleton website
**Date:** 2026-02-22

---

## Research Summary

Premium technology consultancy websites (Palantir, Thoughtworks, IDEO, McKinsey Digital, BCG Platinion, Accenture Interactive, ThoughtLeaders, Booz Allen Hamilton, Two Sigma, Jane Street careers pages, etc.) share a consistent core structure, but the elite tier separates itself through craft: how that structure is executed, animated, and composed. The difference between "competent consultancy site" and "elite consultancy site" is almost never about features — it is about execution density on a small set of high-signal features.

---

## Table Stakes — Must Have or Visitors Leave

These features are expected by any visitor to a technology consultancy website. Their absence signals amateurism or neglect. None of these are differentiating on their own.

### 1. Hero / Above-the-Fold Statement
- **What it is:** Full-viewport or near-full-viewport opening section with company name, one-line positioning statement, and a primary call to action (contact us, learn more, see our work).
- **Why required:** Visitors decide within 3–5 seconds whether to stay. No hero = no first impression.
- **Complexity:** Low. One section, minimal interactivity.
- **Dependencies:** Needs navigation (below) to anchor CTA links.
- **Notes for Clover:** The bold tagline and high-impact visual is already in the active requirements. This is the most important section to get right aesthetically.

### 2. Navigation Header (Sticky/Fixed)
- **What it is:** Logo + section anchor links, fixed to top of viewport on scroll. Hamburger menu on mobile.
- **Why required:** Orientation and wayfinding. Without it, visitors feel lost in a single-page scroll.
- **Complexity:** Low–Medium. Sticky behavior, scroll-spy to highlight active section, mobile collapse.
- **Dependencies:** Requires sections to be defined before anchors can be set.
- **Notes for Clover:** Already in active requirements. Scroll-spy (highlighting the active nav item based on scroll position) is a small detail that elite sites consistently include — it signals technical care.

### 3. Services / Capabilities Section
- **What it is:** Named list of what the firm does: AI/ML, cloud, software engineering, data, security, etc. Usually 3–6 capability areas with short descriptions.
- **Why required:** If visitors cannot understand what you do in 30 seconds, they leave. This is the core commercial message.
- **Complexity:** Low. Mostly content layout (grid or column).
- **Dependencies:** None — standalone section.
- **Notes for Clover:** Should feel like engineering taxonomy, not marketing bullet points. Use precise technical language.

### 4. Team / Leadership Section
- **What it is:** Names, titles, headshots or initials, brief credentials. For a 4-person firm, all partners should appear.
- **Why required:** Technology consultancy is a trust business. Clients hire people, not companies. Anonymous firms feel risky.
- **Complexity:** Low. Grid of profile cards with placeholder content.
- **Dependencies:** None for skeleton. Real photos/bios come in mature phase.
- **Notes for Clover:** Four owners: Mike Wong, Matt Drapp, Peter Kwon, Stefan Schaner. Skeleton = placeholder avatars and placeholder bios.

### 5. Contact Section
- **What it is:** Form (name, email, message) plus direct contact signals: email address, location. Optional: phone, LinkedIn.
- **Why required:** Every consultancy conversion happens through direct outreach. Without a clear contact path, the site fails its primary commercial goal.
- **Complexity:** Low for skeleton (no backend). Medium when wired up.
- **Dependencies:** None for skeleton form. Backend/email integration out of scope for v1.
- **Notes for Clover:** Location (Ashburn, VA) is a trust signal for government/defense market clients. Show it prominently.

### 6. Full Responsiveness
- **What it is:** Site renders correctly and usably on mobile (320px), tablet (768px), and desktop (1280px+).
- **Why required:** Google ranks non-responsive sites lower. More importantly, a broken mobile experience is an immediate credibility failure for a technology firm.
- **Complexity:** Medium. Requires deliberate layout design at each breakpoint. Grid/flexbox discipline.
- **Dependencies:** Must be considered for every section, not added at the end.

### 7. Fast Load Performance
- **What it is:** Page loads quickly — ideally sub-2 seconds on a standard connection.
- **Why required:** Slow sites feel cheap. For a technology firm, a slow website is a contradiction. Clients infer technical capability from the site itself.
- **Complexity:** Medium. Requires image optimization, lazy loading, minimal JS bundle, correct Next.js usage.
- **Dependencies:** Image assets, animation library choices, font loading strategy.

### 8. Professional Typography
- **What it is:** A consistent, intentional type system: 1–2 typefaces, clear hierarchy (H1/H2/H3/body/caption), appropriate sizing and line-height.
- **Why required:** In a pure B&W design, typography carries the entire aesthetic weight. Poor typography makes a monochrome site look unfinished.
- **Complexity:** Low (choosing a system), Medium (implementing consistently across all sections).
- **Dependencies:** Design tokens / CSS variables for type scale.

---

## Differentiators — Competitive Advantage for an Elite Firm

These features are present on premium sites but absent or poorly executed on commodity consultancy sites. They are what make a site feel "elite."

### 1. Scroll-Triggered Animations (Purposeful, Not Decorative)
- **What it is:** Elements enter viewport with deliberate motion — fade + translate, stagger reveals, counter animations. Not CSS transitions on hover alone; actual scroll-linked entrance behavior.
- **Why it differentiates:** Most consultancy sites have zero animation or jarring CSS3 animations. A well-tuned scroll reveal system signals engineering craft without saying anything. Palantir does this well. IDEO uses it on case studies.
- **Complexity:** Medium. Intersection Observer API or Framer Motion (since Next.js/React). The challenge is restraint — too much animation is worse than none.
- **Dependencies:** Requires all sections to be built first so animation can be layered in.
- **Pitfall:** Animations that block content or cause layout shift destroy performance scores and feel amateurish. Must be additive-only (opacity + transform, no layout-shifting properties).
- **Notes for Clover:** Already in active requirements. The key discipline: every animation should have a purpose (directing attention, implying sequence) rather than just existing.

### 2. Geometric / Technical Visual Language (Circuit / Grid Patterns)
- **What it is:** Background textures, section dividers, or hero visuals built from precise geometric forms — grid lines, circuit trace paths, dot matrices, coordinate systems. Pure SVG or CSS-based, no photography.
- **Why it differentiates:** Photography-based consultancy sites all look the same (stock photos of handshakes, server racks, diverse teams). A purely geometric visual language is harder to execute and instantly signals a firm with its own aesthetic point of view.
- **Complexity:** Medium–High. SVG path generation, CSS custom properties for theming, performance at scale. Circuit patterns must read as intentional, not randomly generated noise.
- **Dependencies:** Design language decisions must be locked before implementation. Pattern decisions affect hero, section backgrounds, card elements.
- **Pitfall:** Can look amateur if the geometric forms are not precisely controlled. Must be drawn/engineered, not clipart.
- **Notes for Clover:** Core to the visual identity. Circuit/grid patterns as subtle background textures is already defined. Key word: subtle. They should recede, not compete.

### 3. Asymmetric, Grid-Breaking Layouts
- **What it is:** Content that deliberately breaks a regular grid — offset image blocks, full-bleed sections that interrupt the column rhythm, typographic elements that span outside their containers, diagonal section transitions.
- **Why it differentiates:** Standard consultancy sites use 12-column Bootstrap-style grids uniformly. Asymmetry communicates confidence and design intentionality. Firms like Pentagram, IDEO, and Ueno (now part of Accenture) use this as a signature.
- **Complexity:** Medium. Requires precise CSS Grid usage (named areas, span rules) and careful responsive handling so asymmetry doesn't break on mobile.
- **Dependencies:** Must be considered in layout architecture, not added later. Affects section structure.
- **Notes for Clover:** "Asymmetric layouts, generous whitespace" already in active requirements. The risk is over-complicating this. One or two asymmetric moments per section is more powerful than every element being offset.

### 4. Portfolio / Work Section with Structured Project Cards
- **What it is:** Capability area groupings (AI/ML, Cloud, Full-Stack, etc.) with placeholder project cards under each. Cards should have a consistent anatomy: project title, client type, outcome metric, tech stack tags.
- **Why it differentiates:** Most small consultancies have no portfolio (NDA excuses) or a generic services page. Even placeholder cards that show the structure of how work is presented signal organizational capability. It implies there is real work to fill in later.
- **Complexity:** Medium. Component architecture (capability category + card grid), hover states, placeholder content system.
- **Dependencies:** Requires capability area taxonomy to be defined. Card component must be designed to accept real content later.
- **Notes for Clover:** Already in active requirements as "Technology portfolio with capability categories and placeholder project cards." This is a high-signal section — invest in making the card design premium.

### 5. Micro-Interactions on Interactive Elements
- **What it is:** Hover states that go beyond color change: magnetic button effects, underline draw animations, border trace effects, cursor custom styling on hover. Every clickable element should respond to attention.
- **Why it differentiates:** These are the details that distinguish a site built by engineers who care from a site built by a template shop. Visitors feel it without being able to articulate it.
- **Complexity:** Low–Medium individually, Medium to maintain consistency across all elements.
- **Dependencies:** Requires a defined interaction vocabulary (one or two types of micro-interaction, applied consistently).
- **Notes for Clover:** Even a single, well-executed button hover effect (e.g., a border trace or fill-from-left) applied consistently is more effective than many different effects. Restraint is the differentiator.

### 6. Section Transitions That Imply Structure
- **What it is:** Visual devices between sections — angled cuts, partial overlapping panels, inverted color blocks (e.g., white section to black section with an angled boundary rather than a horizontal line) — that make the single-page scroll feel deliberately composed rather than stitched together.
- **Why it differentiates:** Most single-page sites have abrupt section changes. Thoughtful transitions imply the site was designed as a whole, not assembled section by section.
- **Complexity:** Low–Medium. CSS clip-path, SVG dividers, or background color transitions with diagonal cuts.
- **Dependencies:** Requires all section background decisions to be finalized.
- **Notes for Clover:** In a pure B&W palette, section transitions are one of the primary tools for visual variety. Black-to-white transitions with geometric angles reinforce the circuit/grid aesthetic.

### 7. Precise Spatial Rhythm (Whitespace as a Design Element)
- **What it is:** Consistent, generous spacing between elements — not just padding, but a deliberate spatial scale that makes every element feel placed rather than stacked. Section padding of 120–160px. Intentional "breathing room" around hero text.
- **Why it differentiates:** Commodity sites cram content. Premium sites use whitespace as signal: "we are confident enough in our content that we don't need to fill every pixel." Palantir's site is a masterclass in this.
- **Complexity:** Low (to define), Medium (to maintain consistently as sections are built). Requires a spacing scale (design tokens: 8px, 16px, 24px, 48px, 80px, 120px).
- **Dependencies:** Must be established in base CSS before sections are built. Retrofitting spacing is painful.

### 8. A Single, Signature Visual Moment
- **What it is:** One section or element that is memorable — a full-viewport animated circuit diagram in the hero, a counter that ticks up to a metric, a typographic layout that is surprising. Something that a visitor can point to and describe when recommending the site.
- **Why it differentiates:** Most sites are competent. Elite sites have one thing you remember. For Palantir it is the hero data visualization aesthetic. For IDEO it is the case study narrative depth. The signature moment does not have to be complex — it has to be precise and intentional.
- **Complexity:** Medium–High depending on execution. An SVG circuit animation in the hero is achievable. A WebGL data visualization is out of scope for a skeleton site.
- **Dependencies:** Must be decided early — the hero is the natural home. Affects asset creation approach.
- **Notes for Clover:** The circuit/grid pattern as an animated or interactive hero background is the natural candidate. Even a slow-moving CSS grid with circuit trace elements would serve as the signature moment if executed with precision.

---

## Anti-Features — Deliberately Do NOT Build (Skeleton Phase)

These are things that appear on consultancy websites but would be wrong to build for a skeleton site, either because they require real content to have value, add complexity with no return, or undermine the design focus.

### 1. Blog / Insights / Thought Leadership Section
- **Why not:** A blog without content is an empty shelf. It signals ambition without follow-through. Real thought leadership content requires editorial investment that doesn't belong in a skeleton site.
- **When it belongs:** Mature site, when there are 3+ real articles ready to publish simultaneously.
- **Already excluded:** Yes — in PROJECT.md Out of Scope.

### 2. Case Studies with Real Narrative Depth
- **Why not:** Placeholder case study copy is worse than placeholder cards. It implies the firm has nothing real to say. Structured placeholder cards (title, type, tags) are acceptable; paragraph copy that is clearly filler is not.
- **When it belongs:** When clients have given permission to be referenced and real outcomes can be described.

### 3. Testimonials / Client Logos
- **Why not:** Placeholder client logos are a red flag. A section that says "[Client Logo] [Client Logo] [Client Logo]" is more damaging than no section at all.
- **When it belongs:** When real client relationships can be publicly disclosed.

### 4. Awards / Press / Recognition Section
- **Why not:** Same logic as testimonials. Placeholder press mentions signal that the firm has no real press mentions.
- **When it belongs:** After earning recognizable credentials.

### 5. Real Contact Form Backend / Email Integration
- **Why not:** Out of scope for skeleton, correctly. A form that doesn't work is expected on a skeleton site. Document the intention clearly in the code.
- **When it belongs:** Mature site, with a backend or form service (Formspree, Resend, SES) wired in.
- **Already excluded:** Yes — in PROJECT.md Out of Scope.

### 6. SEO Metadata / Open Graph / Sitemap
- **Why not:** Premature optimization. A skeleton site may change substantially before launch. Investing in SEO infrastructure before content is final is waste.
- **When it belongs:** Mature site, when content, URLs, and section structure are stable.
- **Already excluded:** Yes — in PROJECT.md Out of Scope.

### 7. Chat Widget / Live Chat / Intercom
- **Why not:** Chat widgets on small consultancy sites feel desperate rather than responsive. They break the premium aesthetic. High-end firms do not have pop-up chat windows.
- **When it belongs:** Almost never on a premium consultancy site at this scale.

### 8. Video Backgrounds or Heavy Media
- **Why not:** They hurt load performance, fight with the geometric aesthetic, and require real production assets. Placeholder or stock video in a premium site is immediately recognizable.
- **When it belongs:** Only with bespoke produced video content.

### 9. Social Media Feeds Embedded
- **Why not:** Live-updating feeds require real social activity. An empty or infrequently updated feed is worse than no feed.
- **When it belongs:** When the firm has active, high-quality social presence worth showcasing.

### 10. Multiple Accent Colors or Gradient Systems
- **Why not:** The B&W constraint is a design decision, not a limitation. Breaking it — even with one accent — dilutes the aesthetic commitment that makes the site distinctive.
- **When it belongs:** If the brand evolves to include a color system. For now, B&W is the identity.
- **Already excluded:** Yes — in PROJECT.md Out of Scope.

---

## Feature Dependency Map

```
Navigation Header
    └── depends on: Section structure (anchors can't be defined until sections exist)
    └── enables: Scroll-spy (requires sections to be built)

Hero Section
    └── depends on: Typography system (tagline must be set before spacing can be tuned)
    └── depends on: Geometric visual language (circuit pattern decisions)
    └── enables: Signature visual moment (natural home for the animated element)

Typography System
    └── no dependencies — must be first
    └── enables: All sections (every section uses type)

Spacing Scale / Design Tokens
    └── no dependencies — must be early
    └── enables: All sections (all sections use spacing)

Geometric Visual Language / Circuit Patterns
    └── depends on: Design token decisions (SVG colors, opacity values)
    └── enables: Hero background, section backgrounds, card elements

Services Section
    └── depends on: Typography, Spacing
    └── no blocking dependencies

Portfolio / Project Cards
    └── depends on: Capability taxonomy decisions (what categories to use)
    └── depends on: Card component design

Team Section
    └── depends on: Confirmed owner list (Mike Wong, Matt Drapp, Peter Kwon, Stefan Schaner)
    └── depends on: Placeholder avatar approach

Contact Section
    └── depends on: Confirmed contact details (email, location)
    └── no backend dependencies for skeleton

Scroll-Triggered Animations
    └── depends on: All sections built (animations layered in after structure)
    └── depends on: Animation library choice (Framer Motion, GSAP, or Intersection Observer)
    └── must not block: Content load (must be additive-only)

Micro-Interactions
    └── depends on: Interactive element inventory (buttons, links, cards)
    └── depends on: Interaction vocabulary defined (one or two types, applied consistently)

Section Transitions
    └── depends on: Section background color decisions (which sections are black vs white)
    └── depends on: All sections built (transitions are between sections)

Responsiveness
    └── depends on: All sections built (responsive behavior must be tested per section)
    └── must be: Considered during layout design, not retrofitted
```

---

## Signal Analysis: What Makes a Site Feel "Elite"

The following observations come from studying premium technology consultancy sites. These are execution-level signals rather than discrete features:

**Signal 1 — Confidence in whitespace.**
Elite sites use more space than they need to. They do not fill every row. A section with one large typographic statement and 160px of padding above and below reads as confident. A section crammed with six bullet points reads as insecure.

**Signal 2 — Typography does the heavy lifting.**
On sites without photography (like a B&W geometric site), type must carry the aesthetic. Elite sites have a clear decision about typeface character: geometric sans-serif (Neue Haas Grotesk, Inter, PP Neue Montreal), sharp-edged display type, or a deliberate serif/sans contrast. The typeface choice should feel engineered, not neutral.

**Signal 3 — Restraint in animation.**
Palantir and similar firms use animation to direct attention, not to entertain. The pattern is: one thing moves at a time. Staggered card reveals, single element entrances. Sites that animate everything simultaneously feel chaotic and junior.

**Signal 4 — Precision in geometry.**
Circuit trace patterns and grid overlays must be mathematically precise. Randomly placed elements or imprecise angles look like clipart. The geometry must look like it was drawn by an engineer, not a graphic designer using a filter.

**Signal 5 — The site itself demonstrates capability.**
For a technology consultancy, the website is a proof of work. A site built with care, technical precision, and deliberate restraint communicates more about engineering capability than any copy could. The site should feel like something the firm built for a demanding client — not like a template they adapted.

---

*Last updated: 2026-02-22*
*Feeds into: Requirements definition (requirements engineer downstream consumer)*
