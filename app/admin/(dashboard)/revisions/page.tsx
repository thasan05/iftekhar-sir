import type { Metadata } from "next";
import { listRevisions } from "@/lib/content";
import { RevisionList } from "@/components/admin/RevisionList";

export const metadata: Metadata = { title: "Revisions" };

export default async function RevisionsPage() {
  const revisions = await listRevisions(40);

  return (
    <div className="pb-16">
      <header className="mb-10">
        <h1 className="text-h2">Revisions</h1>
        <p className="mt-3 max-w-prose text-body text-ink-soft">
          Every save stores the version it replaced. Because edits publish
          immediately, this history is the undo button: restoring a revision brings
          the whole document back and publishes it.
        </p>
      </header>

      <RevisionList
        revisions={revisions.map((revision) => ({
          id: revision.id,
          note: revision.note,
          createdAt: revision.createdAt.toISOString(),
        }))}
      />
    </div>
  );
}
