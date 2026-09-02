import type { Content } from "@/lib/schema";

/**
 * JSON-LD `Person` graph, derived from the same document the page renders, so
 * the structured data cannot drift from what a reader sees.
 */
export function personJsonLd(content: Content) {
  const { identity, meta, hero, education, research, honors, contact, socials, experience } =
    content;
  const current = experience.find((entry) => entry.current);

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: identity.name,
    jobTitle: `${identity.title}, ${identity.department}`,
    description: meta.description,
    url: meta.siteUrl,
    image: hero.portrait.src.startsWith("http")
      ? hero.portrait.src
      : `${meta.siteUrl}${hero.portrait.src}`,
    worksFor: {
      "@type": "CollegeOrUniversity",
      name: current?.organization ?? identity.institution,
      url: identity.institutionUrl,
    },
    alumniOf: education.entries.map((entry) => ({
      "@type": "CollegeOrUniversity",
      name: entry.institution,
    })),
    hasCredential: education.entries.map((entry) => ({
      "@type": "EducationalOccupationalCredential",
      credentialCategory: "degree",
      name: `${entry.degree} — ${entry.field}`,
      recognizedBy: { "@type": "CollegeOrUniversity", name: entry.institution },
    })),
    knowsAbout: research.interests,
    knowsLanguage: [
      { "@type": "Language", name: "English" },
      { "@type": "Language", name: "Bengali" },
      { "@type": "Language", name: "Hindi" },
    ],
    award: honors.map((honor) => `${honor.title} (${honor.year})`),
    address: {
      "@type": "PostalAddress",
      addressLocality: identity.location.split(",")[0]?.trim() || identity.location,
      addressCountry: "BD",
    },
    ...(contact.email.href ? { email: contact.email.href } : {}),
    sameAs: socials.map((social) => social.href),
  };
}
