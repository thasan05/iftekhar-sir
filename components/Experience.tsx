import type { ExperienceEntry, Section as SectionMeta } from "@/lib/schema";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";

interface ExperienceProps {
  section: SectionMeta;
  index: string;
  entries: ExperienceEntry[];
}

export function Experience({ section, index, entries }: ExperienceProps) {
  return (
    <Section section={section} index={index}>
      <ol className="max-w-3xl">
        {entries.map((entry, position) => (
          <li
            key={entry.id}
            className="relative border-l border-ink/15 pb-12 pl-6 last:pb-0 sm:pb-14 sm:pl-9"
          >
            <span
              aria-hidden="true"
              className={[
                "absolute left-0 top-[0.55rem] h-2.5 w-2.5 -translate-x-1/2 rounded-full",
                entry.current
                  ? "bg-pen ring-4 ring-pen/15"
                  : "bg-paper ring-1 ring-ink/30",
              ].join(" ")}
            />

            <Reveal delay={position * 0.05}>
              <div className="grid gap-x-8 gap-y-3 md:grid-cols-[10rem_minmax(0,1fr)] md:gap-y-4">
                <p className="font-mono text-label uppercase text-ink-soft md:pt-[0.3rem]">
                  <span className="block break-words">
                    {entry.start} <span aria-hidden="true">–</span> {entry.end}
                  </span>
                  {entry.current ? (
                    <span className="mt-2 block text-pen">Current</span>
                  ) : null}
                </p>

                <div className="min-w-0">
                  <h3 className="text-h3 break-words">{entry.role}</h3>
                  <p className="mt-1.5 text-small text-ink-soft break-words">
                    {entry.organization}
                    {entry.location ? (
                      <>
                        <span aria-hidden="true" className="mx-2 text-ink/25">
                          /
                        </span>
                        {entry.location}
                      </>
                    ) : null}
                  </p>

                  {entry.summary ? (
                    <p className="mt-4 max-w-prose text-body text-ink-soft break-words">
                      {entry.summary}
                    </p>
                  ) : null}

                  {entry.highlights.length > 0 ? (
                    <ul className="mt-5 max-w-prose space-y-3">
                      {entry.highlights.map((highlight, highlightIndex) => (
                        <li
                          key={highlightIndex}
                          className="flex gap-3 text-small text-ink-soft"
                        >
                          <span
                            aria-hidden="true"
                            className="mt-[0.62rem] h-1 w-1 shrink-0 rounded-full bg-pen/70"
                          />
                          <span className="min-w-0 break-words">{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </div>
            </Reveal>
          </li>
        ))}
      </ol>
    </Section>
  );
}
