"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import type { Hero as HeroContent, Identity } from "@/lib/schema";
import { ProofUnderline } from "@/components/ui/ProofUnderline";
import { EASE_MANUSCRIPT } from "@/components/ui/motion";

const STEP = 0.09;

interface HeroProps {
  hero: HeroContent;
  identity: Identity;
}

export function Hero({ hero, identity }: HeroProps) {
  const reduceMotion = useReducedMotion();

  /**
   * The one orchestrated entrance on the page: each element of the masthead
   * lifts into place a beat after the last. Explicit delays rather than parent
   * variants, so the sequence is readable and cannot fail to propagate.
   *
   * Reduced motion collapses the timings to zero instead of removing the props,
   * which keeps the server and client markup identical. `motion-reveal` is the
   * hook the no-JavaScript fallback in the layout uses.
   */
  const enter = (index: number, className: string) => ({
    className: `motion-reveal ${className}`,
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: reduceMotion ? 0 : 0.55,
      delay: reduceMotion ? 0 : 0.06 + index * STEP,
      ease: EASE_MANUSCRIPT,
    },
  });

  return (
    <section id="top" className="pt-28 pb-section sm:pt-32 lg:pt-40">
      <div className="mx-auto w-full max-w-shell px-6 sm:px-8 lg:px-10">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,0.55fr)] lg:gap-16">
          <div>
            {hero.eyebrow.length > 0 ? (
              <motion.p
                {...enter(
                  0,
                  "flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-label uppercase text-ink-soft",
                )}
              >
                {hero.eyebrow.map((part, index) => (
                  <span key={`${part}-${index}`} className="flex items-center gap-3">
                    {index > 0 ? (
                      <span aria-hidden="true" className="text-pen">
                        ·
                      </span>
                    ) : null}
                    {part}
                  </span>
                ))}
              </motion.p>
            ) : null}

            <motion.h1 {...enter(1, "mt-7 text-h1")}>{identity.name}</motion.h1>

            <motion.p {...enter(2, "mt-6 font-serif text-h3 text-ink-soft")}>
              {identity.title}, {identity.department}
              <span className="block">{identity.institution}</span>
            </motion.p>

            <motion.p {...enter(3, "mt-8 max-w-prose text-lede text-ink")}>
              {hero.taglineLead}
              <ProofUnderline>{hero.taglineMarked}</ProofUnderline>
              {hero.taglineTail}
            </motion.p>

            <motion.div
              {...enter(4, "mt-10 flex flex-wrap items-center gap-x-7 gap-y-4")}
            >
              <a
                href={hero.primaryCta.href}
                className="inline-flex items-center rounded-sheet bg-ink px-5 py-3 font-mono text-micro uppercase tracking-[0.16em] text-paper transition-colors duration-200 ease-manuscript hover:bg-ink-soft"
              >
                {hero.primaryCta.label}
              </a>
              <a
                href={hero.secondaryCta.href}
                className="pen-link font-mono text-micro uppercase tracking-[0.16em]"
              >
                {hero.secondaryCta.label}
              </a>
            </motion.div>
          </div>

          <motion.div
            {...enter(
              2,
              "relative aspect-square w-36 shrink-0 sm:w-44 lg:w-full lg:max-w-[19rem] lg:justify-self-end",
            )}
          >
            <Image
              src={hero.portrait.src}
              alt={hero.portrait.alt}
              fill
              priority
              sizes="(min-width: 1024px) 19rem, 11rem"
              className="rounded-full object-cover"
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-ink/15"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
