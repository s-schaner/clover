// components/sections/ServicesSection.tsx
// Services section — light theme, full 5-capability grid with diagonal stagger animation.
// Server Component: no 'use client'. Animation is handled by FadeInOnScroll (client boundary),
// StaggerItem (client boundary), and ServiceCard/HoverLift (client boundary) internally.
//
// Structure:
//   SectionWrapper (light)
//     └── inner div (relative mx-auto max-w-7xl)
//           ├── GridPattern (light, absolute full-bleed, needs parent relative)
//           ├── FadeInOnScroll → heading block
//           │     ├── geometric accent (line-diamond-line)
//           │     ├── h2 "Services"
//           │     └── p intro copy
//           └── StaggerChildren (grid)
//                 └── map SERVICES → StaggerItem → ServiceCard
//
// Note: SectionWrapper already applies py-[--section-padding-y] and px-[--section-padding-x].
// The inner div only provides relative + max-w-7xl centering — no duplicate padding.

import SectionWrapper from '@/components/ui/SectionWrapper';
import { GridPattern } from '@/components/ui/GridPattern';
import { FadeInOnScroll } from '@/components/ui/FadeInOnScroll';
import { StaggerChildren, StaggerItem } from '@/components/ui/StaggerChildren';
import { ServiceCard } from '@/components/cards/ServiceCard';
import { SECTION_IDS, SERVICES } from '@/lib/constants';

export function ServicesSection() {
  return (
    <SectionWrapper id={SECTION_IDS.SERVICES} theme="light">
      {/*
        Inner div: relative provides stacking context for GridPattern absolute positioning.
        max-w-7xl + mx-auto centers content. No padding here — SectionWrapper handles that.
      */}
      <div className="relative mx-auto max-w-7xl">
        {/* Subtle fractal grid texture — light theme at low opacity */}
        <GridPattern theme="light" />

        {/* Section heading block — fades in as a unit */}
        <FadeInOnScroll>
          <div className="mb-16">
            {/* Geometric accent — line-diamond-line visual marker above heading */}
            <div className="flex items-center justify-center gap-3 mb-6" aria-hidden="true">
              <span className="block h-px w-8 bg-current opacity-25" />
              <span className="block w-1.5 h-1.5 border border-current opacity-50 rotate-45" />
              <span className="block h-px w-8 bg-current opacity-25" />
            </div>

            <h2 className="font-display text-[length:--text-section] font-bold text-on-surface-light text-center">
              Services
            </h2>

            <p className="font-body text-on-surface-light-muted mt-4 max-w-2xl mx-auto text-center text-base">
              We architect and deliver at the intersection of infrastructure, AI, and custom
              software — engineered for production, not proof-of-concept.
            </p>
          </div>
        </FadeInOnScroll>

        {/* Card grid — all 5 services with diagonal stagger cascade */}
        <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[--gap-grid]">
          {SERVICES.map((service, i) => (
            <StaggerItem key={service.id} index={i} columns={3}>
              {/*
                h-full on ServiceCard for equal-height cards in the grid.
                HoverLift is built into ServiceCard — do NOT wrap in HoverLift again.
              */}
              <ServiceCard item={service} className="h-full" />
            </StaggerItem>
          ))}
        </StaggerChildren>
      </div>
    </SectionWrapper>
  );
}
