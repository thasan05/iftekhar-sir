import "server-only";

/**
 * One tiny query surface over Postgres.
 *
 * Production (and any real deployment) sets `DATABASE_URL` and talks to a
 * Postgres server — Neon on Vercel. With no `DATABASE_URL` the app falls back to
 * PGlite, a real Postgres compiled to WebAssembly that runs in-process and
 * stores its data under `.data/pglite`, so `npm run dev` works on a fresh clone
 * with no service to provision.
 *
 * Both backends run identical SQL. Everything above this file uses `query()` and
 * does not know or care which one is live.
 */

export interface QueryResult<T> {
  rows: T[];
}

interface Backend {
  query<T>(text: string, values?: unknown[]): Promise<QueryResult<T>>;
  /** Multi-statement script, used only for the schema. */
  exec(sql: string): Promise<void>;
  label: string;
}

declare global {
  // Survives hot reloads in development instead of leaking a pool per edit.
  var __imBackend: Promise<Backend> | undefined;
}

async function createPostgresBackend(connectionString: string): Promise<Backend> {
  const { Pool } = await import("pg");
  const pool = new Pool({
    connectionString,
    max: 3,
    idleTimeoutMillis: 10_000,
    connectionTimeoutMillis: 10_000,
    // Managed Postgres (Neon, Supabase, RDS) terminates TLS with its own chain.
    ssl: /\bsslmode=disable\b/.test(connectionString)
      ? undefined
      : { rejectUnauthorized: false },
  });

  return {
    label: "postgres",
    async query<T>(text: string, values?: unknown[]) {
      const result = await pool.query(text, values as never[]);
      return { rows: result.rows as T[] };
    },
    async exec(sql: string) {
      await pool.query(sql);
    },
  };
}

async function createPgliteBackend(): Promise<Backend> {
  const { PGlite } = await import("@electric-sql/pglite");
  const { mkdir } = await import("node:fs/promises");
  const { join } = await import("node:path");

  // PGlite creates its own directory but not the parent, so make the whole path.
  const dataDir = join(process.cwd(), ".data", "pglite");
  await mkdir(dataDir, { recursive: true });

  const db = await PGlite.create({ dataDir });

  return {
    label: "pglite",
    async query<T>(text: string, values?: unknown[]) {
      const result = await db.query<T>(text, values as unknown[]);
      return { rows: result.rows };
    },
    async exec(sql: string) {
      await db.exec(sql);
    },
  };
}

/**
 * Apply the schema once per process. Every statement is `if not exists`, so this
 * is safe to run on every cold start and there is no migration step to forget on
 * deploy: set `DATABASE_URL` and the tables appear.
 */
async function migrate(db: Backend): Promise<Backend> {
  try {
    await db.exec(SCHEMA_SQL);
  } catch (error) {
    // Two cold starts can race on the same DDL. One retry settles it; if it
    // still fails, let the caller fall back to the seed document.
    try {
      await db.exec(SCHEMA_SQL);
    } catch {
      console.error("[db] schema setup failed", error);
    }
  }
  return db;
}

function backend(): Promise<Backend> {
  if (!globalThis.__imBackend) {
    const url = process.env.DATABASE_URL?.trim();
    const connecting = (
      url ? createPostgresBackend(url) : createPgliteBackend()
    ).then(migrate);

    // Never cache a failure. A rejected promise left in place would keep failing
    // long after the cause was fixed, so drop it and let the next call retry.
    connecting.catch(() => {
      globalThis.__imBackend = undefined;
    });

    globalThis.__imBackend = connecting;
  }
  return globalThis.__imBackend;
}

/** Run a parameterised query. Never interpolate values into `text`. */
export async function query<T = Record<string, unknown>>(
  text: string,
  values?: unknown[],
): Promise<T[]> {
  const db = await backend();
  const { rows } = await db.query<T>(text, values);
  return rows;
}

/** Run a query expecting at most one row. */
export async function queryOne<T = Record<string, unknown>>(
  text: string,
  values?: unknown[],
): Promise<T | null> {
  const rows = await query<T>(text, values);
  return rows[0] ?? null;
}

/** Which backend is live — surfaced in the admin panel so it is never a mystery. */
export async function backendLabel(): Promise<string> {
  return (await backend()).label;
}

export const usingManagedPostgres = () => Boolean(process.env.DATABASE_URL?.trim());

/**
 * Schema. Applied by `npm run db:setup`, and idempotent so re-running is safe.
 *
 * The whole site lives in one JSONB document. It is edited as a unit, always
 * read as a unit, and every save writes the previous version to `revisions`,
 * which is what makes instant publishing safe: any save can be rolled back.
 */
export const SCHEMA_SQL = `
create table if not exists content (
  id          integer primary key default 1,
  data        jsonb   not null,
  updated_at  timestamptz not null default now(),
  constraint content_singleton check (id = 1)
);

create table if not exists revisions (
  id          bigserial primary key,
  data        jsonb   not null,
  note        text    not null default '',
  created_at  timestamptz not null default now()
);

create index if not exists revisions_created_at_idx on revisions (created_at desc);

create table if not exists media (
  id           text primary key,
  filename     text not null,
  mime         text not null,
  size_bytes   integer not null,
  bytes        bytea not null,
  created_at   timestamptz not null default now()
);

create table if not exists login_attempts (
  ip            text primary key,
  failures      integer not null default 0,
  locked_until  timestamptz,
  updated_at    timestamptz not null default now()
);
`;
