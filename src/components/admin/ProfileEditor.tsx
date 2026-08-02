"use client";

import { useEffect, useState } from "react";
import { FiSave, FiRefreshCw, FiPlus, FiTrash2 } from "react-icons/fi";
import { FieldRow, type FieldSchema } from "./fields";

const FIELDS: FieldSchema[] = [
  { key: "name", label: "Full name", type: "text" },
  { key: "shortName", label: "Short name", type: "text" },
  { key: "title", label: "Title", type: "text" },
  { key: "roles", label: "Roles (comma-separated)", type: "tags" },
  { key: "tagline", label: "Tagline", type: "textarea" },
  { key: "bio", label: "Bio", type: "textarea" },
  { key: "location", label: "Location", type: "text" },
  { key: "email", label: "Email", type: "text" },
  { key: "phone", label: "Phone", type: "text" },
  { key: "avatar", label: "Avatar path", type: "text" },
  { key: "resumeUrl", label: "Resume URL", type: "text" },
  { key: "availability", label: "Availability text", type: "text" },
];

interface Language {
  name: string;
  level: string;
}

export default function ProfileEditor({ password }: { password: string }) {
  const [data, setData] = useState<Record<string, unknown>>({});
  const [languages, setLanguages] = useState<Language[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setStatus(null);
    try {
      const res = await fetch("/api/admin/content?key=profile");
      const json = await res.json();
      setData(json.data ?? {});
      setLanguages(Array.isArray(json.data?.languages) ? json.data.languages : []);
    } catch {
      setStatus("Failed to load content.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function save() {
    setStatus(null);
    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "profile", data: { ...data, languages }, password }),
      });
      const json = await res.json();
      setStatus(json.ok ? "Saved." : json.error ?? "Save failed.");
    } catch {
      setStatus("Network error while saving.");
    }
  }

  return (
    <div className="glass rounded-2xl border border-white/10 p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display text-base font-semibold text-white">Profile</h3>
        <div className="flex gap-2">
          <button
            onClick={load}
            className="flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 text-xs text-white/60 hover:border-neon-cyan/40"
          >
            <FiRefreshCw /> Reload
          </button>
          <button
            onClick={save}
            className="flex items-center gap-1.5 rounded-full border border-neon-blue/30 bg-neon-blue/10 px-3 py-1.5 text-xs text-neon-blue hover:bg-neon-blue/20"
          >
            <FiSave /> Save
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-xs text-white/40">Loading…</p>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {FIELDS.map((f) => (
              <div key={f.key} className={f.type === "textarea" ? "sm:col-span-2" : ""}>
                <FieldRow field={f} value={data[f.key]} onChange={(v) => setData((d) => ({ ...d, [f.key]: v }))} />
              </div>
            ))}
          </div>

          <div className="mt-5 border-t border-white/10 pt-4">
            <div className="mb-2 flex items-center justify-between">
              <label className="text-xs text-white/40">Languages</label>
              <button
                onClick={() => setLanguages((l) => [...l, { name: "", level: "" }])}
                className="flex items-center gap-1 text-xs text-white/50 hover:text-neon-cyan"
              >
                <FiPlus /> Add language
              </button>
            </div>
            <div className="space-y-2">
              {languages.map((lang, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    value={lang.name}
                    onChange={(e) =>
                      setLanguages((prev) => prev.map((l, idx) => (idx === i ? { ...l, name: e.target.value } : l)))
                    }
                    placeholder="Language"
                    className="flex-1 rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none focus:border-neon-blue/40"
                  />
                  <input
                    value={lang.level}
                    onChange={(e) =>
                      setLanguages((prev) => prev.map((l, idx) => (idx === i ? { ...l, level: e.target.value } : l)))
                    }
                    placeholder="Level"
                    className="w-32 rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none focus:border-neon-blue/40"
                  />
                  <button
                    onClick={() => setLanguages((prev) => prev.filter((_, idx) => idx !== i))}
                    className="rounded-full p-2 text-white/40 hover:bg-red-500/10 hover:text-red-400"
                    aria-label="Remove language"
                  >
                    <FiTrash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
      {status && <p className="mt-3 text-xs text-white/50">{status}</p>}
    </div>
  );
}
