import type { ReactNode } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink, LogOut } from "lucide-react";
import { requireSession } from "@/lib/auth";
import { AdminNav } from "@/components/admin/AdminNav";
import { logoutAction } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: ReactNode }) {
  await requireSession();

  return (
    <div className="min-h-dvh overflow-x-hidden bg-paper">
      <header className="border-b border-ink/12 bg-paper-raised">
        <div className="mx-auto flex w-full max-w-[86rem] flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10">
          <div className="min-w-0">
            <p className="font-serif text-h4">Site editor</p>
            <p className="mt-1 font-mono text-[0.625rem] uppercase tracking-[0.16em] text-ink-soft sm:tracking-[0.2em]">
              Changes publish immediately
            </p>
          </div>

          <div className="flex w-full items-stretch gap-2 sm:w-auto sm:items-center sm:gap-3">
            <Link
              href="/"
              target="_blank"
              className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-sheet border border-ink/20 px-3.5 py-2 font-mono text-micro uppercase tracking-[0.12em] text-ink-soft transition-colors duration-150 hover:border-ink/40 hover:text-ink sm:flex-none sm:tracking-[0.14em]"
            >
              View site
              <ExternalLink size={13} aria-hidden="true" />
            </Link>

            <form action={logoutAction} className="flex flex-1 sm:flex-none">
              <button
                type="submit"
                className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-sheet border border-ink/20 px-3.5 py-2 font-mono text-micro uppercase tracking-[0.12em] text-ink-soft transition-colors duration-150 hover:border-pen hover:text-pen sm:w-auto sm:tracking-[0.14em]"
              >
                Sign out
                <LogOut size={13} aria-hidden="true" />
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-[86rem] flex-col gap-7 px-5 py-6 sm:px-8 sm:py-8 lg:grid lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-14 lg:px-10 lg:py-10">
        <div className="lg:sticky lg:top-10 lg:self-start">
          <AdminNav />
        </div>

        <main id="main" className="min-w-0 w-full max-w-4xl overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
