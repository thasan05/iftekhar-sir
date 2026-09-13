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
    <section id="top" className="pt-8 pb-16 sm:pt-12 sm:pb-section lg:pt-14">
      <div className="mx-auto w-full max-w-shell px-5 sm:px-8 lg:px-10">
        <div className="grid items-center gap-10 sm:gap-12 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,0.55fr)] lg:gap-16">
          <div className="min-w-0">
            {hero.eyebrow.length > 0 ? (
              <motion.p
                {...enter(
                  0,
                  "flex flex-wrap items-center gap-x-2.5 gap-y-2 font-mono text-label uppercase text-ink-soft",
                )}
              >
                {hero.eyebrow.map((part, index) => (
                  <span key={`${part}-${index}`} className="flex items-center gap-2.5">
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

            <motion.h1
              {...enter(1, "mt-5 max-w-[12ch] text-[clamp(2.5rem,13vw,4.75rem)] sm:mt-6")}
            >
              {identity.name}
            </motion.h1>

            <motion.p {...enter(2, "mt-5 max-w-xl font-serif text-h3 text-ink-soft sm:mt-6")}>
              {identity.title}, {identity.department}
              <span className="block">{identity.institution}</span>
            </motion.p>

            <motion.p {...enter(3, "mt-7 max-w-prose text-lede text-ink sm:mt-8")}>
              {hero.taglineLead}
              <ProofUnderline>{hero.taglineMarked}</ProofUnderline>
              {hero.taglineTail}
            </motion.p>

            <motion.div
              {...enter(
                4,
                "mt-8 flex flex-col items-stretch gap-4 sm:mt-10 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-7 sm:gap-y-4",
              )}
            >
              <a
                href={hero.primaryCta.href}
                className="inline-flex min-h-11 items-center justify-center rounded-sheet bg-ink px-5 py-3 font-mono text-micro uppercase tracking-[0.16em] text-paper transition-colors duration-200 ease-manuscript hover:bg-ink-soft sm:min-h-0 sm:justify-start"
              >
                {hero.primaryCta.label}
              </a>
              <a
                href={hero.secondaryCta.href}
                className="pen-link inline-flex min-h-11 items-center font-mono text-micro uppercase tracking-[0.16em] sm:min-h-0"
              >
                {hero.secondaryCta.label}
              </a>
            </motion.div>
          </div>

          <motion.div
            {...enter(
              2,
              "relative mx-auto aspect-square w-36 shrink-0 sm:w-44 lg:mx-0 lg:w-full lg:max-w-[19rem] lg:justify-self-end",
            )}
          >
            <Image
              src={hero.portrait.src}
              alt={hero.portrait.alt}
              fill
              priority
              sizes="(min-width: 1024px) 19rem, (min-width: 640px) 11rem, 9rem"
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
