import type { MonoFont, SansFont, SerifFont } from "@/lib/schema";

/**
 * Human descriptions for the font pickers.
 *
 * Kept apart from `lib/fonts.ts` because that module calls `next/font`, which
 * must not be pulled into a client bundle just to render a dropdown label.
 */
export const fontLabels = {
  serif: {
    fraunces: "Fraunces — high contrast, a little wonky",
    spectral: "Spectral — quieter, bookish",
    newsreader: "Newsreader — editorial, open",
  } satisfies Record<SerifFont, string>,
  sans: {
    publicSans: "Public Sans — neutral humanist",
    inter: "Inter — tighter, more technical",
  } satisfies Record<SansFont, string>,
  mono: {
    ibmPlexMono: "IBM Plex Mono — warm, slightly narrow",
    jetBrainsMono: "JetBrains Mono — wider, sturdier",
  } satisfies Record<MonoFont, string>,
};
