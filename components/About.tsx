import type { About as AboutContent, Section as SectionMeta } from "@/lib/schema";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";

interface AboutProps {
  section: SectionMeta;
  index: string;
  about: AboutContent;
}

export function About({ section, index, about }: AboutProps) {
  return (
    <Section section={section} index={index}>
      <Reveal className="max-w-prose space-y-6 text-body text-ink-soft">
        {about.paragraphs.map((paragraph, position) => (
          <p key={position}>{paragraph}</p>
        ))}
      </Reveal>

      {about.humanNote ? (
        <Reveal delay={0.08} className="mt-10 max-w-prose border-l-2 border-pen/40 pl-5">
          <p className="text-small text-ink-soft">{about.humanNote}</p>
        </Reveal>
      ) : null}
    </Section>
  );
}
