import type { Metadata } from "next";
import { loadContent } from "@/lib/content";
import { ExperienceEditor } from "@/components/admin/editors/ExperienceEditor";

export const metadata: Metadata = { title: "Experience" };

export default async function ExperiencePage() {
  const { content } = await loadContent();
  return <ExperienceEditor initial={content.experience} />;
}
