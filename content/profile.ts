import type { Content } from "@/lib/schema";

/**
 * The document the database is seeded with on first run.
 *
 * After seeding, the live site reads from the database and this file is only a
 * fallback and a reset point — the admin panel is the way to change content.
 * Keep it valid against `contentSchema`; `npm run db:setup` validates it.
 */
export const defaultContent: Content = {
  identity: {
    name: "Iftekhar Mahmud",
    title: "Lecturer in English",
    department: "Department of English",
    institution: "American International University-Bangladesh",
    institutionShort: "AIUB",
    institutionUrl: "https://www.aiub.edu",
    location: "Dhaka, Bangladesh",
  },

  meta: {
    title: "Iftekhar Mahmud — Lecturer in English, AIUB",
    description:
      "I am a Lecturer in the Department of English at American International University-Bangladesh. MEd TESOL (University of Dundee). I teach academic writing and reading; I research language testing and technology in language education.",
    keywords: [
      "Iftekhar Mahmud",
      "AIUB English",
      "TESOL",
      "language testing",
      "academic writing",
      "EAP",
      "ESP",
      "ELT",
      "technology in language education",
      "Dhaka",
    ],
    siteUrl: "https://iftekharmahmud.vercel.app",
  },

  hero: {
    eyebrow: ["Lecturer", "Department of English", "AIUB"],
    taglineLead: "Teaching students to write with precision — and researching ",
    taglineMarked: "how language is measured",
    taglineTail: ", and what technology changes about the way it is learned.",
    portrait: {
      src: "/headshot.webp",
      alt: "Portrait of Iftekhar Mahmud, Lecturer in the Department of English at American International University-Bangladesh",
    },
    primaryCta: { label: "Get in touch", href: "#contact" },
    secondaryCta: { label: "Research & writing", href: "#research" },
  },

  about: {
    paragraphs: [
      "I am a TESOL specialist, and I have taught in the Department of English at American International University-Bangladesh since 2023. I coordinate the university's Academic Writing course and teach across its EAP, ESP and ELT offerings.",
      "Before joining AIUB, I prepared candidates for the IELTS at Eduko Pathways and, earlier, at Liakat's — work that left me with a durable interest in how language ability is actually measured rather than merely described.",
      "My research now sits where language testing meets educational technology: how assessment can be made fairer and more informative, and how tools such as NLP applications support the speaking and writing development of EFL learners.",
    ],
    humanNote:
      "Outside the department I photograph, watch a great deal of film, and travel whenever the semester lets me.",
  },

  experience: [
    {
      id: "aiub-lecturer",
      role: "Lecturer",
      organization: "American International University-Bangladesh",
      location: "Dhaka, Bangladesh",
      start: "Jun 2023",
      end: "Present",
      startDate: "2023-06-01",
      endDate: "",
      current: true,
      summary:
        "I teach and coordinate undergraduate English courses in the Department of English, with responsibility for the university-wide Academic Writing curriculum.",
      highlights: [
        "I coordinate Academic Writing and moderate Academic Reading, setting shared syllabi, question papers and marking standards across sections.",
        "I teach undergraduate EAP, ESP and ELT courses, developing lecture material, tasks and reading packs from scratch.",
        "I design, administer and grade assessments, and review grading across sections for consistency.",
        "I mentor student research projects and conference-style presentations, from question framing to delivery.",
        "I help organise departmental conferences, workshops and inter-university competitions.",
      ],
    },
    {
      id: "eduko-ielts",
      role: "IELTS Instructor",
      organization: "Eduko Pathways",
      location: "Dhaka, Bangladesh",
      start: "Sep 2021",
      end: "Feb 2022",
      startDate: "2021-09-01",
      endDate: "2022-02-28",
      current: false,
      summary:
        "I taught full-course IELTS preparation and built the centre's practice material.",
      highlights: [
        "I designed course material and practice tasks covering listening, reading, writing and speaking.",
        "I ran and marked full mock tests across all four skills, with individual feedback on band-score gaps.",
      ],
    },
    {
      id: "liakats-ielts",
      role: "IELTS Instructor",
      organization: "Liakat's",
      location: "Dhaka, Bangladesh",
      start: "Sep 2018",
      end: "Jan 2019",
      startDate: "2018-09-01",
      endDate: "2019-01-31",
      current: false,
      summary:
        "I taught IELTS preparation classes alongside one-to-one candidate coaching.",
      highlights: [
        "I delivered group preparation classes on test strategy and language accuracy.",
        "I held one-on-one consultations to diagnose individual weaknesses and set study plans.",
      ],
    },
  ],

  education: {
    entries: [
      {
        id: "dundee-med",
        degree: "MEd",
        field: "Teaching English to Speakers of Other Languages (TESOL)",
        institution: "University of Dundee",
        location: "Dundee, United Kingdom",
        year: "2023",
        distinction: "Global Excellence Scholarship",
      },
      {
        id: "aiub-ba",
        degree: "BA (Hons)",
        field: "English — Linguistics & TEFL",
        institution: "American International University-Bangladesh",
        location: "Dhaka, Bangladesh",
        year: "2021",
        distinction: "Magna Cum Laude",
      },
    ],
    earlierEducation:
      "Earlier schooling on the science track: HSC and SSC, both completed with a 5.00 GPA.",
  },

  research: {
    intro:
      "Work in progress on assessment and technology, grown directly out of the writing and speaking classroom.",
    interests: [
      "Language testing & assessment",
      "Technology in language education",
      "EFL speaking development",
      "EFL writing development",
    ],
    outputs: [
      {
        id: "ieom-2025-nlp",
        role: "Supervisory Author",
        title:
          "Benefits of NLP Tools for Speaking Development of Second Language Learners",
        venue:
          "8th IEOM Bangladesh International Conference on Industrial Engineering & Operations Management",
        venueShort: "IEOM Bangladesh 2025",
        date: "21 December 2025",
        dateISO: "2025-12-21",
        award: "Best Track Paper — Track 5",
      },
    ],
  },

  honors: [
    {
      id: "ieom-best-track",
      title: "Best Track Paper",
      awarder: "IEOM Bangladesh International Conference",
      year: "2025",
      detail: "Track 5, for the paper on NLP tools and second-language speaking.",
    },
    {
      id: "magna-cum-laude",
      title: "Magna Cum Laude",
      awarder: "American International University-Bangladesh",
      year: "2023",
      detail: "For academic standing across the BA in English.",
    },
    {
      id: "dundee-scholarship",
      title: "Global Excellence Scholarship",
      awarder: "University of Dundee",
      year: "2022",
      detail: "Competitive award towards the MEd in TESOL.",
    },
    {
      id: "ielts-band",
      title: "IELTS 8.0 / 9.0",
      awarder: "British Council",
      year: "2018 & 2021",
      detail: "Overall band 8.0 out of a possible 9.0.",
    },
    {
      id: "deans-award",
      title: "Dean's Award",
      awarder: "American International University-Bangladesh",
      year: "2018–2020",
      detail: "Three consecutive years for academic standing.",
    },
  ],

  service: [
    {
      id: "conference-debate",
      title: "Conference & Debate Service",
      blurb:
        "I organise sessions, review papers and judge argument — inside the department and across universities.",
      range: "",
      items: [
        {
          id: "icctass-2025",
          role: "Session Organizer & Paper Reviewer",
          event: "ICCTASS International Conference",
          year: "2025",
        },
        {
          id: "discover-english",
          role: "Adjudicator",
          event: "Discover English",
          year: "2025 & 2023",
        },
        { id: "eco-fest", role: "Debate Adjudicator", event: "Eco Fest", year: "2025" },
        { id: "creation-2", role: "Debate Adjudicator", event: "Creation 2.0", year: "" },
        {
          id: "oratory-odyssey",
          role: "Debate Adjudicator",
          event: "Oratory Odyssey 2.0",
          year: "",
        },
      ],
    },
    {
      id: "continuing-development",
      title: "Continuing Development",
      blurb:
        "I keep my teaching and research current through workshops and certification.",
      range: "2021–2025",
      items: [
        {
          id: "workshop-publishing",
          role: "Workshop",
          event: "Publishing in applied linguistics",
          year: "",
        },
        {
          id: "workshop-motivation",
          role: "Workshop",
          event: "Learner motivation in the language classroom",
          year: "",
        },
        {
          id: "workshop-scholarly-writing",
          role: "Workshop",
          event: "Scholarly writing & research methods",
          year: "",
        },
        { id: "pte-trainer", role: "Certification", event: "PTE Train-the-Trainer", year: "" },
      ],
    },
  ],

  skills: [
    {
      id: "teaching-research",
      title: "Teaching & Research",
      icon: "teaching",
      items: [
        "TESOL",
        "Assessment design",
        "Academic writing instruction",
        "Material development",
        "Linguistic analysis",
      ],
    },
    {
      id: "languages",
      title: "Languages",
      icon: "languages",
      items: [
        "English — British & American, fluent",
        "Bengali — fluent",
        "Hindi — conversational",
      ],
    },
    {
      id: "tools",
      title: "Tools",
      icon: "tools",
      items: [
        "MS Office",
        "Adobe Photoshop",
        "Adobe Lightroom",
        "Adobe Premiere Pro",
        "Prompt engineering & LLMs",
      ],
    },
  ],

  contact: {
    heading: "Get in touch",
    invitation:
      "I am open to research collaboration, conference invitations and student supervision enquiries. Students in my courses are welcome during posted office hours.",
    email: { label: "Email", href: "iftekhar@aiub.edu", note: "" },
    cv: {
      label: "Download CV",
      href: "",
      note: "CV available on request.",
    },
    referencesLine: "References available on request.",
  },

  socials: [
    {
      id: "linkedin",
      label: "LinkedIn",
      handle: "linkedin.com/in/iftekhar72",
      href: "https://www.linkedin.com/in/iftekhar72",
      icon: "linkedin",
    },
  ],

  nav: [
    { id: "nav-about", href: "/#about", label: "About" },
    { id: "nav-experience", href: "/#experience", label: "Experience" },
    { id: "nav-research", href: "/#research", label: "Research" },
    { id: "nav-service", href: "/#service", label: "Service" },
    { id: "nav-contact", href: "/#contact", label: "Contact" },
  ],

  sections: [
    {
      id: "about",
      enabled: true,
      label: "About",
      title: "A teacher first, and a researcher because of it",
      lede: "",
      tone: "paper",
    },
    {
      id: "experience",
      enabled: true,
      label: "Experience",
      title: "Teaching, coordinating, examining",
      lede: "From IELTS preparation rooms to a university writing curriculum.",
      tone: "paper",
    },
    {
      id: "education",
      enabled: true,
      label: "Education",
      title: "Training in language teaching and linguistics",
      lede: "",
      tone: "raised",
    },
    {
      id: "research",
      enabled: true,
      label: "Research",
      title: "What gets measured, and what technology changes",
      lede: "",
      tone: "paper",
    },
    {
      id: "honors",
      enabled: true,
      label: "Honors",
      title: "Selected recognition",
      lede: "",
      tone: "raised",
    },
    {
      id: "service",
      enabled: true,
      label: "Service",
      title: "Work for the department and the field",
      lede: "",
      tone: "paper",
    },
    {
      id: "skills",
      enabled: true,
      label: "Skills",
      title: "What I work with",
      lede: "",
      tone: "raised",
    },
    {
      id: "contact",
      enabled: true,
      label: "Contact",
      title: "Get in touch",
      lede: "",
      tone: "paper",
    },
  ],

  theme: {
    ink: "#20302A",
    inkSoft: "#4A5B54",
    inkFaint: "#6B7C74",
    paper: "#F1EFE6",
    paperRaised: "#F7F5EF",
    paperDim: "#E4E1D5",
    pen: "#A63B31",
    penDeep: "#8A2F27",
    brass: "#B08D57",
    brassDeep: "#6F5426",
    serif: "fraunces",
    sans: "publicSans",
    mono: "ibmPlexMono",
    grain: true,
  },
};
