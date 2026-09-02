import type { MetadataRoute } from "next";
import { loadContent } from "@/lib/content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { content, updatedAt } = await loadContent();

  return [
    {
      url: `${content.meta.siteUrl}/`,
      lastModified: updatedAt ?? new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
