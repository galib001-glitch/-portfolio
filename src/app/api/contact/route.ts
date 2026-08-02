import { NextRequest, NextResponse } from "next/server";
import { addMessage } from "@/lib/content";

interface ContactPayload {
  name?: string;
  email?: string;
  message?: string;
  subject?: string;
}

export async function POST(req: NextRequest) {
  const body: ContactPayload = await req.json().catch(() => ({}));
  const { name, email, message, subject } = body;

  if (!name || !email || !message) {
    return NextResponse.json({ ok: false, error: "Missing fields" }, { status: 400 });
  }

  const entry = {
    id: crypto.randomUUID(),
    name,
    email,
    message: subject ? `[${subject}] ${message}` : message,
    receivedAt: new Date().toISOString(),
  };

  await addMessage(entry);

  // TODO: integrate a transactional email provider here, e.g.:
  // if (process.env.RESEND_API_KEY) { await sendEmailViaResend(entry); }

  return NextResponse.json({ ok: true });
}
