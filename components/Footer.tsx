import { ArrowUp, Mail } from "lucide-react";
import type { Contact, Identity, Social } from "@/lib/schema";
import { SocialGlyph } from "@/components/ui/icons";

interface FooterProps {
  identity: Identity;
  socials: Social[];
  contact: Contact;
}

export function Footer({ identity, socials, contact }: FooterProps) {
  const year = new Date().getFullYear();
  const email = contact.email.href;

  return (
    <footer className="border-t border-ink/10 bg-paper">
      <div className="mx-auto flex w-full max-w-shell flex-col gap-7 px-5 py-9 sm:gap-6 sm:px-8 sm:py-10 lg:flex-row lg:items-center lg:justify-between lg:px-10">
        <div className="min-w-0">
          <p className="font-serif text-h4">{identity.name}</p>
          <p className="mt-1.5 font-mono text-[0.625rem] uppercase tracking-[0.16em] text-ink-soft break-words sm:tracking-[0.18em]">
            © {year} · {identity.department} · {identity.institutionShort}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-4">
          {socials.map((social) => (
            <a
              key={social.id}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 min-w-11 items-center justify-center text-ink-soft transition-colors duration-200 hover:text-pen"
            >
              <SocialGlyph icon={social.icon} size={17} />
              <span className="sr-only">{social.label}</span>
            </a>
          ))}

          {email ? (
            <a
              href={`mailto:${email}`}
              className="inline-flex min-h-11 min-w-11 items-center justify-center text-ink-soft transition-colors duration-200 hover:text-pen"
            >
              <Mail size={18} aria-hidden="true" />
              <span className="sr-only">Email {identity.name}</span>
            </a>
          ) : null}

          <a
            href="#top"
            className="inline-flex min-h-11 items-center gap-2 font-mono text-[0.625rem] uppercase tracking-[0.16em] text-ink-soft transition-colors duration-200 hover:text-pen sm:tracking-[0.18em]"
          >
            Back to top
            <ArrowUp size={13} aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  );
}
