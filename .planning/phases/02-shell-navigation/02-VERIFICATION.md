---
phase: 02-shell-navigation
verified: 2026-02-22T00:00:00Z
status: gaps_found
score: 7/9 must-haves verified
re_verification: false
gaps:
  - truth: Clicking any nav anchor link smooth-scrolls to the correct section position with proper offset for the sticky header height
    status: failed
    reason: data-scroll-behavior=smooth on html is a Next.js 16 router signal only. No CSS scroll-behavior rule exists. Next.js source (disable-smooth-scroll.js) confirms it reads htmlElement.dataset.scrollBehavior to temporarily disable smooth scroll during route transitions, not to activate it. Anchor clicks jump instantly.
    artifacts:
      - path: app/globals.css
        issue: No CSS rule sets scroll-behavior. The html[data-scroll-behavior=smooth] selector is absent from globals.css.
      - path: app/layout.tsx
        issue: data-scroll-behavior=smooth on html signals the Next.js router only; a CSS rule must separately activate scroll-behavior in the browser.
    missing:
      - In app/globals.css @layer base add: html[data-scroll-behavior=smooth] { scroll-behavior: smooth; }
  - truth: Anchor link clicks scroll to target section with proper offset so the section heading is not hidden behind the sticky header
    status: partial
    reason: scrollMarginTop via var(--nav-height) is correctly wired and provides the correct offset. Partial because anchor clicks jump instantly rather than smooth-scrolling. Same root cause as the first gap.
    artifacts:
      - path: app/globals.css
        issue: Same missing scroll-behavior CSS rule.
    missing:
      - Same fix as first gap resolves both truths.
---

# Phase 2: Shell and Navigation Verification Report

**Phase Goal:** The site has a functioning navigation layer with sticky header, anchor links and scroll-spy, a mobile hamburger menu, and a section wrapper that every content section will use
**Verified:** 2026-02-22
**Status:** gaps_found
**Re-verification:** No, initial verification

---

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | Every content section renders as section element with correct id matching SECTION_IDS | VERIFIED | page.tsx maps SECTIONS array to SectionWrapper with id={section.id} for all 5 sections: hero, services, portfolio, team, contact |
| 2 | Anchor link click scrolls to target section with correct header offset | PARTIAL | scrollMarginTop via var(--nav-height) correctly wired in SectionWrapper line 27. Offset mechanism works. Smooth scroll is absent. |
| 3 | Clicking any nav anchor link smooth-scrolls to the correct section | FAILED | No CSS scroll-behavior property set anywhere. data-scroll-behavior=smooth on html is a Next.js 16 router signal confirmed by Next.js source. Anchor clicks jump instantly. |
| 4 | Each section has consistent vertical padding and dark/light theme alternation | VERIFIED | py-[--section-padding-y] px-[--section-padding-x] in SectionWrapper; dark/light/dark/light/dark alternation in SECTIONS constant |
| 5 | Clover Labs wordmark and anchor links visible in sticky header | VERIFIED | header className fixed top-0 inset-x-0 z-50 h-[--nav-height]; COMPANY.name wordmark and NAV_LINKS.map() desktop links |
| 6 | Nav link for currently visible section is highlighted via scroll-spy | VERIFIED | IntersectionObserver in useEffect with rootMargin using NAV_HEIGHT_PX offset; setActiveSection(entry.target.id) on intersect; clsx applies active style when activeSection matches |
| 7 | Mobile hamburger opens full-screen overlay; focus is trapped; Escape dismisses | VERIFIED | isMenuOpen state; div role=dialog aria-modal=true; useEffect 3 implements Tab/Shift+Tab wrap and Escape dismiss with focus return |
| 8 | Mobile overlay open locks background page scroll | VERIFIED | useEffect 2 sets document.body.style.overflow=hidden when isMenuOpen is true |
| 9 | Mobile overlay close returns focus to hamburger button | VERIFIED | Escape handler and close button onClick both call menuButtonRef.current?.focus() |

**Score:** 7/9 truths verified. Truth 3 failed, Truth 2 partial. Both share the same root cause: missing CSS scroll-behavior rule.

---

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|  
| components/ui/SectionWrapper.tsx | Reusable section wrapper with anchor ID, scroll-margin-top, theme class | VERIFIED | 32 lines; default export; no stubs; imported and used in page.tsx |
| app/page.tsx | All 5 sections rendered using SectionWrapper with correct IDs and themes | VERIFIED | Imports SECTIONS and SECTION_IDS from constants; maps all 5 to SectionWrapper |
| components/layout/Navigation.tsx | Sticky nav with scroll-spy, desktop links, mobile overlay, focus trap | VERIFIED | 202 lines (exceeds 100-line minimum); use client; default export; full implementation |
| app/layout.tsx | Root layout rendering Navigation above page children | VERIFIED | Imports Navigation; renders Navigation above main children |

