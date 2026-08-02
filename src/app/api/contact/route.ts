import { NextRequest, NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";

const MESSAGES_FILE = path.join(process.cwd(), "src", "data", "messages.json");

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

  try {
    const raw = await fs.readFile(MESSAGES_FILE, "utf-8").catch(() => "[]");
    const list = JSON.parse(raw);
    list.unshift(entry);
    await fs.writeFile(MESSAGES_FILE, JSON.stringify(list.slice(0, 200), null, 2), "utf-8");
  } catch {
    // Filesystem may be read-only in some deployment environments (e.g. Vercel serverless).
    // In that case, wire this route up to an email provider (Resend, SendGrid, etc.) instead.
  }

  // TODO: integrate a transactional email provider here, e.g.:
  // if (process.env.RESEND_API_KEY) { await sendEmailViaResend(entry); }

  return NextResponse.json({ ok: true });
}
