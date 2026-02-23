# Phase 2: Shell & Navigation - Research

**Researched:** 2026-02-22
**Domain:** React navigation components, IntersectionObserver scroll-spy, mobile hamburger menu with focus management, Next.js App Router client/server component boundaries, CSS scroll-margin-top
**Confidence:** HIGH (all major findings verified against official Next.js docs and authoritative sources)

---

## Summary

Phase 2 creates the persistent navigation shell that every subsequent phase depends on: a sticky header with anchor links, scroll-spy active state tracking, and a mobile hamburger menu with a full-screen overlay. Three areas required deep investigation beyond the Phase 1 research.

**First**, the component architecture question for the navigation header is answered clearly by Next.js 16 official docs: `app/layout.tsx` remains a Server Component; `Navigation.tsx` itself must be a `'use client'` component because it needs `useState` (mobile menu open/close), `useEffect` + `useRef` (IntersectionObserver scroll-spy), and `useCallback` for event handlers. The entire header is a single client boundary — there is no benefit to splitting the logo or static links into a separate server component since they add no significant server-rendering benefit and splitting them would add unnecessary complexity.

**Second**, the IntersectionObserver scroll-spy approach is the correct implementation — no library is needed. The key configuration insight is the `rootMargin` parameter: setting `rootMargin: "-80px 0px -55% 0px"` (top offset = nav height, bottom offset = large negative value) creates a narrow detection band just below the sticky header. This causes `entry.isIntersecting` to fire for the section that is actually visible in the user's reading area, not the section touching the top of the viewport. The `NAV_HEIGHT_PX = 80` constant from `lib/constants.ts` feeds directly into this rootMargin calculation.

**Third**, the mobile hamburger overlay requires manual focus trap implementation (no library) using `useRef` + `keydown` event listener for Tab and Shift+Tab wrapping, plus `Escape` key close. The ARIA pattern from W3C APG specifies `role="dialog"` (or `role="navigation"` for a nav overlay), `aria-modal="true"`, `aria-label`, and `aria-expanded` on the trigger button. On open: focus moves to the first focusable element. On close: focus returns to the hamburger button. The Escape key must close the overlay.

**Primary recommendation:** Build `Navigation.tsx` as a single `'use client'` component with internal state. Keep `SectionWrapper.tsx` as a Server Component. Use hand-rolled IntersectionObserver scroll-spy (no library). Implement focus trap manually — the codebase has no external focus trap library and one isn't needed for a single overlay component.

---

## Standard Stack

### Core (all already installed in Phase 1)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| React (built-in) | 19.2.3 | useState, useEffect, useRef, useCallback | Required for all interactive navigation state |
| Next.js Link | 16.1.6 | Anchor link navigation with hash support | `<Link href="#services">` renders as `<a href="#services">` with correct scroll behavior |
| lucide-react | 0.575.0 | Menu / X icons for hamburger button | Already installed; Menu and X icons cover the hamburger pattern |
| clsx | 2.1.1 | Conditional className composition for active state | Already installed |
| Tailwind CSS v4 | 4.2.0 | sticky top-0, z-50, transition utilities | All positioning and styling |

### Supporting (browser APIs — no install needed)

| API | Purpose | When to Use |
|-----|---------|-------------|
| `IntersectionObserver` | Scroll-spy — detects which section is visible | Navigation active state |
| `document.getElementById` | Look up section DOM nodes by ID | Observer setup |
| `useRef<HTMLButtonElement>` | Reference to hamburger button for focus return | Focus management on menu close |
| `useRef<HTMLDivElement>` | Reference to overlay container for focus trap | Keyboard event capture |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Hand-rolled IntersectionObserver | `react-intersection-observer` library | Library adds ~3KB; not needed for 5 static section IDs; hand-rolled is simpler and already understood by the team |
| Hand-rolled focus trap | `focus-trap-react` library | Library adds dependency for a single overlay; hand-rolled Tab/Shift+Tab wrapping is ~30 lines and fully sufficient for one menu |
| Lucide Menu/X icons | Custom SVG hamburger lines | Lucide is already installed; using it is consistent with the project's icon strategy |
| `<Link href="#services">` | `<a href="#services">` | Next.js Link renders to `<a>` for hash links; either works. Link is consistent and preferred. |

