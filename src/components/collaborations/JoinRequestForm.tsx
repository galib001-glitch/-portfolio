"use client";

import { useState } from "react";
import { FiArrowRight, FiCheck } from "react-icons/fi";

export default function JoinRequestForm({ collaborationTitle }: { collaborationTitle: string }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", role: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          subject: `Join request: ${collaborationTitle}`,
          message: form.role ? `Interested as: ${form.role}\n\n${form.message}` : form.message,
        }),
      });
      setStatus(res.ok ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <p className="flex items-center gap-2 text-sm text-emerald-300">
        <FiCheck /> Request sent — I&apos;ll get back to you at {form.email}.
      </p>
    );
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        data-cursor="pointer"
        className="inline-flex items-center gap-1.5 rounded-full border border-neon-blue/30 bg-neon-blue/10 px-4 py-2 text-xs text-neon-blue hover:bg-neon-blue/20"
      >
        Request to join <FiArrowRight />
      </button>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-3 rounded-xl border border-white/10 bg-black/20 p-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <input
          required
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          placeholder="Your name"
          className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none focus:border-neon-blue/40"
        />
        <input
          required
          type="email"
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          placeholder="Your email"
          className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none focus:border-neon-blue/40"
        />
      </div>
      <input
        value={form.role}
        onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
        placeholder="Which role interests you? (optional)"
        className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none focus:border-neon-blue/40"
      />
      <textarea
        required
        value={form.message}
        onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
        placeholder="Tell me a bit about yourself and why you'd like to join…"
        rows={3}
        className="w-full resize-y rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none focus:border-neon-blue/40"
      />
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={status === "sending"}
          data-cursor="pointer"
          className="inline-flex items-center gap-1.5 rounded-full border border-neon-blue/30 bg-neon-blue/10 px-4 py-2 text-xs text-neon-blue hover:bg-neon-blue/20 disabled:opacity-50"
        >
          {status === "sending" ? "Sending…" : "Send request"} <FiArrowRight />
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-xs text-white/40 hover:text-white/70"
        >
          Cancel
        </button>
        {status === "error" && <span className="text-xs text-red-400">Something went wrong. Try again.</span>}
      </div>
    </form>
  );
}
