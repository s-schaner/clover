// components/ui/GeometryAccent.tsx
// Hero signature draw animation — the first visual impact a visitor receives.
// Renders a four-leaf clover pattern using CSS keyframes on stroke-dashoffset.
// Path length is read at runtime via getTotalLength() to avoid hardcoding.
// Animation is disabled and final settled state shown for prefers-reduced-motion.

'use client';

import { useEffect, useRef } from 'react';

interface GeometryAccentProps {
  className?: string;
}

// Four-leaf clover pattern — Clover Labs brand identity.
// Uses the rose curve r = cos(2θ) to generate four symmetric petals,
// with internal vein/structural lines for an engineering blueprint aesthetic.
// Total path is intentionally complex to produce 1–1.5s of draw time.
//
// Layout within viewBox 0 0 600 600, centered at (300, 300).
// Each petal extends ~200px from center, with veins at 45° and midlines.
//
// Drawn as a single continuous <path> using M/C/L moves so stroke-dashoffset
// animates the whole structure as one unbroken line being drawn.

function generateCloverPath(): string {
  const cx = 300;
  const cy = 300;
  const segments: string[] = [];

  // --- Generate 4-leaf clover outline using rose curve r = cos(2θ) ---
  // We trace each petal as a cubic Bézier curve for smooth rendering.
  // Petals point along the 4 cardinal axes (0°, 90°, 180°, 270°).
  const petalLength = 200; // Distance from center to petal tip
  const petalWidth = 120;  // Width of petal at its widest point

  // Each petal: from center, bulge out to tip, curve back to center.
  // Control points create the rounded heart-like petal shape.

  // Right petal (0° / 3 o'clock)
  segments.push(`M ${cx} ${cy}`);
  segments.push(`C ${cx + petalWidth * 0.6} ${cy - petalWidth * 0.75}, ${cx + petalLength} ${cy - petalWidth * 0.4}, ${cx + petalLength} ${cy}`);
  segments.push(`C ${cx + petalLength} ${cy + petalWidth * 0.4}, ${cx + petalWidth * 0.6} ${cy + petalWidth * 0.75}, ${cx} ${cy}`);

  // Top petal (90° / 12 o'clock)
  segments.push(`C ${cx - petalWidth * 0.75} ${cy - petalWidth * 0.6}, ${cx - petalWidth * 0.4} ${cy - petalLength}, ${cx} ${cy - petalLength}`);
  segments.push(`C ${cx + petalWidth * 0.4} ${cy - petalLength}, ${cx + petalWidth * 0.75} ${cy - petalWidth * 0.6}, ${cx} ${cy}`);

  // Left petal (180° / 9 o'clock)
  segments.push(`C ${cx - petalWidth * 0.6} ${cy - petalWidth * 0.75}, ${cx - petalLength} ${cy - petalWidth * 0.4}, ${cx - petalLength} ${cy}`);
  segments.push(`C ${cx - petalLength} ${cy + petalWidth * 0.4}, ${cx - petalWidth * 0.6} ${cy + petalWidth * 0.75}, ${cx} ${cy}`);

  // Bottom petal (270° / 6 o'clock)
  segments.push(`C ${cx + petalWidth * 0.75} ${cy + petalWidth * 0.6}, ${cx + petalWidth * 0.4} ${cy + petalLength}, ${cx} ${cy + petalLength}`);
  segments.push(`C ${cx - petalWidth * 0.4} ${cy + petalLength}, ${cx - petalWidth * 0.75} ${cy + petalWidth * 0.6}, ${cx} ${cy}`);

  // --- Inner clover outline (smaller, nested for fractal depth) ---
  const innerScale = 0.55;
  const iLen = petalLength * innerScale;
  const iWid = petalWidth * innerScale;

  // Right inner petal
  segments.push(`M ${cx} ${cy}`);
  segments.push(`C ${cx + iWid * 0.6} ${cy - iWid * 0.75}, ${cx + iLen} ${cy - iWid * 0.4}, ${cx + iLen} ${cy}`);
  segments.push(`C ${cx + iLen} ${cy + iWid * 0.4}, ${cx + iWid * 0.6} ${cy + iWid * 0.75}, ${cx} ${cy}`);

  // Top inner petal
  segments.push(`C ${cx - iWid * 0.75} ${cy - iWid * 0.6}, ${cx - iWid * 0.4} ${cy - iLen}, ${cx} ${cy - iLen}`);
  segments.push(`C ${cx + iWid * 0.4} ${cy - iLen}, ${cx + iWid * 0.75} ${cy - iWid * 0.6}, ${cx} ${cy}`);

  // Left inner petal
  segments.push(`C ${cx - iWid * 0.6} ${cy - iWid * 0.75}, ${cx - iLen} ${cy - iWid * 0.4}, ${cx - iLen} ${cy}`);
  segments.push(`C ${cx - iLen} ${cy + iWid * 0.4}, ${cx - iWid * 0.6} ${cy + iWid * 0.75}, ${cx} ${cy}`);

  // Bottom inner petal
  segments.push(`C ${cx + iWid * 0.75} ${cy + iWid * 0.6}, ${cx + iWid * 0.4} ${cy + iLen}, ${cx} ${cy + iLen}`);
  segments.push(`C ${cx - iWid * 0.4} ${cy + iLen}, ${cx - iWid * 0.75} ${cy + iWid * 0.6}, ${cx} ${cy}`);

  // --- Structural vein lines (blueprint aesthetic) ---

  // Cardinal axis veins — center to petal tips
  segments.push(`M ${cx} ${cy} L ${cx + petalLength} ${cy}`);   // Right
  segments.push(`M ${cx} ${cy} L ${cx} ${cy - petalLength}`);    // Top
  segments.push(`M ${cx} ${cy} L ${cx - petalLength} ${cy}`);    // Left
  segments.push(`M ${cx} ${cy} L ${cx} ${cy + petalLength}`);    // Bottom

  // Diagonal axis veins — between petals
  const diagLen = petalLength * 0.55;
  segments.push(`M ${cx} ${cy} L ${cx + diagLen} ${cy - diagLen}`);  // NE
  segments.push(`M ${cx} ${cy} L ${cx - diagLen} ${cy - diagLen}`);  // NW
  segments.push(`M ${cx} ${cy} L ${cx - diagLen} ${cy + diagLen}`);  // SW
  segments.push(`M ${cx} ${cy} L ${cx + diagLen} ${cy + diagLen}`);  // SE

  // --- Petal midline curves (inner vein structure) ---
  // These arc slightly to follow the petal curvature, adding organic depth.
  const veinOffset = petalLength * 0.65;

  // Right petal vein arcs
  segments.push(`M ${cx + 30} ${cy - 15} Q ${cx + veinOffset} ${cy - 8}, ${cx + petalLength - 10} ${cy}`);
  segments.push(`M ${cx + 30} ${cy + 15} Q ${cx + veinOffset} ${cy + 8}, ${cx + petalLength - 10} ${cy}`);

  // Top petal vein arcs
  segments.push(`M ${cx - 15} ${cy - 30} Q ${cx - 8} ${cy - veinOffset}, ${cx} ${cy - petalLength + 10}`);
  segments.push(`M ${cx + 15} ${cy - 30} Q ${cx + 8} ${cy - veinOffset}, ${cx} ${cy - petalLength + 10}`);

  // Left petal vein arcs
  segments.push(`M ${cx - 30} ${cy - 15} Q ${cx - veinOffset} ${cy - 8}, ${cx - petalLength + 10} ${cy}`);
  segments.push(`M ${cx - 30} ${cy + 15} Q ${cx - veinOffset} ${cy + 8}, ${cx - petalLength + 10} ${cy}`);

  // Bottom petal vein arcs
  segments.push(`M ${cx + 15} ${cy + 30} Q ${cx + 8} ${cy + veinOffset}, ${cx} ${cy + petalLength - 10}`);
  segments.push(`M ${cx - 15} ${cy + 30} Q ${cx - 8} ${cy + veinOffset}, ${cx} ${cy + petalLength - 10}`);

  // --- Outer geometric frame (subtle container) ---
  const frame = petalLength + 40;
  segments.push(`M ${cx - frame} ${cy - frame}`);
  segments.push(`L ${cx + frame} ${cy - frame}`);
  segments.push(`L ${cx + frame} ${cy + frame}`);
  segments.push(`L ${cx - frame} ${cy + frame}`);
  segments.push(`L ${cx - frame} ${cy - frame}`);

  // --- Corner tick marks (engineering drawing convention) ---
  const tickLen = 20;
  // Top-left
  segments.push(`M ${cx - frame} ${cy - frame + tickLen} L ${cx - frame} ${cy - frame} L ${cx - frame + tickLen} ${cy - frame}`);
  // Top-right
  segments.push(`M ${cx + frame - tickLen} ${cy - frame} L ${cx + frame} ${cy - frame} L ${cx + frame} ${cy - frame + tickLen}`);
  // Bottom-right
  segments.push(`M ${cx + frame} ${cy + frame - tickLen} L ${cx + frame} ${cy + frame} L ${cx + frame - tickLen} ${cy + frame}`);
  // Bottom-left
  segments.push(`M ${cx - frame + tickLen} ${cy + frame} L ${cx - frame} ${cy + frame} L ${cx - frame} ${cy + frame - tickLen}`);

  // --- Center crosshair ---
  const crossLen = 15;
  segments.push(`M ${cx - crossLen} ${cy} L ${cx + crossLen} ${cy}`);
  segments.push(`M ${cx} ${cy - crossLen} L ${cx} ${cy + crossLen}`);

  return segments.join(' ');
}

const CLOVER_PATH = generateCloverPath();

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
          d={CLOVER_PATH}
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          className="hero-pattern-draw"
        />
      </svg>
    </div>
  );
}
