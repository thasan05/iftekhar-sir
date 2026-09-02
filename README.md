# Iftekhar Mahmud — academic profile site

A single-page profile site for **Iftekhar Mahmud**, Lecturer in the Department of English at
American International University-Bangladesh (AIUB), with a built-in admin panel at `/admin`
for editing every part of it.

Next.js (App Router) and TypeScript, content in Postgres, deployable to Vercel.

---

## Stack

| Concern    | Choice                                                          |
| ---------- | --------------------------------------------------------------- |
| Framework  | Next.js 16 (App Router, Turbopack), React 19                    |
| Language   | TypeScript (strict)                                             |
| Styling    | Tailwind CSS 4, tokens in `app/globals.css`                     |
| Content    | Postgres — one validated JSON document, edited at `/admin`       |
| Validation | Zod, shared by the admin panel and the renderer                 |
| Motion     | Framer Motion                                                   |
| Icons      | lucide-react                                                    |
| Fonts      | `next/font/google`                                              |
| Hosting    | Vercel + Neon Postgres                                          |

---

## Quick start

```bash
npm install
```

```bash
npm run admin:password
```

```bash
npm run dev
```

Then open <http://localhost:3000>, and <http://localhost:3000/admin> to edit.

**No database setup is needed locally.** With no `DATABASE_URL`, the app runs PGlite — a real
Postgres compiled to WebAssembly — in-process, storing data under `.data/pglite`. The schema is
created on first use, so there is no migration step. Point `DATABASE_URL` at a real Postgres and
the same code talks to that instead.

### Scripts

| Script                   | What it does                                       |
| ------------------------ | -------------------------------------------------- |
| `npm run dev`            | Development server                                 |
| `npm run build`          | Production build (also type-checks)                |
| `npm start`              | Serve the production build                         |
| `npm run lint`           | ESLint                                             |
| `npm run typecheck`      | `tsc --noEmit`                                     |
| `npm run admin:password` | Set the admin password, writing `.env.local`       |

Requires Node 20.9 or newer.

---

## Environment variables

| Variable               | Required            | Purpose                                              |
| ---------------------- | ------------------- | ---------------------------------------------------- |
| `DATABASE_URL`         | in production       | Postgres connection string. Omit locally to use PGlite. |
| `ADMIN_PASSWORD_HASH`  | to sign in          | Written by `npm run admin:password`. Never the password itself. |
| `SESSION_SECRET`       | in production       | Signs the session cookie. Generated alongside the hash. |
| `NEXT_PUBLIC_SITE_URL` | recommended         | Public URL, used for canonical links and the sitemap. |

`npm run admin:password` creates or updates `.env.local` with the first two. Copy those values
into your host's environment variables for production — the same password works in both places.

Both generated values are dot-separated base64url on purpose. `.env` loaders — including the one
Next uses — expand `$NAME` references *inside* values, so a hash containing `$` arrives at the
server with every segment after the first silently deleted, and sign-in can never succeed. Keep
`$` out of these values if you ever write them by hand.

---

## The admin panel

Sign in at `/admin`. **Saving publishes immediately**, and every save stores the version it
replaced, so the revision history is the undo button.

| Screen                | Edits                                                             |
| --------------------- | ----------------------------------------------------------------- |
| Dashboard             | Status, which database is live, backup download and restore        |
| Hero                  | Tagline (including the underlined phrase), eyebrow, portrait, buttons |
| About                 | Paragraphs and the closing aside                                  |
| Experience            | Roles, with highlights — add, remove, reorder                     |
| Education             | Degrees and the earlier-schooling line                            |
| Research              | Interests and papers                                              |
| Honors                | Award cards                                                       |
| Service               | Clusters and their nested entries                                 |
| Skills                | Groups, their icon, and tags                                      |
| Contact               | Heading, email, CV upload, references line                        |
| Sections & order      | Reorder the page, rename headings, hide sections                  |
| Menu / Profiles       | Masthead links; external profiles (ORCID, Scholar, ResearchGate)  |
| Theme                 | Colours and fonts, with live contrast checking                    |
| Identity / Search     | Name and post; title, description, keywords, site URL             |
| Uploads               | Images and PDFs                                                   |
| Revisions             | Restore any previous version                                      |

Notes worth knowing:

- **Nothing saves half-valid.** Every screen validates against the same Zod schema the public
  page relies on. Errors come back attached to the field that caused them.
- **Section numbers are computed.** The `§ 01` marks follow the order in *Sections & order*, so
  reordering or hiding a section renumbers the page by itself.
- **Empty means hidden, not broken.** Clearing the aside, a standfirst, a distinction or the
  references line removes it from the page rather than leaving an empty block.
- **The theme editor checks contrast as you pick.** It runs the WCAG maths on the eight colour
  pairings that actually appear on the page and warns before a palette that fails AA can be
  published.
- **Uploads are addressed by content hash**, so URLs are immutable, cacheable forever, and
  re-uploading the same file costs nothing.
- **Unsaved changes are protected** — the browser warns before you navigate away, and Ctrl/Cmd+S
  saves.

### Security

- One editor, one password. PBKDF2-HMAC-SHA256 at 600,000 iterations; only the hash is stored.
- Session is an HMAC-signed HttpOnly cookie, verified in `proxy.ts` before any admin route
  renders, and re-checked inside every server action — actions are separately addressable POST
  endpoints and never trust the route they appear to belong to.
- Six failed sign-ins from one address triggers a 15-minute lockout.
- `/admin` is `noindex` and excluded in `robots.txt`.
- Uploads are checked by inspecting the file's actual bytes, not its claimed content type.

