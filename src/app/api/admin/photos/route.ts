import { NextRequest, NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";
import { isAdminAuthorized, readContent, writeContent } from "@/lib/content";
import { blobAvailable, uploadToBlob, deleteFromBlob } from "@/lib/blob";
import type { GalleryImage } from "@/components/gallery/MasonryGallery";

const GALLERY_DIR = path.join(process.cwd(), "public", "gallery");

export async function GET() {
  const images = (await readContent<GalleryImage[]>("gallery")) ?? [];
  return NextResponse.json({ ok: true, data: images });
}

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

export async function DELETE(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });

  const { id, password } = body as { id?: string; password?: string };
  if (!(await isAdminAuthorized(password))) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  if (!id) return NextResponse.json({ ok: false, error: "Missing id" }, { status: 400 });

  const existing = (await readContent<GalleryImage[]>("gallery")) ?? [];
  const target = existing.find((img) => img.id === id);
  if (!target) {
    return NextResponse.json({ ok: false, error: "Photo not found" }, { status: 404 });
  }

  const updated = existing.filter((img) => img.id !== id);
  const result = await writeContent("gallery", updated);
  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error ?? "Failed to update gallery." }, { status: 500 });
  }

  // Best-effort cleanup of the underlying file — don't fail the request over it.
  try {
    if (target.src.includes("blob.vercel-storage.com")) {
      await deleteFromBlob(target.src);
    } else if (target.src.startsWith("/gallery/")) {
      await fs.unlink(path.join(process.cwd(), "public", target.src));
    }
  } catch {
    // original upload may already be gone, or this is a bundled placeholder — ignore
  }

  return NextResponse.json({ ok: true });
}
