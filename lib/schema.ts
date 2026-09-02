import { z } from "zod";

/**
 * The shape of the entire site.
 *
 * This file is the single source of truth: the database stores one JSON
 * document validated against `contentSchema`, the public page renders from it,
 * the admin panel edits it, and every TypeScript type on both sides is inferred
 * from here. Add a field once and it exists everywhere.
 *
 * Convention: an empty string means "not set". There are no nulls in the
 * document, which keeps form inputs and rendering checks simple.
 */

const text = z.string().trim();
const required = (label: string) => text.min(1, `${label} is required`);
const hex = text.regex(/^#[0-9a-fA-F]{6}$/, "Must be a 6-digit hex colour, e.g. #20302A");
const httpUrl = text.regex(/^https?:\/\/\S+$/i, "Must start with http:// or https://");
const emailAddress = text.regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Must be a valid email address");

/** A path this app serves: an uploaded file or something in /public. */
const localPath = text.regex(/^\//, "Must start with /");

// ---------------------------------------------------------------------------
// Identity and metadata
// ---------------------------------------------------------------------------

export const identitySchema = z.object({
  name: required("Name"),
  title: required("Title"),
  department: required("Department"),
  institution: required("Institution"),
  institutionShort: required("Institution short name"),
  institutionUrl: httpUrl,
  location: required("Location"),
});

export const metaSchema = z.object({
  title: required("Browser title"),
  description: required("Description").max(320, "Keep the description under 320 characters"),
  keywords: z.array(required("Keyword")).max(24, "24 keywords is plenty"),
  siteUrl: httpUrl,
});

// ---------------------------------------------------------------------------
// Hero and about
// ---------------------------------------------------------------------------

export const heroSchema = z.object({
  eyebrow: z.array(required("Eyebrow item")).max(5, "Up to 5 eyebrow items"),
  /** Split in three so one phrase can carry the drawn proofreader's mark. */
  taglineLead: required("Tagline opening"),
  taglineMarked: required("Underlined phrase").max(
    46,
    "Keep the underlined phrase short so it fits on one line on a phone",
  ),
  taglineTail: text,
  portrait: z.object({
    src: localPath,
    alt: required("Portrait alt text"),
  }),
  primaryCta: z.object({ label: required("Button label"), href: required("Button target") }),
  secondaryCta: z.object({ label: required("Link label"), href: required("Link target") }),
});

export const aboutSchema = z.object({
  paragraphs: z.array(required("Paragraph")).min(1, "At least one paragraph"),
  humanNote: text,
});

// ---------------------------------------------------------------------------
// Timelines
// ---------------------------------------------------------------------------

export const experienceEntrySchema = z.object({
  id: required("id"),
  role: required("Role"),
  organization: required("Organization"),
  location: text,
  /** Display strings, e.g. "Jun 2023" and "Present". */
  start: required("Start"),
  end: required("End"),
  /** Machine-readable, used by the structured data. Empty end means ongoing. */
  startDate: text,
  endDate: text,
  current: z.boolean(),
  summary: text,
  highlights: z.array(required("Highlight")),
});

export const educationEntrySchema = z.object({
  id: required("id"),
  degree: required("Degree"),
  field: required("Field"),
  institution: required("Institution"),
  location: text,
  year: required("Year"),
  /** Scholarship or distinction. Grades are deliberately not modelled. */
  distinction: text,
});

export const educationSchema = z.object({
  entries: z.array(educationEntrySchema),
  /** The quiet closing line about earlier schooling. */
  earlierEducation: text,
});

// ---------------------------------------------------------------------------
// Research, honors, service, skills
// ---------------------------------------------------------------------------

export const researchOutputSchema = z.object({
  id: required("id"),
  role: required("Role"),
  title: required("Title"),
  venue: required("Venue"),
  venueShort: text,
  date: text,
  dateISO: text,
  award: text,
});

export const researchSchema = z.object({
  intro: text,
  interests: z.array(required("Interest")),
  outputs: z.array(researchOutputSchema),
});

export const honorSchema = z.object({
  id: required("id"),
  title: required("Title"),
  awarder: required("Awarded by"),
  year: required("Year"),
  detail: text,
});

export const serviceItemSchema = z.object({
  id: required("id"),
  role: required("Role"),
  event: required("Event"),
  /** Empty where the year is not on record — nothing is invented. */
  year: text,
});

export const serviceClusterSchema = z.object({
  id: required("id"),
  title: required("Title"),
  blurb: text,
  /** Span shown when the individual items carry no year. */
  range: text,
  items: z.array(serviceItemSchema),
});

export const skillIcons = ["teaching", "languages", "tools", "research", "writing"] as const;
export type SkillIcon = (typeof skillIcons)[number];

export const skillGroupSchema = z.object({
  id: required("id"),
  title: required("Title"),
  icon: z.enum(skillIcons),
  items: z.array(required("Skill")),
});

// ---------------------------------------------------------------------------
// Contact and links
// ---------------------------------------------------------------------------

/** A link that may not be live yet. Empty href renders the note as a marked placeholder. */
const pendingLinkSchema = z.object({
  label: required("Label"),
  href: text,
  note: text,
});

export const contactSchema = z.object({
  heading: required("Heading"),
  invitation: text,
  email: pendingLinkSchema.extend({
    href: z.union([emailAddress, z.literal("")]),
  }),
  cv: pendingLinkSchema.extend({
    href: z.union([localPath, z.literal("")]),
  }),
  referencesLine: text,
});

export const socialIcons = ["linkedin", "scholar", "orcid", "researchgate", "website"] as const;
export type SocialIcon = (typeof socialIcons)[number];

export const socialSchema = z.object({
  id: required("id"),
  label: required("Label"),
  /** What the reader sees, e.g. "linkedin.com/in/iftekhar72". */
  handle: required("Handle"),
  href: httpUrl,
  icon: z.enum(socialIcons),
});

export const navLinkSchema = z.object({
  id: required("id"),
  /** Root-relative so the masthead works from any route, e.g. "/#about". */
  href: required("Target"),
  label: required("Label"),
});

// ---------------------------------------------------------------------------
// Section order, visibility and headings
// ---------------------------------------------------------------------------

export const sectionIds = [
  "about",
  "experience",
  "education",
  "research",
  "honors",
  "service",
  "skills",
  "contact",
] as const;
export type SectionId = (typeof sectionIds)[number];

export const sectionSchema = z.object({
  id: z.enum(sectionIds),
  enabled: z.boolean(),
  /** Margin label, e.g. "Experience". The § number comes from the order. */
  label: required("Margin label"),
  title: required("Heading"),
  lede: text,
  tone: z.enum(["paper", "raised"]),
});

// ---------------------------------------------------------------------------
// Theme
// ---------------------------------------------------------------------------

export const serifFonts = ["fraunces", "spectral", "newsreader"] as const;
export const sansFonts = ["publicSans", "inter"] as const;
export const monoFonts = ["ibmPlexMono", "jetBrainsMono"] as const;
export type SerifFont = (typeof serifFonts)[number];
export type SansFont = (typeof sansFonts)[number];
export type MonoFont = (typeof monoFonts)[number];

export const themeSchema = z.object({
  ink: hex,
  inkSoft: hex,
  inkFaint: hex,
  paper: hex,
  paperRaised: hex,
  paperDim: hex,
  pen: hex,
  penDeep: hex,
  brass: hex,
  brassDeep: hex,
  serif: z.enum(serifFonts),
  sans: z.enum(sansFonts),
  mono: z.enum(monoFonts),
  /** The paper-tooth overlay. Decorative, and cheap to switch off. */
  grain: z.boolean(),
});

// ---------------------------------------------------------------------------
// The whole document
// ---------------------------------------------------------------------------

export const contentSchema = z.object({
  identity: identitySchema,
  meta: metaSchema,
  hero: heroSchema,
  about: aboutSchema,
  experience: z.array(experienceEntrySchema),
  education: educationSchema,
  research: researchSchema,
  honors: z.array(honorSchema),
  service: z.array(serviceClusterSchema),
  skills: z.array(skillGroupSchema),
  contact: contactSchema,
  socials: z.array(socialSchema),
  nav: z.array(navLinkSchema),
  sections: z.array(sectionSchema),
  theme: themeSchema,
});

export type Content = z.infer<typeof contentSchema>;
export type Identity = z.infer<typeof identitySchema>;
export type Meta = z.infer<typeof metaSchema>;
export type Hero = z.infer<typeof heroSchema>;
export type About = z.infer<typeof aboutSchema>;
export type ExperienceEntry = z.infer<typeof experienceEntrySchema>;
export type Education = z.infer<typeof educationSchema>;
export type EducationEntry = z.infer<typeof educationEntrySchema>;
export type Research = z.infer<typeof researchSchema>;
export type ResearchOutput = z.infer<typeof researchOutputSchema>;
export type HonorEntry = z.infer<typeof honorSchema>;
export type ServiceCluster = z.infer<typeof serviceClusterSchema>;
export type ServiceItem = z.infer<typeof serviceItemSchema>;
export type SkillGroup = z.infer<typeof skillGroupSchema>;
export type Contact = z.infer<typeof contactSchema>;
export type Social = z.infer<typeof socialSchema>;
export type NavLink = z.infer<typeof navLinkSchema>;
export type Section = z.infer<typeof sectionSchema>;
export type Theme = z.infer<typeof themeSchema>;

/**
 * Editable slices, each addressed by the admin panel as one unit. Saving posts
 * the whole slice, so a single generic action can serve every editor screen.
 */
export const sliceSchemas = {
  identity: identitySchema,
  meta: metaSchema,
  hero: heroSchema,
  about: aboutSchema,
  experience: contentSchema.shape.experience,
  education: educationSchema,
  research: researchSchema,
  honors: contentSchema.shape.honors,
  service: contentSchema.shape.service,
  skills: contentSchema.shape.skills,
  contact: contactSchema,
  socials: contentSchema.shape.socials,
  nav: contentSchema.shape.nav,
  sections: contentSchema.shape.sections,
  theme: themeSchema,
} as const;

export type SliceKey = keyof typeof sliceSchemas;

/**
 * What a save returns. Declared here rather than beside the database code so the
 * client editors can import the type without reaching into a server-only module.
 */
export interface SaveResult {
  ok: boolean;
  /** Dotted field path → message, ready to render next to the offending input. */
  fieldErrors: Record<string, string>;
  message: string;
}

export const sliceKeys = Object.keys(sliceSchemas) as SliceKey[];

export function isSliceKey(value: string): value is SliceKey {
  return Object.prototype.hasOwnProperty.call(sliceSchemas, value);
}
