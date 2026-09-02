import type { MetadataRoute } from "next";
import { loadContent } from "@/lib/content";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const { content } = await loadContent();

  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/api/"] }],
    sitemap: `${content.meta.siteUrl}/sitemap.xml`,
    host: content.meta.siteUrl,
  };
}
