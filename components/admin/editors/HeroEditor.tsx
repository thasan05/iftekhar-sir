"use client";

import type { Hero } from "@/lib/schema";
import { SliceForm } from "@/components/admin/SliceForm";
import { FieldRow, Panel, StringList, TextField } from "@/components/admin/fields";
import { MediaField } from "@/components/admin/MediaField";

export function HeroEditor({ initial }: { initial: Hero }) {
  return (
    <SliceForm
      slice="hero"
      initial={initial}
      title="Hero"
      description="The masthead: the small label above the name, the tagline, the portrait and the two calls to action."
    >
      {({ value, set, err }) => (
        <>
          <Panel
            title="Tagline"
            description="Split into three parts so the middle phrase can carry the drawn proofreader's underline — the one animated flourish on the page."
          >
            <TextField
              label="Before the underline"
              value={value.taglineLead}
              onChange={(taglineLead) => set({ ...value, taglineLead })}
              error={err("taglineLead")}
              rows={2}
              hint="Usually ends mid-sentence with a trailing space."
            />
            <TextField
              label="Underlined phrase"
              value={value.taglineMarked}
              onChange={(taglineMarked) => set({ ...value, taglineMarked })}
              error={err("taglineMarked")}
              hint="Keep this short. It is held on one line, so a long phrase overflows on a narrow phone."
            />
            <TextField
              label="After the underline"
              value={value.taglineTail}
              onChange={(taglineTail) => set({ ...value, taglineTail })}
              error={err("taglineTail")}
              rows={2}
            />
          </Panel>

          <Panel
            title="Eyebrow"
            description="The small monospaced items above the name, separated by a red dot."
          >
            <StringList
              label="Items"
              items={value.eyebrow}
              onChange={(eyebrow) => set({ ...value, eyebrow })}
              itemLabel="Eyebrow item"
              addLabel="Add item"
              errorAt={(index) => err("eyebrow", index)}
            />
          </Panel>

          <Panel title="Portrait">
            <MediaField
              label="Image"
              kind="image"
              value={value.portrait.src}
              onChange={(src) => set({ ...value, portrait: { ...value.portrait, src } })}
              error={err("portrait", "src")}
              hint="Square works best — it is shown as a circle. At least 760×760."
            />
            <TextField
              label="Alt text"
              value={value.portrait.alt}
              onChange={(alt) => set({ ...value, portrait: { ...value.portrait, alt } })}
              error={err("portrait", "alt")}
              rows={2}
              hint="Describe the person and their role, as a screen reader would read it aloud."
            />
          </Panel>

          <Panel
            title="Calls to action"
            description="The filled button and the underlined link beneath the tagline. A target starting with # jumps to a section on this page."
          >
            <FieldRow>
              <TextField
                label="Button label"
                value={value.primaryCta.label}
                onChange={(label) =>
                  set({ ...value, primaryCta: { ...value.primaryCta, label } })
                }
                error={err("primaryCta", "label")}
              />
              <TextField
                label="Button target"
                mono
                value={value.primaryCta.href}
                onChange={(href) =>
                  set({ ...value, primaryCta: { ...value.primaryCta, href } })
                }
                error={err("primaryCta", "href")}
              />
            </FieldRow>
            <FieldRow>
              <TextField
                label="Link label"
                value={value.secondaryCta.label}
                onChange={(label) =>
                  set({ ...value, secondaryCta: { ...value.secondaryCta, label } })
                }
                error={err("secondaryCta", "label")}
              />
              <TextField
                label="Link target"
                mono
                value={value.secondaryCta.href}
                onChange={(href) =>
                  set({ ...value, secondaryCta: { ...value.secondaryCta, href } })
                }
                error={err("secondaryCta", "href")}
              />
            </FieldRow>
          </Panel>
        </>
      )}
    </SliceForm>
  );
}
