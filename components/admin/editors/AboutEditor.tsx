"use client";

import type { About } from "@/lib/schema";
import { SliceForm } from "@/components/admin/SliceForm";
import { Panel, StringList, TextField } from "@/components/admin/fields";

export function AboutEditor({ initial }: { initial: About }) {
  return (
    <SliceForm
      slice="about"
      initial={initial}
      title="About"
      description="The short third-person introduction, plus the quieter aside set off by a red rule."
    >
      {({ value, set, err }) => (
        <>
          <Panel
            title="Paragraphs"
            description="Three or four sentences reads best. Each paragraph is its own block."
          >
            <StringList
              label="Body"
              items={value.paragraphs}
              onChange={(paragraphs) => set({ ...value, paragraphs })}
              itemLabel="Paragraph"
              addLabel="Add paragraph"
              rows={4}
              errorAt={(index) => err("paragraphs", index)}
            />
          </Panel>

          <Panel
            title="Aside"
            description="The human touch at the end, shown smaller with a red margin rule. Leave empty to hide it."
          >
            <TextField
              label="Note"
              value={value.humanNote}
              onChange={(humanNote) => set({ ...value, humanNote })}
              error={err("humanNote")}
              rows={3}
            />
          </Panel>
        </>
      )}
    </SliceForm>
  );
}
