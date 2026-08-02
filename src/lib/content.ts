import fs from "node:fs/promises";
import path from "node:path";
import { kvAvailable, kvGet, kvSet } from "./kv";

// Content store used by the admin panel.
//
// Locally (no KV env vars configured) this reads/writes the JSON files in
// src/data directly, which is convenient for `npm run dev`.
//
// In production, Vercel's filesystem is read-only at runtime, so plain file
// writes silently fail (or throw EROFS). When KV_REST_API_URL/TOKEN (Vercel
// KV) or UPSTASH_REDIS_REST_URL/TOKEN (Upstash Redis) are set, this store
// reads/writes through that instead, which actually persists. The bundled
// JSON file is still used as the initial value the very first time a key is
// read before any admin edit has been saved to KV.

const DATA_DIR = path.join(process.cwd(), "src", "data");
const ADMIN_PW_FILE = path.join(DATA_DIR, ".admin-password");
const MESSAGES_FILE = path.join(DATA_DIR, "messages.json");

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  receivedAt: string;
}

export type ContentKey =
  | "profile"
  | "links"
  | "education"
  | "experience"
  | "achievements"
  | "certifications"
  | "research"
  | "skills"
  | "manual-projects"
  | "collaborations"
  | "linkedin";

async function readFileContent<T>(key: ContentKey): Promise<T | null> {
  try {
    const file = path.join(DATA_DIR, `${key}.json`);
    const raw = await fs.readFile(file, "utf-8");
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export async function readContent<T = unknown>(key: ContentKey): Promise<T | null> {
  if (kvAvailable()) {
    const stored = await kvGet(`content:${key}`);
    if (stored) {
      try {
        return JSON.parse(stored) as T;
      } catch {
        // fall through to file seed if the stored value is somehow corrupt
      }
    }
    // No admin edit saved yet — seed from the bundled JSON that shipped with this deploy.
    return readFileContent<T>(key);
  }
  return readFileContent<T>(key);
}

export async function writeContent(key: ContentKey, data: unknown): Promise<{ ok: boolean; error?: string }> {
  if (kvAvailable()) {
    const ok = await kvSet(`content:${key}`, JSON.stringify(data));
    return ok ? { ok: true } : { ok: false, error: "Failed to write to the connected KV store." };
  }
  try {
    const file = path.join(DATA_DIR, `${key}.json`);
    await fs.writeFile(file, JSON.stringify(data, null, 2), "utf-8");
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      error:
        err instanceof Error
          ? `${err.message} — connect a KV/Redis store (see Settings) for edits to persist in production.`
          : "unknown error",
    };
  }
}

export async function getAdminPassword(): Promise<string | null> {
  if (kvAvailable()) {
    const stored = await kvGet("admin:password");
    if (stored) return stored;
    return process.env.ADMIN_PASSWORD ?? null;
  }
  try {
    const stored = (await fs.readFile(ADMIN_PW_FILE, "utf-8")).trim();
    if (stored) return stored;
  } catch {
    // no local override saved yet
  }
  return process.env.ADMIN_PASSWORD ?? null;
}

export async function setAdminPassword(newPassword: string): Promise<{ ok: boolean; error?: string }> {
  if (kvAvailable()) {
    const ok = await kvSet("admin:password", newPassword);
    return ok ? { ok: true } : { ok: false, error: "Failed to write to the connected KV store." };
  }
  try {
    await fs.writeFile(ADMIN_PW_FILE, newPassword, "utf-8");
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Failed to save password locally." };
  }
}

export async function readMessages(): Promise<ContactMessage[]> {
  if (kvAvailable()) {
    const stored = await kvGet("messages");
    if (stored) {
      try {
        return JSON.parse(stored) as ContactMessage[];
      } catch {
        return [];
      }
    }
    return [];
  }
  try {
    const raw = await fs.readFile(MESSAGES_FILE, "utf-8");
    return JSON.parse(raw) as ContactMessage[];
  } catch {
    return [];
  }
}

export async function addMessage(entry: ContactMessage): Promise<{ ok: boolean; error?: string }> {
  const existing = await readMessages();
  const list = [entry, ...existing].slice(0, 200);
  if (kvAvailable()) {
    const ok = await kvSet("messages", JSON.stringify(list));
    return ok ? { ok: true } : { ok: false, error: "Failed to write to the connected KV store." };
  }
  try {
    await fs.writeFile(MESSAGES_FILE, JSON.stringify(list, null, 2), "utf-8");
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Failed to save message locally." };
  }
}

export async function isAdminAuthorized(providedPassword: string | null | undefined): Promise<boolean> {
  if (!providedPassword) return false;
  const expected = await getAdminPassword();
  if (!expected) return false;
  return providedPassword === expected;
}
