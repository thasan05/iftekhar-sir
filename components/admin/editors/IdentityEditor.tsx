"use client";

import type { Identity } from "@/lib/schema";
import { SliceForm } from "@/components/admin/SliceForm";
import { FieldRow, Panel, TextField } from "@/components/admin/fields";

export function IdentityEditor({ initial }: { initial: Identity }) {
  return (
    <SliceForm
      slice="identity"
      initial={initial}
      title="Identity"
      description="Name, post and institution. These appear in the masthead, the hero, the footer and the site's structured data, so they are edited in one place."
    >
      {({ value, set, err }) => (
        <>
          <Panel title="Person">
            <TextField
              label="Full name"
              value={value.name}
              onChange={(name) => set({ ...value, name })}
              error={err("name")}
            />
            <TextField
              label="Post"
              value={value.title}
              onChange={(title) => set({ ...value, title })}
              error={err("title")}
              hint="e.g. Lecturer in English"
            />
            <TextField
              label="Location"
              value={value.location}
              onChange={(location) => set({ ...value, location })}
              error={err("location")}
              hint="City first — the city is used in the structured data."
            />
          </Panel>

          <Panel title="Institution">
            <TextField
              label="Department"
              value={value.department}
              onChange={(department) => set({ ...value, department })}
              error={err("department")}
            />
            <FieldRow>
              <TextField
                label="Institution"
                value={value.institution}
                onChange={(institution) => set({ ...value, institution })}
                error={err("institution")}
              />
              <TextField
                label="Short name"
                value={value.institutionShort}
                onChange={(institutionShort) => set({ ...value, institutionShort })}
                error={err("institutionShort")}
                hint="Used in the masthead and footer, e.g. AIUB"
              />
            </FieldRow>
            <TextField
              label="Institution website"
              type="url"
              mono
              value={value.institutionUrl}
              onChange={(institutionUrl) => set({ ...value, institutionUrl })}
              error={err("institutionUrl")}
            />
          </Panel>
        </>
      )}
    </SliceForm>
  );
}
