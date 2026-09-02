"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";

interface NavItem {
  href: string;
  label: string;
}

const GROUPS: Array<{ heading: string; items: NavItem[] }> = [
  {
    heading: "Overview",
    items: [{ href: "/admin", label: "Dashboard" }],
  },
  {
    heading: "Content",
    items: [
      { href: "/admin/hero", label: "Hero" },
      { href: "/admin/about", label: "About" },
      { href: "/admin/experience", label: "Experience" },
      { href: "/admin/education", label: "Education" },
      { href: "/admin/research", label: "Research" },
      { href: "/admin/honors", label: "Honors" },
      { href: "/admin/service", label: "Service" },
      { href: "/admin/skills", label: "Skills" },
      { href: "/admin/contact", label: "Contact" },
    ],
  },
  {
    heading: "Structure",
    items: [
      { href: "/admin/sections", label: "Sections & order" },
      { href: "/admin/menu", label: "Menu" },
      { href: "/admin/profiles", label: "Profiles" },
    ],
  },
  {
    heading: "Presentation",
    items: [
      { href: "/admin/theme", label: "Theme" },
      { href: "/admin/identity", label: "Identity" },
      { href: "/admin/seo", label: "Search & sharing" },
    ],
  },
  {
    heading: "Files & history",
    items: [
      { href: "/admin/media", label: "Uploads" },
      { href: "/admin/revisions", label: "Revisions" },
    ],
  },
];

export function AdminNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const linkClass = (href: string) => {
    const active = pathname === href;
    return [
      "block rounded-sheet px-3 py-2 text-small transition-colors duration-150",
      active
        ? "bg-ink text-paper"
        : "text-ink-soft hover:bg-ink/5 hover:text-ink",
    ].join(" ");
  };

  const tree = (
    <div className="space-y-7">
      {GROUPS.map((group) => (
        <div key={group.heading}>
          <p className="mb-2 px-3 font-mono text-label uppercase text-ink-soft/80">
            {group.heading}
          </p>
          <ul className="space-y-0.5">
            {group.items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={pathname === item.href ? "page" : undefined}
                  onClick={() => setOpen(false)}
                  className={linkClass(item.href)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );

  return (
    <>
      <div className="lg:hidden">
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="admin-nav"
          className="inline-flex items-center gap-2 rounded-sheet border border-ink/20 px-3 py-2 font-mono text-micro uppercase tracking-[0.14em] text-ink-soft"
        >
          {open ? <X size={15} aria-hidden="true" /> : <Menu size={15} aria-hidden="true" />}
          Sections
        </button>
        <nav id="admin-nav" aria-label="Admin" hidden={!open} className="mt-5">
          {tree}
        </nav>
      </div>

      <nav aria-label="Admin" className="hidden lg:block">
        {tree}
      </nav>
    </>
  );
}
