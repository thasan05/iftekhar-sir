import "server-only";

import { cache } from "react";
import { revalidatePath } from "next/cache";
import { query, queryOne } from "@/lib/db";
import { defaultContent } from "@/content/profile";
import {
  contentSchema,
  sliceSchemas,
  type Content,
  type SaveResult,
  type SliceKey,
} from "@/lib/schema";

export type { SaveResult };

/** Revisions kept per document. Older ones are pruned on save. */
const REVISION_LIMIT = 60;

type Json = Record<string, unknown>;

function isPlainObject(value: unknown): value is Json {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Lay a stored document over the defaults.
 *
 * Without this, adding a field to the schema would break every document already
 * in the database. Objects merge key by key; arrays and scalars are taken
 * wholesale from the stored value, because a stored empty list is a real answer.
 */
function mergeWithDefaults<T>(defaults: T, stored: unknown): T {
  if (!isPlainObject(defaults) || !isPlainObject(stored)) {
    return (stored === undefined ? defaults : (stored as T));
  }
  const out: Json = { ...defaults };
  for (const [key, fallback] of Object.entries(defaults)) {
    if (key in stored) out[key] = mergeWithDefaults(fallback, stored[key]);
  }
  return out as T;
}

/**
 * Convert the original third-person profile copy to the site's first-person voice.
 *
 * This is intentionally a small, exact replacement map rather than a generic
 * pronoun replacer: words such as "his" can legitimately occur inside unrelated
 * content, URLs or proper nouns. It also makes existing CMS rows switch voice
 * immediately without requiring a destructive database reset.
 */
const firstPersonReplacements: ReadonlyArray<readonly [string, string]> = [
  [
    "Iftekhar Mahmud is a TESOL specialist who has taught in the Department of English at American International University-Bangladesh since 2023, where he coordinates the university's Academic Writing course and teaches across its EAP, ESP and ELT offerings.",
    "I am a TESOL specialist, and I have taught in the Department of English at American International University-Bangladesh since 2023. I coordinate the university's Academic Writing course and teach across its EAP, ESP and ELT offerings.",
  ],
  [
    "Before joining AIUB he prepared candidates for the IELTS at Eduko Pathways and, earlier, at Liakat's — work that left him with a durable interest in how language ability is actually measured rather than merely described.",
    "Before joining AIUB, I prepared candidates for the IELTS at Eduko Pathways and, earlier, at Liakat's — work that left me with a durable interest in how language ability is actually measured rather than merely described.",
  ],
  [
    "His research now sits where language testing meets educational technology: how assessment can be made fairer and more informative, and how tools such as NLP applications support the speaking and writing development of EFL learners.",
    "My research now sits where language testing meets educational technology: how assessment can be made fairer and more informative, and how tools such as NLP applications support the speaking and writing development of EFL learners.",
  ],
  [
    "Outside the department he photographs, watches a great deal of film, and travels whenever the semester lets him.",
    "Outside the department I photograph, watch a great deal of film, and travel whenever the semester lets me.",
  ],
  [
    "Teaches and coordinates undergraduate English courses in the Department of English, with responsibility for the university-wide Academic Writing curriculum.",
    "I teach and coordinate undergraduate English courses in the Department of English, with responsibility for the university-wide Academic Writing curriculum.",
  ],
  [
    "Course coordinator for Academic Writing and course moderator for Academic Reading, setting shared syllabi, question papers and marking standards across sections.",
    "I coordinate Academic Writing and moderate Academic Reading, setting shared syllabi, question papers and marking standards across sections.",
  ],
  [
    "Teaches undergraduate EAP, ESP and ELT courses, developing lecture material, tasks and reading packs from scratch.",
    "I teach undergraduate EAP, ESP and ELT courses, developing lecture material, tasks and reading packs from scratch.",
  ],
  [
    "Designs, administers and grades assessments, and reviews grading across sections for consistency.",
    "I design, administer and grade assessments, and review grading across sections for consistency.",
  ],
  [
    "Mentors student research projects and conference-style presentations, from question framing to delivery.",
    "I mentor student research projects and conference-style presentations, from question framing to delivery.",
  ],
  [
    "Helps organise departmental conferences, workshops and inter-university competitions.",
    "I help organise departmental conferences, workshops and inter-university competitions.",
  ],
  [
    "Taught full-course IELTS preparation and built the centre's practice material.",
    "I taught full-course IELTS preparation and built the centre's practice material.",
  ],
  [
    "Designed course material and practice tasks covering listening, reading, writing and speaking.",
    "I designed course material and practice tasks covering listening, reading, writing and speaking.",
  ],
  [
    "Ran and marked full mock tests across all four skills, with individual feedback on band-score gaps.",
    "I ran and marked full mock tests across all four skills, with individual feedback on band-score gaps.",
  ],
  [
    "Taught IELTS preparation classes alongside one-to-one candidate coaching.",
    "I taught IELTS preparation classes alongside one-to-one candidate coaching.",
  ],
  [
    "Delivered group preparation classes on test strategy and language accuracy.",
    "I delivered group preparation classes on test strategy and language accuracy.",
  ],
  [
    "Held one-on-one consultations to diagnose individual weaknesses and set study plans.",
    "I held one-on-one consultations to diagnose individual weaknesses and set study plans.",
  ],
  [
    "Organising sessions, reviewing papers and judging argument — inside the department and across universities.",
    "I organise sessions, review papers and judge argument — inside the department and across universities.",
  ],
  [
    "Workshops and certification keeping the teaching and the research current.",
    "I keep my teaching and research current through workshops and certification.",
  ],
  [
    "Open to research collaboration, conference invitations and student supervision enquiries. Students in his courses are welcome during posted office hours.",
    "I am open to research collaboration, conference invitations and student supervision enquiries. Students in my courses are welcome during posted office hours.",
  ],
  [
    "Iftekhar Mahmud is a Lecturer in the Department of English at American International University-Bangladesh. MEd TESOL (University of Dundee). Teaching academic writing and reading; researching language testing and technology in language education.",
    "I am a Lecturer in the Department of English at American International University-Bangladesh. MEd TESOL (University of Dundee). I teach academic writing and reading; I research language testing and technology in language education.",
  ],
];

function normalizeFirstPerson<T>(value: T): T {
  if (typeof value === "string") {
    let result = value;
    for (const [from, to] of firstPersonReplacements) {
      result = result.replaceAll(from, to);
    }
    return result as T;
  }

  if (Array.isArray(value)) {
    return value.map((item) => normalizeFirstPerson(item)) as T;
  }

  if (isPlainObject(value)) {
    const out: Json = {};
    for (const [key, item] of Object.entries(value)) {
      out[key] = normalizeFirstPerson(item);
    }
    return out as T;
  }

  return value as T;
}

function parseJsonColumn(value: unknown): unknown {
  if (typeof value === "string") {
    try {
      return JSON.parse(value);
    } catch {
      return null;
    }
  }
  return value;
}

export interface LoadedContent {