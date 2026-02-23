// components/cards/PortfolioCard.tsx
// Portfolio project card with full project anatomy and category filter readiness.
// Used in the Portfolio section (Phase 5). Each card renders the complete project
// anatomy — project type badge, title, outcome metric, and tech tags — all driven
// by typed PortfolioItem props.
//
// Filter readiness: The article element exposes `data-category` so Phase 5 can
// implement category filtering via CSS/JS attribute selectors without modifying
// this component.
//
// Dark theme: Portfolio section is dark-themed — uses on-surface* tokens (not
// on-surface-light*). No border-radius — sharp corners per design system.

'use client';

import React from 'react';
import type { PortfolioItem } from '@/lib/types';
import { HoverLift } from '@/components/ui/HoverLift';

// ---------------------------------------------------------------------------
// PortfolioCard — atom for the Portfolio section
// ---------------------------------------------------------------------------

interface PortfolioCardProps {
  item: PortfolioItem;
  className?: string; // passed to HoverLift wrapper so parent can add h-full for equal-height grids
}

export function PortfolioCard({ item, className }: PortfolioCardProps) {
  return (
    <HoverLift className={className}>
      {/*
        article: semantic — each card is a self-contained piece of content.
        data-category: raw category string (e.g. "AI/ML") — Phase 5 uses
        this for category filtering without modifying PortfolioCard.
        h-full + flex flex-col: ensures cards stretch to equal height in a grid,
        with mt-auto on the tags row pushing tags to the bottom.
      */}
      <article
        data-category={item.category}
        className="p-[--card-padding] border border-on-surface-subtle/20 bg-surface-raised h-full flex flex-col"
      >
        {/* 1. Project type badge — uppercase label at top */}
        <p className="text-xs font-body text-on-surface-muted uppercase tracking-wider mb-3">
          {item.projectType}
        </p>

        {/* 2. Title */}
        <h3 className="font-display text-base font-semibold mb-2 text-on-surface">
          {item.title}
        </h3>

        {/* 3. Outcome metric — only rendered when present */}
        {item.outcomeMetric && (
          <p className="font-body text-sm text-on-surface-muted mb-4 italic">
            {item.outcomeMetric}
          </p>
        )}

        {/* 4. Tech tags — JetBrains Mono font, border pill styling, pushed to bottom */}
        <div className="flex flex-wrap gap-2 mt-auto">
          {item.tags.map((tag) => (
            <span
              key={tag.label}
              className="text-xs font-mono text-on-surface-subtle border border-on-surface-subtle/30 px-2 py-0.5"
            >
              {tag.label}
            </span>
          ))}
        </div>
      </article>
    </HoverLift>
  );
}
