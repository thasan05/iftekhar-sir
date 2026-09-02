import {
  Fraunces,
  IBM_Plex_Mono,
  Inter,
  JetBrains_Mono,
  Newsreader,
  Public_Sans,
  Spectral,
} from "next/font/google";
import type { MonoFont, SansFont, SerifFont } from "@/lib/schema";

/**
 * Every font the admin panel can choose, declared once at module scope as
 * `next/font` requires.
 *
 * Only the defaults are preloaded. The alternates still ship their @font-face
 * rules, but a browser downloads a face only when something on the page actually
 * uses it, so offering the choice costs nothing until the choice is made.
 */

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const spectral = Spectral({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-spectral",
  display: "swap",
  preload: false,
});

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  display: "swap",
  preload: false,
});

const publicSans = Public_Sans({
  subsets: ["latin"],
  variable: "--font-public-sans",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: false,
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-ibm-plex-mono",
  display: "swap",
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
  preload: false,
});

/** Applied to <html> so every family's variable is in scope. */
export const fontVariables = [
  fraunces.variable,
  spectral.variable,
  newsreader.variable,
  publicSans.variable,
  inter.variable,
  ibmPlexMono.variable,
  jetBrainsMono.variable,
].join(" ");

export const serifVariables: Record<SerifFont, string> = {
  fraunces: "--font-fraunces",
  spectral: "--font-spectral",
  newsreader: "--font-newsreader",
};

export const sansVariables: Record<SansFont, string> = {
  publicSans: "--font-public-sans",
  inter: "--font-inter",
};

export const monoVariables: Record<MonoFont, string> = {
  ibmPlexMono: "--font-ibm-plex-mono",
  jetBrainsMono: "--font-jetbrains-mono",
};

// Font labels for the admin pickers live in `lib/fontLabels.ts`, which client
// components can import without dragging `next/font` along with them.
