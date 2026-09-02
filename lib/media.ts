import "server-only";

import { query, queryOne } from "@/lib/db";

/**
 * Uploads live in Postgres as bytes and are served by `/api/media/[id]`.
 *
 * Keeping them in the database means the whole site needs exactly one service:
 * no blob store, no bucket credentials, nothing extra to configure on Vercel.
 * The volumes here are a headshot and a CV, so this is comfortably the right
 * trade. Ids are content hashes, which makes every URL immutable and safe to
 * cache forever, and re-uploading the same file is free.
 */

export const IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp", "image/avif"] as const;
export const DOCUMENT_TYPES = ["application/pdf"] as const;

const MAX_IMAGE_BYTES = 6 * 1024 * 1024;
const MAX_DOCUMENT_BYTES = 12 * 1024 * 1024;

export type UploadKind = "image" | "document";

export interface MediaRecord {
  id: string;
  filename: string;
  mime: string;
  sizeBytes: number;
  createdAt: Date;
  url: string;
}

export interface UploadResult {
  ok: boolean;
  url?: string;
  message: string;
}

function humanSize(bytes: number): string {
  return bytes >= 1024 * 1024
    ? `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    : `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

function toUint8(value: unknown): Uint8Array {
  if (value instanceof Uint8Array) return value;
  if (Array.isArray(value)) return new Uint8Array(value as number[]);
  if (typeof value === "string") {
    // Postgres bytea in hex form, e.g. "\x89504e47…"
    const hex = value.startsWith("\\x") ? value.slice(2) : value;
    const out = new Uint8Array(hex.length / 2);
    for (let i = 0; i < out.length; i += 1) {
      out[i] = Number.parseInt(hex.substr(i * 2, 2), 16);
    }
    return out;
  }
  return new Uint8Array();
}

async function contentId(bytes: Uint8Array): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", bytes as BufferSource);
  return Array.from(new Uint8Array(digest))
    .slice(0, 12)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Confirm the bytes really are what the content type claims, rather than
 * trusting a client-supplied MIME string.
 */
function sniff(bytes: Uint8Array): string | null {
  const startsWith = (...sig: number[]) => sig.every((byte, i) => bytes[i] === byte);

  if (startsWith(0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a)) return "image/png";
  if (startsWith(0xff, 0xd8, 0xff)) return "image/jpeg";
  if (startsWith(0x25, 0x50, 0x44, 0x46)) return "application/pdf";
  if (startsWith(0x52, 0x49, 0x46, 0x46)) {
    const tag = String.fromCharCode(bytes[8], bytes[9], bytes[10], bytes[11]);
    if (tag === "WEBP") return "image/webp";
  }
  // AVIF and other ISO-BMFF files carry "ftyp" at offset 4.
  if (String.fromCharCode(bytes[4], bytes[5], bytes[6], bytes[7]) === "ftyp") {
    const brand = String.fromCharCode(bytes[8], bytes[9], bytes[10], bytes[11]);
    if (brand.startsWith("avi")) return "image/avif";
  }
  return null;
}

export async function storeUpload(file: File, kind: UploadKind): Promise<UploadResult> {
  if (!file || file.size === 0) return { ok: false, message: "Choose a file first." };

  const limit = kind === "image" ? MAX_IMAGE_BYTES : MAX_DOCUMENT_BYTES;
  if (file.size > limit) {
    return {
      ok: false,
      message: `That file is ${humanSize(file.size)}. The limit is ${humanSize(limit)}.`,
    };
  }

  const bytes = new Uint8Array(await file.arrayBuffer());
  const detected = sniff(bytes);

  if (!detected) {
    return { ok: false, message: "That file type is not recognised." };
  }

  const allowed: readonly string[] = kind === "image" ? IMAGE_TYPES : DOCUMENT_TYPES;
  if (!allowed.includes(detected)) {
    return {
      ok: false,
      message:
        kind === "image"
          ? "Upload a PNG, JPEG, WebP or AVIF image."
          : "Upload a PDF.",
    };
  }

  const id = await contentId(bytes);
  const filename = file.name.slice(0, 120) || `upload-${id}`;

  await query(
    `insert into media (id, filename, mime, size_bytes, bytes)
       values ($1, $2, $3, $4, $5)
     on conflict (id) do nothing`,
    [id, filename, detected, bytes.byteLength, Buffer.from(bytes)],
  );

  return { ok: true, url: `/api/media/${id}`, message: `Uploaded ${filename}.` };
}

export async function readMedia(
  id: string,
): Promise<{ bytes: Uint8Array; mime: string; filename: string } | null> {
  const row = await queryOne<{ bytes: unknown; mime: string; filename: string }>(
    "select bytes, mime, filename from media where id = $1",
    [id],
  );
  if (!row) return null;
  return { bytes: toUint8(row.bytes), mime: row.mime, filename: row.filename };
}

export async function listMedia(): Promise<MediaRecord[]> {
  const rows = await query<{
    id: string;
    filename: string;
    mime: string;
    size_bytes: number;
    created_at: Date;
  }>(
    "select id, filename, mime, size_bytes, created_at from media order by created_at desc limit 60",
  );

  return rows.map((row) => ({
    id: row.id,
    filename: row.filename,
    mime: row.mime,
    sizeBytes: Number(row.size_bytes),
    createdAt: row.created_at,
    url: `/api/media/${row.id}`,
  }));
}

export async function deleteMedia(id: string): Promise<void> {
  await query("delete from media where id = $1", [id]);
}

export { humanSize };
