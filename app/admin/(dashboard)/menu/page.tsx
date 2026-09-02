import type { Metadata } from "next";
import { loadContent } from "@/lib/content";
import { MenuEditor } from "@/components/admin/editors/MenuEditor";

export const metadata: Metadata = { title: "Menu" };

export default async function MenuPage() {
  const { content } = await loadContent();
  return <MenuEditor initial={content.nav} />;
}
