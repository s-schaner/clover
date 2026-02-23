// components/ui/SectionWrapper.tsx
// Reusable Server Component — foundational layout primitive for every content section.
// Provides: anchor ID for nav scroll, scroll-margin-top offset for sticky header,
// dark/light theme class, and consistent vertical/horizontal padding.

import React from 'react';

interface SectionWrapperProps {
  id: string;
  theme?: 'dark' | 'light';
  className?: string;
  children: React.ReactNode;
}

export default function SectionWrapper({
  id,
  theme = 'dark',
  className,
  children,
}: SectionWrapperProps) {
  const themeClass = theme === 'light' ? 'section-light' : 'section-dark';

  return (
    <section
      id={id}
      className={`${themeClass} py-[--section-padding-y] px-[--section-padding-x]${className ? ` ${className}` : ''}`}
      style={{ scrollMarginTop: 'var(--nav-height)' }}
    >
      {children}
    </section>
  );
}
