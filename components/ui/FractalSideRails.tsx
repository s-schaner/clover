// components/ui/FractalSideRails.tsx
// 'use client' — uses ResizeObserver, scroll listener, and refs.
//
// Decorative geometric line patterns running along the left and right edges
// of the page. Patterns scroll with page content and progressively draw
// themselves as the user scrolls down via stroke-dashoffset driven by JS
// scroll listener (universally supported, no CSS Scroll Timeline dependency).
//
// Architecture:
// - ResizeObserver measures actual page height (wrapper div)
// - generateRailPath() produces a single continuous SVG <path> per rail:
//   vertical spine + repeating geometric motifs (diamonds, angle brackets,
//   crosshairs, tick marks, circles) every ~300px
// - Right rail mirrors left via transform: scaleX(-1)
// - getTotalLength() measures path; scroll % drives stroke-dashoffset
//
// Responsive: hidden below lg (1024px) — rails only appear on desktop.
// Reduced-motion: fully drawn, no scroll animation — via useReducedMotion().

'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useReducedMotion } from 'framer-motion';

// ---------------------------------------------------------------------------
// Path generator — geometric motifs along a vertical spine
// ---------------------------------------------------------------------------

const RAIL_WIDTH = 60;
const MOTIF_SPACING = 300;
const SPINE_X = 30;

function generateRailPath(height: number): string {
  const segments: string[] = [];
  const x = SPINE_X;

  // Vertical spine
  segments.push(`M ${x} 0 L ${x} ${height}`);

  const motifCount = Math.max(1, Math.floor(height / MOTIF_SPACING));

  for (let i = 0; i < motifCount; i++) {
    const cy = MOTIF_SPACING * 0.5 + i * MOTIF_SPACING;
    const motifType = i % 5;

    switch (motifType) {
      case 0:
        appendDiamond(segments, x, cy, 14);
        break;
      case 1:
        appendAngleBrackets(segments, x, cy, 12);
        break;
      case 2:
        appendCrosshair(segments, x, cy, 10);
        break;
      case 3:
        appendTickMarks(segments, x, cy, 16);
        break;
      case 4:
        appendCircle(segments, x, cy, 8);
        break;
    }

    // Branch offshoots between motifs
    if (i < motifCount - 1) {
      const branchY = cy + MOTIF_SPACING * 0.35;
      segments.push(`M ${x} ${branchY} L ${x + 12} ${branchY - 6}`);
      segments.push(`M ${x} ${branchY + 20} L ${x - 10} ${branchY + 14}`);
      const accentY = cy + MOTIF_SPACING * 0.7;
      segments.push(`M ${x - 4} ${accentY} L ${x + 4} ${accentY - 8}`);
    }
  }

  return segments.join(' ');
}

// ---------------------------------------------------------------------------
// Motif helpers
// ---------------------------------------------------------------------------

function appendDiamond(s: string[], cx: number, cy: number, size: number) {
  s.push(`M ${cx} ${cy - size} L ${cx + size} ${cy} L ${cx} ${cy + size} L ${cx - size} ${cy} Z`);
  const inner = size * 0.5;
  s.push(`M ${cx} ${cy - inner} L ${cx + inner} ${cy} L ${cx} ${cy + inner} L ${cx - inner} ${cy} Z`);
}

function appendAngleBrackets(s: string[], cx: number, cy: number, size: number) {
  s.push(`M ${cx - size * 0.3} ${cy - size} L ${cx - size} ${cy} L ${cx - size * 0.3} ${cy + size}`);
  s.push(`M ${cx + size * 0.3} ${cy - size} L ${cx + size} ${cy} L ${cx + size * 0.3} ${cy + size}`);
}

function appendCrosshair(s: string[], cx: number, cy: number, size: number) {
  const gap = 3;
  s.push(`M ${cx - size} ${cy} L ${cx - gap} ${cy}`);
  s.push(`M ${cx + gap} ${cy} L ${cx + size} ${cy}`);
  s.push(`M ${cx} ${cy - size} L ${cx} ${cy - gap}`);
  s.push(`M ${cx} ${cy + gap} L ${cx} ${cy + size}`);
}

function appendTickMarks(s: string[], cx: number, cy: number, size: number) {
  const tickSpacing = 6;
  for (let j = -2; j <= 2; j++) {
    const ty = cy + j * tickSpacing;
    const tickW = j === 0 ? size : size * 0.6;
    s.push(`M ${cx - tickW} ${ty} L ${cx + tickW} ${ty}`);
  }
}

