import { monoVariables, sansVariables, serifVariables } from "@/lib/fonts";
import type { Theme } from "@/lib/schema";

/**
 * Turn the stored theme into a `:root` block.
 *
 * These are the raw `:root` variables that `app/globals.css` maps Tailwind's
 * colour tokens onto with `@theme inline`. Overriding them here re-themes both
 * the solid utilities and the translucent ones — `border-ink/10` resolves through
 * a `color-mix()` against the same variable, so it follows along.
 *
 * This block is rendered inline and unlayered, so it beats the layered
 * declarations in the stylesheet regardless of order, and there is no flash of
 * the previous palette.
 */
export function themeCss(theme: Theme): string {
  const declarations = [
    `--ink:${theme.ink}`,
    `--ink-soft:${theme.inkSoft}`,
    `--ink-faint:${theme.inkFaint}`,
    `--paper:${theme.paper}`,
    `--paper-raised:${theme.paperRaised}`,
    `--paper-dim:${theme.paperDim}`,
    `--pen:${theme.pen}`,
    `--pen-deep:${theme.penDeep}`,
    `--brass:${theme.brass}`,
    `--brass-deep:${theme.brassDeep}`,
    // Only the face is swapped; the fallback stacks stay in globals.css.
    `--font-serif-face:var(${serifVariables[theme.serif]})`,
    `--font-sans-face:var(${sansVariables[theme.sans]})`,
    `--font-mono-face:var(${monoVariables[theme.mono]})`,
  ];

  return `:root{${declarations.join(";")}}`;
}
