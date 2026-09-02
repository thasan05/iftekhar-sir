import type { Metadata } from "next";
import { loadContent } from "@/lib/content";
import { ContactEditor } from "@/components/admin/editors/ContactEditor";

export const metadata: Metadata = { title: "Contact" };

export default async function ContactPage() {
  const { content } = await loadContent();
  return <ContactEditor initial={content.contact} />;
}
