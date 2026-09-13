import type { Section as SectionMeta, ServiceCluster } from "@/lib/schema";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";

interface AcademicServiceProps {
  section: SectionMeta;
  index: string;
  clusters: ServiceCluster[];
}

export function AcademicService({ section, index, clusters }: AcademicServiceProps) {
  return (
    <Section section={section} index={index}>
      <div className="grid gap-10 sm:gap-12 lg:grid-cols-2 lg:gap-14">
        {clusters.map((cluster, position) => (
          <Reveal key={cluster.id} delay={position * 0.06}>
            <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-ink/10 pb-4">
              <h3 className="text-h3 break-words">{cluster.title}</h3>
              {cluster.range ? (
                <p className="shrink-0 font-mono text-label uppercase text-ink-soft">
                  {cluster.range}
                </p>
              ) : null}
            </div>

            {cluster.blurb ? (
              <p className="mt-5 max-w-prose text-small text-ink-soft break-words">{cluster.blurb}</p>
            ) : null}

            <ul className="mt-7 space-y-5">
              {cluster.items.map((serviceItem) => (
                <li key={serviceItem.id} className="flex gap-3">
                  <span
                    aria-hidden="true"
                    className="mt-[0.55rem] h-1 w-1 shrink-0 rounded-full bg-pen/70"
                  />
                  <div className="min-w-0">
                    <p className="text-h4 break-words">{serviceItem.role}</p>
                    <p className="mt-1 text-small text-ink-soft break-words">
                      {serviceItem.event}
                      {serviceItem.year ? (
                        <span className="ml-2.5 font-mono text-micro uppercase tracking-[0.12em] text-ink-soft">
                          {serviceItem.year}
                        </span>
                      ) : null}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
