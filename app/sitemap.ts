import type { MetadataRoute } from "next";
import { loadContent } from "@/lib/content";

function canonicalSiteUrl(siteUrl: string): string {
  return siteUrl === "https://iftekhar-mahmud.vercel.app"
    ? "https://iftekharmahmud.vercel.app"
    : siteUrl;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { content, updatedAt } = await loadContent();
  const siteUrl = canonicalSiteUrl(content.meta.siteUrl);

  return [
    {
      url: `${siteUrl}/`,
      lastModified: updatedAt ?? new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
