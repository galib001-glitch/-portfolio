import { NextRequest, NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";
import { isAdminAuthorized } from "@/lib/content";

const GALLERY_DIR = path.join(process.cwd(), "public", "gallery");
const GALLERY_JSON = path.join(process.cwd(), "src", "data", "gallery.json");

export async function POST(req: NextRequest) {
  const formData = await req.formData().catch(() => null);
  if (!formData) return NextResponse.json({ ok: false, error: "Expected multipart/form-data" }, { status: 400 });

  const password = formData.get("password");
  if (!isAdminAuthorized(typeof password === "string" ? password : null)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const file = formData.get("file");
  const alt = (formData.get("alt") as string) ?? "Untitled";
  if (!(file instanceof File)) {
    return NextResponse.json({ ok: false, error: "No file provided" }, { status: 400 });
  }

  const ext = file.name.split(".").pop() ?? "jpg";
  const id = `upload-${Date.now()}`;
  const filename = `${id}.${ext}`;

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.mkdir(GALLERY_DIR, { recursive: true });
    await fs.writeFile(path.join(GALLERY_DIR, filename), buffer);

    const raw = await fs.readFile(GALLERY_JSON, "utf-8").catch(() => "[]");
    const list = JSON.parse(raw);
    list.push({ id, src: `/gallery/${filename}`, alt, height: 800 });
    await fs.writeFile(GALLERY_JSON, JSON.stringify(list, null, 2), "utf-8");
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Failed to save photo" },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true, src: `/gallery/${filename}` });
}
