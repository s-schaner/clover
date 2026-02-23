// components/ui/HoverLift.tsx
// Card hover scale micro-interaction wrapper.
// Scales children up by 1.025x on hover (configurable via `scale` prop) with a
// 120ms ease-out transition — within the "instant-feeling" 100–150ms range.
//
// Reduced-motion: When prefers-reduced-motion is set, renders a plain <div> with
// no scale, no transition. Hover state is completely absent, not just suppressed.
//
// Usage note: This component does NOT set cursor: pointer.
// Consumers are responsible for pointer style based on their child element type
// (e.g. a link, button, or non-interactive card).

'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface HoverLiftProps {
  children: React.ReactNode;
  className?: string;
  scale?: number; // default 1.025 — sits within the 1.02–1.03 range from CONTEXT.md
}

export function HoverLift({ children, className, scale = 1.025 }: HoverLiftProps) {
  const shouldReduceMotion = useReducedMotion();

  // Reduced-motion: plain div, no interaction.
  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      whileHover={{ scale }}
      transition={{
        duration: 0.12, // 120ms — "instant-feeling" per CONTEXT.md (100–150ms range)
        ease: [0.0, 0.0, 0.2, 1], // matches --ease-out token
      }}
      style={{ willChange: 'transform' }}
    >
      {children}
    </motion.div>
  );
}
