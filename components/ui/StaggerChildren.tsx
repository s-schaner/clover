// components/ui/StaggerChildren.tsx
// 'use client' — StaggerItem uses framer-motion hooks which require client-side rendering.
//
// Diagonal stagger animation system for card grids. Cards cascade from top-left,
// each item delayed by (row + col) * staggerInterval seconds.
//
// IMPORTANT: `staggerChildren` is DEPRECATED in framer-motion 12 (motion-dom).
// The `stagger()` utility only supports 1D ordering and cannot produce diagonal cascades.
// This implementation uses per-item manual delay computation instead.
//
// Architecture:
// - StaggerChildren: plain div wrapper — semantic clarity and future flexibility only.
//   Contains NO framer-motion. Animation is entirely in StaggerItem.
// - StaggerItem: individual animated card — each item independently tracks viewport
//   entry via whileInView. No parent-child stagger propagation.
//
// Usage pattern:
//   <StaggerChildren className="grid grid-cols-3 gap-6">
//     {items.map((item, i) => (
//       <StaggerItem key={item.id} index={i} columns={3}>
//         <Card {...item} />
//       </StaggerItem>
//     ))}
//   </StaggerChildren>
//
// Reduced-motion: When prefers-reduced-motion is set, all items render at full
// visibility immediately — no animation, no stagger, no opacity flash.

'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

// ---------------------------------------------------------------------------
// StaggerChildren — grid wrapper
// ---------------------------------------------------------------------------

interface StaggerChildrenProps {
  children: React.ReactNode;
  className?: string;
}

export function StaggerChildren({ children, className }: StaggerChildrenProps) {
  // Plain wrapper — no framer-motion here. Animation lives in StaggerItem.
  return <div className={className}>{children}</div>;
}

// ---------------------------------------------------------------------------
// StaggerItem — individually animated card with diagonal cascade delay
// ---------------------------------------------------------------------------

interface StaggerItemProps {
  children: React.ReactNode;
  index: number;           // flat index in the grid (0-based)
  columns: number;         // number of columns in the grid
  className?: string;
  staggerInterval?: number; // seconds per diagonal step, default 0.08
}

export function StaggerItem({
  children,
  index,
  columns,
  className,
  staggerInterval = 0.08,
}: StaggerItemProps) {
  const shouldReduceMotion = useReducedMotion();

  // Compute position in grid
  const row = Math.floor(index / columns);
  const col = index % columns;

  // Diagonal delay: items on the same diagonal (row + col = constant) animate simultaneously.
  // This creates the top-left cascade effect described in CONTEXT.md.
  const delay = (row + col) * staggerInterval;

  // Reduced-motion: render at full visibility, no animation.
  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.1 }}
      transition={{
        duration: 0.6,
        ease: [0.21, 0.47, 0.32, 0.98],
        delay,
      }}
    >
      {children}
    </motion.div>
  );
}
