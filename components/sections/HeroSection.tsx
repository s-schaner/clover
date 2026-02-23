// components/sections/HeroSection.tsx
// Full-viewport hero section — first thing visitors see.
// Server Component: no 'use client'. Animation is handled by FadeInOnScroll (client boundary)
// and GeometryAccent (client boundary) internally — this file itself is a Server Component.
//
// Structure:
//   SectionWrapper (dark, min-h-[100dvh])
//     └── inner div (relative, min-h-[100dvh] flex centered)
//           ├── GeometryAccent (absolute full-bleed background, needs parent relative)
//           └── content div (relative z-10 max-w-4xl centered text)
//                 ├── FadeInOnScroll (delay 0.1) → h1 tagline
//                 ├── FadeInOnScroll (delay 0.25) → p subheading
//                 └── FadeInOnScroll (delay 0.4) → a CTA link

import SectionWrapper from '@/components/ui/SectionWrapper';
import { GeometryAccent } from '@/components/ui/GeometryAccent';
import { FadeInOnScroll } from '@/components/ui/FadeInOnScroll';
import { SECTION_IDS, HERO_CONTENT } from '@/lib/constants';

export function HeroSection() {
  return (
    <SectionWrapper id={SECTION_IDS.HERO} theme="dark" className="min-h-[100dvh]">
      {/*
        Inner div retains px-[--section-padding-x] because hero does NOT use max-w-7xl.
        It needs horizontal padding for its centered flex layout.
        The parent SectionWrapper already applies py padding — so we only add px here.
        The `relative` class is required so GeometryAccent's `absolute inset-0` is contained.
        min-h-[100dvh] accounts for mobile browser chrome (URL bar / navigation UI).
      */}
      <div className="relative min-h-[100dvh] flex items-center justify-center px-[--section-padding-x]">
        {/* Four-leaf clover draw animation — brand visual, full-bleed behind text */}
        <GeometryAccent />

        {/* Text content — sits above the pattern via z-10 */}
        <div className="relative z-10 max-w-4xl text-center">
          <FadeInOnScroll delay={0.1}>
            <h1 className="font-display text-[length:--text-hero] leading-tight font-bold">
              {HERO_CONTENT.tagline}
            </h1>
          </FadeInOnScroll>

          <FadeInOnScroll delay={0.25}>
            <p className="font-body text-on-surface-muted mt-6 text-lg max-w-2xl mx-auto">
              {HERO_CONTENT.subheading}
            </p>
          </FadeInOnScroll>

          <FadeInOnScroll delay={0.4}>
            {/*
              CTA is a text link (link-underline class), NOT a button.
              The tagline is the visual star — this is deliberately understated.
            */}
            <a
              href={HERO_CONTENT.ctaHref}
              className="link-underline font-body text-on-surface mt-8 inline-block text-sm tracking-widest uppercase"
            >
              {HERO_CONTENT.ctaLabel}
            </a>
          </FadeInOnScroll>
        </div>
      </div>
    </SectionWrapper>
  );
}
