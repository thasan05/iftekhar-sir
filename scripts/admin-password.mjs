#!/usr/bin/env node
/**
 * Set the admin password.
 *
 *   npm run admin:password                 prompts for a password
 *   npm run admin:password -- "some pass"  takes it from the argument
 *
 * Writes ADMIN_PASSWORD_HASH into .env.local, and generates SESSION_SECRET if it
 * is not there yet. The plain password is never stored anywhere.
 *
 * Uses only Node built-ins and mirrors the PBKDF2 parameters in lib/auth.ts —
 * keep the two in step if either changes.
 */

import { readFile, writeFile } from "node:fs/promises";
import { createInterface } from "node:readline/promises";
import { existsSync } from "node:fs";

const ENV_PATH = ".env.local";
const ITERATIONS = 600_000;
const KEY_LENGTH_BITS = 256;
const MINIMUM_LENGTH = 12;

// base64url + dot separators: "$" and "=" do not survive .env expansion.
const toBase64Url = (bytes) =>
  Buffer.from(bytes).toString("base64url");

async function hash(password) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations: ITERATIONS, hash: "SHA-256" },
    key,
    KEY_LENGTH_BITS,
  );
  return `pbkdf2.sha256.${ITERATIONS}.${toBase64Url(salt)}.${toBase64Url(new Uint8Array(bits))}`;
}

function parseEnv(text) {
  const entries = new Map();
  for (const line of text.split(/\r?\n/)) {
    const match = /^\s*([A-Z0-9_]+)\s*=(.*)$/.exec(line);
    if (match) entries.set(match[1], match[2]);
  }
  return entries;
}

function serialiseEnv(entries) {
  return `${[...entries].map(([key, value]) => `${key}=${value}`).join("\n")}\n`;
}

async function readPassword() {
  const fromArgv = process.argv.slice(2).join(" ").trim();
  if (fromArgv) return fromArgv;

  if (!process.stdin.isTTY) {
    const generated = toBase64Url(crypto.getRandomValues(new Uint8Array(18))).slice(0, 20);
    console.log(`\nNo password given and no terminal to prompt from.`);
    console.log(`Generated one for you — save it now, it is not recoverable:\n`);
    console.log(`    ${generated}\n`);
    return generated;
  }

  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const answer = await rl.question("New admin password: ");
  rl.close();
  return answer.trim();
}

const password = await readPassword();

if (password.length < MINIMUM_LENGTH) {
  console.error(
    `\nThat password is ${password.length} characters. Use at least ${MINIMUM_LENGTH}.\n`,
  );
  process.exit(1);
}

const existing = existsSync(ENV_PATH) ? await readFile(ENV_PATH, "utf8") : "";
const entries = parseEnv(existing);

entries.set("ADMIN_PASSWORD_HASH", await hash(password));

let generatedSecret = false;
if (!entries.get("SESSION_SECRET")) {
  entries.set("SESSION_SECRET", toBase64Url(crypto.getRandomValues(new Uint8Array(32))));
  generatedSecret = true;
}

await writeFile(ENV_PATH, serialiseEnv(entries), "utf8");

console.log(`\nPassword set. Wrote ADMIN_PASSWORD_HASH to ${ENV_PATH}.`);
if (generatedSecret) console.log("Also generated SESSION_SECRET.");
console.log("\nRestart the dev server, then sign in at /admin/login.");
console.log(
  "For production, copy ADMIN_PASSWORD_HASH and SESSION_SECRET into your host's environment variables.\n",
);
