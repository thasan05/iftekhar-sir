import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import { loadContent } from "@/lib/content";
import { fontVariables } from "@/lib/fonts";
import { themeCss } from "@/lib/theme";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const { content } = await loadContent();
  const { meta, identity } = content;
  const [firstName, ...rest] = identity.name.split(" ");

  return {
    metadataBase: new URL(meta.siteUrl),
    title: {
      default: meta.title,
      template: `%s — ${identity.name}`,
    },
    description: meta.description,
    keywords: meta.keywords,
    authors: [{ name: identity.name, url: meta.siteUrl }],
    creator: identity.name,
    applicationName: identity.name,
    category: "education",
    alternates: { canonical: "/" },
    openGraph: {
      type: "profile",
      firstName,
      lastName: rest.join(" "),
      siteName: identity.name,
      title: meta.title,
      description: meta.description,
      url: meta.siteUrl,
      locale: "en_GB",
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large" },
    },
  };
}

export async function generateViewport(): Promise<Viewport> {
  const { content } = await loadContent();
  return { themeColor: content.theme.paper, colorScheme: "light" };
}

export default async function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const { content } = await loadContent();

  return (
    <html lang="en" className={fontVariables}>
      <body
        className={[
          content.theme.grain ? "paper-grain" : "",
          "flex min-h-dvh flex-col bg-paper text-ink",
        ].join(" ")}
      >
        {/* Live theme tokens. Unlayered, so this always wins over globals.css. */}
        <style dangerouslySetInnerHTML={{ __html: themeCss(content.theme) }} />

        {/* Motion pre-renders every reveal target in its hidden state. With no
            JavaScript there is nothing to animate them in, so show them as-is.
            Anything animated on mount or on scroll carries `.motion-reveal`. */}
        <noscript
          dangerouslySetInnerHTML={{
            __html:
              "<style>.motion-reveal{opacity:1!important;transform:none!important;stroke-dasharray:none!important}</style>",
          }}
        />

        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[70] focus:rounded-sheet focus:bg-ink focus:px-4 focus:py-2.5 focus:font-mono focus:text-micro focus:uppercase focus:tracking-[0.16em] focus:text-paper"
        >
          Skip to content
        </a>

        {children}
      </body>
    </html>
  );
}
