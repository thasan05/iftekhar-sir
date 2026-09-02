"use client";

import type { ExperienceEntry } from "@/lib/schema";
import { SliceForm } from "@/components/admin/SliceForm";
import {
  CheckboxField,
  FieldRow,
  Panel,
  Repeater,
  StringList,
  TextField,
  newId,
} from "@/components/admin/fields";

function blankEntry(): ExperienceEntry {
  return {
    id: newId("role"),
    role: "",
    organization: "",
    location: "",
    start: "",
    end: "Present",
    startDate: "",
    endDate: "",
    current: false,
    summary: "",
    highlights: [],
  };
}

export function ExperienceEditor({ initial }: { initial: ExperienceEntry[] }) {
  return (
    <SliceForm
      slice="experience"
      initial={initial}
      title="Experience"
      description="The timeline, newest first. Order here is the order on the page."
    >
      {({ value, set, err }) => (
        <Panel title="Roles">
          <Repeater
            items={value}
            onChange={set}
            makeItem={blankEntry}
            titleFor={(entry, index) =>
              entry.role || entry.organization || `Role ${index + 1}`
            }
            addLabel="Add role"
            emptyMessage="No roles yet."
          >
            {(entry, update, index) => (
              <>
                <FieldRow>
                  <TextField
                    label="Role"
                    value={entry.role}
                    onChange={(role) => update({ role })}
                    error={err(index, "role")}
                  />
                  <TextField
                    label="Organization"
                    value={entry.organization}
                    onChange={(organization) => update({ organization })}
                    error={err(index, "organization")}
                  />
                </FieldRow>

                <TextField
                  label="Location"
                  value={entry.location}
                  onChange={(location) => update({ location })}
                  error={err(index, "location")}
                />

                <FieldRow>
                  <TextField
                    label="Start (shown)"
                    value={entry.start}
                    onChange={(start) => update({ start })}
                    error={err(index, "start")}
                    hint="e.g. Jun 2023"
                  />
                  <TextField
                    label="End (shown)"
                    value={entry.end}
                    onChange={(end) => update({ end })}
                    error={err(index, "end")}
                    hint="e.g. Feb 2022, or Present"
                  />
                </FieldRow>

                <FieldRow>
                  <TextField
                    label="Start date"
                    mono
                    value={entry.startDate}
                    onChange={(startDate) => update({ startDate })}
                    error={err(index, "startDate")}
                    hint="YYYY-MM-DD, for search engines. Not shown."
                  />
                  <TextField
                    label="End date"
                    mono
                    value={entry.endDate}
                    onChange={(endDate) => update({ endDate })}
                    error={err(index, "endDate")}
                    hint="Leave empty for an ongoing role."
                  />
                </FieldRow>

                <CheckboxField
                  label="Current role"
                  checked={entry.current}
                  onChange={(current) => update({ current })}
                  hint="Marks the timeline dot in red and adds a Current label."
                />

                <TextField
                  label="Summary"
                  value={entry.summary}
                  onChange={(summary) => update({ summary })}
                  error={err(index, "summary")}
                  rows={3}
                />

                <StringList
                  label="Highlights"
                  items={entry.highlights}
                  onChange={(highlights) => update({ highlights })}
                  itemLabel="Highlight"
                  addLabel="Add highlight"
                  rows={2}
                  errorAt={(highlightIndex) => err(index, "highlights", highlightIndex)}
                />
              </>
            )}
          </Repeater>
        </Panel>
      )}
    </SliceForm>
  );
}
