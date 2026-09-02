"use client";

import type { Education, EducationEntry } from "@/lib/schema";
import { SliceForm } from "@/components/admin/SliceForm";
import {
  FieldRow,
  Panel,
  Repeater,
  TextField,
  newId,
} from "@/components/admin/fields";

function blankEntry(): EducationEntry {
  return {
    id: newId("degree"),
    degree: "",
    field: "",
    institution: "",
    location: "",
    year: "",
    distinction: "",
  };
}

export function EducationEditor({ initial }: { initial: Education }) {
  return (
    <SliceForm
      slice="education"
      initial={initial}
      title="Education"
      description="Degrees, and the quieter closing line about earlier schooling."
    >
      {({ value, set, err }) => (
        <>
          <Panel title="Degrees">
            <Repeater
              items={value.entries}
              onChange={(entries) => set({ ...value, entries })}
              makeItem={blankEntry}
              titleFor={(entry, index) => entry.degree || `Degree ${index + 1}`}
              addLabel="Add degree"
              emptyMessage="No degrees yet."
            >
              {(entry, update, index) => (
                <>
                  <FieldRow>
                    <TextField
                      label="Degree"
                      value={entry.degree}
                      onChange={(degree) => update({ degree })}
                      error={err("entries", index, "degree")}
                      hint="e.g. MEd, BA (Hons)"
                    />
                    <TextField
                      label="Year"
                      value={entry.year}
                      onChange={(year) => update({ year })}
                      error={err("entries", index, "year")}
                    />
                  </FieldRow>

                  <TextField
                    label="Field"
                    value={entry.field}
                    onChange={(field) => update({ field })}
                    error={err("entries", index, "field")}
                  />

                  <FieldRow>
                    <TextField
                      label="Institution"
                      value={entry.institution}
                      onChange={(institution) => update({ institution })}
                      error={err("entries", index, "institution")}
                    />
                    <TextField
                      label="Location"
                      value={entry.location}
                      onChange={(location) => update({ location })}
                      error={err("entries", index, "location")}
                    />
                  </FieldRow>

                  <TextField
                    label="Distinction"
                    value={entry.distinction}
                    onChange={(distinction) => update({ distinction })}
                    error={err("entries", index, "distinction")}
                    hint="Scholarship or honour, shown in red beneath. Leave empty to hide. Grades are deliberately not shown on this site."
                  />
                </>
              )}
            </Repeater>
          </Panel>

          <Panel
            title="Earlier schooling"
            description="One quiet line, set smaller so it does not compete with the degrees. Leave empty to hide it."
          >
            <TextField
              label="Line"
              value={value.earlierEducation}
              onChange={(earlierEducation) => set({ ...value, earlierEducation })}
              error={err("earlierEducation")}
              rows={2}
            />
          </Panel>
        </>
      )}
    </SliceForm>
  );
}
