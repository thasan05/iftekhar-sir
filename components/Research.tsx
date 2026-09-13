import type { Research as ResearchContent, Section as SectionMeta } from "@/lib/schema";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Pill } from "@/components/ui/Pill";

interface ResearchProps {
  section: SectionMeta;
  index: string;
  research: ResearchContent;
}

export function Research({ section, index, research }: ResearchProps) {
  return (
    <Section section={section} index={index}>
      {research.intro ? (
        <Reveal className="mb-9 max-w-prose text-body text-ink-soft sm:mb-12">
          <p>{research.intro}</p>
        </Reveal>
      ) : null}

      {research.interests.length > 0 ? (
        <Reveal>
          <h3 className="font-mono text-label uppercase text-ink-soft">Interests</h3>
          <ul className="mt-5 flex flex-wrap gap-2">
            {research.interests.map((interest) => (
              <li key={interest} className="max-w-full">
                <Pill key={interest}>{interest}</Pill>
              </li>
            ))}
          </ul>
        </Reveal>
      ) : null}

      {research.outputs.length > 0 ? (
        <Reveal delay={0.08} className="mt-12 sm:mt-14">
          <h3 className="font-mono text-label uppercase text-ink-soft">
            {research.outputs.length === 1 ? "Conference paper" : "Papers & presentations"}
          </h3>

          <ul className="mt-5 space-y-5">
            {research.outputs.map((output) => (
              <li
                key={output.id}
                className="max-w-3xl rounded-sheet border border-ink/10 bg-paper-raised p-5 shadow-card sm:p-8"
              >
                <p className="font-mono text-label uppercase text-pen break-words">{output.role}</p>

                <h4 className="mt-3 font-serif text-h3 italic break-words sm:mt-4">
                  &ldquo;{output.title}&rdquo;
                </h4>

                <p className="mt-3 text-small text-ink-soft break-words sm:mt-4">
                  Presented at the {output.venue}.
                </p>

                <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-3 border-t border-ink/10 pt-4 sm:mt-6 sm:pt-5">
                  <p className="font-mono text-micro uppercase tracking-[0.14em] text-ink-soft break-words">
                    {output.date ? (
                      output.dateISO ? <time dateTime={output.dateISO}>{output.date}</time> : output.date
                    ) : null}
                    {output.date && output.venueShort ? (
                      <span aria-hidden="true" className="mx-2.5 text-ink/25">/</span>
                    ) : null}
                    {output.venueShort}
                  </p>
                  {output.award ? (
                    <p className="rounded-full border border-pen/30 bg-pen/5 px-3 py-1 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-pen break-words">
                      {output.award}
                    </p>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        </Reveal>
      ) : null}
    </Section>
  );
}