**Installation:** No new packages needed. All dependencies are already installed from Phase 1.

---

## Architecture Patterns

### Recommended File Structure (Phase 2 creates)

```
components/
├── layout/
│   └── Navigation.tsx     # 'use client' — sticky header, scroll-spy, mobile menu
│
└── ui/
    └── SectionWrapper.tsx  # Server Component — section anchor wrapper
```

Both files are new. No existing files are modified (except `app/layout.tsx` which gets `<Navigation />` inserted).

### Pattern 1: Navigation as a Single Client Component

**What:** `Navigation.tsx` is marked `'use client'` at the top. It manages all state internally: `activeSection: string`, `isMenuOpen: boolean`. It reads `NAV_LINKS` and `COMPANY` from `lib/constants.ts`.

**When to use:** Any component that needs both `useState` and `useEffect` is a client component. Navigation needs both — there is no Server Component architecture gain to be had here.

**Key decision from official docs:** The Next.js 16 docs explicitly show that a layout with a logo (static) and a search bar (interactive) keeps the whole `<nav>` in the layout as a Server Component while only the interactive part (`<Search />`) is a Client Component. For this project, the entire `<nav>` is interactive (scroll-spy updates active link; mobile menu toggles), so the entire `Navigation.tsx` is `'use client'`. There is no benefit to splitting the logo into a separate server component.

```tsx
// components/layout/Navigation.tsx
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import clsx from 'clsx';
import { NAV_LINKS, COMPANY, NAV_HEIGHT_PX, SECTION_IDS } from '@/lib/constants';

export default function Navigation() {
  const [activeSection, setActiveSection] = useState<string>(SECTION_IDS.HERO);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Scroll-spy: IntersectionObserver
  useEffect(() => {
    const sectionIds = Object.values(SECTION_IDS);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: `-${NAV_HEIGHT_PX}px 0px -55% 0px`,
        threshold: 0,
      }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Close menu on Escape; handle focus trap
  useEffect(() => {
    if (!isMenuOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMenuOpen(false);
        menuButtonRef.current?.focus();
        return;
      }

      if (e.key === 'Tab') {
        const overlay = overlayRef.current;
        if (!overlay) return;
        const focusable = overlay.querySelectorAll<HTMLElement>(
          'a[href], button, [tabindex]:not([tabindex="-1"])'
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isMenuOpen]);

  const handleNavLinkClick = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  return (
    <header className="fixed top-0 inset-x-0 z-50 h-[--nav-height] bg-surface border-b border-surface-border">
      <nav
        role="navigation"
        aria-label="Main navigation"
        className="flex items-center justify-between h-full px-[--section-padding-x]"
      >
        {/* Wordmark */}
        <Link href="#hero" className="font-display font-semibold text-on-surface">
          {COMPANY.name}
        </Link>

        {/* Desktop nav links */}
        <ul className="hidden md:flex gap-8 list-none" role="list">
          {NAV_LINKS.map((link) => (
            <li key={link.sectionId}>
              <Link
                href={link.href}
                className={clsx(
                  'text-sm font-body transition-colors duration-base',
                  activeSection === link.sectionId
                    ? 'text-on-surface'
                    : 'text-on-surface-muted hover:text-on-surface'
                )}
                aria-current={activeSection === link.sectionId ? 'true' : undefined}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Hamburger button */}
        <button
          ref={menuButtonRef}
          className="md:hidden text-on-surface"
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
          onClick={() => setIsMenuOpen((prev) => !prev)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile overlay */}
      {isMenuOpen && (
        <div
          id="mobile-menu"
          ref={overlayRef}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
          className="fixed inset-0 z-40 bg-surface flex flex-col items-center justify-center"
        >
          {/* Close button inside overlay */}
          <button
            className="absolute top-4 right-4 text-on-surface"
            aria-label="Close menu"
            onClick={() => {
              setIsMenuOpen(false);
              menuButtonRef.current?.focus();
            }}
          >
            <X size={24} />
          </button>

          <ul className="flex flex-col items-center gap-8 list-none" role="list">
            {NAV_LINKS.map((link) => (
              <li key={link.sectionId}>
                <Link
                  href={link.href}
                  onClick={handleNavLinkClick}
                  className="font-display text-2xl text-on-surface"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
```

