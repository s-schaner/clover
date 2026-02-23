// app/page.tsx
// Single-page layout — renders all 5 content sections as DOM scroll targets.
// Each section uses SectionWrapper for anchor ID, scroll-margin-top, and theme.
// Placeholder headings fill viewport height for scroll-spy observability (Phase 2-02).

import SectionWrapper from '@/components/ui/SectionWrapper';
import { SECTIONS, SECTION_IDS } from '@/lib/constants';

export default function Home() {
  return (
    <main>
      {SECTIONS.map((section) => (
        <SectionWrapper
          key={section.id}
          id={section.id}
          theme={section.theme}
          className={section.id === SECTION_IDS.HERO ? 'min-h-screen' : undefined}
        >
          <div className="min-h-screen flex items-center justify-center">
            <h2 className="font-display text-4xl font-bold">{section.label}</h2>
          </div>
        </SectionWrapper>
      ))}
    </main>
  );
}
