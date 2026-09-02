/**
 * Session tokens, using only Web Crypto so the same code verifies a session in
 * middleware (edge runtime), in server components and in server actions. No
 * crypto dependency, no user table — this site has exactly one editor.
 *
 * Deliberately kept free of database imports so middleware stays cheap: it
 * checks the signature and the expiry, nothing more.
 */

export const SESSION_COOKIE = "im_session";

/** Seven days. Long enough to be convenient, short enough to expire. */
export const SESSION_TTL_SECONDS = 7 * 24 * 60 * 60;

interface SessionPayload {
  sub: string;
  exp: number;
}

const encoder = new TextEncoder();

function toBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(value: string): Uint8Array {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(padded + "=".repeat((4 - (padded.length % 4)) % 4));
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

/** Length-independent, value-independent comparison. */
function constantTimeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a[i] ^ b[i];
  return diff === 0;
}

/**
 * In development with no SESSION_SECRET set, sign with a per-boot random key.
 * Sessions then simply do not survive a restart, which is a mild annoyance
 * rather than a shared hardcoded secret.
 */
let ephemeralSecret: string | null = null;

function sessionSecret(): string {
  const configured = process.env.SESSION_SECRET?.trim();
  if (configured && configured.length >= 16) return configured;

  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "SESSION_SECRET is missing or too short. Set it to at least 16 characters.",
    );
  }
  if (!ephemeralSecret) {
    ephemeralSecret = toBase64Url(crypto.getRandomValues(new Uint8Array(32)));
    console.warn(
      "[auth] SESSION_SECRET is not set — using a random development secret. Sessions end on restart.",
    );
  }
  return ephemeralSecret;
}

async function hmacKey(): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(sessionSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

export async function createSessionToken(subject = "admin"): Promise<string> {
  const payload: SessionPayload = {
    sub: subject,
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
  };
  const body = toBase64Url(encoder.encode(JSON.stringify(payload)));
  const signature = await crypto.subtle.sign("HMAC", await hmacKey(), encoder.encode(body));
  return `${body}.${toBase64Url(new Uint8Array(signature))}`;
}

export async function verifySessionToken(
  token: string | undefined,
): Promise<SessionPayload | null> {
  if (!token) return null;

  const [body, signature] = token.split(".");
  if (!body || !signature) return null;

  let expected: Uint8Array;
  try {
    expected = new Uint8Array(
      await crypto.subtle.sign("HMAC", await hmacKey(), encoder.encode(body)),
    );
  } catch {
    return null;
  }

  let provided: Uint8Array;
  try {
    provided = fromBase64Url(signature);
  } catch {
    return null;
  }

  if (!constantTimeEqual(expected, provided)) return null;

  try {
    const payload = JSON.parse(new TextDecoder().decode(fromBase64Url(body))) as SessionPayload;
    if (typeof payload.exp !== "number" || payload.exp * 1000 < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}
