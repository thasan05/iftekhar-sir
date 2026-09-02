import type { Metadata } from "next";
import { loadContent } from "@/lib/content";
import { ThemeEditor } from "@/components/admin/editors/ThemeEditor";

export const metadata: Metadata = { title: "Theme" };

export default async function ThemePage() {
  const { content } = await loadContent();
  return <ThemeEditor initial={content.theme} />;
}
