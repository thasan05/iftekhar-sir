import type { Metadata } from "next";
import { loadContent } from "@/lib/content";
import { IdentityEditor } from "@/components/admin/editors/IdentityEditor";

export const metadata: Metadata = { title: "Identity" };

export default async function IdentityPage() {
  const { content } = await loadContent();
  return <IdentityEditor initial={content.identity} />;
}
