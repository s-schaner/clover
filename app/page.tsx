// app/page.tsx
// Production page composition — imports 5 section components built in Phase 5.
// Dark/light alternation: Hero (dark) -> Services (light) -> Portfolio (dark) -> Team (light) -> Contact (dark)

import { HeroSection } from '@/components/sections/HeroSection';
import { ServicesSection } from '@/components/sections/ServicesSection';
import { PortfolioSection } from '@/components/sections/PortfolioSection';
import { TeamSection } from '@/components/sections/TeamSection';
import { ContactSection } from '@/components/sections/ContactSection';

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
