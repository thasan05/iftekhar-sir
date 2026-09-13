"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  adminPasswordConfigured,
  clearFailures,
  endSession,
  lockState,
  recordFailure,
  remainingAttempts,
  requireSession,
  startSession,
  verifyPassword,
} from "@/lib/auth";
import {
  listRevisions,
  loadContent,
  replaceContent,
  rollbackTo,
  saveSlice,
  seedIfEmpty,
  type SaveResult,
} from "@/lib/content";
import { deleteMedia, storeUpload, type UploadKind } from "@/lib/media";
import { isSliceKey } from "@/lib/schema";

/**
 * Every action here re-checks the session. Middleware guards navigation, but
 * actions are independently addressable POST endpoints and must not assume the
 * route they belong to was ever rendered.
 */

const denied = (message: string): SaveResult => ({
  ok: false,
  fieldErrors: {},
  message,
});

async function clientIp(): Promise<string> {
  const store = await headers();
  const forwarded = store.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  return store.get("x-real-ip")?.trim() || "unknown";
}

// ---------------------------------------------------------------------------
// Content
// ---------------------------------------------------------------------------

export async function saveSliceAction(slice: string, json: string): Promise<SaveResult> {
  await requireSession();

  if (!isSliceKey(slice)) return denied("Unknown section.");

  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    return denied("The editor sent malformed data. Reload the page and try again.");
  }

  const result = await saveSlice(slice, parsed);
  if (result.ok) revalidatePath("/admin", "layout");
  return result;
}

export async function seedAction(): Promise<SaveResult> {
  await requireSession();
  const outcome = await seedIfEmpty();
  revalidatePath("/", "layout");
  revalidatePath("/admin", "layout");
  return {
    ok: true,
    fieldErrors: {},
    message:
      outcome === "seeded"
        ? "Database initialised with the starting content."
        : "The database already holds a document — nothing changed.",
  };
}

export async function rollbackAction(revisionId: string): Promise<SaveResult> {
  await requireSession();
  const result = await rollbackTo(revisionId);
  if (result.ok) revalidatePath("/admin", "layout");
  return result;
}

export async function importAction(json: string): Promise<SaveResult> {
  await requireSession();

  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    return denied("That is not valid JSON.");
  }

  const result = await replaceContent(parsed, "before importing a backup");
  if (result.ok) revalidatePath("/admin", "layout");
  return result;
}

/** The whole document as formatted JSON, for download as a backup. */
export async function exportAction(): Promise<string> {
  await requireSession();
  const { content } = await loadContent();
  return JSON.stringify(content, null, 2);
}

export async function revisionsAction() {
  await requireSession();
  const revisions = await listRevisions();
  return revisions.map((revision) => ({
    id: revision.id,
    note: revision.note,
    createdAt: revision.createdAt.toISOString(),
  }));
}

// ---------------------------------------------------------------------------
// Media
// ---------------------------------------------------------------------------

export async function uploadAction(
  formData: FormData,
): Promise<{ ok: boolean; url?: string; message: string }> {
  await requireSession();

  const file = formData.get("file");
  const kind = formData.get("kind");

  if (!(file instanceof File)) return { ok: false, message: "Choose a file first." };
  if (kind !== "image" && kind !== "document") {
    return { ok: false, message: "Unknown upload type." };
  }

  const result = await storeUpload(file, kind as UploadKind);
  if (result.ok) revalidatePath("/admin/media");
  return result;
}

export async function deleteMediaAction(id: string): Promise<void> {
  await requireSession();
  await deleteMedia(id);
  revalidatePath("/admin/media");
}

// ---------------------------------------------------------------------------
// Session
// ---------------------------------------------------------------------------

export interface LoginState {
  error: string;
}

export async function loginAction(
  _previous: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const stored = process.env.ADMIN_PASSWORD_HASH?.trim() || process.env.ADMIN_PASSWORD?.trim() || "";

  if (!adminPasswordConfigured()) {
    return {
      error:
        "No admin password is set. Add ADMIN_PASSWORD in Vercel Environment Variables and redeploy.",
    };
  }

  const password = String(formData.get("password") ?? "");
  if (!password) return { error: "Enter your password." };

  const ip = await clientIp();
  const lock = await lockState(ip);
  if (lock.locked) {
    return {
      error: `Too many failed attempts. Try again in ${Math.ceil(
        lock.retryAfterSeconds / 60,
      )} minute(s).`,
    };
  }

  if (!(await verifyPassword(password, stored))) {
    const next = await recordFailure(ip);
    return {
      error: next.locked
        ? `Too many failed attempts. Locked for ${Math.ceil(
            next.retryAfterSeconds / 60,
          )} minutes.`
        : `That password is not right. You have a limited number of attempts (${remainingAttempts} before a lockout).`,
    };
  }

  await clearFailures(ip);
  await startSession();

  const target = String(formData.get("next") ?? "");
  redirect(target.startsWith("/admin") ? target : "/admin");
}

export async function logoutAction(): Promise<void> {
  await endSession();
  redirect("/admin/login");
}
