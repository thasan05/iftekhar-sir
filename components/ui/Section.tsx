import type { ReactNode } from "react";
import type { Section as SectionMeta } from "@/lib/schema";

interface SectionProps {
  section: SectionMeta;
  index: string;
  children: ReactNode;
}

export function Section({ section, index, children }: SectionProps) {
  return (
    <section
      id={section.id}
      aria-labelledby={`${section.id}-title`}
      className={[
        "border-t border-ink/10 py-16 sm:py-section",
        section.tone === "raised" ? "bg-paper-raised" : "",
      ].join(" ")}
    >
      <div className="mx-auto w-full max-w-shell px-5 sm:px-8 lg:px-10">
        <div className="grid gap-y-7 sm:gap-y-8 lg:grid-cols-[9.5rem_minmax(0,1fr)] lg:gap-x-14">
          <div className="lg:border-r lg:border-ink/10 lg:pr-8">
            <p className="font-mono text-label uppercase lg:sticky lg:top-32">
              <span className="block text-pen">§ {index}</span>
              <span className="mt-2 block text-ink-soft">{section.label}</span>
            </p>
          </div>

          <div className="min-w-0">
            <h2 id={`${section.id}-title`} className="max-w-prose text-h2">
              {section.title}
            </h2>
            {section.lede ? (
              <p className="mt-4 max-w-prose text-lede text-ink-soft sm:mt-5">{section.lede}</p>
            ) : null}
            <div className="mt-8 sm:mt-12">{children}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