### Pattern 2: SectionWrapper as Server Component

**What:** A thin wrapper that provides the `id` anchor, `scroll-margin-top` offset, and consistent vertical padding. It is a Server Component (no `'use client'`) because it has no interactivity — it just renders a `<section>` element.

**When to use:** Every content section (Hero, Services, Portfolio, Team, Contact) wraps its top-level element in `<SectionWrapper>`.

**Critical detail:** `scroll-margin-top` must equal `--nav-height` (80px) to prevent the section from scrolling behind the fixed header when an anchor link is clicked. This is a pure CSS property — no JavaScript needed.

```tsx
// components/ui/SectionWrapper.tsx
// No 'use client' — Server Component

interface SectionWrapperProps {
  id: string;
  theme?: 'dark' | 'light';
  className?: string;
  children: React.ReactNode;
}

export default function SectionWrapper({
  id,
  theme = 'dark',
  className,
  children,
}: SectionWrapperProps) {
  return (
    <section
      id={id}
      className={`${theme === 'dark' ? 'section-dark' : 'section-light'} ${className ?? ''}`}
      style={{ scrollMarginTop: 'var(--nav-height)' }}
    >
      {children}
    </section>
  );
}
```

### Pattern 3: Wiring Navigation into layout.tsx

**What:** `Navigation` is imported and rendered in `app/layout.tsx` inside the `<body>`, above `{children}`. This ensures the nav is present on all pages and persists across client navigations.

**Critical detail:** `app/layout.tsx` is a Server Component. It can import `Navigation` (a Client Component) directly — Next.js handles the client/server boundary automatically. No special wrapper is needed.

```tsx
// app/layout.tsx (modification)
import Navigation from '@/components/layout/Navigation';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`...`} data-scroll-behavior="smooth">
      <body className="font-body">
        <Navigation />
        {children}
      </body>
    </html>
  );
}
```

### Pattern 4: Scroll-Spy rootMargin Configuration

**What:** The IntersectionObserver `rootMargin` is the critical tuning parameter for scroll-spy. It defines the effective detection zone for "currently visible section."

**Formula:** `rootMargin: "-${NAV_HEIGHT_PX}px 0px -55% 0px"`

- Top: `-80px` — shrinks the detection zone from the top by the nav height. Prevents sections hidden behind the fixed header from triggering.
- Bottom: `-55%` — shrinks the detection zone from the bottom by 55% of the viewport. Only the top 45% of the viewport (below the nav) can activate a section. This creates a narrow band near the top of visible content.
- `threshold: 0` — fires as soon as ANY part of the section enters the detection zone.

**Why this works:** When a section enters the narrow band just below the nav, it becomes "active." As the user scrolls, sections exit the bottom of the band before the next section enters from below, preventing two sections from being active simultaneously.

**Pitfall:** If rootMargin bottom value is too large (e.g., `-90%`), the band is too narrow and sections may not register during fast scrolling. `-55%` is a reliable middle ground for sections with substantial content height.

### Anti-Patterns to Avoid

