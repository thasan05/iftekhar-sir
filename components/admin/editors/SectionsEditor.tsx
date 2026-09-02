"use client";

import type { Section } from "@/lib/schema";
import { SliceForm } from "@/components/admin/SliceForm";
import {
  CheckboxField,
  FieldRow,
  Panel,
  SelectField,
  TextField,
  move,
} from "@/components/admin/fields";
import { ChevronDown, ChevronUp } from "lucide-react";

const iconButtonClass =
  "inline-flex h-8 w-8 items-center justify-center rounded-sheet border border-ink/20 bg-paper text-ink-soft transition-colors duration-150 hover:border-ink/40 hover:text-ink disabled:cursor-not-allowed disabled:opacity-35";

/**
 * Sections are a fixed set — each one has a component behind it — so they can be
 * reordered, retitled and hidden, but not invented or deleted. The § numbers on
 * the page come from this order, so moving a section renumbers the page.
 */
export function SectionsEditor({ initial }: { initial: Section[] }) {
  return (
    <SliceForm
      slice="sections"
      initial={initial}
      title="Sections & order"
      description="Reorder the page, rename the margin labels and headings, and hide anything not needed. Numbering follows the order automatically."
    >
      {({ value, set, err }) => {
        const visibleCount = value.filter((section) => section.enabled).length;

        return (
          <Panel
            title="Page order"
            description={`${visibleCount} of ${value.length} sections are shown. The hero always comes first and is edited on its own screen.`}
          >
            <ul className="space-y-5">
              {value.map((section, index) => {
                const position = value
                  .slice(0, index + 1)
                  .filter((candidate) => candidate.enabled).length;

                return (
                  <li
                    key={section.id}
                    className={[
                      "rounded-sheet border p-5 shadow-card transition-colors",
                      section.enabled
                        ? "border-ink/12 bg-paper-raised"
                        : "border-dashed border-ink/20 bg-paper",
                    ].join(" ")}
                  >
                    <div className="mb-5 flex items-center justify-between gap-4 border-b border-ink/10 pb-3">
                      <p className="font-mono text-label uppercase text-ink-soft">
                        {section.enabled ? (
                          <span className="text-pen">
                            § {String(position).padStart(2, "0")}
                          </span>
                        ) : (
                          <span>hidden</span>
                        )}
                        <span className="ml-3">{section.id}</span>
                      </p>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          className={iconButtonClass}
                          disabled={index === 0}
                          aria-label={`Move ${section.label} up`}
                          onClick={() => set(move(value, index, index - 1))}
                        >
                          <ChevronUp size={15} aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          className={iconButtonClass}
                          disabled={index === value.length - 1}
                          aria-label={`Move ${section.label} down`}
                          onClick={() => set(move(value, index, index + 1))}
                        >
                          <ChevronDown size={15} aria-hidden="true" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-5">
                      <CheckboxField
                        label="Show this section"
                        checked={section.enabled}
                        onChange={(enabled) => {
                          const next = [...value];
                          next[index] = { ...section, enabled };
                          set(next);
                        }}
                      />

                      <FieldRow>
                        <TextField
                          label="Margin label"
                          value={section.label}
                          onChange={(label) => {
                            const next = [...value];
                            next[index] = { ...section, label };
                            set(next);
                          }}
                          error={err(index, "label")}
                        />
                        <SelectField
                          label="Background"
                          value={section.tone}
                          options={[
                            { value: "paper" as const, label: "Paper" },
                            { value: "raised" as const, label: "Raised" },
                          ]}
                          onChange={(tone) => {
                            const next = [...value];
                            next[index] = { ...section, tone };
                            set(next);
                          }}
                          error={err(index, "tone")}
                        />
                      </FieldRow>

                      <TextField
                        label="Heading"
                        value={section.title}
                        onChange={(title) => {
                          const next = [...value];
                          next[index] = { ...section, title };
                          set(next);
                        }}
                        error={err(index, "title")}
                        rows={2}
                      />

                      <TextField
                        label="Standfirst"
                        value={section.lede}
                        onChange={(lede) => {
                          const next = [...value];
                          next[index] = { ...section, lede };
                          set(next);
                        }}
                        error={err(index, "lede")}
                        rows={2}
                        hint="The larger line under the heading. Leave empty to omit."
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          </Panel>
        );
      }}
    </SliceForm>
  );
}
