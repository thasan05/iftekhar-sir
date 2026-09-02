"use client";

import { useEffect, useMemo, useState, useTransition, type ReactNode } from "react";
import { CircleAlert, CircleCheck, LoaderCircle, Save } from "lucide-react";
import { saveSliceAction } from "@/app/admin/actions";
import type { SaveResult, SliceKey } from "@/lib/schema";

interface SliceFormContext<T> {
  value: T;
  set: (next: T) => void;
  /** Look up a validation error by path, e.g. err(0, "role") or err("entries", 1). */
  err: (...path: Array<string | number>) => string | undefined;
}

interface SliceFormProps<T> {
  slice: SliceKey;
  initial: T;
  title: string;
  description?: string;
  children: (context: SliceFormContext<T>) => ReactNode;
}

/**
 * The shell every editor screen sits in.
 *
 * The editor keeps its slice in local state and posts the whole slice as JSON on
 * save, which is why arbitrarily nested lists need no form-field naming scheme.
 * Validation happens on the server against the same Zod schema the public site
 * trusts; failures come back as dotted paths and land next to their field.
 */
export function SliceForm<T>({
  slice,
  initial,
  title,
  description,
  children,
}: SliceFormProps<T>) {
  const [value, setValue] = useState<T>(initial);
  const [baseline, setBaseline] = useState(() => JSON.stringify(initial));
  const [result, setResult] = useState<SaveResult | null>(null);
  const [pending, startTransition] = useTransition();

  const serialized = useMemo(() => JSON.stringify(value), [value]);
  const dirty = serialized !== baseline;

  const save = () => {
    startTransition(async () => {
      const outcome = await saveSliceAction(slice, serialized);
      setResult(outcome);
      if (outcome.ok) setBaseline(serialized);
    });
  };

  // Losing edits to a stray navigation is the one failure this panel can't undo.
  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "s") {
        event.preventDefault();
        if (dirty && !pending) save();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // `save` closes over the current serialized value, so it is intentionally
    // re-created each render rather than memoised into staleness.
  });

  const fieldErrors = result?.ok === false ? result.fieldErrors : {};

  const err = (...path: Array<string | number>) => fieldErrors[path.join(".")];

  return (
    <div className="pb-32">
      <header className="mb-10">
        <h1 className="text-h2">{title}</h1>
        {description ? (
          <p className="mt-3 max-w-prose text-body text-ink-soft">{description}</p>
        ) : null}
      </header>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          save();
        }}
      >
        <div className="space-y-10">{children({ value, set: setValue, err })}</div>

        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-ink/12 bg-paper/95 backdrop-blur-md">
          <div className="mx-auto flex w-full max-w-4xl flex-wrap items-center justify-between gap-x-6 gap-y-3 px-6 py-4 lg:px-10">
            <div aria-live="polite" className="min-w-0 flex-1">
              {result ? (
                <p
                  className={[
                    "flex items-start gap-2 text-small",
                    result.ok ? "text-ink-soft" : "text-pen",
                  ].join(" ")}
                >
                  {result.ok ? (
                    <CircleCheck size={16} aria-hidden="true" className="mt-0.5 shrink-0" />
                  ) : (
                    <CircleAlert size={16} aria-hidden="true" className="mt-0.5 shrink-0" />
                  )}
                  <span>{result.message}</span>
                </p>
              ) : (
                <p className="font-mono text-micro uppercase tracking-[0.14em] text-ink-soft">
                  {dirty ? "Unsaved changes" : "Up to date"}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={pending || !dirty}
              className="inline-flex items-center gap-2 rounded-sheet bg-ink px-5 py-3 font-mono text-micro uppercase tracking-[0.16em] text-paper transition-colors duration-200 hover:bg-ink-soft disabled:cursor-not-allowed disabled:opacity-40"
            >
              {pending ? (
                <LoaderCircle size={14} aria-hidden="true" className="animate-spin" />
              ) : (
                <Save size={14} aria-hidden="true" />
              )}
              {pending ? "Publishing" : "Save & publish"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
