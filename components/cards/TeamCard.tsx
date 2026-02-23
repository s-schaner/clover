// components/cards/TeamCard.tsx
// Team profile card with SVG monogram avatar, clover accent, name, role, and social links.
// Used in the Team section (Phase 5). The large monogram avatar is the visual hero of
// each card — it dominates the top portion with each member's two-character initials
// (MW, MD, PK, SS) so no two avatars look identical.
//
// Avatar structure:
//   - Blueprint-style rect frame (engineering aesthetic)
//   - Two-character initials in Space Grotesk, bold, large presence
//   - CloverAccentMini: four-petal clover bezier in top-right quadrant
//
// Card chrome: Light theme (Team section is light), sharp corners, border-only separation.
// Social links: Inline SVG icons, monochrome, opacity hover.

'use client';

import React from 'react';
import type { TeamMember, SocialLink } from '@/lib/types';
import { HoverLift } from '@/components/ui/HoverLift';

// ---------------------------------------------------------------------------
// CloverAccentMini — simplified four-petal clover bezier (no veins, no frame)
// Shares the same cubic bezier petal shape as GeometryAccent's generateCloverPath().
// ---------------------------------------------------------------------------

interface CloverAccentMiniProps {
  cx: number;
  cy: number;
  size?: number;
}

function CloverAccentMini({ cx, cy, size = 10 }: CloverAccentMiniProps) {
  const h = size / 2;

  // Four petals using cubic bezier curves — same control-point pattern as
  // GeometryAccent's generateCloverPath(). Each petal goes from center,
  // bulges out to tip, and curves back to center.
  const d = [
    // Start at center
    `M ${cx} ${cy}`,
    // Right petal (3 o'clock)
    `C ${cx + h * 0.6} ${cy - h * 0.75}, ${cx + size} ${cy - h * 0.4}, ${cx + size} ${cy}`,
    `C ${cx + size} ${cy + h * 0.4}, ${cx + h * 0.6} ${cy + h * 0.75}, ${cx} ${cy}`,
    // Top petal (12 o'clock)
    `C ${cx - h * 0.75} ${cy - h * 0.6}, ${cx - h * 0.4} ${cy - size}, ${cx} ${cy - size}`,
    `C ${cx + h * 0.4} ${cy - size}, ${cx + h * 0.75} ${cy - h * 0.6}, ${cx} ${cy}`,
    // Left petal (9 o'clock)
    `C ${cx - h * 0.6} ${cy - h * 0.75}, ${cx - size} ${cy - h * 0.4}, ${cx - size} ${cy}`,
    `C ${cx - size} ${cy + h * 0.4}, ${cx - h * 0.6} ${cy + h * 0.75}, ${cx} ${cy}`,
    // Bottom petal (6 o'clock)
    `C ${cx + h * 0.75} ${cy + h * 0.6}, ${cx + h * 0.4} ${cy + size}, ${cx} ${cy + size}`,
    `C ${cx - h * 0.4} ${cy + size}, ${cx - h * 0.75} ${cy + h * 0.6}, ${cx} ${cy}`,
  ].join(' ');

  return (
    <path
      d={d}
      fill="none"
      stroke="currentColor"
      strokeWidth="0.8"
    />
  );
}

// ---------------------------------------------------------------------------
// MonogramAvatar — SVG identity mark with initials and clover accent
// ---------------------------------------------------------------------------

interface MonogramAvatarProps {
  initials: string;
}

function MonogramAvatar({ initials }: MonogramAvatarProps) {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      stroke="currentColor"
      className="w-full h-full"
      aria-hidden="true"
    >
      {/* Engineering blueprint outer frame — subtle container */}
      <rect
        x="4"
        y="4"
        width="112"
        height="112"
        strokeWidth="0.5"
        opacity="0.3"
      />

      {/* Two-character initials — centered in viewBox */}
      <text
        x="55"
        y="62"
        dominantBaseline="middle"
        textAnchor="middle"
        fontFamily="'Space Grotesk', sans-serif"
        fontSize="36"
        fontWeight="700"
        stroke="none"
        fill="currentColor"
        letterSpacing="-1"
      >
        {initials}
      </text>

      {/* CloverAccentMini — top-right of letter cluster */}
      <CloverAccentMini cx={88} cy={28} size={10} />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Social link icons — hand-crafted geometric SVGs (16x16 viewport, 24x24 coord)
// ---------------------------------------------------------------------------

function LinkedInIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" />
      <line x1="8" y1="11" x2="8" y2="17" />
      <line x1="8" y1="7" x2="8" y2="8" />
      <path d="M12 17v-4c0-1.5 1-2 2-2s2 .5 2 2v4" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
    </svg>
  );
}

function SocialIcon({ platform }: { platform: SocialLink['platform'] }) {
  switch (platform) {
    case 'linkedin':
      return <LinkedInIcon />;
    case 'github':
      return <GitHubIcon />;
    case 'twitter':
      // Geometric X mark for Twitter/X
      return (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden="true"
        >
          <line x1="5" y1="5" x2="19" y2="19" />
          <line x1="19" y1="5" x2="5" y2="19" />
        </svg>
      );
    default:
      return null;
  }
}

// ---------------------------------------------------------------------------
// TeamCard — exported atom for the Team section
// ---------------------------------------------------------------------------

interface TeamCardProps {
  member: TeamMember;
  className?: string; // passed to HoverLift wrapper
}

export function TeamCard({ member, className }: TeamCardProps) {
  return (
    <HoverLift className={className}>
      {/*
        flex flex-col: avatar area on top, text content below.
        border: provides separation without a raised surface background.
        No border-radius: sharp corners per design system.
      */}
      <div className="flex flex-col border border-on-surface-light-subtle/20 h-full">

        {/* Avatar area — fills top ~60% of card, avatar bleeds to edges (no padding) */}
        <div className="aspect-square max-h-48 flex-shrink-0 text-on-surface-light">
          <MonogramAvatar initials={member.initials} />
        </div>

        {/* Text content below avatar */}
        <div className="p-[--card-padding] flex flex-col gap-1 flex-1">
          {/* Name */}
          <h3 className="font-display text-base font-semibold text-on-surface-light">
            {member.name}
          </h3>

          {/*
            Role + social links on same line — inline integration per CONTEXT.md.
            Role text takes available space; icons sit at the end.
          */}
          <div className="flex items-center justify-between gap-2">
            <p className="font-body text-sm text-on-surface-light-muted">
              {member.role}
            </p>

            {/* Social link icons — small, monochrome, inline */}
            {member.socialLinks.length > 0 && (
              <div className="flex items-center gap-2 flex-shrink-0">
                {member.socialLinks.map((link) => (
                  <a
                    key={link.platform}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${member.name} on ${link.platform}`}
                    className="text-on-surface-light opacity-60 hover:opacity-100 transition-opacity"
                  >
                    <SocialIcon platform={link.platform} />
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </HoverLift>
  );
}
