import { readMedia } from "@/lib/media";

/**
 * Serve an uploaded file. Ids are content hashes, so a URL can never point at
 * different bytes later and the response is safe to cache indefinitely.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  if (!/^[0-9a-f]{8,64}$/.test(id)) {
    return new Response("Not found", { status: 404 });
  }

  const file = await readMedia(id);
  if (!file) return new Response("Not found", { status: 404 });

  return new Response(file.bytes as unknown as BodyInit, {
    headers: {
      "Content-Type": file.mime,
      "Content-Length": String(file.bytes.byteLength),
      "Cache-Control": "public, max-age=31536000, immutable",
      ETag: `"${id}"`,
      "Content-Disposition": `inline; filename="${file.filename.replace(/[^\w.\-]/g, "_")}"`,
      "X-Content-Type-Options": "nosniff",
    },
  });
}
