import type { Metadata } from "next";
import { loadContent } from "@/lib/content";
import { ResearchEditor } from "@/components/admin/editors/ResearchEditor";

export const metadata: Metadata = { title: "Research" };

export default async function ResearchPage() {
  const { content } = await loadContent();
  return <ResearchEditor initial={content.research} />;
}