function appendCircle(s: string[], cx: number, cy: number, r: number) {
  const k = r * 0.5522847498;
  s.push(
    `M ${cx} ${cy - r}` +
    ` C ${cx + k} ${cy - r}, ${cx + r} ${cy - k}, ${cx + r} ${cy}` +
    ` C ${cx + r} ${cy + k}, ${cx + k} ${cy + r}, ${cx} ${cy + r}` +
    ` C ${cx - k} ${cy + r}, ${cx - r} ${cy + k}, ${cx - r} ${cy}` +
    ` C ${cx - r} ${cy - k}, ${cx - k} ${cy - r}, ${cx} ${cy - r}`,
  );
  const dr = r * 0.3;
  const dk = dr * 0.5522847498;
  s.push(
    `M ${cx} ${cy - dr}` +
    ` C ${cx + dk} ${cy - dr}, ${cx + dr} ${cy - dk}, ${cx + dr} ${cy}` +
    ` C ${cx + dr} ${cy + dk}, ${cx + dk} ${cy + dr}, ${cx} ${cy + dr}` +
    ` C ${cx - dk} ${cy + dr}, ${cx - dr} ${cy + dk}, ${cx - dr} ${cy}` +
    ` C ${cx - dr} ${cy - dk}, ${cx - dk} ${cy - dr}, ${cx} ${cy - dr}`,
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function FractalSideRails() {
  const shouldReduceMotion = useReducedMotion();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const leftPathRef = useRef<SVGPathElement>(null);
  const rightPathRef = useRef<SVGPathElement>(null);
  const pathLengthRef = useRef(0);

  const [pageHeight, setPageHeight] = useState(0);
  const [pathData, setPathData] = useState('');

  // Measure page height via ResizeObserver
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const h = entry.contentRect.height;
        if (h > 0) setPageHeight(h);
      }
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Generate path when height changes
  useEffect(() => {
    if (pageHeight > 0) {
      setPathData(generateRailPath(pageHeight));
    }
  }, [pageHeight]);

  // Measure path length after path data renders, then set initial dashoffset
  useEffect(() => {
    if (!pathData) return;

    requestAnimationFrame(() => {
      if (leftPathRef.current) {
        const len = leftPathRef.current.getTotalLength();
        pathLengthRef.current = len;

        // Set stroke-dasharray and initial dashoffset on both paths
        [leftPathRef.current, rightPathRef.current].forEach((path) => {
          if (path) {
            path.style.strokeDasharray = String(len);
            // If reduced motion, show fully drawn
            path.style.strokeDashoffset = shouldReduceMotion ? '0' : String(len);
          }
        });
      }
    });
  }, [pathData, shouldReduceMotion]);

  // Scroll-driven draw animation — updates stroke-dashoffset on each scroll
  const handleScroll = useCallback(() => {
    const len = pathLengthRef.current;
    if (len === 0) return;

    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollFraction = docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0;
    const offset = len * (1 - scrollFraction);

    if (leftPathRef.current) {
      leftPathRef.current.style.strokeDashoffset = String(offset);
    }
    if (rightPathRef.current) {
      rightPathRef.current.style.strokeDashoffset = String(offset);
    }
  }, []);

  useEffect(() => {
    if (shouldReduceMotion) return; // No scroll animation for reduced motion

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Run once on mount to set initial state
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll, shouldReduceMotion]);

  return (
    <div
      ref={wrapperRef}
      className="absolute inset-0 overflow-hidden pointer-events-none hidden lg:block"
      aria-hidden="true"
    >
      {pathData && (
        <>
          {/* Left rail */}
          <svg
            className="absolute top-0 left-0 h-full"
            style={{ width: RAIL_WIDTH }}
            viewBox={`0 0 ${RAIL_WIDTH} ${pageHeight}`}
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              ref={leftPathRef}
              d={pathData}
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              opacity="var(--pattern-opacity-dark)"
            />
          </svg>

          {/* Right rail — mirrored */}
          <svg
            className="absolute top-0 right-0 h-full"
            style={{ width: RAIL_WIDTH, transform: 'scaleX(-1)' }}
            viewBox={`0 0 ${RAIL_WIDTH} ${pageHeight}`}
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              ref={rightPathRef}
              d={pathData}
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              opacity="var(--pattern-opacity-dark)"
            />
          </svg>
        </>
      )}
    </div>
  );
}
