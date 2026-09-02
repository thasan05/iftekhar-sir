import type { ReactNode } from "react";
import type { Section as SectionMeta } from "@/lib/schema";

interface SectionProps {
  section: SectionMeta;
  /** Position in the page, e.g. "03". Derived from order, never stored. */
  index: string;
  children: ReactNode;
}

/**
 * Shared section frame: a narrow left margin carrying the section number and
 * name — the manuscript gutter — with the content set against a hairline rule.
 */
export function Section({ section, index, children }: SectionProps) {
  return (
    <section
      id={section.id}
      aria-labelledby={`${section.id}-title`}
      className={[
        "border-t border-ink/10 py-section",
        section.tone === "raised" ? "bg-paper-raised" : "",
      ].join(" ")}
    >
      <div className="mx-auto w-full max-w-shell px-6 sm:px-8 lg:px-10">
        <div className="grid gap-y-8 lg:grid-cols-[9.5rem_minmax(0,1fr)] lg:gap-x-14">
          <div className="lg:border-r lg:border-ink/10 lg:pr-8">
            <p className="font-mono text-label uppercase lg:sticky lg:top-32">
              <span className="block text-pen">§ {index}</span>
              <span className="mt-2 block text-ink-soft">{section.label}</span>
            </p>
          </div>

          <div>
            <h2 id={`${section.id}-title`} className="max-w-prose text-h2">
              {section.title}
            </h2>
            {section.lede ? (
              <p className="mt-5 max-w-prose text-lede text-ink-soft">{section.lede}</p>
            ) : null}
            <div className="mt-10 sm:mt-12">{children}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
