// components/cards/ServiceCard.tsx
// Service capability card with hand-crafted geometric SVG icon, title, and description.
// Used in the Services section (Phase 5). Wraps in HoverLift internally so consumers
// do not need to add HoverLift themselves.
//
// Note: HERO-03 (animated geometric fractal hero element) is satisfied by
// components/ui/GeometryAccent.tsx — no separate hero card component needed.

'use client';

import React from 'react';
import type { ServiceItem } from '@/lib/types';
import { HoverLift } from '@/components/ui/HoverLift';

// ---------------------------------------------------------------------------
// Geometric SVG icon system — hand-crafted, no lucide-react import.
// All icons share the same viewBox (0 0 24 24) and stroke conventions for
// consistent sizing alongside Lucide if used elsewhere in the project.
// Each icon is purely decorative (aria-hidden="true").
// ---------------------------------------------------------------------------

const IconCpu = (
  <svg
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {/* Outer housing */}
    <rect x="7" y="7" width="10" height="10" />
    {/* Inner processing core */}
    <rect x="9" y="9" width="6" height="6" />
    {/* Pin lines — top side (3 pins) */}
    <line x1="9" y1="7" x2="9" y2="4" />
    <line x1="12" y1="7" x2="12" y2="4" />
    <line x1="15" y1="7" x2="15" y2="4" />
    {/* Pin lines — bottom side (3 pins) */}
    <line x1="9" y1="17" x2="9" y2="20" />
    <line x1="12" y1="17" x2="12" y2="20" />
    <line x1="15" y1="17" x2="15" y2="20" />
    {/* Pin lines — left side (3 pins) */}
    <line x1="7" y1="9" x2="4" y2="9" />
    <line x1="7" y1="12" x2="4" y2="12" />
    <line x1="7" y1="15" x2="4" y2="15" />
    {/* Pin lines — right side (3 pins) */}
    <line x1="17" y1="9" x2="20" y2="9" />
    <line x1="17" y1="12" x2="20" y2="12" />
    <line x1="17" y1="15" x2="20" y2="15" />
  </svg>
);

const IconCloud = (
  <svg
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
  </svg>
);

const IconCode = (
  <svg
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {/* Right bracket: > */}
    <polyline points="16 18 22 12 16 6" />
    {/* Left bracket: < */}
    <polyline points="8 6 2 12 8 18" />
  </svg>
);

const IconDatabase = (
  <svg
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {/* Top ellipse — database lid */}
    <ellipse cx="12" cy="5" rx="9" ry="3" />
    {/* Mid arc — middle platter seam */}
    <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
    {/* Side walls with bottom arc */}
    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
  </svg>
);

const IconShield = (
  <svg
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

// Keyed by the iconName values used in lib/constants.ts SERVICES array.
const ICON_MAP: Record<string, React.ReactNode> = {
  cpu:      IconCpu,
  cloud:    IconCloud,
  code:     IconCode,
  database: IconDatabase,
  shield:   IconShield,
};

// ---------------------------------------------------------------------------
// ServiceCard — atom for the Services section
// ---------------------------------------------------------------------------

interface ServiceCardProps {
  item: ServiceItem;
  className?: string; // passed to HoverLift wrapper
}

export function ServiceCard({ item, className }: ServiceCardProps) {
  const icon = item.iconName ? (ICON_MAP[item.iconName] ?? null) : null;

  return (
    <HoverLift className={className}>
      <div className="p-[--card-padding] flex flex-col gap-4 border border-on-surface-light-subtle/20 h-full">
        {icon && (
          <div className="text-on-surface-light-subtle" aria-hidden="true">
            {icon}
          </div>
        )}
        <h3 className="font-display text-lg font-semibold text-on-surface-light">
          {item.title}
        </h3>
        <p className="font-body text-sm text-on-surface-light-muted leading-relaxed">
          {item.description}
        </p>
      </div>
    </HoverLift>
  );
}
