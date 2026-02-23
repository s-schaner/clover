// components/ui/GridPattern.tsx
// Recursive line grid SVG pattern component — subtle texture primitive used by every section.
// 4-level nested SVG <pattern> produces a fractal-density grid at controlled opacity.
// Uses CSS mask-image for smooth edge dissolve (no hard crop).
// Uses useId() per instance to prevent SVG pattern ID collision when multiple instances render.

'use client';

import { useId } from 'react';

interface GridPatternProps {
  theme: 'dark' | 'light';
  position?: 'corner-br' | 'corner-tr' | 'edge-right' | 'full';
  className?: string;
}

const MASK_BY_POSITION: Record<NonNullable<GridPatternProps['position']>, string> = {
  'corner-br': 'radial-gradient(ellipse 60% 70% at 100% 100%, black 30%, transparent 80%)',
  'corner-tr': 'radial-gradient(ellipse 60% 70% at 100% 0%, black 30%, transparent 80%)',
  'edge-right': 'radial-gradient(ellipse 50% 80% at 100% 50%, black 30%, transparent 80%)',
  'full':       'radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)',
};

export function GridPattern({
  theme,
  position = 'corner-br',
  className,
}: GridPatternProps) {
  // Unique prefix per instance prevents ID collision when rendered multiple times on the same page.
  const uid = useId();
  // Replace characters that are invalid in SVG id attributes (useId returns e.g. ":r0:")
  const id = uid.replace(/:/g, 'gp');

  const opacity =
    theme === 'dark'
      ? 'var(--pattern-opacity-dark)'
      : 'var(--pattern-opacity-light)';

  const maskImage = MASK_BY_POSITION[position];

  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none${className ? ` ${className}` : ''}`}
      aria-hidden="true"
      style={{ opacity, maskImage }}
    >
      <svg
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Level 3 — finest: 5px tiles, barely visible, creates texture density */}
          <pattern
            id={`${id}-l3`}
            width="5"
            height="5"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 5 0 L 0 0 0 5"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.15"
            />
          </pattern>

          {/* Level 2 — 10px tiles: fills with level 3 + own grid lines */}
          <pattern
            id={`${id}-l2`}
            width="10"
            height="10"
            patternUnits="userSpaceOnUse"
          >
            <rect width="10" height="10" fill={`url(#${id}-l3)`} />
            <path
              d="M 10 0 L 0 0 0 10"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.3"
            />
          </pattern>

          {/* Level 1 — 20px tiles: fills with level 2 + own grid lines */}
          <pattern
            id={`${id}-l1`}
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <rect width="20" height="20" fill={`url(#${id}-l2)`} />
            <path
              d="M 20 0 L 0 0 0 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
            />
          </pattern>

          {/* Level 0 — primary: 40px tiles (matches --pattern-size), most visible */}
          <pattern
            id={`${id}-l0`}
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <rect width="40" height="40" fill={`url(#${id}-l1)`} />
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.8"
            />
          </pattern>
        </defs>

        {/* Main fill rect uses the level-0 (primary) pattern */}
        <rect width="100%" height="100%" fill={`url(#${id}-l0)`} />
      </svg>
    </div>
  );
}
