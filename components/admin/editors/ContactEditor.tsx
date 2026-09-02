"use client";

import type { Contact } from "@/lib/schema";
import { SliceForm } from "@/components/admin/SliceForm";
import { Panel, TextField } from "@/components/admin/fields";
import { MediaField } from "@/components/admin/MediaField";

export function ContactEditor({ initial }: { initial: Contact }) {
  return (
    <SliceForm
      slice="contact"
      initial={initial}
      title="Contact"
      description="The dark panel at the foot of the page. Anything left empty is hidden rather than shown broken."
    >
      {({ value, set, err }) => (
        <>
          <Panel title="Heading">
            <TextField
              label="Heading"
              value={value.heading}
              onChange={(heading) => set({ ...value, heading })}
              error={err("heading")}
            />
            <TextField
              label="Invitation"
              value={value.invitation}
              onChange={(invitation) => set({ ...value, invitation })}
              error={err("invitation")}
              rows={3}
            />
          </Panel>

          <Panel
            title="Email"
            description="Also linked from the footer and included in the site's structured data. Leave the address empty to show the note instead."
          >
            <TextField
              label="Address"
              type="email"
              mono
              value={value.email.href}
              onChange={(href) => set({ ...value, email: { ...value.email, href } })}
              error={err("email", "href")}
            />
            <TextField
              label="Placeholder note"
              value={value.email.note}
              onChange={(note) => set({ ...value, email: { ...value.email, note } })}
              error={err("email", "note")}
              hint="Shown only while the address above is empty."
            />
          </Panel>

          <Panel
            title="CV"
            description="Upload the public-ready PDF and the download button appears by itself."
          >
            <MediaField
              label="PDF"
              kind="document"
              value={value.cv.href}
              onChange={(href) => set({ ...value, cv: { ...value.cv, href } })}
              error={err("cv", "href")}
            />
            <TextField
              label="Button label"
              value={value.cv.label}
              onChange={(label) => set({ ...value, cv: { ...value.cv, label } })}
              error={err("cv", "label")}
            />
            <TextField
              label="Placeholder note"
              value={value.cv.note}
              onChange={(note) => set({ ...value, cv: { ...value.cv, note } })}
              error={err("cv", "note")}
              hint="Shown only while no PDF is set."
            />
          </Panel>

          <Panel title="References">
            <TextField
              label="Line"
              value={value.referencesLine}
              onChange={(referencesLine) => set({ ...value, referencesLine })}
              error={err("referencesLine")}
              hint="Leave empty to omit. Named referees are deliberately not listed on a public page."
            />
          </Panel>
        </>
      )}
    </SliceForm>
  );
}
