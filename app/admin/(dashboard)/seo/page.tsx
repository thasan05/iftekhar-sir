import type { Metadata } from "next";
import { loadContent } from "@/lib/content";
import { SeoEditor } from "@/components/admin/editors/SeoEditor";

export const metadata: Metadata = { title: "Search & sharing" };

export default async function SeoPage() {
  const { content } = await loadContent();
  return <SeoEditor initial={content.meta} />;
}
