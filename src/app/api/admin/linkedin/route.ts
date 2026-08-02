import { NextRequest, NextResponse } from "next/server";
import { readContent, writeContent, isAdminAuthorized } from "@/lib/content";

// Accepts a manually exported/synchronized LinkedIn data JSON payload.
// LinkedIn does not allow live scraping, so this endpoint expects data the
// user has exported themselves (Settings & Privacy -> Get a copy of your data)
// and reshaped into the following optional shape, or pasted as free-form JSON
// which is stored as-is under `raw` for the admin UI to review before merging.
interface LinkedInImportPayload {
  password?: string;
  raw: unknown;
  merge?: boolean;
}

export async function POST(req: NextRequest) {
  const body: LinkedInImportPayload = await req.json().catch(() => null as never);
  if (!body) return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });

  if (!isAdminAuthorized(body.password)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const saveResult = await writeContent("linkedin", body.raw);
  if (!saveResult.ok) {
    return NextResponse.json({ ok: false, error: saveResult.error }, { status: 500 });
  }

  if (!body.merge) {
    return NextResponse.json({ ok: true, merged: false });
  }

  // Best-effort merge into the site's structured content. LinkedIn exports vary
  // in shape, so this only maps fields that are present and recognizable.
  const raw = body.raw as Record<string, unknown>;
  const results: Record<string, boolean> = {};

  if (Array.isArray(raw.experience)) {
    const existing = (await readContent("experience")) ?? [];
    results.experience = (await writeContent("experience", [...(raw.experience as unknown[]), ...(existing as unknown[])])).ok;
  }
  if (Array.isArray(raw.education)) {
    results.education = (await writeContent("education", raw.education)).ok;
  }
  if (Array.isArray(raw.certifications)) {
    results.certifications = (await writeContent("certifications", raw.certifications)).ok;
  }
  if (Array.isArray(raw.skills)) {
    results.skills = (await writeContent("skills", raw.skills)).ok;
  }

  return NextResponse.json({ ok: true, merged: true, results });
}

export async function GET() {
  const data = await readContent("linkedin");
  return NextResponse.json({ ok: true, data });
}
