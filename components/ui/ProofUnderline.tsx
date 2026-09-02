"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { EASE_MANUSCRIPT } from "@/components/ui/motion";

interface ProofUnderlineProps {
  children: ReactNode;
  /** Seconds to wait before the mark is drawn. */
  delay?: number;
}

/**
 * The signature gesture of the site, used exactly once: the phrase in the hero
 * tagline gets a proofreader's underline drawn in by hand on load. The path
 * coordinates are deliberately uneven so the line reads as pen, not as a border.
 *
 * Under reduced motion the mark is simply there, fully drawn, from the start.
 */
export function ProofUnderline({ children, delay = 0.7 }: ProofUnderlineProps) {
  const reduceMotion = useReducedMotion();
  const drawDelay = reduceMotion ? 0 : delay;

  return (
    <span className="relative inline-block whitespace-nowrap">
      {children}
      <svg
        className="pointer-events-none absolute inset-x-0 bottom-[-0.3em] h-[0.4em] w-full overflow-visible text-pen"
        viewBox="0 0 300 12"
        preserveAspectRatio="none"
        aria-hidden="true"
        focusable="false"
      >
        <motion.path
          className="motion-reveal"
          d="M1.6 7.9C33 3.6 65.5 9.7 98 6.2c32.5-3.5 64.8 3.7 97.3 1.1 32.5-2.6 65-4.2 103.1-.6"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.2}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{
            pathLength: {
              duration: reduceMotion ? 0 : 0.95,
              delay: drawDelay,
              ease: EASE_MANUSCRIPT,
            },
            opacity: { duration: 0.01, delay: drawDelay },
          }}
        />
      </svg>
    </span>
  );
}
