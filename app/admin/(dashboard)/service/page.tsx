import type { Metadata } from "next";
import { loadContent } from "@/lib/content";
import { ServiceEditor } from "@/components/admin/editors/ServiceEditor";

export const metadata: Metadata = { title: "Academic service" };

export default async function ServicePage() {
  const { content } = await loadContent();
  return <ServiceEditor initial={content.service} />;
}
