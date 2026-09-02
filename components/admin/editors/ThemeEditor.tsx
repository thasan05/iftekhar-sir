"use client";

import { monoFonts, sansFonts, serifFonts, type Theme } from "@/lib/schema";
import { auditTheme } from "@/lib/contrast";
import { fontLabels } from "@/lib/fontLabels";
import { SliceForm } from "@/components/admin/SliceForm";
import {
  CheckboxField,
  ColorField,
  Panel,
  SelectField,
} from "@/components/admin/fields";

/**
 * Live contrast readouts sit beside the colour pickers. The palette is the one
 * place in this panel where a well-meaning edit can quietly break accessibility,
 * so the consequence is shown while the choice is being made rather than
 * discovered later.
 */
function ContrastReport({ theme }: { theme: Theme }) {
  const checks = auditTheme(theme);
  const failures = checks.filter((check) => !check.passes);

  return (
    <div className="rounded-sheet border border-ink/12 bg-paper-raised p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <p className="font-mono text-label uppercase text-ink-soft">Contrast check</p>
        <p
          className={`font-mono text-micro uppercase tracking-[0.14em] ${
            failures.length ? "text-pen" : "text-ink-soft"
          }`}
        >
          {failures.length === 0
            ? "All pairings pass WCAG AA"
            : `${failures.length} pairing${failures.length === 1 ? "" : "s"} below AA`}
        </p>
      </div>

      <ul className="mt-5 space-y-2.5">
        {checks.map((check) => (
          <li
            key={check.label}
            className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-ink/8 pb-2.5 last:border-b-0 last:pb-0"
          >
            <span className="text-small text-ink">{check.label}</span>
            <span className="flex items-center gap-3">
              <span className="font-mono text-micro text-ink-soft">
                needs {check.required.toFixed(1)}
              </span>
              <span
                className={`font-mono text-micro font-medium ${
                  check.passes ? "text-ink" : "text-pen"
                }`}
              >
                {check.ratio === null ? "—" : `${check.ratio.toFixed(2)}:1`}
                {check.passes ? "" : " ✕"}
              </span>
            </span>
          </li>
        ))}
      </ul>

      {failures.length > 0 ? (
        <p className="mt-5 text-micro text-pen">
          Text below its threshold is hard to read for people with low vision, and
          fails an accessibility audit. Darken the text colour or lighten the
          background until every row passes.
        </p>
      ) : null}
    </div>
  );
}

/** A miniature of the real page, so a palette can be judged before it ships. */
function ThemePreview({ theme }: { theme: Theme }) {
  return (
    <div
      className="overflow-hidden rounded-sheet border border-ink/15"
      style={{ backgroundColor: theme.paper }}
    >
      <div className="p-6">
        <p
          className="font-mono text-label uppercase"
          style={{ color: theme.inkSoft }}
        >
          <span style={{ color: theme.pen }}>§ 01</span> &nbsp;About
        </p>
        <p className="mt-4 font-serif text-h3" style={{ color: theme.ink }}>
          A teacher first, and a researcher because of it
        </p>
        <p className="mt-3 text-small" style={{ color: theme.inkSoft }}>
          Secondary copy sits at this weight, with{" "}
          <span
            style={{
              color: theme.pen,
              textDecoration: "underline",
              textUnderlineOffset: "4px",
            }}
          >
            a link in the accent
          </span>
          .
        </p>
      </div>

      <div className="p-6" style={{ backgroundColor: theme.paperRaised }}>
        <div
          className="rounded-sheet p-4"
          style={{
            backgroundColor: theme.paper,
            borderTop: `2px solid ${theme.brass}`,
            border: `1px solid ${theme.ink}1a`,
            borderTopColor: theme.brass,
          }}
        >
          <p className="font-mono text-label uppercase" style={{ color: theme.brassDeep }}>
            2025
          </p>
          <p className="mt-2 font-serif text-h4" style={{ color: theme.ink }}>
            Best Track Paper
          </p>
        </div>
      </div>

      <div className="p-6" style={{ backgroundColor: theme.ink }}>
        <p className="font-serif text-h4" style={{ color: theme.paper }}>
          Get in touch
        </p>
        <p className="mt-2 text-small" style={{ color: `${theme.paper}cc` }}>
          The contact panel inverts to ink.
        </p>
      </div>
    </div>
  );
}

