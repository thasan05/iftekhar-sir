import type { Metadata } from "next";
import { loadContent } from "@/lib/content";
import { ProfilesEditor } from "@/components/admin/editors/ProfilesEditor";

export const metadata: Metadata = { title: "Profiles" };

export default async function ProfilesPage() {
  const { content } = await loadContent();
  return <ProfilesEditor initial={content.socials} />;
}
