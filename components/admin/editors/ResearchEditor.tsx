"use client";

import type { Research, ResearchOutput } from "@/lib/schema";
import { SliceForm } from "@/components/admin/SliceForm";
import {
  FieldRow,
  Panel,
  Repeater,
  StringList,
  TextField,
  newId,
} from "@/components/admin/fields";

function blankOutput(): ResearchOutput {
  return {
    id: newId("paper"),
    role: "",
    title: "",
    venue: "",
    venueShort: "",
    date: "",
    dateISO: "",
    award: "",
  };
}

export function ResearchEditor({ initial }: { initial: Research }) {
  return (
    <SliceForm
      slice="research"
      initial={initial}
      title="Research"
      description="Interests as tags, and papers or presentations as cards."
    >
      {({ value, set, err }) => (
        <>
          <Panel title="Opening line" description="Leave empty to go straight to the tags.">
            <TextField
              label="Intro"
              value={value.intro}
              onChange={(intro) => set({ ...value, intro })}
              error={err("intro")}
              rows={2}
            />
          </Panel>

          <Panel
            title="Interests"
            description="Shown as tags. These also become the knowsAbout list in the site's structured data."
          >
            <StringList
              label="Interests"
              items={value.interests}
              onChange={(interests) => set({ ...value, interests })}
              itemLabel="Interest"
              addLabel="Add interest"
              errorAt={(index) => err("interests", index)}
            />
          </Panel>

          <Panel title="Papers & presentations">
            <Repeater
              items={value.outputs}
              onChange={(outputs) => set({ ...value, outputs })}
              makeItem={blankOutput}
              titleFor={(output, index) => output.title || `Paper ${index + 1}`}
              addLabel="Add paper"
              emptyMessage="No papers yet. The section hides this block when it is empty."
            >
              {(output, update, index) => (
                <>
                  <TextField
                    label="Title"
                    value={output.title}
                    onChange={(title) => update({ title })}
                    error={err("outputs", index, "title")}
                    rows={2}
                    hint="Shown in italics inside quotation marks."
                  />

                  <TextField
                    label="Role"
                    value={output.role}
                    onChange={(role) => update({ role })}
                    error={err("outputs", index, "role")}
                    hint="e.g. Supervisory Author"
                  />

                  <TextField
                    label="Venue"
                    value={output.venue}
                    onChange={(venue) => update({ venue })}
                    error={err("outputs", index, "venue")}
                    rows={2}
                  />

                  <FieldRow>
                    <TextField
                      label="Venue, short"
                      value={output.venueShort}
                      onChange={(venueShort) => update({ venueShort })}
                      error={err("outputs", index, "venueShort")}
                    />
                    <TextField
                      label="Award"
                      value={output.award}
                      onChange={(award) => update({ award })}
                      error={err("outputs", index, "award")}
                      hint="Shown as a red tag. Leave empty to hide."
                    />
                  </FieldRow>

                  <FieldRow>
                    <TextField
                      label="Date (shown)"
                      value={output.date}
                      onChange={(date) => update({ date })}
                      error={err("outputs", index, "date")}
                      hint="e.g. 21 December 2025"
                    />
                    <TextField
                      label="Date (machine)"
                      mono
                      value={output.dateISO}
                      onChange={(dateISO) => update({ dateISO })}
                      error={err("outputs", index, "dateISO")}
                      hint="YYYY-MM-DD. Not shown."
                    />
                  </FieldRow>
                </>
              )}
            </Repeater>
          </Panel>
        </>
      )}
    </SliceForm>
  );
}
