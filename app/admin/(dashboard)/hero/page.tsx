import type { Metadata } from "next";
import { loadContent } from "@/lib/content";
import { HeroEditor } from "@/components/admin/editors/HeroEditor";

export const metadata: Metadata = { title: "Hero" };

export default async function HeroPage() {
  const { content } = await loadContent();
  return <HeroEditor initial={content.hero} />;
}
