import { NextRequest, NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";
import { isAdminAuthorized } from "@/lib/content";

const MESSAGES_FILE = path.join(process.cwd(), "src", "data", "messages.json");

export async function GET(req: NextRequest) {
  const password = req.nextUrl.searchParams.get("password");
  if (!isAdminAuthorized(password)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  const raw = await fs.readFile(MESSAGES_FILE, "utf-8").catch(() => "[]");
  return NextResponse.json({ ok: true, data: JSON.parse(raw) });
}
