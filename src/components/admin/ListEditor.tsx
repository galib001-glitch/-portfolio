"use client";

import { useEffect, useState } from "react";
import { FiPlus, FiTrash2, FiSave, FiRefreshCw, FiChevronDown } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { FieldRow, type FieldSchema } from "./fields";

export default function ListEditor({
  contentKey,
  password,
  label,
  fields,
  emptyItem,
  titleKey,
}: {
  contentKey: string;
  password: string;
  label: string;
  fields: FieldSchema[];
  emptyItem: () => Record<string, unknown>;
  titleKey: string;
}) {
  const [items, setItems] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<string | null>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  async function load() {
    setLoading(true);
    setStatus(null);
    try {
      const res = await fetch(`/api/admin/content?key=${contentKey}`);
      const json = await res.json();
      setItems(Array.isArray(json.data) ? json.data : []);
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

  function updateField(index: number, key: string, value: unknown) {
    setItems((prev) => prev.map((it, i) => (i === index ? { ...it, [key]: value } : it)));
  }

  function addItem() {
    setItems((prev) => [...prev, emptyItem()]);
    setOpenIndex(items.length);
  }

  function removeItem(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index));
    setOpenIndex(null);
  }

  async function save() {
    setStatus(null);
    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: contentKey, data: items, password }),
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
        <h3 className="font-display text-base font-semibold text-white">
          {label} <span className="text-xs font-normal text-white/30">({items.length})</span>
        </h3>
        <div className="flex gap-2">
          <button
            onClick={load}
            className="flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 text-xs text-white/60 hover:border-neon-cyan/40"
          >
            <FiRefreshCw /> Reload
          </button>
          <button
            onClick={addItem}
            className="flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 text-xs text-white/60 hover:border-neon-cyan/40"
          >
            <FiPlus /> Add
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
      ) : items.length === 0 ? (
        <p className="text-xs text-white/30">No entries yet. Click Add to create one.</p>
      ) : (
        <div className="space-y-2">
          {items.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={index} className="rounded-xl border border-white/10 bg-white/[0.02]">
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between px-4 py-3 text-left"
                >
                  <span className="text-sm text-white/80">
                    {(item[titleKey] as string) || `(untitled #${index + 1})`}
                  </span>
                  <div className="flex items-center gap-3">
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        removeItem(index);
                      }}
                      className="rounded-full p-1.5 text-white/40 hover:bg-red-500/10 hover:text-red-400"
                      aria-label="Remove"
                    >
                      <FiTrash2 size={14} />
                    </span>
                    <motion.span animate={{ rotate: isOpen ? 180 : 0 }} className="text-white/40">
                      <FiChevronDown size={14} />
                    </motion.span>
                  </div>
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="grid grid-cols-1 gap-3 border-t border-white/10 p-4 sm:grid-cols-2">
                        {fields.map((f) => (
                          <div key={f.key} className={f.type === "textarea" || f.type === "list" ? "sm:col-span-2" : ""}>
                            <FieldRow
                              field={f}
                              value={item[f.key]}
                              onChange={(v) => updateField(index, f.key, v)}
                            />
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      )}
      {status && <p className="mt-3 text-xs text-white/50">{status}</p>}
    </div>
  );
}