---

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|  
| SectionWrapper.tsx | globals.css | scrollMarginTop: var(--nav-height) | WIRED | Line 27 in SectionWrapper; --nav-height: 80px defined in :root in globals.css |
| page.tsx | lib/constants.ts | import SECTIONS and SECTION_IDS | WIRED | Line 7; both imports used in JSX map |
| page.tsx | SectionWrapper.tsx | SectionWrapper JSX usage | WIRED | Line 13; used in SECTIONS.map() with id, theme, className props |
| Navigation.tsx | lib/constants.ts | import NAV_LINKS COMPANY NAV_HEIGHT_PX SECTION_IDS | WIRED | Line 7; all four named exports imported and used in component |
| Navigation.tsx | DOM section elements | IntersectionObserver | WIRED | Lines 20-41; observes document.getElementById for each value in SECTION_IDS |
| layout.tsx | Navigation.tsx | Navigation JSX element | WIRED | Line 41; Navigation rendered above main children in body |
| html[data-scroll-behavior] | CSS scroll-behavior | CSS attribute selector rule | NOT WIRED | data-scroll-behavior=smooth on html (layout.tsx line 38) has no CSS counterpart. Next.js 16 source confirms this is a router signal only. CSS scroll-behavior: smooth must be set separately. |

---

### Requirements Coverage

| Requirement | Description | Status | Blocking Issue |
|-------------|-------------|--------|----------------|
| NAV-01 | Sticky header with anchor links to each section | SATISFIED | header is fixed top-0 inset-x-0 z-50; all 4 anchor links from NAV_LINKS |
| NAV-02 | Scroll-spy active state | SATISFIED | IntersectionObserver complete; active link highlighted via clsx |
| NAV-03 | Mobile hamburger menu with overlay and focus management | SATISFIED | Full-screen overlay with Tab trap, Escape, body scroll lock, focus return |
| NAV-04 | Logo/wordmark Clover Labs in navigation | SATISFIED | COMPANY.name rendered as Link to #hero |
| NAV-05 | Smooth scroll behavior on anchor link clicks | BLOCKED | No CSS scroll-behavior rule; anchor clicks produce instant position jump |
| LAYT-01 | Hybrid single-page scroll with anchor navigation | PARTIAL | Single-page anchor structure exists and works; not smooth |
| LAYT-03 | SectionWrapper with vertical rhythm, anchor IDs, scroll-margin-top | SATISFIED | SectionWrapper provides padding, anchor id, and scrollMarginTop via var(--nav-height) |

---

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| app/page.tsx | 11 | Nested main element | Warning | layout.tsx wraps children in main (line 42) and page.tsx also returns a main element, producing nested main tags. HTML spec allows only one main per document. Functionally harmless but semantically invalid. Not a Phase 2 blocker. |
| lib/constants.ts | 114 122 130 138 | status: placeholder in PORTFOLIO_ITEMS | Info | Expected placeholder data for this phase; no impact on Phase 2 goals |

---

### Gaps Summary

One gap blocks full goal achievement. Two truths fail for the same root cause: the CSS scroll-behavior: smooth property is never applied.

The project decision log (STATE.md and 01-02-SUMMARY.md) documents using data-scroll-behavior=smooth as a data attribute on html to avoid React 19 hydration mismatches with inline styles. The 01-02-SUMMARY.md explicitly notes that the CSS selector can be added if needed later. That rule was never added.

Verifying the Next.js 16 source at node_modules/next/dist/shared/lib/router/utils/disable-smooth-scroll.js confirms the mechanism: Next.js reads htmlElement.dataset.scrollBehavior === smooth to know whether to temporarily disable smooth scroll during route transitions. It expects the browser CSS scroll-behavior to be set independently. Without a CSS rule anchor clicks jump instantly.

Fix required. Add one CSS rule to app/globals.css inside @layer base:

    html[data-scroll-behavior="smooth"] {
      scroll-behavior: smooth;
    }

This closes both failing truths (NAV-05 and the smooth-scroll aspect of LAYT-01). It uses a CSS attribute selector not an inline style so it carries no hydration risk.

The nested main issue is flagged as a warning. It does not block Phase 2 goals and should be resolved before Phase 5 by removing the main wrapper from page.tsx.

---

_Verified: 2026-02-22_
_Verifier: Claude (gsd-verifier)_
