import { Download, Mail } from "lucide-react";
import type { Contact as ContactContent, Section as SectionMeta, Social } from "@/lib/schema";
import { Reveal } from "@/components/ui/Reveal";
import { SocialGlyph } from "@/components/ui/icons";

/** Marked placeholder for a link that is not live yet — never a dead anchor. */
function PendingLink({ note }: { note: string }) {
  return (
    <p className="rounded-sheet border border-dashed border-paper/30 px-4 py-3 font-mono text-micro text-paper/70">
      {note}
    </p>
  );
}

interface ContactProps {
  section: SectionMeta;
  index: string;
  contact: ContactContent;
  socials: Social[];
}

export function Contact({ section, index, contact, socials }: ContactProps) {
  return (
    <section
      id={section.id}
      aria-labelledby={`${section.id}-title`}
      className="bg-ink py-section text-paper"
    >
      <div className="mx-auto w-full max-w-shell px-6 sm:px-8 lg:px-10">
        <div className="grid gap-y-8 lg:grid-cols-[9.5rem_minmax(0,1fr)] lg:gap-x-14">
          <div className="lg:border-r lg:border-paper/15 lg:pr-8">
            <p className="font-mono text-label uppercase">
              <span className="block text-paper/70">§ {index}</span>
              <span className="mt-2 block text-paper/90">{section.label}</span>
            </p>
          </div>

          <div>
            <h2 id={`${section.id}-title`} className="max-w-prose text-h2">
              {contact.heading || section.title}
            </h2>
            {contact.invitation ? (
              <p className="mt-5 max-w-prose text-lede text-paper/80">
                {contact.invitation}
              </p>
            ) : null}

            <Reveal className="mt-12 grid max-w-3xl gap-8 sm:grid-cols-2">
              {socials.length > 0 ? (
                <div>
                  <h3 className="font-mono text-label uppercase text-paper/70">
                    Elsewhere
                  </h3>
                  <ul className="mt-5 space-y-3">
                    {socials.map((social) => (
                      <li key={social.id}>
                        <a
                          href={social.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-3 rounded-sheet border border-paper/25 px-4 py-3 text-small transition-colors duration-200 ease-manuscript hover:border-paper/60 hover:bg-paper/5"
                        >
                          <SocialGlyph
                            icon={social.icon}
                            size={16}
                            className="shrink-0 text-paper/80"
                          />
                          <span>{social.handle}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <div>
                <h3 className="font-mono text-label uppercase text-paper/70">Direct</h3>
                <div className="mt-5 space-y-3">
                  {contact.email.href ? (
                    <a
                      href={`mailto:${contact.email.href}`}
                      className="inline-flex items-center gap-3 rounded-sheet border border-paper/25 px-4 py-3 text-small transition-colors duration-200 ease-manuscript hover:border-paper/60 hover:bg-paper/5"
                    >
                      <Mail
                        size={16}
                        aria-hidden="true"
                        className="shrink-0 text-paper/80"
                      />
                      <span>{contact.email.href}</span>
                    </a>
                  ) : contact.email.note ? (
                    <PendingLink note={contact.email.note} />
                  ) : null}

                  {contact.cv.href ? (
                    <a
                      href={contact.cv.href}
                      className="inline-flex items-center gap-3 rounded-sheet bg-paper px-4 py-3 text-small text-ink transition-colors duration-200 ease-manuscript hover:bg-paper-dim"
                    >
                      <Download size={16} aria-hidden="true" className="shrink-0" />
                      <span>{contact.cv.label}</span>
                    </a>
                  ) : contact.cv.note ? (
                    <PendingLink note={contact.cv.note} />
                  ) : null}
                </div>
              </div>
            </Reveal>

            {contact.referencesLine ? (
              <p className="mt-12 font-mono text-micro text-paper/60">
                {contact.referencesLine}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
