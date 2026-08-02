import fs from "node:fs/promises";
import path from "node:path";

// Local, file-system backed content store used by the admin panel.
// NOTE: On serverless platforms (e.g. Vercel) the filesystem is read-only at
// runtime and any writes here will not persist across deployments/instances.
// For production persistence, swap these functions for calls to a database
// or headless CMS while keeping the same function signatures.

const DATA_DIR = path.join(process.cwd(), "src", "data");

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

export async function readContent<T = unknown>(key: ContentKey): Promise<T | null> {
  try {
    const file = path.join(DATA_DIR, `${key}.json`);
    const raw = await fs.readFile(file, "utf-8");
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export async function writeContent(key: ContentKey, data: unknown): Promise<{ ok: boolean; error?: string }> {
  try {
    const file = path.join(DATA_DIR, `${key}.json`);
    await fs.writeFile(file, JSON.stringify(data, null, 2), "utf-8");
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "unknown error" };
  }
}

export function isAdminAuthorized(providedPassword: string | null | undefined): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  return providedPassword === expected;
}
