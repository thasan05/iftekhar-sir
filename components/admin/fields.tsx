"use client";

import { useId, type ReactNode } from "react";
import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";

/**
 * Form primitives for the admin panel.
 *
 * Every control is a plain labelled input wired to React state — no form
 * library, no uncontrolled surprises. Errors arrive as dotted paths from Zod and
 * are rendered next to the field they belong to, announced via aria-describedby.
 */

const inputClass =
  "w-full rounded-sheet border border-ink/20 bg-paper px-3 py-2.5 text-small text-ink transition-colors duration-150 placeholder:text-ink-soft/60 hover:border-ink/35 focus:border-pen focus:outline-none";

const invalidClass = "border-pen bg-pen/5";

interface FieldShellProps {
  label: string;
  hint?: string;
  error?: string;
  children: (ids: { inputId: string; describedBy: string | undefined }) => ReactNode;
}

function FieldShell({ label, hint, error, children }: FieldShellProps) {
  const base = useId();
  const inputId = `${base}-input`;
  const hintId = hint ? `${base}-hint` : undefined;
  const errorId = error ? `${base}-error` : undefined;
  const describedBy = [errorId, hintId].filter(Boolean).join(" ") || undefined;

  return (
    <div>
      <label
        htmlFor={inputId}
        className="mb-2 block font-mono text-label uppercase text-ink-soft"
      >
        {label}
      </label>
      {children({ inputId, describedBy })}
      {error ? (
        <p id={errorId} className="mt-2 text-micro text-pen">
          {error}
        </p>
      ) : null}
      {hint ? (
        <p id={hintId} className="mt-2 text-micro text-ink-soft">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

interface TextFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  hint?: string;
  error?: string;
  placeholder?: string;
  rows?: number;
  mono?: boolean;
  type?: "text" | "email" | "url";
}

export function TextField({
  label,
  value,
  onChange,
  hint,
  error,
  placeholder,
  rows,
  mono,
  type = "text",
}: TextFieldProps) {
  return (
    <FieldShell label={label} hint={hint} error={error}>
      {({ inputId, describedBy }) =>
        rows ? (
          <textarea
            id={inputId}
            rows={rows}
            value={value}
            placeholder={placeholder}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy}
            onChange={(event) => onChange(event.target.value)}
            className={[inputClass, "resize-y leading-relaxed", error ? invalidClass : ""].join(" ")}
          />
        ) : (
          <input
            id={inputId}
            type={type}
            value={value}
            placeholder={placeholder}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy}
            onChange={(event) => onChange(event.target.value)}
            className={[inputClass, mono ? "font-mono" : "", error ? invalidClass : ""].join(" ")}
          />
        )
      }
    </FieldShell>
  );
}

interface SelectFieldProps<T extends string> {
  label: string;
  value: T;
  options: Array<{ value: T; label: string }>;
  onChange: (value: T) => void;
  hint?: string;
  error?: string;
}

export function SelectField<T extends string>({
  label,
  value,
  options,
  onChange,
  hint,
  error,
}: SelectFieldProps<T>) {
  return (
    <FieldShell label={label} hint={hint} error={error}>
      {({ inputId, describedBy }) => (
        <select
          id={inputId}
          value={value}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          onChange={(event) => onChange(event.target.value as T)}
          className={[inputClass, error ? invalidClass : ""].join(" ")}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )}
    </FieldShell>
  );
}

export function CheckboxField({
  label,
  checked,
  onChange,
  hint,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  hint?: string;
}) {
  const base = useId();
  return (
    <div className="flex items-start gap-3">
      <input
        id={base}
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-0.5 h-4 w-4 shrink-0 accent-pen"
      />
      <div>
        <label htmlFor={base} className="text-small text-ink">
          {label}
        </label>
        {hint ? <p className="mt-1 text-micro text-ink-soft">{hint}</p> : null}
      </div>
    </div>
  );
}

export function ColorField({
  label,
  value,
  onChange,
  error,
  hint,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  hint?: string;
}) {
  const base = useId();
  const errorId = error ? `${base}-error` : undefined;

  return (
    <div>
      <label
        htmlFor={`${base}-hex`}
        className="mb-2 block font-mono text-label uppercase text-ink-soft"
      >
        {label}
      </label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          aria-label={`${label} colour picker`}
          value={/^#[0-9a-fA-F]{6}$/.test(value) ? value : "#000000"}
          onChange={(event) => onChange(event.target.value.toUpperCase())}
          className="h-10 w-12 shrink-0 cursor-pointer rounded-sheet border border-ink/20 bg-paper p-1"
        />
        <input
          id={`${base}-hex`}
          type="text"
          value={value}
          spellCheck={false}
          aria-invalid={error ? true : undefined}
          aria-describedby={errorId}
          onChange={(event) => onChange(event.target.value.toUpperCase())}
          className={[inputClass, "font-mono uppercase", error ? invalidClass : ""].join(" ")}
        />
      </div>
      {error ? (
        <p id={errorId} className="mt-2 text-micro text-pen">
          {error}
        </p>
      ) : null}
      {hint ? <p className="mt-2 text-micro text-ink-soft">{hint}</p> : null}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Ordering
// ---------------------------------------------------------------------------

export function move<T>(items: T[], from: number, to: number): T[] {
  if (to < 0 || to >= items.length) return items;
  const next = [...items];
  const [moved] = next.splice(from, 1);
  next.splice(to, 0, moved);
  return next;
}

export function newId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}

const iconButtonClass =
  "inline-flex h-8 w-8 items-center justify-center rounded-sheet border border-ink/20 bg-paper text-ink-soft transition-colors duration-150 hover:border-ink/40 hover:text-ink disabled:cursor-not-allowed disabled:opacity-35";

function RowControls({
  label,
  index,
  total,
  onMove,
  onRemove,
}: {
  label: string;
  index: number;
  total: number;
  onMove: (to: number) => void;
  onRemove: () => void;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        className={iconButtonClass}
        disabled={index === 0}
        aria-label={`Move ${label} up`}
        onClick={() => onMove(index - 1)}
      >
        <ChevronUp size={15} aria-hidden="true" />
      </button>
      <button
        type="button"
        className={iconButtonClass}
        disabled={index === total - 1}
        aria-label={`Move ${label} down`}
        onClick={() => onMove(index + 1)}
      >
        <ChevronDown size={15} aria-hidden="true" />
      </button>
      <button
        type="button"
        className={`${iconButtonClass} hover:border-pen hover:text-pen`}
        aria-label={`Remove ${label}`}
        onClick={onRemove}
      >
        <Trash2 size={15} aria-hidden="true" />
      </button>
    </div>
  );
}

export function AddButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-sheet border border-dashed border-ink/30 px-4 py-2.5 font-mono text-micro uppercase tracking-[0.14em] text-ink-soft transition-colors duration-150 hover:border-pen hover:text-pen"
    >
      <Plus size={14} aria-hidden="true" />
      {label}
    </button>
  );
}

/** A list of plain strings — bullet points, paragraphs, tags. */
export function StringList({
  label,
  items,
  onChange,
  itemLabel,
  addLabel,
  rows,
  errorAt,
  hint,
}: {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
  itemLabel: string;
  addLabel: string;
  rows?: number;
  errorAt?: (index: number) => string | undefined;
  hint?: string;
}) {
  return (
    <fieldset>
      <legend className="mb-2 font-mono text-label uppercase text-ink-soft">{label}</legend>
      {hint ? <p className="mb-4 text-micro text-ink-soft">{hint}</p> : null}

      <ul className="space-y-3">
        {items.map((item, index) => (
          <li key={index} className="flex items-start gap-2">
            <div className="flex-1">
              {rows ? (
                <textarea
                  rows={rows}
                  value={item}
                  aria-label={`${itemLabel} ${index + 1}`}
                  onChange={(event) => {
                    const next = [...items];
                    next[index] = event.target.value;
                    onChange(next);
                  }}
                  className={[
                    inputClass,
                    "resize-y leading-relaxed",
                    errorAt?.(index) ? invalidClass : "",
                  ].join(" ")}
                />
              ) : (
                <input
                  type="text"
                  value={item}
                  aria-label={`${itemLabel} ${index + 1}`}
                  onChange={(event) => {
                    const next = [...items];
                    next[index] = event.target.value;
                    onChange(next);
                  }}
                  className={[inputClass, errorAt?.(index) ? invalidClass : ""].join(" ")}
                />
              )}
              {errorAt?.(index) ? (
                <p className="mt-1.5 text-micro text-pen">{errorAt(index)}</p>
              ) : null}
            </div>
            <div className="pt-1">
              <RowControls
                label={`${itemLabel} ${index + 1}`}
                index={index}
                total={items.length}
                onMove={(to) => onChange(move(items, index, to))}
                onRemove={() => onChange(items.filter((_, i) => i !== index))}
              />
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-4">
        <AddButton label={addLabel} onClick={() => onChange([...items, ""])} />
      </div>
    </fieldset>
  );
}

/** A list of objects: each row is a card with its own fields. */
export function Repeater<T>({
  items,
  onChange,
  makeItem,
  titleFor,
  addLabel,
  children,
  emptyMessage,
}: {
  items: T[];
  onChange: (items: T[]) => void;
  makeItem: () => T;
  titleFor: (item: T, index: number) => string;
  addLabel: string;
  emptyMessage?: string;
  children: (item: T, update: (patch: Partial<T>) => void, index: number) => ReactNode;
}) {
  return (
    <div>
      {items.length === 0 && emptyMessage ? (
        <p className="mb-4 rounded-sheet border border-dashed border-ink/25 px-4 py-6 text-center text-small text-ink-soft">
          {emptyMessage}
        </p>
      ) : null}

      <ul className="space-y-5">
        {items.map((item, index) => (
          <li
            key={index}
            className="rounded-sheet border border-ink/12 bg-paper-raised p-5 shadow-card"
          >
            <div className="mb-5 flex items-center justify-between gap-4 border-b border-ink/10 pb-3">
              <p className="font-mono text-label uppercase text-ink-soft">
                {titleFor(item, index)}
              </p>
              <RowControls
                label={titleFor(item, index)}
                index={index}
                total={items.length}
                onMove={(to) => onChange(move(items, index, to))}
                onRemove={() => onChange(items.filter((_, i) => i !== index))}
              />
            </div>

            <div className="space-y-5">
              {children(
                item,
                (patch) => {
                  const next = [...items];
                  next[index] = { ...items[index], ...patch };
                  onChange(next);
                },
                index,
              )}
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-5">
        <AddButton label={addLabel} onClick={() => onChange([...items, makeItem()])} />
      </div>
    </div>
  );
}

/** Groups fields inside one editor screen. */
export function Panel({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="border-t border-ink/10 pt-8 first:border-t-0 first:pt-0">
      <h2 className="text-h3">{title}</h2>
      {description ? (
        <p className="mt-2 max-w-prose text-small text-ink-soft">{description}</p>
      ) : null}
      <div className="mt-6 space-y-6">{children}</div>
    </section>
  );
}

export function FieldRow({ children }: { children: ReactNode }) {
  return <div className="grid gap-5 sm:grid-cols-2">{children}</div>;
}
