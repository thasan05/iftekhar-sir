"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import type { Identity, NavLink } from "@/lib/schema";

interface NavProps {
  identity: Identity;
  links: NavLink[];
}

export function Nav({ identity, links }: NavProps) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <header
      className={[
        "fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300 ease-manuscript",
        scrolled || open
          ? "border-ink/10 bg-paper/95 backdrop-blur-md"
          : "border-transparent bg-paper/90 backdrop-blur-sm sm:bg-transparent sm:backdrop-blur-none",
      ].join(" ")}
    >
      <div className="mx-auto flex h-16 w-full max-w-shell items-center justify-between gap-4 px-5 sm:h-[4.75rem] sm:px-8 lg:px-10">
        <a href="#top" className="min-w-0 flex max-w-[calc(100%-3rem)] flex-col leading-none">
          <span className="truncate font-serif text-[1.0625rem] tracking-[-0.01em]">
            {identity.name}
          </span>
          <span className="mt-1.5 truncate font-mono text-[0.625rem] uppercase tracking-[0.16em] text-ink-soft sm:tracking-[0.2em]">
            {identity.department} · {identity.institutionShort}
          </span>
        </a>

        {links.length > 0 ? (
          <nav aria-label="Primary" className="hidden md:block">
            <ul className="flex items-center gap-7">
              {links.map((link) => (
                <li key={link.id}>
                  <a
                    href={link.href}
                    className="font-mono text-micro uppercase tracking-[0.16em] text-ink-soft transition-colors duration-200 hover:text-pen"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}

        {links.length > 0 ? (
          <button
            type="button"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((value) => !value)}
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-sheet text-ink transition-colors duration-200 hover:text-pen md:hidden"
          >
            {open ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
          </button>
        ) : null}
      </div>

      <nav
        id="mobile-nav"
        aria-label="Primary, mobile"
        hidden={!open}
        className="max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-ink/10 bg-paper/98 backdrop-blur-md md:hidden"
      >
        <ul className="mx-auto flex max-w-shell flex-col px-5 py-2 sm:px-8">
          {links.map((link) => (
            <li key={link.id} className="border-b border-ink/8 last:border-b-0">
              <a
                href={link.href}
                onClick={() => setOpen(false)}
                className="flex min-h-12 items-center py-3.5 font-mono text-micro uppercase tracking-[0.16em] text-ink-soft transition-colors duration-200 hover:text-pen"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
