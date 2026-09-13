import type { MetadataRoute } from "next";
import { loadContent } from "@/lib/content";

function canonicalSiteUrl(siteUrl: string): string {
  return siteUrl === "https://iftekhar-mahmud.vercel.app"
    ? "https://iftekharmahmud.vercel.app"
    : siteUrl;
}

export default async function robots(): Promise<MetadataRoute.Robots> {
  const { content } = await loadContent();
  const siteUrl = canonicalSiteUrl(content.meta.siteUrl);

  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/api/"] }],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
