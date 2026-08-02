import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthorized, setAdminPassword } from "@/lib/content";

interface PasswordChangePayload {
  currentPassword?: string;
  newPassword?: string;
}

export async function POST(req: NextRequest) {
  const body: PasswordChangePayload = await req.json().catch(() => ({}));
  const { currentPassword, newPassword } = body;

  if (!(await isAdminAuthorized(currentPassword))) {
    return NextResponse.json({ ok: false, error: "Current password is incorrect." }, { status: 401 });
  }
  if (!newPassword || newPassword.length < 6) {
    return NextResponse.json({ ok: false, error: "New password must be at least 6 characters." }, { status: 400 });
  }

  const result = await setAdminPassword(newPassword);
  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error ?? "Failed to save new password." }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
