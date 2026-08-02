import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthorized, readMessages } from "@/lib/content";

export async function GET(req: NextRequest) {
  const password = req.nextUrl.searchParams.get("password");
  if (!(await isAdminAuthorized(password))) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  const data = await readMessages();
  return NextResponse.json({ ok: true, data });
}
