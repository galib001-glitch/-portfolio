import { NextRequest, NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";
import { isAdminAuthorized, readContent, writeContent } from "@/lib/content";
import { blobAvailable, uploadToBlob } from "@/lib/blob";
import type { GalleryImage } from "@/components/gallery/MasonryGallery";

const GALLERY_DIR = path.join(process.cwd(), "public", "gallery");

export async function POST(req: NextRequest) {
  const formData = await req.formData().catch(() => null);
  if (!formData) return NextResponse.json({ ok: false, error: "Expected multipart/form-data" }, { status: 400 });

  const password = formData.get("password");
  if (!(await isAdminAuthorized(typeof password === "string" ? password : null))) {
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
  const buffer = Buffer.from(await file.arrayBuffer());

  let src: string;
  try {
    if (blobAvailable()) {
      src = await uploadToBlob(`gallery/${filename}`, buffer, file.type || undefined);
    } else {
      await fs.mkdir(GALLERY_DIR, { recursive: true });
      await fs.writeFile(path.join(GALLERY_DIR, filename), buffer);
      src = `/gallery/${filename}`;
    }
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Failed to save photo" },
      { status: 500 }
    );
  }

  const existing = (await readContent<GalleryImage[]>("gallery")) ?? [];
  const updated = [...existing, { id, src, alt, height: 800 }];
  const result = await writeContent("gallery", updated);
  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error ?? "Failed to save gallery entry." }, { status: 500 });
  }

  return NextResponse.json({ ok: true, src });
}
