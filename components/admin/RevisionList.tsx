"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle, RotateCcw } from "lucide-react";
import { rollbackAction } from "@/app/admin/actions";
import type { SaveResult } from "@/lib/schema";

interface Revision {
  id: string;
  note: string;
  createdAt: string;
}

const formatter = new Intl.DateTimeFormat("en-GB", {
  dateStyle: "medium",
  timeStyle: "short",
});

export function RevisionList({ revisions }: { revisions: Revision[] }) {
  const router = useRouter();
  const [result, setResult] = useState<SaveResult | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const restore = (id: string) => {
    setBusyId(id);
    startTransition(async () => {
      const outcome = await rollbackAction(id);
      setResult(outcome);
      setBusyId(null);
      setConfirmingId(null);
      if (outcome.ok) router.refresh();
    });
  };

  if (revisions.length === 0) {
    return (
      <p className="rounded-sheet border border-dashed border-ink/25 px-4 py-8 text-center text-small text-ink-soft">
        No revisions yet. The first one appears after your next save.
      </p>
    );
  }

  return (
    <div>
      <div aria-live="polite" className="mb-6">
        {result ? (
          <p className={`text-small ${result.ok ? "text-ink-soft" : "text-pen"}`}>
            {result.message}
          </p>
        ) : null}
      </div>

      <ul className="space-y-3">
        {revisions.map((revision) => (
          <li
            key={revision.id}
            className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 rounded-sheet border border-ink/12 bg-paper-raised px-5 py-4"
          >
            <div className="min-w-0">
              <p className="font-mono text-micro uppercase tracking-[0.12em] text-ink">
                {formatter.format(new Date(revision.createdAt))}
              </p>
              <p className="mt-1 text-small text-ink-soft">
                {revision.note || "Saved version"}
              </p>
            </div>

            {confirmingId === revision.id ? (
              <div className="flex items-center gap-3">
                <p className="text-micro text-pen">
                  Replace the live site with this version?
                </p>
                <button
                  type="button"
                  onClick={() => restore(revision.id)}
                  disabled={pending}
                  className="inline-flex items-center gap-2 rounded-sheet bg-pen px-3.5 py-2 font-mono text-micro uppercase tracking-[0.14em] text-paper transition-colors hover:bg-pen-deep disabled:opacity-50"
                >
                  {busyId === revision.id ? (
                    <LoaderCircle size={13} aria-hidden="true" className="animate-spin" />
                  ) : null}
                  Yes, restore
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmingId(null)}
                  className="font-mono text-micro uppercase tracking-[0.14em] text-ink-soft underline decoration-ink/30 underline-offset-4"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmingId(revision.id)}
                className="inline-flex items-center gap-2 rounded-sheet border border-ink/25 px-3.5 py-2 font-mono text-micro uppercase tracking-[0.14em] text-ink-soft transition-colors duration-150 hover:border-pen hover:text-pen"
              >
                <RotateCcw size={13} aria-hidden="true" />
                Restore
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
