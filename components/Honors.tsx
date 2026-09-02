import { Award } from "lucide-react";
import type { HonorEntry, Section as SectionMeta } from "@/lib/schema";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";

interface HonorsProps {
  section: SectionMeta;
  index: string;
  honors: HonorEntry[];
}

export function Honors({ section, index, honors }: HonorsProps) {
  const cardTone = section.tone === "raised" ? "bg-paper" : "bg-paper-raised";

  return (
    <Section section={section} index={index}>
      <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {honors.map((honor, position) => (
          <li key={honor.id} className="flex">
            <Reveal delay={position * 0.04} className="flex w-full">
              <article
                className={`flex w-full flex-col rounded-sheet border border-ink/10 border-t-2 border-t-brass/70 p-6 shadow-card ${cardTone}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <p className="font-mono text-label uppercase text-brass-deep">
                    {honor.year}
                  </p>
                  <Award
                    size={16}
                    aria-hidden="true"
                    className="mt-[-0.1rem] shrink-0 text-brass"
                  />
                </div>

                <h3 className="mt-4 text-h4 font-semibold">{honor.title}</h3>
                <p className="mt-1.5 text-small text-ink-soft">{honor.awarder}</p>
                {honor.detail ? (
                  <p className="mt-4 text-micro text-ink-soft">{honor.detail}</p>
                ) : null}
              </article>
            </Reveal>
          </li>
        ))}
      </ul>
    </Section>
  );
}
