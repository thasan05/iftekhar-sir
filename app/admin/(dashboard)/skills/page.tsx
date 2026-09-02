import type { Metadata } from "next";
import { loadContent } from "@/lib/content";
import { SkillsEditor } from "@/components/admin/editors/SkillsEditor";

export const metadata: Metadata = { title: "Skills" };

export default async function SkillsPage() {
  const { content } = await loadContent();
  return <SkillsEditor initial={content.skills} />;
}