- **Marking layout.tsx as `'use client'`:** Never add `'use client'` to `app/layout.tsx`. The layout is a Server Component that imports Navigation (a Client Component). This is the correct pattern per Next.js 16 docs.
- **Using scroll event listeners for scroll-spy:** `window.addEventListener('scroll', ...)` is synchronous and fires on every scroll event. `IntersectionObserver` is asynchronous and fires only when intersection state changes — far more performant.
- **Setting `position: sticky` instead of `position: fixed` for the header:** `sticky` requires a scrollable parent and can break if any ancestor has `overflow: hidden`. For a navigation header that must always be visible, `fixed` (or `sticky top-0` on the body scroll container) is safer. In this codebase, `fixed top-0 inset-x-0` is the correct approach.
- **Using `scroll-padding-top` on `<html>` instead of `scroll-margin-top` on sections:** Both work, but `scroll-margin-top` on each section is more portable and works correctly in this project's SectionWrapper. The value `var(--nav-height)` reads the already-defined CSS custom property.
- **Not returning focus to the hamburger button on menu close:** ARIA pattern for dialogs/overlays requires focus to return to the triggering element. Failure to do this is an accessibility violation.
- **Using `overflow: hidden` on body when overlay is open:** Can break sticky/fixed positioning in some browsers. Instead, manage scroll lock with `document.body.style.overflow = 'hidden'` on mount and restore on unmount.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Anchor link hash navigation | Custom JavaScript scroll function | Native `<a href="#id">` or `<Link href="#id">` + `data-scroll-behavior="smooth"` on `<html>` | Already working from Phase 1 — the `data-scroll-behavior="smooth"` attribute on `<html>` in `layout.tsx` enables smooth scrolling for anchor links natively |
| Icon for hamburger button | Custom SVG hamburger lines | `lucide-react` Menu and X components | Already installed; consistent stroke style; TypeScript-typed props |
| Conditional class names for active link | String template literals | `clsx` | Already installed; handles undefined/null safely |
| `scroll-margin-top` pixel value | JavaScript to calculate offset | CSS custom property `var(--nav-height)` | Already defined in `:root` in `globals.css` |

**Key insight:** The Phase 1 foundation was designed specifically to serve Phase 2. `NAV_HEIGHT_PX`, `SECTION_IDS`, `NAV_LINKS`, `SECTIONS`, and the `--nav-height` CSS custom property are all ready to use. Phase 2 is primarily wiring these existing constants into components.

---

## Common Pitfalls

### Pitfall 1: IntersectionObserver Fires for All Sections on Mount

