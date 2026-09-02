import type { ReactNode } from "react";

interface PillProps {
  children: ReactNode;
}

/** Tag used for research interests and skills — a set, not a sequence. */
export function Pill({ children }: PillProps) {
  return (
    <li className="inline-flex items-center rounded-full border border-ink/15 bg-paper-raised px-3.5 py-1.5 text-small text-ink-soft">
      {children}
    </li>
  );
}
