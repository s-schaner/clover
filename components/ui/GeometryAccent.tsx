// components/ui/GeometryAccent.tsx
// Hero signature draw animation — the first visual impact a visitor receives.
// Renders a fractal-like geometric path using CSS keyframes on stroke-dashoffset.
// Path length is read at runtime via getTotalLength() to avoid hardcoding.
// Animation is disabled and final settled state shown for prefers-reduced-motion.

'use client';

import { useEffect, useRef } from 'react';

interface GeometryAccentProps {
  className?: string;
}

// Fractal recursive grid path — engineering blueprint aesthetic.
// Traces an outer rectangle then subdivides into 2 levels of internal grid.
// Total path is intentionally complex to produce 1–1.5s of draw time.
//
// Layout within viewBox 0 0 600 600:
//   Outer frame: 20,20 → 580,580
//   Level-1 grid: 4×4 cells (each 140px)
//   Level-2 sub-grid: selected cells subdivided into 2×2 quarters
//
// Drawn as a single continuous <path> using M/L/m moves so stroke-dashoffset
// animates the whole structure as one unbroken line being drawn.
const FRACTAL_PATH = [
  // --- Outer frame ---
  'M 20 20',
  'L 580 20',
  'L 580 580',
  'L 20 580',
  'L 20 20',

  // --- Level-1 grid: 4 columns × 4 rows (140px pitch) ---
  // Vertical dividers
  'M 160 20', 'L 160 580',
  'M 300 20', 'L 300 580',
  'M 440 20', 'L 440 580',

  // Horizontal dividers
  'M 20 160',  'L 580 160',
  'M 20 300',  'L 580 300',
  'M 20 440',  'L 580 440',

  // --- Level-2 sub-grid: top-left cell (20,20)→(160,160) ---
  // Quarter verticals at 90 (midpoint)
  'M 90 20',   'L 90 160',
  // Quarter horizontals at 90
  'M 20 90',   'L 160 90',

  // --- Level-2 sub-grid: top-right cell (440,20)→(580,160) ---
  'M 510 20',  'L 510 160',
  'M 440 90',  'L 580 90',

  // --- Level-2 sub-grid: center cell (230,230)→(370,370) ---
  'M 230 300', 'L 370 300',
  'M 300 230', 'L 300 370',

  // Level-3 within top-left cell: further quarter of 90px tile
  'M 55 20',   'L 55 90',
  'M 20 55',   'L 90 55',

  // --- Level-2 sub-grid: bottom-left cell (20,440)→(160,580) ---
  'M 90 440',  'L 90 580',
  'M 20 510',  'L 160 510',

  // --- Level-2 sub-grid: bottom-right cell (440,440)→(580,580) ---
  'M 510 440', 'L 510 580',
  'M 440 510', 'L 580 510',

  // --- Diagonal cross-lines within center cell ---
  'M 230 230', 'L 370 370',
  'M 370 230', 'L 230 370',

  // --- Additional level-2 cells for path length and complexity ---
  // cell (160,20)→(300,160)
  'M 230 20',  'L 230 160',
  'M 160 90',  'L 300 90',

  // cell (300,20)→(440,160)
  'M 370 20',  'L 370 160',
  'M 300 90',  'L 440 90',

  // cell (20,160)→(160,300)
  'M 90 160',  'L 90 300',
  'M 20 230',  'L 160 230',

  // cell (440,160)→(580,300)
  'M 510 160', 'L 510 300',
  'M 440 230', 'L 580 230',

  // cell (20,300)→(160,440)
  'M 90 300',  'L 90 440',
  'M 20 370',  'L 160 370',

  // cell (440,300)→(580,440)
  'M 510 300', 'L 510 440',
  'M 440 370', 'L 580 370',

  // cell (160,440)→(300,580)
  'M 230 440', 'L 230 580',
  'M 160 510', 'L 300 510',

  // cell (300,440)→(440,580)
  'M 370 440', 'L 370 580',
  'M 300 510', 'L 440 510',
].join(' ');

export function GeometryAccent({ className }: GeometryAccentProps) {
  const pathRef = useRef<SVGPathElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    // Read actual path length at runtime — survives design changes without hardcoding.
    if (pathRef.current && svgRef.current) {
      const length = pathRef.current.getTotalLength();
      svgRef.current.style.setProperty('--hero-path-length', String(length));
    }
  }, []);

  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none${className ? ` ${className}` : ''}`}
      aria-hidden="true"
      style={{
        maskImage:
          'radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)',
      }}
    >
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        viewBox="0 0 600 600"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          ref={pathRef}
          d={FRACTAL_PATH}
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          className="hero-pattern-draw"
        />
      </svg>
    </div>
  );
}
