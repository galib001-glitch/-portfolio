import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthorized, readMessages } from "@/lib/content";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const password = body?.password as string | undefined;
  if (!(await isAdminAuthorized(password))) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  const data = await readMessages();
  return NextResponse.json({ ok: true, data });
}
