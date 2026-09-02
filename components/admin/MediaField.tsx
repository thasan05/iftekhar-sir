"use client";

import { useRef, useState, useTransition } from "react";
import { CircleAlert, LoaderCircle, Upload } from "lucide-react";
import { uploadAction } from "@/app/admin/actions";

interface MediaFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  kind: "image" | "document";
  hint?: string;
  error?: string;
}

/**
 * Upload a file or point at one that already exists.
 *
 * Uploads are stored by content hash, so the same file uploaded twice costs
 * nothing and every returned URL is safe to cache forever.
 */
export function MediaField({
  label,
  value,
  onChange,
  kind,
  hint,
  error,
}: MediaFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<{ ok: boolean; message: string } | null>(null);
  const [pending, startTransition] = useTransition();

  const upload = (file: File) => {
    const formData = new FormData();
    formData.set("file", file);
    formData.set("kind", kind);

    startTransition(async () => {
      const result = await uploadAction(formData);
      setStatus({ ok: result.ok, message: result.message });
      if (result.ok && result.url) onChange(result.url);
      if (inputRef.current) inputRef.current.value = "";
    });
  };

  const accept =
    kind === "image" ? "image/png,image/jpeg,image/webp,image/avif" : "application/pdf";

  return (
    <fieldset>
      <legend className="mb-2 font-mono text-label uppercase text-ink-soft">{label}</legend>

      <div className="flex flex-wrap items-start gap-4">
        {kind === "image" && value ? (
          // Deliberately a plain <img>: the source is arbitrary and changes as
          // soon as something is uploaded, which is not what next/image is for.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={value}
            alt=""
            className="h-20 w-20 shrink-0 rounded-full border border-ink/15 object-cover"
          />
        ) : null}

        <div className="min-w-[16rem] flex-1 space-y-3">
          <input
            type="text"
            value={value}
            spellCheck={false}
            aria-label={`${label} path`}
            placeholder={kind === "image" ? "/headshot.webp" : "/api/media/…"}
            onChange={(event) => onChange(event.target.value)}
            className={[
              "w-full rounded-sheet border bg-paper px-3 py-2.5 font-mono text-micro text-ink transition-colors duration-150 focus:border-pen focus:outline-none",
              error ? "border-pen bg-pen/5" : "border-ink/20 hover:border-ink/35",
            ].join(" ")}
          />

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={pending}
              className="inline-flex items-center gap-2 rounded-sheet border border-ink/25 px-3.5 py-2 font-mono text-micro uppercase tracking-[0.14em] text-ink-soft transition-colors duration-150 hover:border-pen hover:text-pen disabled:opacity-50"
            >
              {pending ? (
                <LoaderCircle size={13} aria-hidden="true" className="animate-spin" />
              ) : (
                <Upload size={13} aria-hidden="true" />
              )}
              {pending ? "Uploading" : `Upload ${kind === "image" ? "image" : "PDF"}`}
            </button>

            {value ? (
              <button
                type="button"
                onClick={() => {
                  onChange("");
                  setStatus(null);
                }}
                className="font-mono text-micro uppercase tracking-[0.14em] text-ink-soft underline decoration-ink/30 underline-offset-4 transition-colors hover:text-pen"
              >
                Clear
              </button>
            ) : null}
          </div>

          <input
            ref={inputRef}
            type="file"
            accept={accept}
            className="sr-only"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) upload(file);
            }}
          />

          <div aria-live="polite">
            {error ? (
              <p className="flex items-start gap-2 text-micro text-pen">
                <CircleAlert size={13} aria-hidden="true" className="mt-0.5 shrink-0" />
                <span>{error}</span>
              </p>
            ) : status ? (
              <p className={`text-micro ${status.ok ? "text-ink-soft" : "text-pen"}`}>
                {status.message}
              </p>
            ) : hint ? (
              <p className="text-micro text-ink-soft">{hint}</p>
            ) : null}
          </div>
        </div>
      </div>
    </fieldset>
  );
}
