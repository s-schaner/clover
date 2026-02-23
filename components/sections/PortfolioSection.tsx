// components/sections/PortfolioSection.tsx
// Client Component — the only section requiring 'use client'.
// Maintains category filter state via useState.
//
// Filter interaction:
//   - "All" is default active state, shows all PORTFOLIO_ITEMS
//   - Clicking a category pill instantly narrows to matching items (no animation)
//   - "All" is prepended at component level — it is NOT in PORTFOLIO_CATEGORIES
//   - Filter uses React .filter() — NOT DOM attribute selectors
//   - Render only visibleItems (not all items hidden/shown via CSS)
//
// Security category: no items exist for Security in PORTFOLIO_ITEMS — clicking
// Security correctly shows an empty grid. No empty state message needed.

'use client';

import { useState } from 'react';
import SectionWrapper from '@/components/ui/SectionWrapper';
import { GridPattern } from '@/components/ui/GridPattern';
import { FadeInOnScroll } from '@/components/ui/FadeInOnScroll';
import { StaggerChildren, StaggerItem } from '@/components/ui/StaggerChildren';
import { PortfolioCard } from '@/components/cards/PortfolioCard';
import { SECTION_IDS, PORTFOLIO_CATEGORIES, PORTFOLIO_ITEMS } from '@/lib/constants';
import type { PortfolioCategory } from '@/lib/types';

// "All" is a virtual filter that is NOT a PortfolioCategory — it lives at the component level only.
type ActiveFilter = PortfolioCategory | 'All';

export function PortfolioSection() {
  const [activeCategory, setActiveCategory] = useState<ActiveFilter>('All');

  // Derived: items to render based on active filter.
  // Instant — no AnimatePresence, no transition. Cards just appear/disappear.
  const visibleItems =
    activeCategory === 'All'
      ? PORTFOLIO_ITEMS
      : PORTFOLIO_ITEMS.filter((item) => item.category === activeCategory);

  // "All" prepended at component level; PORTFOLIO_CATEGORIES does NOT contain it.
  const allFilters: ActiveFilter[] = ['All', ...PORTFOLIO_CATEGORIES];

  return (
    <SectionWrapper id={SECTION_IDS.PORTFOLIO} theme="dark">
      {/*
        relative: required so GridPattern's `absolute inset-0` is contained.
        max-w-7xl: constrains content width.
        NO px-[--section-padding-x] or py-[--section-padding-y] — SectionWrapper
        already applies the outer section padding.
      */}
      <div className="relative mx-auto max-w-7xl">
        {/* Fractal grid texture — dark theme */}
        <GridPattern theme="dark" />

        {/* Heading + pill filter row — fades in on scroll */}
        <FadeInOnScroll>
          <div className="text-center mb-8">
            {/* Geometric accent — line/diamond/line, matches ServicesSection pattern */}
            <div className="flex items-center justify-center gap-3 mb-6" aria-hidden="true">
              <span className="block h-px w-8 bg-current opacity-25" />
              <span className="block w-1.5 h-1.5 border border-current opacity-50 rotate-45" />
              <span className="block h-px w-8 bg-current opacity-25" />
            </div>

            <h2 className="font-display text-[length:--text-section] font-bold text-on-surface text-center">
              Portfolio
            </h2>

            <p className="font-body text-on-surface-muted mt-4 max-w-2xl mx-auto text-center text-base">
              Representative capability areas. Client details available under NDA.
            </p>
          </div>

          {/* Category filter pills — sharp corners, no rounded-* */}
          <div className="flex flex-wrap gap-2 justify-center mb-12">
            {allFilters.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={
                  activeCategory === cat
                    ? 'px-4 py-1.5 font-body text-sm border border-on-surface text-on-surface uppercase tracking-wider'
                    : 'px-4 py-1.5 font-body text-sm border border-on-surface-subtle/40 text-on-surface-muted uppercase tracking-wider hover:border-on-surface/60 hover:text-on-surface/80 transition-colors'
                }
              >
                {cat}
              </button>
            ))}
          </div>
        </FadeInOnScroll>

        {/*
          Card grid — maps visibleItems only (not all items with hidden non-matching).
          key={item.id} on StaggerItem ensures React reconciliation is item-based,
          so items that remain visible across filter changes keep their DOM node.
          PortfolioCard has HoverLift built in — do NOT wrap in HoverLift again.
        */}
        <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[--gap-grid]">
          {visibleItems.map((item, i) => (
            <StaggerItem key={item.id} index={i} columns={3}>
              <PortfolioCard item={item} className="h-full" />
            </StaggerItem>
          ))}
        </StaggerChildren>
      </div>
    </SectionWrapper>
  );
}
