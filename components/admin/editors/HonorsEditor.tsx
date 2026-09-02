"use client";

import type { HonorEntry } from "@/lib/schema";
import { SliceForm } from "@/components/admin/SliceForm";
import {
  FieldRow,
  Panel,
  Repeater,
  TextField,
  newId,
} from "@/components/admin/fields";

function blankHonor(): HonorEntry {
  return { id: newId("honor"), title: "", awarder: "", year: "", detail: "" };
}

export function HonorsEditor({ initial }: { initial: HonorEntry[] }) {
  return (
    <SliceForm
      slice="honors"
      initial={initial}
      title="Honors"
      description="Shown as cards with a brass rule. Four or five reads as selective; a long list reads as a CV dump."
    >
      {({ value, set, err }) => (
        <Panel title="Awards">
          <Repeater
            items={value}
            onChange={set}
            makeItem={blankHonor}
            titleFor={(honor, index) => honor.title || `Award ${index + 1}`}
            addLabel="Add award"
            emptyMessage="No awards yet."
          >
            {(honor, update, index) => (
              <>
                <FieldRow>
                  <TextField
                    label="Title"
                    value={honor.title}
                    onChange={(title) => update({ title })}
                    error={err(index, "title")}
                  />
                  <TextField
                    label="Year"
                    value={honor.year}
                    onChange={(year) => update({ year })}
                    error={err(index, "year")}
                    hint="A range or two years is fine, e.g. 2018–2020"
                  />
                </FieldRow>

                <TextField
                  label="Awarded by"
                  value={honor.awarder}
                  onChange={(awarder) => update({ awarder })}
                  error={err(index, "awarder")}
                />

                <TextField
                  label="Detail"
                  value={honor.detail}
                  onChange={(detail) => update({ detail })}
                  error={err(index, "detail")}
                  rows={2}
                />
              </>
            )}
          </Repeater>
        </Panel>
      )}
    </SliceForm>
  );
}
