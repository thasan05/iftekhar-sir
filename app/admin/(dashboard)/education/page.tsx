import type { Metadata } from "next";
import { loadContent } from "@/lib/content";
import { EducationEditor } from "@/components/admin/editors/EducationEditor";

export const metadata: Metadata = { title: "Education" };

export default async function EducationPage() {
  const { content } = await loadContent();
  return <EducationEditor initial={content.education} />;
}
