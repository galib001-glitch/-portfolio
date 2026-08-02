"use client";

import { useState } from "react";
import { FiUploadCloud } from "react-icons/fi";
import links from "@/data/links.json";

export default function LinkedinImporter({ password }: { password: string }) {
  const [text, setText] = useState('{\n  "experience": [],\n  "education": [],\n  "certifications": [],\n  "skills": []\n}');
  const [status, setStatus] = useState<string | null>(null);
  const [merge, setMerge] = useState(false);

  async function importData() {
    setStatus(null);
    let raw: unknown;
    try {
      raw = JSON.parse(text);
    } catch {
      setStatus("Invalid JSON.");
      return;
    }
    try {
      const res = await fetch("/api/admin/linkedin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, raw, merge }),
      });
      const json = await res.json();
      setStatus(json.ok ? (merge ? "Imported and merged." : "Imported (saved as raw, not merged).") : json.error);
    } catch {
      setStatus("Network error.");
    }
  }

  return (
    <div className="glass rounded-2xl border border-white/10 p-5">
      <h3 className="font-display mb-2 text-base font-semibold text-white">LinkedIn Import</h3>
      <p className="mb-3 text-xs text-white/40">
        LinkedIn blocks live scraping, so paste an exported/synchronized JSON payload here (from your{" "}
        <a href={links.linkedin} target="_blank" rel="noreferrer" className="text-neon-cyan">
          LinkedIn data export
        </a>{" "}
        — Settings &amp; Privacy → Get a copy of your data — reshaped to the fields below).
      </p>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={10}
        spellCheck={false}
        className="font-mono-term w-full resize-y rounded-lg border border-white/10 bg-black/30 p-3 text-xs text-white/80 outline-none focus:border-neon-blue/40"
      />
      <div className="mt-3 flex items-center justify-between">
        <label className="flex items-center gap-2 text-xs text-white/50">
          <input type="checkbox" checked={merge} onChange={(e) => setMerge(e.target.checked)} />
          Merge into site content (experience / education / certifications / skills)
        </label>
        <button
          onClick={importData}
          className="flex items-center gap-1.5 rounded-full border border-neon-blue/30 bg-neon-blue/10 px-4 py-1.5 text-xs text-neon-blue hover:bg-neon-blue/20"
        >
          <FiUploadCloud /> Import
        </button>
      </div>
      {status && <p className="mt-2 text-xs text-white/50">{status}</p>}
    </div>
  );
}
