import { NextRequest, NextResponse } from "next/server";
import { readContent, writeContent, isAdminAuthorized, type ContentKey } from "@/lib/content";

const VALID_KEYS: ContentKey[] = [
  "profile",
  "links",
  "education",
  "experience",
  "achievements",
  "certifications",
  "research",
  "skills",
  "manual-projects",
  "collaborations",
  "linkedin",
];

export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get("key") as ContentKey | null;
  if (!key || !VALID_KEYS.includes(key)) {
    return NextResponse.json({ ok: false, error: "Invalid or missing key" }, { status: 400 });
  }
  const data = await readContent(key);
  return NextResponse.json({ ok: true, data });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });

  const { key, data, password } = body as { key: ContentKey; data: unknown; password?: string };

  if (!isAdminAuthorized(password)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  if (!key || !VALID_KEYS.includes(key)) {
    return NextResponse.json({ ok: false, error: "Invalid content key" }, { status: 400 });
  }

  const result = await writeContent(key, data);
  if (!result.ok) {
    return NextResponse.json(
      {
        ok: false,
        error:
          result.error ??
          "Write failed. On serverless platforms (Vercel) the filesystem is read-only at runtime — connect a database for persistent admin edits in production.",
      },
      { status: 500 }
    );
  }
  return NextResponse.json({ ok: true });
}
