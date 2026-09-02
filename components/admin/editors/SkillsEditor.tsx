"use client";

import { skillIcons, type SkillGroup, type SkillIcon } from "@/lib/schema";
import { SliceForm } from "@/components/admin/SliceForm";
import {
  Panel,
  Repeater,
  SelectField,
  StringList,
  TextField,
  newId,
} from "@/components/admin/fields";

const ICON_LABELS: Record<SkillIcon, string> = {
  teaching: "Teaching — open book",
  languages: "Languages — speech marks",
  tools: "Tools — spanner",
  research: "Research — flask",
  writing: "Writing — pen",
};

function blankGroup(): SkillGroup {
  return { id: newId("group"), title: "", icon: "teaching", items: [] };
}

export function SkillsEditor({ initial }: { initial: SkillGroup[] }) {
  return (
    <SliceForm
      slice="skills"
      initial={initial}
      title="Skills"
      description="Three tidy groups read best. Each group shows an icon, a heading and a set of tags."
    >
      {({ value, set, err }) => (
        <Panel title="Groups">
          <Repeater
            items={value}
            onChange={set}
            makeItem={blankGroup}
            titleFor={(group, index) => group.title || `Group ${index + 1}`}
            addLabel="Add group"
            emptyMessage="No groups yet."
          >
            {(group, update, index) => (
              <>
                <TextField
                  label="Heading"
                  value={group.title}
                  onChange={(title) => update({ title })}
                  error={err(index, "title")}
                />

                <SelectField
                  label="Icon"
                  value={group.icon}
                  options={skillIcons.map((icon) => ({
                    value: icon,
                    label: ICON_LABELS[icon],
                  }))}
                  onChange={(icon) => update({ icon })}
                  error={err(index, "icon")}
                />

                <StringList
                  label="Tags"
                  items={group.items}
                  onChange={(items) => update({ items })}
                  itemLabel="Tag"
                  addLabel="Add tag"
                  errorAt={(itemIndex) => err(index, "items", itemIndex)}
                />
              </>
            )}
          </Repeater>
        </Panel>
      )}
    </SliceForm>
  );
}
