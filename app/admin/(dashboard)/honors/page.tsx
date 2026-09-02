import type { Metadata } from "next";
import { loadContent } from "@/lib/content";
import { HonorsEditor } from "@/components/admin/editors/HonorsEditor";

export const metadata: Metadata = { title: "Honors" };

export default async function HonorsPage() {
  const { content } = await loadContent();
  return <HonorsEditor initial={content.honors} />;
}
