// components/sections/TeamSection.tsx
// Team section — light theme, 4-member founder grid with geometric monogram avatars.
// Server Component: no 'use client'. Animation handled by FadeInOnScroll (client boundary),
// StaggerItem (client boundary), and TeamCard/HoverLift (client boundary) internally.
//
// Structure:
//   SectionWrapper (light)
//     └── inner div (relative mx-auto max-w-7xl)
//           ├── GridPattern (light, absolute full-bleed, needs parent relative)
//           ├── FadeInOnScroll → heading block
//           │     ├── geometric accent (line-diamond-line)
//           │     ├── h2 "Team"
//           │     └── p intro copy
//           └── StaggerChildren (4-column grid)
//                 └── map TEAM_MEMBERS → StaggerItem (columns=4) → TeamCard
//
// Note: SectionWrapper already applies py-[--section-padding-y] and px-[--section-padding-x].
// The inner div only provides relative + max-w-7xl centering — no duplicate padding.

import SectionWrapper from '@/components/ui/SectionWrapper';
import { GridPattern } from '@/components/ui/GridPattern';
import { FadeInOnScroll } from '@/components/ui/FadeInOnScroll';
import { StaggerChildren, StaggerItem } from '@/components/ui/StaggerChildren';
import { TeamCard } from '@/components/cards/TeamCard';
import { SECTION_IDS, TEAM_MEMBERS } from '@/lib/constants';

export function TeamSection() {
  return (
    <SectionWrapper id={SECTION_IDS.TEAM} theme="light">
      {/*
        Inner div: relative provides stacking context for GridPattern absolute positioning.
        max-w-7xl + mx-auto centers content. No padding here — SectionWrapper handles that.
      */}
      <div className="relative mx-auto max-w-7xl">
        {/* Subtle fractal grid texture — light theme at low opacity */}
        <GridPattern theme="light" />

        {/* Section heading block — fades in as a unit */}
        <FadeInOnScroll>
          <div className="text-center mb-16">
            {/* Geometric accent — line-diamond-line visual marker above heading */}
            <div className="flex items-center justify-center gap-3 mb-6" aria-hidden="true">
              <span className="block h-px w-8 bg-current opacity-25" />
              <span className="block w-1.5 h-1.5 border border-current opacity-50 rotate-45" />
              <span className="block h-px w-8 bg-current opacity-25" />
            </div>

            <h2 className="font-display text-[length:--text-section] font-bold text-on-surface-light text-center">
              Team
            </h2>

            <p className="font-body text-on-surface-light-muted mt-4 max-w-2xl mx-auto text-center text-base">
              Four engineers with deep expertise across AI systems, cloud infrastructure, and custom software development.
            </p>
          </div>
        </FadeInOnScroll>

        {/*
          Card grid — all 4 team members with diagonal stagger cascade.
          4 columns on lg (one per member), 2 on sm, 1 on mobile.
          columns={4} in StaggerItem drives the diagonal delay computation.
          TeamCard has HoverLift built in — do NOT wrap in HoverLift.
          h-full on TeamCard for equal-height cards in the grid.
        */}
        <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[--gap-grid]">
          {TEAM_MEMBERS.map((member, i) => (
            <StaggerItem key={member.id} index={i} columns={4}>
              <TeamCard member={member} className="h-full" />
            </StaggerItem>
          ))}
        </StaggerChildren>
      </div>
    </SectionWrapper>
  );
}
