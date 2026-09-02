"use client";

import { socialIcons, type Social, type SocialIcon } from "@/lib/schema";
import { SliceForm } from "@/components/admin/SliceForm";
import {
  FieldRow,
  Panel,
  Repeater,
  SelectField,
  TextField,
  newId,
} from "@/components/admin/fields";

const ICON_LABELS: Record<SocialIcon, string> = {
  linkedin: "LinkedIn",
  scholar: "Google Scholar",
  orcid: "ORCID",
  researchgate: "ResearchGate",
  website: "Website or other",
};

function blankProfile(): Social {
  return { id: newId("profile"), label: "", handle: "", href: "https://", icon: "website" };
}

export function ProfilesEditor({ initial }: { initial: Social[] }) {
  return (
    <SliceForm
      slice="socials"
      initial={initial}
      title="Profiles"
      description="External profiles, shown in the contact panel and as small icons in the footer. Useful places for an academic: ORCID, Google Scholar, ResearchGate."
    >
      {({ value, set, err }) => (
        <Panel title="Links">
          <Repeater
            items={value}
            onChange={set}
            makeItem={blankProfile}
            titleFor={(profile, index) => profile.label || `Profile ${index + 1}`}
            addLabel="Add profile"
            emptyMessage="No profiles yet."
          >
            {(profile, update, index) => (
              <>
                <FieldRow>
                  <TextField
                    label="Name"
                    value={profile.label}
                    onChange={(label) => update({ label })}
                    error={err(index, "label")}
                    hint="Used as the screen-reader label on the footer icon."
                  />
                  <SelectField
                    label="Icon"
                    value={profile.icon}
                    options={socialIcons.map((icon) => ({
                      value: icon,
                      label: ICON_LABELS[icon],
                    }))}
                    onChange={(icon) => update({ icon })}
                    error={err(index, "icon")}
                  />
                </FieldRow>

                <TextField
                  label="Shown text"
                  value={profile.handle}
                  onChange={(handle) => update({ handle })}
                  error={err(index, "handle")}
                  hint="What the reader sees, e.g. linkedin.com/in/iftekhar72 — no tracking parameters."
                />

                <TextField
                  label="URL"
                  type="url"
                  mono
                  value={profile.href}
                  onChange={(href) => update({ href })}
                  error={err(index, "href")}
                />
              </>
            )}
          </Repeater>
        </Panel>
      )}
    </SliceForm>
  );
}
