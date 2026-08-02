"use client";

import { useState } from "react";
import { FiUpload } from "react-icons/fi";

export default function ResumeUploader({ password }: { password: string }) {
  const [status, setStatus] = useState<string | null>(null);
  const [extracted, setExtracted] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setStatus("Uploading & parsing…");
    setExtracted(null);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("password", password);
      const res = await fetch("/api/admin/resume", { method: "POST", body: form });
      const json = await res.json();
      if (json.ok) {
        setStatus("Resume uploaded and saved as /resume.pdf");
        setExtracted(json.extractedText);
      } else {
        setStatus(json.error ?? "Upload failed.");
        if (json.extractedText) setExtracted(json.extractedText);
      }
    } catch {
      setStatus("Network error during upload.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="glass rounded-2xl border border-white/10 p-5">
      <h3 className="font-display mb-3 text-base font-semibold text-white">Resume / CV Upload</h3>
      <label className="flex cursor-pointer items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white/70 hover:border-neon-cyan/40">
        <FiUpload />
        {busy ? "Uploading…" : "Choose resume.pdf"}
        <input type="file" accept="application/pdf" className="hidden" onChange={onFileChange} disabled={busy} />
      </label>
      {status && <p className="mt-3 text-xs text-white/50">{status}</p>}
      {extracted && (
        <details className="mt-3">
          <summary className="cursor-pointer text-xs text-neon-cyan">View extracted text</summary>
          <pre className="font-mono-term mt-2 max-h-72 overflow-y-auto whitespace-pre-wrap rounded-lg border border-white/10 bg-black/30 p-3 text-[11px] text-white/50">
            {extracted}
          </pre>
        </details>
      )}
      <p className="mt-3 text-xs text-white/30">
        Extraction gives you raw resume text to copy into the structured fields above — it does not
        auto-populate sections, keeping the data model predictable.
      </p>
    </div>
  );
}
