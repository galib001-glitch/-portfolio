import { NextRequest, NextResponse } from "next/server";
import { kvAvailable, kvGet } from "@/lib/kv";

// The "Download CV" link points here instead of directly at /resume.pdf, so
// that uploading a new resume through the admin panel (which stores the file
// in Vercel Blob in production, since /public is read-only at runtime) can
// take effect without a redeploy — this just redirects to whichever resume
// is currently on file.
export async function GET(req: NextRequest) {
  if (kvAvailable()) {
    const url = await kvGet("files:resume");
    if (url) return NextResponse.redirect(url);
  }
  return NextResponse.redirect(new URL("/resume.pdf", req.url));
}
