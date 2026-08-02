"use client";

import { useState } from "react";
import { FiImage } from "react-icons/fi";

export default function PhotoUploader({ password }: { password: string }) {
  const [alt, setAlt] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setStatus("Uploading…");
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("alt", alt || file.name);
      form.append("password", password);
      const res = await fetch("/api/admin/photos", { method: "POST", body: form });
      const json = await res.json();
      setStatus(json.ok ? `Uploaded to ${json.src}` : json.error ?? "Upload failed.");
    } catch {
      setStatus("Network error during upload.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="glass rounded-2xl border border-white/10 p-5">
      <h3 className="font-display mb-3 text-base font-semibold text-white">Gallery Photo Upload</h3>
      <input
        value={alt}
        onChange={(e) => setAlt(e.target.value)}
        placeholder="Caption / alt text"
        className="mb-3 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none focus:border-neon-blue/40"
      />
      <label className="flex cursor-pointer items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white/70 hover:border-neon-cyan/40">
        <FiImage />
        {busy ? "Uploading…" : "Choose photo"}
        <input type="file" accept="image/*" className="hidden" onChange={onFileChange} disabled={busy} />
      </label>
      {status && <p className="mt-3 text-xs text-white/50">{status}</p>}
    </div>
  );
}
