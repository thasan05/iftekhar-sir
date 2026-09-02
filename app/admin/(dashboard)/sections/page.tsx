import type { Metadata } from "next";
import { loadContent } from "@/lib/content";
import { SectionsEditor } from "@/components/admin/editors/SectionsEditor";

export const metadata: Metadata = { title: "Sections & order" };

export default async function SectionsPage() {
  const { content } = await loadContent();
  return <SectionsEditor initial={content.sections} />;
}
