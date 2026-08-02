"use client";

import { useEffect, useState } from "react";
import { FiSave, FiRefreshCw } from "react-icons/fi";
import { FieldRow, type FieldSchema } from "./fields";

export default function ObjectEditor({
  contentKey,
  password,
  label,
  fields,
}: {
  contentKey: string;
  password: string;
  label: string;
  fields: FieldSchema[];
}) {
  const [data, setData] = useState<Record<string, unknown>>({});
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setStatus(null);
    try {
      const res = await fetch(`/api/admin/content?key=${contentKey}`);
      const json = await res.json();
      setData(json.data ?? {});
    } catch {
      setStatus("Failed to load content.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentKey]);

  async function save() {
    setStatus(null);
    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: contentKey, data, password }),
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
        <h3 className="font-display text-base font-semibold text-white">{label}</h3>
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
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {fields.map((f) => (
            <div key={f.key} className={f.type === "textarea" || f.type === "list" ? "sm:col-span-2" : ""}>
              <FieldRow field={f} value={data[f.key]} onChange={(v) => setData((d) => ({ ...d, [f.key]: v }))} />
            </div>
          ))}
        </div>
      )}
      {status && <p className="mt-3 text-xs text-white/50">{status}</p>}
    </div>
  );
}
