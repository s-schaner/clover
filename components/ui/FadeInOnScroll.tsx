// components/ui/FadeInOnScroll.tsx
// 'use client' — uses framer-motion hooks which require client-side rendering.
//
// Scroll-triggered fade-in wrapper. Animates children from opacity:0 + translateY(y)
// to opacity:1 + translateY(0) when the element enters the viewport.
//
// Animation replays every time the element re-enters the viewport (viewport.once = false).
// Easing matches --ease-premium: cubic-bezier(0.21, 0.47, 0.32, 0.98).
// Duration matches --duration-slow: 600ms.
//
// Reduced-motion: When prefers-reduced-motion is set, children are rendered at full
// visibility immediately with no animation — no opacity:0 flash, no transform.
//
// Note on the `as` prop: The `as` prop exists for future flexibility, but this component
// always renders a motion.div internally. If you need a specific semantic element
// (e.g. <section>, <article>), wrap FadeInOnScroll in the appropriate element.

'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface FadeInOnScrollProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;       // seconds, default 0
  y?: number;           // travel distance in px, default 40
  as?: React.ElementType; // render as different element (for future flexibility — see note above)
}

export function FadeInOnScroll({
  children,
  className,
  delay = 0,
  y = 40,
  as: Tag = 'div',
}: FadeInOnScrollProps) {
  const shouldReduceMotion = useReducedMotion();

  // Reduced-motion: render a plain element at full visibility. No animation, no opacity flash.
  // This is the critical accessibility requirement: content must be immediately accessible.
  if (shouldReduceMotion) {
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.2 }}
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
