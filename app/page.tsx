import type { ReactNode } from "react";
import { loadContent } from "@/lib/content";
import { personJsonLd } from "@/lib/jsonld";
import type { Section } from "@/lib/schema";
import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Experience } from "@/components/Experience";
import { Education } from "@/components/Education";
import { Research } from "@/components/Research";
import { Honors } from "@/components/Honors";
import { AcademicService } from "@/components/AcademicService";
import { Skills } from "@/components/Skills";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";

/**
 * Statically rendered and held for an hour, but every save in the admin panel
 * calls `revalidatePath`, so edits appear immediately rather than after an hour.
 */
export const revalidate = 3600;

export default async function HomePage() {
  const { content } = await loadContent();
  const visible = content.sections.filter((section) => section.enabled);

  /** § numbers come from position, so reordering renumbers the page for free. */
  const renderSection = (section: Section, position: number): ReactNode => {
    const index = String(position + 1).padStart(2, "0");
    const shared = { section, index };

    switch (section.id) {
      case "about":
        return <About key={section.id} {...shared} about={content.about} />;
      case "experience":
        return <Experience key={section.id} {...shared} entries={content.experience} />;
      case "education":
        return <Education key={section.id} {...shared} education={content.education} />;
      case "research":
        return <Research key={section.id} {...shared} research={content.research} />;
      case "honors":
        return <Honors key={section.id} {...shared} honors={content.honors} />;
      case "service":
        return <AcademicService key={section.id} {...shared} clusters={content.service} />;
      case "skills":
        return <Skills key={section.id} {...shared} groups={content.skills} />;
      case "contact":
        return (
          <Contact
            key={section.id}
            {...shared}
            contact={content.contact}
            socials={content.socials}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Nav identity={content.identity} links={content.nav} />

      <main id="main">
        <Hero hero={content.hero} identity={content.identity} />
        {visible.map(renderSection)}
      </main>

      <Footer
        identity={content.identity}
        socials={content.socials}
        contact={content.contact}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd(content)) }}
      />
    </>
  );
}
