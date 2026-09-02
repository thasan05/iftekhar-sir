"use client";

import type { ServiceCluster, ServiceItem } from "@/lib/schema";
import { SliceForm } from "@/components/admin/SliceForm";
import {
  FieldRow,
  Panel,
  Repeater,
  TextField,
  newId,
} from "@/components/admin/fields";

function blankCluster(): ServiceCluster {
  return { id: newId("cluster"), title: "", blurb: "", range: "", items: [] };
}

function blankItem(): ServiceItem {
  return { id: newId("item"), role: "", event: "", year: "" };
}

export function ServiceEditor({ initial }: { initial: ServiceCluster[] }) {
  return (
    <SliceForm
      slice="service"
      initial={initial}
      title="Academic service"
      description="Grouped into scannable clusters rather than one long list. Two clusters sit side by side on a wide screen."
    >
      {({ value, set, err }) => (
        <Panel title="Clusters">
          <Repeater
            items={value}
            onChange={set}
            makeItem={blankCluster}
            titleFor={(cluster, index) => cluster.title || `Cluster ${index + 1}`}
            addLabel="Add cluster"
            emptyMessage="No clusters yet."
          >
            {(cluster, update, clusterIndex) => (
              <>
                <FieldRow>
                  <TextField
                    label="Title"
                    value={cluster.title}
                    onChange={(title) => update({ title })}
                    error={err(clusterIndex, "title")}
                  />
                  <TextField
                    label="Year range"
                    value={cluster.range}
                    onChange={(range) => update({ range })}
                    error={err(clusterIndex, "range")}
                    hint="Shown beside the title. Use this when the individual entries have no year."
                  />
                </FieldRow>

                <TextField
                  label="Blurb"
                  value={cluster.blurb}
                  onChange={(blurb) => update({ blurb })}
                  error={err(clusterIndex, "blurb")}
                  rows={2}
                />

                <div className="rounded-sheet border border-ink/12 bg-paper p-4">
                  <p className="mb-4 font-mono text-label uppercase text-ink-soft">
                    Entries
                  </p>
                  <Repeater
                    items={cluster.items}
                    onChange={(items) => update({ items })}
                    makeItem={blankItem}
                    titleFor={(item, index) => item.event || `Entry ${index + 1}`}
                    addLabel="Add entry"
                    emptyMessage="No entries in this cluster yet."
                  >
                    {(item, updateItem, itemIndex) => (
                      <>
                        <TextField
                          label="Role"
                          value={item.role}
                          onChange={(role) => updateItem({ role })}
                          error={err(clusterIndex, "items", itemIndex, "role")}
                          hint="e.g. Adjudicator, Session Organizer, Workshop"
                        />
                        <FieldRow>
                          <TextField
                            label="Event"
                            value={item.event}
                            onChange={(event) => updateItem({ event })}
                            error={err(clusterIndex, "items", itemIndex, "event")}
                          />
                          <TextField
                            label="Year"
                            value={item.year}
                            onChange={(year) => updateItem({ year })}
                            error={err(clusterIndex, "items", itemIndex, "year")}
                            hint="Leave empty if it is not on record — nothing is invented."
                          />
                        </FieldRow>
                      </>
                    )}
                  </Repeater>
                </div>
              </>
            )}
          </Repeater>
        </Panel>
      )}
    </SliceForm>
  );
}
