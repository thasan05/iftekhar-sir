"use client";

import type { Meta } from "@/lib/schema";
import { SliceForm } from "@/components/admin/SliceForm";
import { Panel, StringList, TextField } from "@/components/admin/fields";

export function SeoEditor({ initial }: { initial: Meta }) {
  return (
    <SliceForm
      slice="meta"
      initial={initial}
      title="Search & sharing"
      description="What search engines and social cards show. The description is the line under the title in search results."
    >
      {({ value, set, err }) => (
        <>
          <Panel title="Listing">
            <TextField
              label="Browser & search title"
              value={value.title}
              onChange={(title) => set({ ...value, title })}
              error={err("title")}
              hint="Around 60 characters shows in full. Name, role and institution is a good pattern."
            />

            <div>
              <TextField
                label="Description"
                value={value.description}
                onChange={(description) => set({ ...value, description })}
                error={err("description")}
                rows={4}
              />
              <p className="mt-2 font-mono text-micro text-ink-soft">
                {value.description.length} characters — search engines usually show
                about 155.
              </p>
            </div>
          </Panel>

          <Panel
            title="Address"
            description="The public URL of the site. Used for the canonical link, the sitemap and the social card, so it must match the live domain."
          >
            <TextField
              label="Site URL"
              type="url"
              mono
              value={value.siteUrl}
              onChange={(siteUrl) => set({ ...value, siteUrl })}
              error={err("siteUrl")}
              hint="No trailing slash. On Vercel, set NEXT_PUBLIC_SITE_URL as well if you prefer to keep it in the environment."
            />
          </Panel>

          <Panel
            title="Keywords"
            description="Minor for ranking these days, but harmless and occasionally used."
          >
            <StringList
              label="Keywords"
              items={value.keywords}
              onChange={(keywords) => set({ ...value, keywords })}
              itemLabel="Keyword"
              addLabel="Add keyword"
              errorAt={(index) => err("keywords", index)}
            />
          </Panel>
        </>
      )}
    </SliceForm>
  );
}
