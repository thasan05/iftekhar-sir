import {
  BookOpen,
  FlaskConical,
  Languages,
  PenLine,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import type { Section as SectionMeta, SkillGroup, SkillIcon } from "@/lib/schema";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Pill } from "@/components/ui/Pill";

const ICONS: Record<SkillIcon, LucideIcon> = {
  teaching: BookOpen,
  languages: Languages,
  tools: Wrench,
  research: FlaskConical,
  writing: PenLine,
};

interface SkillsProps {
  section: SectionMeta;
  index: string;
  groups: SkillGroup[];
}

export function Skills({ section, index, groups }: SkillsProps) {
  return (
    <Section section={section} index={index}>
      <div className="grid gap-10 sm:grid-cols-2 xl:grid-cols-3 xl:gap-8">
        {groups.map((group, position) => {
          const Icon = ICONS[group.icon];

          return (
            <Reveal key={group.id} delay={position * 0.05}>
              <div className="flex items-center gap-3 border-b border-ink/10 pb-4">
                <Icon size={17} aria-hidden="true" className="shrink-0 text-pen" />
                <h3 className="font-mono text-label uppercase text-ink-soft">
                  {group.title}
                </h3>
              </div>

              <ul className="mt-5 flex flex-wrap gap-2.5">
                {group.items.map((skill) => (
                  <Pill key={skill}>{skill}</Pill>
                ))}
              </ul>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
