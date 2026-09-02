import type { ReactNode } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink, LogOut } from "lucide-react";
import { requireSession } from "@/lib/auth";
import { AdminNav } from "@/components/admin/AdminNav";
import { logoutAction } from "@/app/admin/actions";

/** The panel always reflects the database as it is right now. */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: ReactNode }) {
  await requireSession();

  return (
    <div className="min-h-dvh bg-paper">
      <header className="border-b border-ink/12 bg-paper-raised">
        <div className="mx-auto flex w-full max-w-[86rem] flex-wrap items-center justify-between gap-4 px-6 py-4 lg:px-10">
          <div>
            <p className="font-serif text-h4">Site editor</p>
            <p className="mt-1 font-mono text-[0.625rem] uppercase tracking-[0.2em] text-ink-soft">
              Changes publish immediately
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-2 rounded-sheet border border-ink/20 px-3.5 py-2 font-mono text-micro uppercase tracking-[0.14em] text-ink-soft transition-colors duration-150 hover:border-ink/40 hover:text-ink"
            >
              View site
              <ExternalLink size={13} aria-hidden="true" />
            </Link>

            <form action={logoutAction}>
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-sheet border border-ink/20 px-3.5 py-2 font-mono text-micro uppercase tracking-[0.14em] text-ink-soft transition-colors duration-150 hover:border-pen hover:text-pen"
              >
                Sign out
                <LogOut size={13} aria-hidden="true" />
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="mx-auto grid w-full max-w-[86rem] gap-10 px-6 py-10 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-14 lg:px-10">
        <div className="lg:sticky lg:top-10 lg:self-start">
          <AdminNav />
        </div>

        <main id="main" className="min-w-0 max-w-4xl">
          {children}
        </main>
      </div>
    </div>
  );
}
