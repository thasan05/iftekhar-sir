"use client";

import type { NavLink } from "@/lib/schema";
import { SliceForm } from "@/components/admin/SliceForm";
import {
  FieldRow,
  Panel,
  Repeater,
  TextField,
  newId,
} from "@/components/admin/fields";

function blankLink(): NavLink {
  return { id: newId("nav"), label: "", href: "/#" };
}

export function MenuEditor({ initial }: { initial: NavLink[] }) {
  return (
    <SliceForm
      slice="nav"
      initial={initial}
      title="Menu"
      description="The links in the masthead, in order. Five or so fits comfortably on a phone."
    >
      {({ value, set, err }) => (
        <Panel
          title="Links"
          description="Targets are written root-relative, like /#research, so the menu also works from other pages."
        >
          <Repeater
            items={value}
            onChange={set}
            makeItem={blankLink}
            titleFor={(link, index) => link.label || `Link ${index + 1}`}
            addLabel="Add link"
            emptyMessage="No links — the masthead will show the name only."
          >
            {(link, update, index) => (
              <FieldRow>
                <TextField
                  label="Label"
                  value={link.label}
                  onChange={(label) => update({ label })}
                  error={err(index, "label")}
                />
                <TextField
                  label="Target"
                  mono
                  value={link.href}
                  onChange={(href) => update({ href })}
                  error={err(index, "href")}
                  hint="e.g. /#experience"
                />
              </FieldRow>
            )}
          </Repeater>
        </Panel>
      )}
    </SliceForm>
  );
}
