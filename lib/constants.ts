// lib/constants.ts
// Single source of truth for all static content. Created in Phase 1.
// Components import from here — never hardcode content in JSX.

import type {
  NavLink,
  ServiceItem,
  PortfolioItem,
  PortfolioCategory,
  TeamMember,
  ContactInfo,
  SectionConfig,
  PatternConfig,
} from './types';

// -------------------------
// Navigation
// -------------------------

export const SECTION_IDS = {
  HERO:      'hero',
  SERVICES:  'services',
  PORTFOLIO: 'portfolio',
  TEAM:      'team',
  CONTACT:   'contact',
} as const;

export const NAV_LINKS: NavLink[] = [
  { label: 'Services',  href: `#${SECTION_IDS.SERVICES}`,  sectionId: SECTION_IDS.SERVICES },
  { label: 'Portfolio', href: `#${SECTION_IDS.PORTFOLIO}`, sectionId: SECTION_IDS.PORTFOLIO },
  { label: 'Team',      href: `#${SECTION_IDS.TEAM}`,      sectionId: SECTION_IDS.TEAM },
  { label: 'Contact',   href: `#${SECTION_IDS.CONTACT}`,   sectionId: SECTION_IDS.CONTACT },
];

// -------------------------
// Section Metadata
// -------------------------

export const SECTIONS: SectionConfig[] = [
  { id: SECTION_IDS.HERO,      label: 'Hero',      theme: 'dark' },
  { id: SECTION_IDS.SERVICES,  label: 'Services',  theme: 'light' },
  { id: SECTION_IDS.PORTFOLIO, label: 'Portfolio', theme: 'dark' },
  { id: SECTION_IDS.TEAM,      label: 'Team',      theme: 'light' },
  { id: SECTION_IDS.CONTACT,   label: 'Contact',   theme: 'dark' },
];

// -------------------------
// Hero
// -------------------------

export const HERO_CONTENT = {
  tagline: 'We build the systems other firms call impossible.',
  subheading: 'Clover Labs is a technology consultancy that solves hard infrastructure, AI, and software problems for clients who cannot afford failure.',
  ctaLabel: 'See our work',
  ctaHref: `#${SECTION_IDS.PORTFOLIO}`,
} as const;

// -------------------------
// Services
// -------------------------

export const SERVICES: ServiceItem[] = [
  {
    id: 'ai-ml',
    title: 'AI & Machine Learning',
    description: 'Production ML systems, LLM integration, and custom model development for real-world constraints — latency, cost, and accuracy at scale.',
    iconName: 'cpu',
  },
  {
    id: 'cloud-infrastructure',
    title: 'Cloud Infrastructure',
    description: 'Kubernetes, Terraform, and cloud-native architecture for organizations that need reliability, not just availability.',
    iconName: 'cloud',
  },
  {
    id: 'custom-software',
    title: 'Custom Software Engineering',
    description: 'Full-stack systems designed from the data model outward. We build the thing correctly, not the thing quickly.',
    iconName: 'code',
  },
  {
    id: 'data-engineering',
    title: 'Data Engineering',
    description: 'Data pipelines, warehousing, and observability for teams whose business decisions depend on accurate, timely data.',
    iconName: 'database',
  },
  {
    id: 'security',
    title: 'Security Engineering',
    description: 'Threat modeling, secure architecture review, and security implementation for high-value systems.',
    iconName: 'shield',
  },
];

// -------------------------
// Portfolio
// -------------------------

export const PORTFOLIO_CATEGORIES: PortfolioCategory[] = [
  'AI/ML',
  'Cloud Infrastructure',
  'Custom Software',
  'Data Engineering',
  'Security',
];

export const PORTFOLIO_ITEMS: PortfolioItem[] = [
  {
    id: 'port-001',
    title: 'Real-Time Inference Pipeline',
    projectType: 'ML Infrastructure',
    category: 'AI/ML',
    outcomeMetric: 'Placeholder — outcome metric here',
    tags: [{ label: 'PyTorch' }, { label: 'Kubernetes' }, { label: 'gRPC' }],
    status: 'placeholder',
  },
  {
    id: 'port-002',
    title: 'Multi-Region Platform Migration',
    projectType: 'Cloud Architecture',
    category: 'Cloud Infrastructure',
    outcomeMetric: 'Placeholder — outcome metric here',
    tags: [{ label: 'Terraform' }, { label: 'AWS' }, { label: 'Kubernetes' }],
    status: 'placeholder',
  },
  {
    id: 'port-003',
    title: 'Document Intelligence System',
    projectType: 'Custom Software',
    category: 'Custom Software',
    outcomeMetric: 'Placeholder — outcome metric here',
    tags: [{ label: 'Next.js' }, { label: 'PostgreSQL' }, { label: 'LLM' }],
    status: 'placeholder',
  },
  {
    id: 'port-004',
    title: 'Event-Driven Data Platform',
    projectType: 'Data Engineering',
    category: 'Data Engineering',
    outcomeMetric: 'Placeholder — outcome metric here',
    tags: [{ label: 'Kafka' }, { label: 'dbt' }, { label: 'Snowflake' }],
    status: 'placeholder',
  },
];

// -------------------------
// Team (real names from day one)
// -------------------------

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'mike-wong',
    name: 'Mike Wong',
    role: 'Co-Founder & Principal Engineer',  // placeholder title — confirm
    initials: 'MW',
    socialLinks: [
      { platform: 'linkedin', href: '#' },
      { platform: 'github',   href: '#' },
    ],
  },
  {
    id: 'matt-drapp',
    name: 'Matt Drapp',
    role: 'Co-Founder & Principal Engineer',  // placeholder title — confirm
    initials: 'MD',
    socialLinks: [
      { platform: 'linkedin', href: '#' },
      { platform: 'github',   href: '#' },
    ],
  },
  {
    id: 'peter-kwon',
    name: 'Peter Kwon',
    role: 'Co-Founder & Principal Engineer',  // placeholder title — confirm
    initials: 'PK',
    socialLinks: [
      { platform: 'linkedin', href: '#' },
      { platform: 'github',   href: '#' },
    ],
  },
  {
    id: 'stefan-schaner',
    name: 'Stefan Schaner',
    role: 'Co-Founder & Principal Engineer',  // placeholder title — confirm
    initials: 'SS',
    socialLinks: [
      { platform: 'linkedin', href: '#' },
      { platform: 'github',   href: '#' },
    ],
  },
];

// -------------------------
// Contact
// -------------------------

export const CONTACT: ContactInfo = {
  email: 'hello@cloverlabs.io',      // placeholder — confirm real email
  location: 'Ashburn, Virginia',
  locationShort: 'Ashburn, VA',
};

// -------------------------
// Design System Constants
// -------------------------

export const PATTERN_CONFIG: PatternConfig = {
  opacityDark: 0.06,
  opacityLight: 0.04,
  sizePx: 40,
};

export const NAV_HEIGHT_PX = 80;

export const COMPANY = {
  name: 'Clover Labs',
  fullName: 'Clover Labs LLC',
  tagline: 'We build the systems other firms call impossible.',
} as const;
