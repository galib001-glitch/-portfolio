import { NextRequest, NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";
import { isAdminAuthorized } from "@/lib/content";
import { blobAvailable, uploadToBlob } from "@/lib/blob";
import { kvSet } from "@/lib/kv";

const RESUME_PATH = path.join(process.cwd(), "public", "resume.pdf");

export async function POST(req: NextRequest) {
  const formData = await req.formData().catch(() => null);
  if (!formData) {
    return NextResponse.json({ ok: false, error: "Expected multipart/form-data" }, { status: 400 });
  }

  const password = formData.get("password");
  if (!(await isAdminAuthorized(typeof password === "string" ? password : null))) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ ok: false, error: "No file provided" }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  let extractedText = "";
  try {
    const { PDFParse } = await import("pdf-parse");
    const parser = new PDFParse({ data: buffer });
    const result = await parser.getText();
    extractedText = result.text ?? "";
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: `Failed to parse PDF: ${err instanceof Error ? err.message : "unknown error"}` },
      { status: 500 }
    );
  }

  if (blobAvailable()) {
    try {
      const url = await uploadToBlob("resume.pdf", buffer, "application/pdf");
      await kvSet("files:resume", url);
      return NextResponse.json({ ok: true, extractedText, savedTo: url });
    } catch (err) {
      return NextResponse.json(
        { ok: false, error: err instanceof Error ? err.message : "Failed to upload resume.", extractedText },
        { status: 500 }
      );
    }
  }

  try {
    await fs.writeFile(RESUME_PATH, buffer);
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Text extracted, but could not save resume.pdf to /public — the filesystem may be read-only in this deployment.",
        extractedText,
      },
      { status: 207 }
    );
  }

  return NextResponse.json({ ok: true, extractedText, savedTo: "/resume.pdf" });
}