---

## Content

The live content is a single JSON document in Postgres. `content/profile.ts` holds the
**starting** document: it seeds an empty database, acts as the fallback if the database is
unreachable, and is the reset point. Day to day, edit through `/admin` rather than in code.

`lib/schema.ts` is the single source of truth for the shape. Every TypeScript type on both
sides is inferred from it, so adding a field there is the only edit needed for it to exist
everywhere. Stored documents are merged over the defaults before validation, so adding a field
does not invalidate what is already saved.

If the database is unavailable the site still renders from the starting document, and the
dashboard says so rather than failing silently.

---

## Design system

The look is an "annotated manuscript": paper stock, ink text, and a single red pen for
underlines and marginal marks. Tokens live in the `@theme` block in
[`app/globals.css`](app/globals.css) — components never hardcode a colour or size.

| Token          | Default   | Used for                                         |
| -------------- | --------- | ------------------------------------------------ |
| `ink`          | `#20302A` | body text, dark surfaces                         |
| `ink-soft`     | `#4A5B54` | secondary copy                                   |
| `paper`        | `#F1EFE6` | page background                                  |
| `paper-raised` | `#F7F5EF` | alternating sections and cards                   |
| `pen`          | `#A63B31` | the one accent: links, underlines, focus ring    |
| `brass`        | `#B08D57` | Honors only, decorative — fails AA as text       |
| `brass-deep`   | `#6F5426` | brass-toned text where contrast matters          |

Type scale: `label`, `micro`, `small`, `body`, `lede`, `h4`, `h3`, `h2`, `h1`. Headline sizes use
`clamp()`, so they scale with the viewport rather than stepping at breakpoints.

**Why the tokens are in CSS and not in a `tailwind.config.ts`.** The palette has to be editable
at runtime, which means Tailwind's colour tokens must resolve to CSS variables. Declaring them
in a JavaScript config silently drops every opacity modifier — `border-ink/10` compiles to solid
ink, and every hairline on the page renders as a hard black rule. Declaring them in `@theme
inline` over plain `:root` variables keeps both behaviours: an opacity modifier compiles to
`color-mix(in oklab, var(--ink) 10%, transparent)`, which follows the live palette. The theme
editor writes those `:root` variables; `lib/theme.ts` renders that block inline, so there is no
flash of the previous colours.

**The signature gesture**, used exactly once: the phrase in the hero tagline gets a
proofreader's underline drawn in on load
([`components/ui/ProofUnderline.tsx`](components/ui/ProofUnderline.tsx)). Deliberately not
repeated anywhere else.

---

## Motion and accessibility

- One orchestrated entrance in the hero, then restrained `whileInView` reveals elsewhere.
- `useReducedMotion` collapses every duration to zero when the reader asks for reduced motion.
  The animated props stay in place, so server and client render identical markup and content is
  never stranded mid-animation.
- Motion pre-renders reveal targets hidden, so the layout ships a `<noscript>` rule that reveals
  anything carrying `.motion-reveal`. With JavaScript off the whole page still reads.
- Semantic landmarks, a skip link, `aria-labelledby` on every section, `aria-expanded` /
  `aria-controls` on both menus, and Escape to close.
- Focus is visible everywhere: a 2 px pen ring with a paper offset, including on the dark
  Contact panel.
- All body and label text meets WCAG AA; the lowest measured ratio on the default palette is
  5.35:1 against a 4.5:1 requirement.
- Admin forms use real labels tied to inputs, `aria-invalid` on rejected fields, and
  `aria-live` status regions. Reordering is buttons, not drag-and-drop, so it works from the
  keyboard.

---

## SEO

Metadata comes from the live document through the Next.js Metadata API: title template,
description, keywords, canonical URL, Open Graph and Twitter cards with dimensions and alt text,
robots directives and `theme-color`. `app/sitemap.ts` and `app/robots.ts` generate
`/sitemap.xml` and `/robots.txt`. A JSON-LD `Person` graph is derived from the same document, so
structured data cannot drift from the page.

---

## Deploying to Vercel

1. **Create a Postgres database.** In the Vercel dashboard, **Storage → Create → Neon**, or use
   any Postgres provider. Copy the pooled connection string.
2. **Push to GitHub** and import the repository in Vercel. Build settings are detected — leave
   the defaults.
3. **Set the environment variables** under Settings → Environment Variables:
   - `DATABASE_URL` — the connection string from step 1
   - `ADMIN_PASSWORD_HASH` and `SESSION_SECRET` — copy from your local `.env.local`
   - `NEXT_PUBLIC_SITE_URL` — the production domain
4. **Deploy.** Tables are created on first request; no migration step.
5. **Open `/admin`**, sign in, and press *Initialise database* on the dashboard to write the
   starting content. Until then the site renders that content from the repository anyway, so
   there is no broken window.

Or from the CLI:

```bash
npx vercel --prod
```

---

## Before launch

- Upload the public-ready **CV PDF** on the Contact screen; the download button appears once it
  is set. Until then the page shows a visibly marked note instead of a dead link.
- Worth confirming with him: the CV dates the AIUB BA at **2021** while the Magna Cum Laude
  honor is dated **2023**. Both are on the page as supplied. If that is a
  convocation-versus-completion difference it is fine as-is; otherwise correct one of them.
- The two sample CV PDFs in the repository root are source material and are excluded by
  `.gitignore`, so they never reach the deploy.

---

## Licence

Copyright and content belong to Iftekhar Mahmud. The site code is provided for his use.
