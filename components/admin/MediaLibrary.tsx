"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { FileText, LoaderCircle, Trash2, Upload } from "lucide-react";
import { deleteMediaAction, uploadAction } from "@/app/admin/actions";

interface MediaFile {
  id: string;
  filename: string;
  mime: string;
  sizeBytes: number;
  url: string;
  createdAt: string;
}

function humanSize(bytes: number): string {
  return bytes >= 1024 * 1024
    ? `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    : `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

export function MediaLibrary({ files }: { files: MediaFile[] }) {
  const router = useRouter();
  const imageRef = useRef<HTMLInputElement>(null);
  const documentRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<{ ok: boolean; message: string } | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const upload = (file: File, kind: "image" | "document") => {
    const formData = new FormData();
    formData.set("file", file);
    formData.set("kind", kind);

    startTransition(async () => {
      const result = await uploadAction(formData);
      setStatus({ ok: result.ok, message: result.message });
      if (result.ok) router.refresh();
      if (imageRef.current) imageRef.current.value = "";
      if (documentRef.current) documentRef.current.value = "";
    });
  };

  const remove = (id: string) => {
    startTransition(async () => {
      await deleteMediaAction(id);
      setStatus({
        ok: true,
        message: "Deleted. Anything still pointing at it will now 404 — check the Hero and Contact screens.",
      });
      router.refresh();
    });
  };

  const buttonClass =
    "inline-flex items-center gap-2 rounded-sheet border border-ink/25 px-4 py-2.5 font-mono text-micro uppercase tracking-[0.14em] text-ink-soft transition-colors duration-150 hover:border-pen hover:text-pen disabled:opacity-45";

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => imageRef.current?.click()}
          disabled={pending}
          className={buttonClass}
        >
          {pending ? (
            <LoaderCircle size={13} aria-hidden="true" className="animate-spin" />
          ) : (
            <Upload size={13} aria-hidden="true" />
          )}
          Upload image
        </button>
        <button
          type="button"
          onClick={() => documentRef.current?.click()}
          disabled={pending}
          className={buttonClass}
        >
          <Upload size={13} aria-hidden="true" />
          Upload PDF
        </button>

        <input
          ref={imageRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/avif"
          className="sr-only"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) upload(file, "image");
          }}
        />
        <input
          ref={documentRef}
          type="file"
          accept="application/pdf"
          className="sr-only"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) upload(file, "document");
          }}
        />
      </div>

      <div aria-live="polite" className="mt-4">
        {status ? (
          <p className={`text-small ${status.ok ? "text-ink-soft" : "text-pen"}`}>
            {status.message}
          </p>
        ) : null}
      </div>

      {files.length === 0 ? (
        <p className="mt-8 rounded-sheet border border-dashed border-ink/25 px-4 py-10 text-center text-small text-ink-soft">
          Nothing uploaded yet.
        </p>
      ) : (
        <ul className="mt-8 grid gap-4 sm:grid-cols-2">
          {files.map((file) => (
            <li
              key={file.id}
              className="flex items-start gap-4 rounded-sheet border border-ink/12 bg-paper-raised p-4"
            >
              {file.mime.startsWith("image/") ? (
                // A plain <img>: these are arbitrary user uploads shown at a fixed
                // small size, which is not what next/image is for.
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={file.url}
                  alt=""
                  className="h-16 w-16 shrink-0 rounded-sheet border border-ink/15 object-cover"
                />
              ) : (
                <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-sheet border border-ink/15 bg-paper text-ink-soft">
                  <FileText size={22} aria-hidden="true" />
                </span>
              )}

              <div className="min-w-0 flex-1">
                <p className="truncate text-small text-ink" title={file.filename}>
                  {file.filename}
                </p>
                <p className="mt-1 font-mono text-micro text-ink-soft">
                  {humanSize(file.sizeBytes)} · {file.mime}
                </p>

                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(file.url);
                      setCopied(file.id);
                    }}
                    className="font-mono text-micro uppercase tracking-[0.12em] text-ink-soft underline decoration-ink/30 underline-offset-4 transition-colors hover:text-pen"
                  >
                    {copied === file.id ? "Copied" : "Copy path"}
                  </button>
                  <a
                    href={file.url}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-micro uppercase tracking-[0.12em] text-ink-soft underline decoration-ink/30 underline-offset-4 transition-colors hover:text-pen"
                  >
                    Open
                  </a>
                  <button
                    type="button"
                    onClick={() => remove(file.id)}
                    disabled={pending}
                    aria-label={`Delete ${file.filename}`}
                    className="inline-flex items-center gap-1.5 font-mono text-micro uppercase tracking-[0.12em] text-ink-soft transition-colors hover:text-pen disabled:opacity-45"
                  >
                    <Trash2 size={12} aria-hidden="true" />
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
