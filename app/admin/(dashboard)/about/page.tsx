import type { Metadata } from "next";
import { loadContent } from "@/lib/content";
import { AboutEditor } from "@/components/admin/editors/AboutEditor";

export const metadata: Metadata = { title: "About" };

export default async function AboutPage() {
  const { content } = await loadContent();
  return <AboutEditor initial={content.about} />;
}
