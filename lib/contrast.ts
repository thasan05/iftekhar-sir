import type { Theme } from "@/lib/schema";

/**
 * WCAG contrast maths, kept free of any font or server import so the theme
 * editor can run the very same checks in the browser as the reviewer ran against
 * the built page.
 */

function channel(value: number): number {
  const v = value / 255;
  return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}

export function parseHex(hex: string): { r: number; g: number; b: number } | null {
  const match = /^#([0-9a-f]{6})$/i.exec(hex.trim());
  if (!match) return null;
  const int = Number.parseInt(match[1], 16);
  return { r: (int >> 16) & 255, g: (int >> 8) & 255, b: int & 255 };
}

export function relativeLuminance(hex: string): number | null {
  const rgb = parseHex(hex);
  if (!rgb) return null;
  return 0.2126 * channel(rgb.r) + 0.7152 * channel(rgb.g) + 0.0722 * channel(rgb.b);
}

/** WCAG 2.1 contrast ratio, or null if either colour is unparseable. */
export function contrastRatio(foreground: string, background: string): number | null {
  const a = relativeLuminance(foreground);
  const b = relativeLuminance(background);
  if (a === null || b === null) return null;
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

export interface ContrastCheck {
  label: string;
  foreground: string;
  background: string;
  ratio: number | null;
  /** 4.5 for body text, 3 for large text and non-text marks. */
  required: number;
  passes: boolean;
  note: string;
}

/**
 * The pairings that actually appear on the page. Checked against the same
 * thresholds the built site was verified against, so the palette cannot quietly
 * regress below AA.
 */
export function auditTheme(theme: Theme): ContrastCheck[] {
  const pairs: Array<Omit<ContrastCheck, "ratio" | "passes">> = [
    {
      label: "Body text on paper",
      foreground: theme.ink,
      background: theme.paper,
      required: 4.5,
      note: "Every paragraph and heading.",
    },
    {
      label: "Secondary text on paper",
      foreground: theme.inkSoft,
      background: theme.paper,
      required: 4.5,
      note: "Summaries, dates, margin labels.",
    },
    {
      label: "Secondary text on raised sections",
      foreground: theme.inkSoft,
      background: theme.paperRaised,
      required: 4.5,
      note: "Education, Honors and Skills sit on this tone.",
    },
    {
      label: "Accent text on paper",
      foreground: theme.pen,
      background: theme.paper,
      required: 4.5,
      note: "Links, section numbers, the award tag.",
    },
    {
      label: "Accent text on raised sections",
      foreground: theme.pen,
      background: theme.paperRaised,
      required: 4.5,
      note: "Distinctions in Education.",
    },
    {
      label: "Brass text on raised sections",
      foreground: theme.brassDeep,
      background: theme.paperRaised,
      required: 4.5,
      note: "Honor years. Plain brass is decorative only.",
    },
    {
      label: "Paper text on ink",
      foreground: theme.paper,
      background: theme.ink,
      required: 4.5,
      note: "The dark Contact panel and the primary button.",
    },
    {
      label: "Focus ring against paper",
      foreground: theme.pen,
      background: theme.paper,
      required: 3,
      note: "Keyboard focus must stay visible.",
    },
  ];

  return pairs.map((pair) => {
    const ratio = contrastRatio(pair.foreground, pair.background);
    return {
      ...pair,
      ratio,
      passes: ratio !== null && ratio >= pair.required,
    };
  });
}
