// app/page.tsx
// Phase 3 visual primitive validation — all 5 sections with GridPattern overlays,
// GeometryAccent hero draw, FadeInOnScroll wrappers, StaggerChildren diagonal cascade,
// HoverLift card scale, and link-underline CSS utility.
//
// Dark/light alternation: Hero (dark) → Services (light) → Portfolio (dark) → Team (light) → Contact (dark)
// This page is a Phase 3 validation surface; real section content is built in Phase 5.

import SectionWrapper from '@/components/ui/SectionWrapper';
import { GridPattern } from '@/components/ui/GridPattern';
import { GeometryAccent } from '@/components/ui/GeometryAccent';
import { FadeInOnScroll } from '@/components/ui/FadeInOnScroll';
import { StaggerChildren, StaggerItem } from '@/components/ui/StaggerChildren';
import { HoverLift } from '@/components/ui/HoverLift';
import { SECTION_IDS, HERO_CONTENT, SERVICES, PORTFOLIO_ITEMS } from '@/lib/constants';

// ---------------------------------------------------------------------------
// Hero Section — dark
// GeometryAccent draws the fractal grid on load. FadeInOnScroll on copy.
// ---------------------------------------------------------------------------

function HeroSection() {
  return (
    <SectionWrapper id={SECTION_IDS.HERO} theme="dark" className="min-h-screen">
      <div className="relative min-h-screen flex items-center justify-center px-[--section-padding-x]">
        <GeometryAccent />
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

// ---------------------------------------------------------------------------
// Services Section — light
// GridPattern corner-br texture. FadeInOnScroll on heading. HoverLift on service cards.
// ---------------------------------------------------------------------------

function ServicesSection() {
  return (
    <SectionWrapper id={SECTION_IDS.SERVICES} theme="light">
      <div className="relative mx-auto max-w-7xl px-[--section-padding-x] py-[--section-padding-y]">
        <GridPattern theme="light" />
        <FadeInOnScroll>
          <h2 className="font-display text-[length:--text-section] font-bold mb-4">
            Services
          </h2>
          <p className="font-body text-on-surface-light-muted max-w-2xl mb-12">
            Placeholder content for services section. Real descriptions come from{' '}
            <span className="link-underline">lib/constants.ts</span> in Phase 5.
          </p>
        </FadeInOnScroll>

        {/* HoverLift validation — service cards with scale micro-interaction */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.slice(0, 3).map((service) => (
            <HoverLift key={service.id} className="cursor-pointer">
              <div className="p-6 border border-on-surface-light-subtle/20 bg-surface-light-raised rounded-sm">
                <h3 className="font-display text-lg font-semibold mb-2 text-on-surface-light">
                  {service.title}
                </h3>
                <p className="font-body text-sm text-on-surface-light-muted leading-relaxed">
                  {service.description}
                </p>
              </div>
            </HoverLift>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}

// ---------------------------------------------------------------------------
// Portfolio Section — dark
// GridPattern corner-br texture. StaggerChildren diagonal cascade on portfolio cards.
// ---------------------------------------------------------------------------

function PortfolioSection() {
  return (
    <SectionWrapper id={SECTION_IDS.PORTFOLIO} theme="dark">
      <div className="relative mx-auto max-w-7xl px-[--section-padding-x] py-[--section-padding-y]">
        <GridPattern theme="dark" />
        <FadeInOnScroll>
          <h2 className="font-display text-[length:--text-section] font-bold mb-4">
            Portfolio
          </h2>
          <p className="font-body text-on-surface-muted max-w-2xl mb-12">
            Placeholder content for portfolio section. Real case studies added in Phase 5.
          </p>
        </FadeInOnScroll>

        {/* StaggerChildren — diagonal cascade from top-left, 3-column grid */}
        <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PORTFOLIO_ITEMS.map((item, i) => (
            <StaggerItem key={item.id} index={i} columns={3}>
              <HoverLift className="cursor-pointer h-full">
                <div className="p-6 border border-on-surface-subtle/20 bg-surface-raised h-full">
                  <div className="text-xs font-body text-on-surface-muted uppercase tracking-wider mb-3">
                    {item.category}
                  </div>
                  <h3 className="font-display text-base font-semibold mb-2 text-on-surface">
                    {item.title}
                  </h3>
                  <p className="font-body text-sm text-on-surface-muted mb-4">
                    {item.projectType} — placeholder outcome metric
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <span
                        key={tag.label}
                        className="text-xs font-mono text-on-surface-subtle border border-on-surface-subtle/30 px-2 py-0.5"
                      >
                        {tag.label}
                      </span>
                    ))}
                  </div>
                </div>
              </HoverLift>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </div>
    </SectionWrapper>
  );
}

// ---------------------------------------------------------------------------
// Team Section — light
// GridPattern corner-br texture. FadeInOnScroll on content.
// ---------------------------------------------------------------------------

function TeamSection() {
  return (
    <SectionWrapper id={SECTION_IDS.TEAM} theme="light">
      <div className="relative mx-auto max-w-7xl px-[--section-padding-x] py-[--section-padding-y]">
        <GridPattern theme="light" />
        <FadeInOnScroll>
          <h2 className="font-display text-[length:--text-section] font-bold mb-4">
            Team
          </h2>
          <p className="font-body text-on-surface-light-muted max-w-2xl">
            Placeholder content for team section. Real bios and portraits added in Phase 5.
          </p>
        </FadeInOnScroll>
      </div>
    </SectionWrapper>
  );
}

// ---------------------------------------------------------------------------
// Contact Section — dark
// GridPattern corner-br texture. FadeInOnScroll on content. link-underline on email.
// ---------------------------------------------------------------------------

function ContactSection() {
  return (
    <SectionWrapper id={SECTION_IDS.CONTACT} theme="dark">
      <div className="relative mx-auto max-w-7xl px-[--section-padding-x] py-[--section-padding-y]">
        <GridPattern theme="dark" />
        <FadeInOnScroll>
          <h2 className="font-display text-[length:--text-section] font-bold mb-4">
            Contact
          </h2>
          <p className="font-body text-on-surface-muted max-w-2xl mb-6">
            Placeholder content for contact section. Real form and contact details added in Phase 5.
          </p>
          <a
            href="mailto:hello@cloverlabs.io"
            className="link-underline font-body text-on-surface text-lg"
          >
            hello@cloverlabs.io
          </a>
        </FadeInOnScroll>
      </div>
    </SectionWrapper>
  );
}

// ---------------------------------------------------------------------------
// Page root — renders all 5 sections in order
// Dark / Light / Dark / Light / Dark alternation
// ---------------------------------------------------------------------------

export default function Home() {
  return (
    <>
      <HeroSection />
      <ServicesSection />
      <PortfolioSection />
      <TeamSection />
      <ContactSection />
    </>
  );
}
