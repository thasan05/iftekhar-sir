import type { Education as EducationContent, Section as SectionMeta } from "@/lib/schema";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";

interface EducationProps {
  section: SectionMeta;
  index: string;
  education: EducationContent;
}

export function Education({ section, index, education }: EducationProps) {
  const markerTone = section.tone === "raised" ? "bg-paper-raised" : "bg-paper";

  return (
    <Section section={section} index={index}>
      <ol className="max-w-3xl">
        {education.entries.map((entry, position) => (
          <li
            key={entry.id}
            className="relative border-l border-ink/15 pb-10 pl-6 last:pb-0 sm:pl-9"
          >
            <span
              aria-hidden="true"
              className={`absolute left-0 top-[0.55rem] h-2 w-2 -translate-x-1/2 rounded-full ring-1 ring-ink/30 ${markerTone}`}
            />

            <Reveal delay={position * 0.05}>
              <div className="grid gap-x-8 gap-y-2 md:grid-cols-[10rem_minmax(0,1fr)] md:gap-y-3">
                <p className="font-mono text-label uppercase text-ink-soft md:pt-[0.3rem]">
                  {entry.year}
                </p>

                <div className="min-w-0">
                  <h3 className="text-h3 break-words">
                    {entry.degree}
                    <span aria-hidden="true" className="mx-1.5 text-ink/25 sm:mx-2">
                      /
                    </span>
                    <span className="font-normal text-ink-soft">{entry.field}</span>
                  </h3>
                  <p className="mt-1.5 text-small text-ink-soft break-words">
                    {entry.institution}
                    {entry.location ? (
                      <>
                        <span aria-hidden="true" className="mx-2 text-ink/25">
                          /
                        </span>
                        {entry.location}
                      </>
                    ) : null}
                  </p>
                  {entry.distinction ? (
                    <p className="mt-3 font-mono text-micro uppercase tracking-[0.14em] text-pen break-words">
                      {entry.distinction}
                    </p>
                  ) : null}
                </div>
              </div>
            </Reveal>
          </li>
        ))}
      </ol>

      {education.earlierEducation ? (
        <Reveal delay={0.1}>
          <p className="mt-10 max-w-prose text-micro text-ink-soft break-words">
            {education.earlierEducation}
          </p>
        </Reveal>
      ) : null}
    </Section>
  );
}