**What goes wrong:** On page load, all sections are queried and observed. If the IntersectionObserver fires immediately with all sections "intersecting" (because the page hasn't scrolled), the active state becomes the last section that fired its callback — which may be arbitrary.

**Why it happens:** On mount, the observer fires for every section that is currently intersecting. If multiple sections are in the initial viewport or if the rootMargin calculation hasn't taken effect yet, multiple entries fire.

**How to avoid:** Initialize `activeSection` to `SECTION_IDS.HERO` (not empty string). The rootMargin setup ensures only the section in the detection band triggers. Additionally, only update `activeSection` when `entry.isIntersecting === true` (not on exit) — this means the last section to enter the band stays active until the next section enters.

**Warning signs:** On page load, a non-hero nav link is highlighted even though the page is at the top.

---

### Pitfall 2: Mobile Overlay z-index Behind Fixed Header

**What goes wrong:** The mobile menu overlay appears behind the sticky navigation header, causing the header and overlay to conflict visually or the overlay close button to be inaccessible.

**Why it happens:** The header is `z-50`. If the overlay is also `z-50` or lower, it renders below the header.

**How to avoid:** The overlay must have a higher z-index than the header OR be rendered as a sibling inside the header (inside the `<header>` element). If rendered inside the header, it automatically inherits the header's stacking context. The code example above renders the overlay inside `<header>` — this is correct. If rendered outside, use `z-[60]` or higher.

**Warning signs:** The overlay appears but the close button (positioned at `top-4 right-4`) is obscured by the nav bar.

---

### Pitfall 3: Scroll-Spy rootMargin Not Accounting for Nav Height

**What goes wrong:** When the user clicks a nav link and smooth-scrolls to a section, the section stops just behind the sticky header. The nav link for that section highlights (correct), but the section heading is hidden under the header.

**Why it happens:** Two separate things need the nav height offset:
1. `scroll-margin-top` on `<section>` elements — offsets anchor scroll position
2. `rootMargin` top value in IntersectionObserver — offsets the detection zone

Both must equal `NAV_HEIGHT_PX` (80px). Missing either one causes incorrect behavior.

**How to avoid:** `SectionWrapper` sets `style={{ scrollMarginTop: 'var(--nav-height)' }}`. Navigation's observer sets `rootMargin: '-80px 0px -55% 0px'`. Both must be present.

**Warning signs:** Clicking a nav link scrolls correctly but the scroll-spy active state doesn't update until the user scrolls further.

---

### Pitfall 4: Body Scroll Not Locked When Mobile Overlay is Open

**What goes wrong:** When the mobile menu overlay is open (full-screen), the user can still scroll the page underneath the overlay. This causes the scroll-spy to update the active section while the menu is open, and the overlay may feel "floaty."

**Why it happens:** The overlay is `position: fixed` over the viewport, but the body can still receive scroll events.

**How to avoid:** When `isMenuOpen` becomes `true`, add `document.body.style.overflow = 'hidden'` in the `useEffect`. When it becomes `false`, restore `document.body.style.overflow = ''`. This scroll-locks the body.

```tsx
useEffect(() => {
  if (isMenuOpen) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
  return () => {
    document.body.style.overflow = '';
  };
}, [isMenuOpen]);
```

**Warning signs:** Background content scrolls while mobile menu is visible.

---

### Pitfall 5: Focus Not Moved to Overlay on Open

**What goes wrong:** When the mobile menu opens, keyboard focus remains on the hamburger button (outside the overlay). The user presses Tab expecting to move through menu links, but instead moves through hidden desktop nav links (which may still exist in the DOM but be visually hidden via `hidden md:flex`).

**Why it happens:** The browser does not automatically move focus to a newly rendered dialog. The component must imperatively set focus when the overlay becomes visible.

**How to avoid:** After `setIsMenuOpen(true)`, use a `useEffect` that watches `isMenuOpen` and calls `.focus()` on the first focusable element in the overlay:

```tsx
useEffect(() => {
  if (isMenuOpen && overlayRef.current) {
    const firstFocusable = overlayRef.current.querySelector<HTMLElement>(
      'a[href], button, [tabindex]:not([tabindex="-1"])'
    );
    firstFocusable?.focus();
  }
}, [isMenuOpen]);
```

**Warning signs:** Opening the mobile menu with keyboard; pressing Tab jumps to elements outside the overlay.

---

### Pitfall 6: Next.js `<Link>` vs `<a>` for Hash Anchors

**What goes wrong:** Using Next.js `<Link>` for hash-only hrefs (e.g., `href="#services"`) on the same page triggers a full client navigation update in some Next.js versions, potentially resetting scroll position or causing unexpected behavior.

**Why it happens:** Next.js `<Link>` in the App Router is designed for route navigation. Hash links trigger scroll-to-element behavior, which works correctly as of Next.js 16 — `<Link href="#services">` renders as `<a href="#services">` which uses native browser anchor scrolling with `data-scroll-behavior="smooth"`.

**How to avoid:** Use `<Link href="#services">` throughout. As confirmed in the official Next.js 16 Link docs: "If you'd like to scroll to a specific id on navigation, you can append your URL with a # hash link or just pass a hash link to the href prop. This is possible since `<Link>` renders to an `<a>` element." This is the correct and verified pattern.

**Warning signs:** Clicking nav links causes full page refreshes or URL changes without scroll.

---

## Code Examples

Verified patterns from official sources:

### IntersectionObserver Scroll-Spy Hook (self-contained)

```typescript
// Source: MDN IntersectionObserver + Next.js 16 constants pattern
// Used inside Navigation.tsx useEffect

const sectionIds = Object.values(SECTION_IDS); // ['hero', 'services', 'portfolio', 'team', 'contact']

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setActiveSection(entry.target.id);
      }
    });
  },
  {
    rootMargin: `-${NAV_HEIGHT_PX}px 0px -55% 0px`,
    threshold: 0,
  }
);

sectionIds.forEach((id) => {
  const el = document.getElementById(id);
  if (el) observer.observe(el);
});

return () => observer.disconnect();
```

### Focus Trap Implementation

```typescript
// Source: W3C APG modal dialog pattern, applied to nav overlay
// Used inside Navigation.tsx useEffect (depends on isMenuOpen)

const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    setIsMenuOpen(false);
    menuButtonRef.current?.focus();
    return;
  }

  if (e.key === 'Tab' && overlayRef.current) {
    const focusableSelector = 'a[href], button, [tabindex]:not([tabindex="-1"])';
    const focusable = Array.from(
      overlayRef.current.querySelectorAll<HTMLElement>(focusableSelector)
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }
};

document.addEventListener('keydown', handleKeyDown);
return () => document.removeEventListener('keydown', handleKeyDown);
```

### SectionWrapper with scroll-margin-top

```tsx
// Source: MDN scroll-margin-top + ARCHITECTURE.md SectionWrapper pattern
// components/ui/SectionWrapper.tsx

interface SectionWrapperProps {
  id: string;
  theme?: 'dark' | 'light';
  className?: string;
  children: React.ReactNode;
}

export default function SectionWrapper({
  id,
  theme = 'dark',
  className,
  children,
}: SectionWrapperProps) {
  return (
    <section
      id={id}
      className={`${theme === 'dark' ? 'section-dark' : 'section-light'} ${className ?? ''}`}
      style={{ scrollMarginTop: 'var(--nav-height)' }}
    >
      {children}
    </section>
  );
}
```

### Active Link Class Composition with clsx

```tsx
// Source: clsx docs — conditional classes
// Used inside Navigation.tsx for each nav link

<Link
  href={link.href}
  className={clsx(
    'text-sm transition-colors duration-base',
    activeSection === link.sectionId
      ? 'text-on-surface font-medium'        // active: full white, slightly bolder
      : 'text-on-surface-muted hover:text-on-surface'  // inactive: muted, hover full
  )}
  aria-current={activeSection === link.sectionId ? 'true' : undefined}
>
  {link.label}
</Link>
```

### Navigation in layout.tsx

```tsx
// Source: Next.js 16 official docs — importing Client Component into Server Component layout
// app/layout.tsx

import Navigation from '@/components/layout/Navigation';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="..." data-scroll-behavior="smooth">
      <body className="font-body">
        <Navigation />
        <main>{children}</main>
      </body>
    </html>
  );
}
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `window.addEventListener('scroll', handler)` for scroll-spy | `IntersectionObserver` with rootMargin | ~2019, widely adopted by 2022 | Async, no main thread blocking, far better performance |
| Manual active-link class with `window.location.hash` | IntersectionObserver + `useState` | 2020+ | Doesn't require URL hash to change; works with smooth scroll |
| Tabindex-based focus management for modals | Querying all focusable elements + keydown listener | Established pattern | More robust; handles dynamically added elements |
| `scroll-behavior: smooth` in CSS | `data-scroll-behavior="smooth"` on `<html>` in Next.js 16 | Next.js 16 (Oct 2025) | Must use attribute; global CSS smooth scroll interferes with Next.js route transitions |
| `scroll-padding-top` on `<html>` | `scroll-margin-top` on `<section>` elements | 2021+ (CSS-Tricks) | Per-element control; better for SectionWrapper pattern |

**Deprecated/outdated:**
- jQuery ScrollSpy: No jQuery in this project; no need to consider
- AOS (Animate on Scroll) library: Not in the stack; scroll-triggered animations are Phase 3
- `position: sticky` for a navigation that must always be visible: For a full-width nav that must persist over all content, `position: fixed` is more predictable

---

## Open Questions

### 1. Scroll-spy behavior at page top (Hero section active state)

**What we know:** SECTION_IDS.HERO ('hero') is initialized as `activeSection`. NAV_LINKS does NOT include Hero as a link (links are Services, Portfolio, Team, Contact). The wordmark links to `#hero`.

**What's unclear:** Whether the hero section needs to be observed by the IntersectionObserver at all, since it has no corresponding nav link to highlight. The observer should still observe it so that when the user scrolls back to the top, the hero becomes "active" and none of the nav links are highlighted (all return to muted state).

**Recommendation:** Include `SECTION_IDS.HERO` in the observer's watched list. When `activeSection === SECTION_IDS.HERO`, no nav link satisfies `activeSection === link.sectionId` (since Hero is not in NAV_LINKS), so all links render in their inactive/muted state. This is the correct UX for the top of the page.

---

### 2. Navigation background transparency vs. solid

**What we know:** Design is pure B&W. The requirements say "sticky header" with no mention of transparency effects. The globals.css `--color-surface` is `#000000`.

**What's unclear:** Whether the nav should be fully opaque black at all times, or whether it should start transparent over the hero and become solid as the user scrolls.

**Recommendation:** Default to fully opaque `bg-surface` (black) with a subtle bottom border (`border-b border-surface-border`) for Phase 2. A scroll-triggered transparency-to-solid transition could be added in Phase 3 (animations phase) using framer-motion's `useScroll` + `useTransform`. Phase 2 should not implement this — it is animation behavior, not shell behavior. If the team wants this, scope it to Phase 3.

---

### 3. Nav link for Hero section

**What we know:** `NAV_LINKS` in `lib/constants.ts` contains Services, Portfolio, Team, Contact — not Hero. The ARCHITECTURE.md shows "Clover Labs" wordmark links to `#hero`.

**What's unclear:** The NAV-01 requirement says "anchor links (Hero, Services, Portfolio, Team, Contact)" — this could mean Hero IS a nav link, or that the nav covers access to those sections (with hero being the wordmark link).

**Recommendation:** Follow the established `NAV_LINKS` constant as defined in Phase 1 (no Hero link — wordmark handles hero navigation). The requirement text "Hero, Services, Portfolio, Team, Contact" refers to the sections the nav provides access to, not the literal link list. The wordmark linking to `#hero` satisfies the Hero access requirement.

---

## Sources

### Primary (HIGH confidence)

- Next.js 16.1.6 official docs: `/docs/app/api-reference/components/link` — hash link anchor behavior, `<Link href="#services">` pattern, scroll behavior options. Last updated 2026-02-20.
- Next.js 16.1.6 official docs: `/docs/app/getting-started/server-and-client-components` — Client Component boundary placement, layout with client children pattern. Last updated 2026-02-20.
- MDN: `scroll-margin-top` — property definition, syntax, browser support (Baseline Widely Available since April 2021).
- W3C APG: Modal Dialog pattern — focus management spec: focus-on-open, focus-return-on-close, Tab wrapping, Escape key close.
- Phase 1 codebase (`lib/constants.ts`, `app/globals.css`, `lib/types.ts`) — confirmed `NAV_HEIGHT_PX = 80`, `SECTION_IDS`, `NAV_LINKS`, `--nav-height: 80px`, `SectionConfig` interface all exist and are ready to use.

### Secondary (MEDIUM confidence)

- CSS-Tricks: "Fixed Headers and Jump Links? The Solution is scroll-margin-top" — `scroll-margin-top` pattern for sticky header offset, verified against MDN.
- Maxime Heckel blog "ScrollSpy Demystified" — IntersectionObserver rootMargin negative margin pattern for scroll-spy with header offset. Implementation pattern verified against MDN IntersectionObserver spec.
- ARIA Accessibility Quick Wins 2025 (Medium) — hamburger menu accessible requirements: focus state, visually-hidden label, Escape keypress, focus return. Verified against W3C APG.

### Tertiary (LOW confidence)

- None — all critical implementation claims are verified against official sources.

---

## Metadata

**Confidence breakdown:**
- Standard stack (no new installs): HIGH — all libraries confirmed installed in Phase 1 verification
- Navigation component architecture (`'use client'` boundary): HIGH — verified against Next.js 16 official docs
- IntersectionObserver scroll-spy with rootMargin: HIGH — pattern verified against MDN and CSS-Tricks
- Focus trap implementation pattern: HIGH — verified against W3C APG modal dialog spec
- `scroll-margin-top` for anchor offset: HIGH — MDN confirmed, browser support 2021+
- rootMargin `-55%` bottom value: MEDIUM — this is the widely-used heuristic, but optimal value may need tuning based on actual section heights
- Open question about nav transparency: LOW — design intent is unspecified; defer to Phase 3

**Research date:** 2026-02-22
**Valid until:** 2026-03-22 for library versions; browser API patterns are stable indefinitely
