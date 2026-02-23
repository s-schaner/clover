// app/page.tsx
// Production page composition — imports 5 section components built in Phase 5.
// Dark/light alternation: Hero (dark) -> Services (light) -> Portfolio (dark) -> Team (light) -> Contact (dark)
// FractalSideRails: decorative geometric lines along left/right edges, scroll-animated.

import { HeroSection } from '@/components/sections/HeroSection';
import { ServicesSection } from '@/components/sections/ServicesSection';
import { PortfolioSection } from '@/components/sections/PortfolioSection';
import { TeamSection } from '@/components/sections/TeamSection';
import { ContactSection } from '@/components/sections/ContactSection';
import { FractalSideRails } from '@/components/ui/FractalSideRails';

export default function Home() {
  return (
    <div className="relative">
      <FractalSideRails />
      <HeroSection />
      <ServicesSection />
      <PortfolioSection />
      <TeamSection />
      <ContactSection />
    </div>
  );
}
