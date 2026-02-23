// components/sections/ContactSection.tsx
// Contact section — dark theme, two-column layout (contact details + form).
// Server Component: no 'use client'. ContactForm is 'use client' but can be
// imported and rendered from a Server Component; React handles the client boundary.
//
// Structure:
//   SectionWrapper (dark)
//     └── inner div (relative mx-auto max-w-7xl)
//           ├── GridPattern (dark, absolute full-bleed, needs parent relative)
//           ├── FadeInOnScroll → heading block
//           │     ├── geometric accent (line-diamond-line)
//           │     └── h2 "Contact"
//           └── two-column grid (lg:grid-cols-2)
//                 ├── left — email mailto link + location with SVG pin
//                 └── right — ContactForm (max-w-lg overridden via [&_form]:max-w-none)
//
// Note: SectionWrapper already applies py-[--section-padding-y] and px-[--section-padding-x].
// The inner div only provides relative + max-w-7xl centering — no duplicate padding.
// Per CONTEXT.md: no intro paragraph under heading — the heading and form speak for themselves.

import SectionWrapper from '@/components/ui/SectionWrapper';
import { GridPattern } from '@/components/ui/GridPattern';
import { FadeInOnScroll } from '@/components/ui/FadeInOnScroll';
import { ContactForm } from '@/components/cards/ContactForm';
import { SECTION_IDS, CONTACT } from '@/lib/constants';

export function ContactSection() {
  return (
    <SectionWrapper id={SECTION_IDS.CONTACT} theme="dark">
      {/*
        Inner div: relative provides stacking context for GridPattern absolute positioning.
        max-w-7xl + mx-auto centers content. No padding here — SectionWrapper handles that.
      */}
      <div className="relative mx-auto max-w-7xl">
        {/* Subtle fractal grid texture — dark theme at low opacity */}
        <GridPattern theme="dark" />

        {/* Section heading block — fades in as a unit */}
        <FadeInOnScroll>
          <div className="text-center mb-16">
            {/* Geometric accent — line-diamond-line visual marker above heading */}
            <div className="flex items-center justify-center gap-3 mb-6" aria-hidden="true">
              <span className="block h-px w-8 bg-current opacity-25" />
              <span className="block w-1.5 h-1.5 border border-current opacity-50 rotate-45" />
              <span className="block h-px w-8 bg-current opacity-25" />
            </div>

            <h2 className="font-display text-[length:--text-section] font-bold text-on-surface text-center">
              Contact
            </h2>
            {/* No intro paragraph per CONTEXT.md: "Just the disabled form" */}
          </div>
        </FadeInOnScroll>

        {/* Two-column layout: contact details left, form right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

          {/* Left column — email + location */}
          <div className="flex flex-col gap-8">

            {/* Email block */}
            <div>
              <p className="font-body text-sm text-on-surface-muted uppercase tracking-wider mb-2">
                Email
              </p>
              <a
                href={`mailto:${CONTACT.email}`}
                className="link-underline font-body text-on-surface"
              >
                {CONTACT.email}
              </a>
            </div>

            {/* Location block with geometric SVG pin */}
            <div>
              <p className="font-body text-sm text-on-surface-muted uppercase tracking-wider mb-2">
                Location
              </p>
              <div className="flex items-center gap-2 text-on-surface">
                {/*
                  Hand-crafted geometric map pin — teardrop outer path + filled inner circle.
                  12x16 viewBox, stroke="currentColor" for theme compatibility.
                */}
                <svg
                  width="12"
                  height="16"
                  viewBox="0 0 12 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M6 1 C3.24 1 1 3.24 1 6 C1 9.5 6 15 6 15 C6 15 11 9.5 11 6 C11 3.24 8.76 1 6 1 Z" />
                  <circle cx="6" cy="6" r="1.5" fill="currentColor" stroke="none" />
                </svg>
                <span className="font-body">{CONTACT.location}</span>
              </div>
            </div>
          </div>

          {/* Right column — ContactForm */}
          {/*
            ContactForm renders a React fragment (<><p>...<form>...</>).
            The form element has max-w-lg baked in. The [&_form]:max-w-none descendant
            selector overrides that so the form fills its grid column.
            ContactForm does not accept a className prop, so this wrapper approach is required.
          */}
          <div className="[&_form]:max-w-none">
            <ContactForm />
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
