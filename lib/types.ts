// lib/types.ts
// Data shape contracts for all phases. Created in Phase 1, consumed by Phases 2-6.
// DO NOT add phase-specific logic here — only interface definitions.

// -------------------------
// Navigation (Phase 2)
// -------------------------

export interface NavLink {
  label: string;
  href: string;       // '#section-id' for single-page, '/route' when split
  sectionId: string;  // anchor ID without '#', used for scroll-spy matching
}

// -------------------------
// Services Section (Phase 4-5)
// -------------------------

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  iconName?: string;  // lucide-react icon name, optional
}

// -------------------------
// Portfolio Section (Phase 4-5)
// -------------------------

export type PortfolioCategory =
  | 'AI/ML'
  | 'Cloud Infrastructure'
  | 'Custom Software'
  | 'Data Engineering'
  | 'Security';

export interface TechTag {
  label: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  projectType: string;
  category: PortfolioCategory;
  outcomeMetric?: string;
  tags: TechTag[];
  status: 'placeholder';
}

// -------------------------
// Team Section (Phase 4-5)
// -------------------------

export interface SocialLink {
  platform: 'linkedin' | 'github' | 'twitter';
  href: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio?: string;
  initials: string;
  socialLinks: SocialLink[];
}

// -------------------------
// Contact Section (Phase 5)
// -------------------------

export interface ContactInfo {
  email: string;
  location: string;
  locationShort: string;
}

// -------------------------
// Section Configuration (Phase 2, 5)
// -------------------------

export interface SectionConfig {
  id: string;
  label: string;
  theme: 'dark' | 'light';
}

// -------------------------
// Design System Metadata (Phase 1, 3)
// -------------------------

export interface PatternConfig {
  opacityDark: number;
  opacityLight: number;
  sizePx: number;
}
