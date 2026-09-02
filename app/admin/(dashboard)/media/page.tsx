import type { Metadata } from "next";
import { listMedia } from "@/lib/media";
import { MediaLibrary } from "@/components/admin/MediaLibrary";

export const metadata: Metadata = { title: "Uploads" };

export default async function MediaPage() {
  const files = await listMedia();

  return (
    <div className="pb-16">
      <header className="mb-10">
        <h1 className="text-h2">Uploads</h1>
        <p className="mt-3 max-w-prose text-body text-ink-soft">
          Images and PDFs, stored in the database and served from immutable URLs.
          Files are addressed by a hash of their contents, so uploading the same
          file twice takes no extra space and no URL ever changes meaning.
        </p>
      </header>

      <MediaLibrary
        files={files.map((file) => ({
          id: file.id,
          filename: file.filename,
          mime: file.mime,
          sizeBytes: file.sizeBytes,
          url: file.url,
          createdAt: file.createdAt.toISOString(),
        }))}
      />
    </div>
  );
}