export function ThemeEditor({ initial }: { initial: Theme }) {
  return (
    <SliceForm
      slice="theme"
      initial={initial}
      title="Theme"
      description="Colours and type for the whole site. Every value here is a design token — nothing in the page hardcodes a colour, so a change lands everywhere at once."
    >
      {({ value, set, err }) => (
        <>
          <Panel title="Preview">
            <ThemePreview theme={value} />
            <ContrastReport theme={value} />
          </Panel>

          <Panel
            title="Ink"
            description="Body text and the dark contact panel."
          >
            <div className="grid gap-5 sm:grid-cols-3">
              <ColorField
                label="Ink"
                value={value.ink}
                onChange={(ink) => set({ ...value, ink })}
                error={err("ink")}
                hint="Headings and body text."
              />
              <ColorField
                label="Ink soft"
                value={value.inkSoft}
                onChange={(inkSoft) => set({ ...value, inkSoft })}
                error={err("inkSoft")}
                hint="Secondary copy."
              />
              <ColorField
                label="Ink faint"
                value={value.inkFaint}
                onChange={(inkFaint) => set({ ...value, inkFaint })}
                error={err("inkFaint")}
                hint="Hairlines only, never text."
              />
            </div>
          </Panel>

          <Panel title="Paper" description="Page background and raised sections.">
            <div className="grid gap-5 sm:grid-cols-3">
              <ColorField
                label="Paper"
                value={value.paper}
                onChange={(paper) => set({ ...value, paper })}
                error={err("paper")}
              />
              <ColorField
                label="Paper raised"
                value={value.paperRaised}
                onChange={(paperRaised) => set({ ...value, paperRaised })}
                error={err("paperRaised")}
                hint="Alternating sections."
              />
              <ColorField
                label="Paper dim"
                value={value.paperDim}
                onChange={(paperDim) => set({ ...value, paperDim })}
                error={err("paperDim")}
                hint="Button hover on ink."
              />
            </div>
          </Panel>

          <Panel
            title="Accent"
            description="The single red pen: links, section numbers, the drawn underline, the focus ring."
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <ColorField
                label="Pen"
                value={value.pen}
                onChange={(pen) => set({ ...value, pen })}
                error={err("pen")}
              />
              <ColorField
                label="Pen deep"
                value={value.penDeep}
                onChange={(penDeep) => set({ ...value, penDeep })}
                error={err("penDeep")}
                hint="Link hover."
              />
            </div>
          </Panel>

          <Panel
            title="Brass"
            description="Reserved for the Honors cards. Plain brass is decorative — the deep tone is the one used for text."
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <ColorField
                label="Brass"
                value={value.brass}
                onChange={(brass) => set({ ...value, brass })}
                error={err("brass")}
                hint="Card rule and icon."
              />
              <ColorField
                label="Brass deep"
                value={value.brassDeep}
                onChange={(brassDeep) => set({ ...value, brassDeep })}
                error={err("brassDeep")}
                hint="Award years."
              />
            </div>
          </Panel>

          <Panel title="Type">
            <SelectField
              label="Headings"
              value={value.serif}
              options={serifFonts.map((font) => ({
                value: font,
                label: fontLabels.serif[font],
              }))}
              onChange={(serif) => set({ ...value, serif })}
              error={err("serif")}
            />
            <SelectField
              label="Body"
              value={value.sans}
              options={sansFonts.map((font) => ({
                value: font,
                label: fontLabels.sans[font],
              }))}
              onChange={(sans) => set({ ...value, sans })}
              error={err("sans")}
            />
            <SelectField
              label="Labels & dates"
              value={value.mono}
              options={monoFonts.map((font) => ({
                value: font,
                label: fontLabels.mono[font],
              }))}
              onChange={(mono) => set({ ...value, mono })}
              error={err("mono")}
            />
          </Panel>

          <Panel title="Texture">
            <CheckboxField
              label="Paper grain overlay"
              checked={value.grain}
              onChange={(grain) => set({ ...value, grain })}
              hint="A very faint noise texture over the whole page. Decorative only."
            />
          </Panel>
        </>
      )}
    </SliceForm>
  );
}
