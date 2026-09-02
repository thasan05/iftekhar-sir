"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { EASE_MANUSCRIPT } from "@/components/ui/motion";

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Seconds of stagger for items revealed as a group. */
  delay?: number;
}

/**
 * Restrained scroll reveal: a short fade and lift, once.
 *
 * Reduced motion collapses the duration to zero rather than swapping the
 * element out, so the server and client render exactly the same markup and the
 * content is never left mid-animation.
 */
export function Reveal({ children, className, delay = 0 }: RevealProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      // `motion-reveal` is the hook the no-JavaScript fallback in the layout uses.
      className={className ? `motion-reveal ${className}` : "motion-reveal"}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{
        duration: reduceMotion ? 0 : 0.4,
        delay: reduceMotion ? 0 : delay,
        ease: EASE_MANUSCRIPT,
      }}
    >
      {children}
    </motion.div>
  );
}
