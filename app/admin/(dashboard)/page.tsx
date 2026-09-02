import Link from "next/link";
import type { Metadata } from "next";
import { CircleAlert, CircleCheck, Database } from "lucide-react";
import { loadContent, listRevisions } from "@/lib/content";
import { backendLabel, usingManagedPostgres } from "@/lib/db";
import { auditTheme } from "@/lib/contrast";
import { DashboardTools } from "@/components/admin/DashboardTools";

export const metadata: Metadata = { title: "Dashboard" };

function Stat({ label, value, href }: { label: string; value: string; href?: string }) {
  const body = (
    <>
      <p className="font-mono text-label uppercase text-ink-soft">{label}</p>
      <p className="mt-2 font-serif text-h3">{value}</p>
    </>
  );

  return href ? (
    <Link
      href={href}
      className="block rounded-sheet border border-ink/12 bg-paper-raised p-5 transition-colors duration-150 hover:border-ink/30"
    >
      {body}
    </Link>
  ) : (
    <div className="rounded-sheet border border-ink/12 bg-paper-raised p-5">{body}</div>
  );
}

export default async function DashboardPage() {
  const { content, seeded, problem, updatedAt } = await loadContent();
  const backend = await backendLabel();
  const revisions = await listRevisions(1).catch(() => []);
  const contrastFailures = auditTheme(content.theme).filter((check) => !check.passes);

  const visibleSections = content.sections.filter((section) => section.enabled).length;

  return (
    <div className="pb-16">
      <header className="mb-10">
        <h1 className="text-h2">Dashboard</h1>
        <p className="mt-3 max-w-prose text-body text-ink-soft">
          Everything on the public page is edited here. Saving publishes straight
          away, and every save keeps the previous version so it can be rolled back.
        </p>
      </header>

      {problem ? (
        <div className="mb-8 rounded-sheet border border-pen/40 bg-pen/5 p-5">
          <p className="flex items-start gap-2 text-small text-ink">
            <CircleAlert size={16} aria-hidden="true" className="mt-0.5 shrink-0 text-pen" />
            <span>
              <strong className="font-semibold">The site is showing its built-in
              content.</strong>{" "}
              {problem}
            </span>
          </p>
        </div>
      ) : null}

      {seeded && !problem ? (
        <div className="mb-8 rounded-sheet border border-ink/20 bg-paper-raised p-5">
          <p className="text-small text-ink">
            Nothing has been saved to the database yet, so the page is rendering the
            starting content from the repository. Saving any screen — or initialising
            below — writes it to the database.
          </p>
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <Stat
          label="Last published"
          value={
            updatedAt
              ? new Intl.DateTimeFormat("en-GB", {
                  dateStyle: "medium",
                  timeStyle: "short",
                }).format(updatedAt)
              : "Not yet"
          }
        />
        <Stat
          label="Sections shown"
          value={`${visibleSections} of ${content.sections.length}`}
          href="/admin/sections"
        />
        <Stat
          label="Roles"
          value={String(content.experience.length)}
          href="/admin/experience"
        />
        <Stat label="Awards" value={String(content.honors.length)} href="/admin/honors" />
        <Stat
          label="Papers"
          value={String(content.research.outputs.length)}
          href="/admin/research"
        />
        <Stat
          label="Theme"
          value={
            contrastFailures.length === 0
              ? "Passes AA"
              : `${contrastFailures.length} contrast issue${
                  contrastFailures.length === 1 ? "" : "s"
                }`
          }
          href="/admin/theme"
        />
      </div>

      <section className="mt-12 rounded-sheet border border-ink/12 p-5">
        <p className="flex flex-wrap items-center gap-x-3 gap-y-2 text-small text-ink-soft">
          <Database size={15} aria-hidden="true" className="shrink-0" />
          <span>
            Storage:{" "}
            <span className="font-mono text-micro uppercase tracking-[0.12em] text-ink">
              {backend}
            </span>
          </span>
          {usingManagedPostgres() ? (
            <span className="flex items-center gap-1.5 text-ink-soft">
              <CircleCheck size={14} aria-hidden="true" />
              Connected through DATABASE_URL
            </span>
          ) : (
            <span className="text-pen">
              No DATABASE_URL set — using the local development database in
              <code className="mx-1 font-mono">.data/pglite</code>. Set DATABASE_URL
              before deploying.
            </span>
          )}
        </p>
        {revisions.length > 0 ? (
          <p className="mt-3 text-small text-ink-soft">
            Latest saved revision:{" "}
            {new Intl.DateTimeFormat("en-GB", {
              dateStyle: "medium",
              timeStyle: "short",
            }).format(revisions[0].createdAt)}
            .{" "}
            <Link href="/admin/revisions" className="pen-link">
              View history
            </Link>
          </p>
        ) : null}
      </section>

      <DashboardTools seeded={seeded} />
    </div>
  );
}
