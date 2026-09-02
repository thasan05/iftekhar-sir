"use client";

import { useRef, useState, useTransition } from "react";
import { Database, Download, LoaderCircle, Upload } from "lucide-react";
import { exportAction, importAction, seedAction } from "@/app/admin/actions";
import type { SaveResult } from "@/lib/schema";

const buttonClass =
  "inline-flex items-center gap-2 rounded-sheet border border-ink/25 px-4 py-2.5 font-mono text-micro uppercase tracking-[0.14em] text-ink-soft transition-colors duration-150 hover:border-pen hover:text-pen disabled:cursor-not-allowed disabled:opacity-45";

export function DashboardTools({ seeded }: { seeded: boolean }) {
  const [result, setResult] = useState<SaveResult | null>(null);
  const [pending, startTransition] = useTransition();
  const fileRef = useRef<HTMLInputElement>(null);

  const run = (task: () => Promise<SaveResult>) => {
    startTransition(async () => setResult(await task()));
  };

  const download = () => {
    startTransition(async () => {
      const json = await exportAction();
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      const stamp = new Date().toISOString().slice(0, 10);
      anchor.href = url;
      anchor.download = `site-content-${stamp}.json`;
      anchor.click();
      URL.revokeObjectURL(url);
      setResult({ ok: true, fieldErrors: {}, message: "Backup downloaded." });
    });
  };

  const restore = (file: File) => {
    startTransition(async () => {
      const text = await file.text();
      setResult(await importAction(text));
      if (fileRef.current) fileRef.current.value = "";
    });
  };

  return (
    <section className="mt-12">
      <h2 className="text-h3">Backups</h2>
      <p className="mt-2 max-w-prose text-small text-ink-soft">
        The whole site is one JSON document. Download it before a large rewrite, and
        restore it if something needs undoing beyond what the revision history holds.
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button type="button" onClick={download} disabled={pending} className={buttonClass}>
          {pending ? (
            <LoaderCircle size={13} aria-hidden="true" className="animate-spin" />
          ) : (
            <Download size={13} aria-hidden="true" />
          )}
          Download backup
        </button>

        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={pending}
          className={buttonClass}
        >
          <Upload size={13} aria-hidden="true" />
          Restore from file
        </button>

        {seeded ? (
          <button
            type="button"
            onClick={() => run(seedAction)}
            disabled={pending}
            className={buttonClass}
          >
            <Database size={13} aria-hidden="true" />
            Initialise database
          </button>
        ) : null}

        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          className="sr-only"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) restore(file);
          }}
        />
      </div>

      <div aria-live="polite" className="mt-4">
        {result ? (
          <p className={`text-small ${result.ok ? "text-ink-soft" : "text-pen"}`}>
            {result.message}
          </p>
        ) : null}
      </div>
    </section>
  );
}
