import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <main
      id="main"
      className="mx-auto flex w-full max-w-shell flex-col items-start justify-center px-6 py-40 sm:px-8 lg:px-10"
    >
      <p className="font-mono text-label uppercase text-pen">Error 404</p>
      <h1 className="mt-6 text-h2">This page has been struck through</h1>
      <p className="mt-5 max-w-prose text-lede text-ink-soft">
        The address you followed does not exist on this site.
      </p>
      <Link
        href="/"
        className="mt-9 inline-flex items-center rounded-sheet bg-ink px-5 py-3 font-mono text-micro uppercase tracking-[0.16em] text-paper transition-colors duration-200 ease-manuscript hover:bg-ink-soft"
      >
        Back to the profile
      </Link>
    </main>
  );
}
