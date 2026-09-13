import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  SESSION_COOKIE,
  SESSION_TTL_SECONDS,
  createSessionToken,
  verifySessionToken,
} from "@/lib/session";

const PBKDF2_ITERATIONS = 600_000;
const KEY_LENGTH_BITS = 256;
const SALT_BYTES = 16;
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

function constantTimeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a[i] ^ b[i];
  return diff === 0;
}

async function derive(password: string, salt: Uint8Array, iterations: number): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt: salt as BufferSource, iterations, hash: "SHA-256" },
    key,
    KEY_LENGTH_BITS,
  );
  return new Uint8Array(bits);
}

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(SALT_BYTES));
  const hash = await derive(password, salt, PBKDF2_ITERATIONS);
  return `pbkdf2.sha256.${PBKDF2_ITERATIONS}.${toBase64Url(salt)}.${toBase64Url(hash)}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const plainPassword = process.env.ADMIN_PASSWORD;
  if (plainPassword) return password === plainPassword;

  const parts = stored.split(".");
  if (parts.length !== 5 || parts[0] !== "pbkdf2" || parts[1] !== "sha256") return false;

  const iterations = Number.parseInt(parts[2], 10);
  if (!Number.isFinite(iterations) || iterations < 1000) return false;

  try {
    const salt = fromBase64Url(parts[3]);
    const expected = fromBase64Url(parts[4]);
    const actual = await derive(password, salt, iterations);
    return constantTimeEqual(expected, actual);
  } catch {
    return false;
  }
}

export function adminPasswordConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD_HASH?.trim() || process.env.ADMIN_PASSWORD?.trim());
}

const MAX_FAILURES = 6;
const LOCKOUT_MINUTES = 15;

interface FailureState {
  failures: number;
  lockedUntil: number;
}

// Login throttling deliberately stays in memory. The previous implementation
// used PGlite as a local fallback, but Vercel's serverless filesystem is not a
// persistent database and cannot create the application's .data directory.
// A production deployment with DATABASE_URL can later move this state to the
// database without changing the login flow.
const failureStates = new Map<string, FailureState>();

function getFailureState(ip: string): FailureState {
  return failureStates.get(ip) ?? { failures: 0, lockedUntil: 0 };
}

export interface LockState {
  locked: boolean;
  retryAfterSeconds: number;
}

export async function lockState(ip: string): Promise<LockState> {
  const state = getFailureState(ip);
  const remaining = state.lockedUntil - Date.now();
  if (remaining <= 0 && state.lockedUntil !== 0) {
    failureStates.delete(ip);
    return { locked: false, retryAfterSeconds: 0 };
  }
  return {
    locked: remaining > 0,
    retryAfterSeconds: remaining > 0 ? Math.ceil(remaining / 1000) : 0,
  };
}

export async function recordFailure(ip: string): Promise<LockState> {
  const current = getFailureState(ip);
  const failures = current.failures + 1;
  const lockedUntil =
    failures >= MAX_FAILURES ? Date.now() + LOCKOUT_MINUTES * 60 * 1000 : 0;

  failureStates.set(ip, { failures, lockedUntil });

  if (lockedUntil > Date.now()) {
    return {
      locked: true,
      retryAfterSeconds: LOCKOUT_MINUTES * 60,
    };
  }

  return { locked: false, retryAfterSeconds: 0 };
}

export async function clearFailures(ip: string): Promise<void> {
  failureStates.delete(ip);
}

export const remainingAttempts = MAX_FAILURES;

export async function startSession(): Promise<void> {
  const token = await createSessionToken();
  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
}

export async function endSession(): Promise<void> {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
}

export async function getSession(): Promise<{ sub: string } | null> {
  const jar = await cookies();
  return verifySessionToken(jar.get(SESSION_COOKIE)?.value);
}

export async function requireSession(): Promise<{ sub: string }> {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  return session;
}
