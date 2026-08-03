"use client";

import { useEffect, useState } from "react";
import { FiSave, FiRefreshCw, FiPlus, FiTrash2, FiChevronDown } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

interface SkillNode {
  id: string;
  label: string;
  level: number;
}

interface SkillCategory {
  id: string;
  label: string;
  color: string;
  description?: string;
  skills: SkillNode[];
}

interface SkillData {
  categories: SkillCategory[];
  core: { id: string; label: string };
}

const inputClass =
  "w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none focus:border-neon-blue/40";

export default function SkillsEditor({ password }: { password: string }) {
  const [data, setData] = useState<SkillData>({ categories: [], core: { id: "core", label: "" } });
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<string | null>(null);
  const [openCat, setOpenCat] = useState<number | null>(null);

  async function load() {
    setLoading(true);
    setStatus(null);
    try {
      const res = await fetch("/api/admin/content?key=skills");
      const json = await res.json();
      setData(json.data ?? { categories: [], core: { id: "core", label: "" } });
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
        body: JSON.stringify({ key: "skills", data, password }),
      });
      const json = await res.json();
      setStatus(json.ok ? "Saved." : json.error ?? "Save failed.");
    } catch {
      setStatus("Network error while saving.");
    }
  }

  function updateCategory(ci: number, patch: Partial<SkillCategory>) {
    setData((d) => ({
      ...d,
      categories: d.categories.map((c, i) => (i === ci ? { ...c, ...patch } : c)),
    }));
  }

  function addCategory() {
    setData((d) => ({
      ...d,
      categories: [
        ...d.categories,
        { id: `category-${Date.now()}`, label: "New Category", color: "#38bdf8", description: "", skills: [] },
      ],
    }));
    setOpenCat(data.categories.length);
  }

  function removeCategory(ci: number) {
    setData((d) => ({ ...d, categories: d.categories.filter((_, i) => i !== ci) }));
    setOpenCat(null);
  }

  function updateSkill(ci: number, si: number, patch: Partial<SkillNode>) {
    updateCategory(ci, {
      skills: data.categories[ci].skills.map((s, i) => (i === si ? { ...s, ...patch } : s)),
    });
  }

  function addSkill(ci: number) {
    updateCategory(ci, {
      skills: [...data.categories[ci].skills, { id: `skill-${Date.now()}`, label: "New Skill", level: 70 }],
    });
  }

  function removeSkill(ci: number, si: number) {
    updateCategory(ci, { skills: data.categories[ci].skills.filter((_, i) => i !== si) });
  }

  return (
    <div className="glass rounded-2xl border border-white/10 p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display text-base font-semibold text-white">
          Skills <span className="text-xs font-normal text-white/30">({data.categories.length} categories)</span>
        </h3>
        <div className="flex gap-2">
          <button
            onClick={load}
            className="flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 text-xs text-white/60 hover:border-neon-cyan/40"
          >
            <FiRefreshCw /> Reload
          </button>
          <button
            onClick={addCategory}
            className="flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 text-xs text-white/60 hover:border-neon-cyan/40"
          >
            <FiPlus /> Add category
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
          <div className="mb-4">
            <label className="mb-1 block text-xs text-white/40">Core label (center of the skill tree)</label>
            <input
              value={data.core.label}
              onChange={(e) => setData((d) => ({ ...d, core: { ...d.core, label: e.target.value } }))}
              className={inputClass}
            />
          </div>

          <div className="space-y-2">
            {data.categories.map((cat, ci) => {
              const isOpen = openCat === ci;
              return (
                <div key={ci} className="rounded-xl border border-white/10 bg-white/[0.02]">
                  <button
                    onClick={() => setOpenCat(isOpen ? null : ci)}
                    className="flex w-full items-center justify-between px-4 py-3 text-left"
                  >
                    <span className="flex items-center gap-2 text-sm text-white/80">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ background: cat.color }} />
                      {cat.label} <span className="text-white/30">({cat.skills.length} skills)</span>
                    </span>
                    <div className="flex items-center gap-3">
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          removeCategory(ci);
                        }}
                        className="rounded-full p-1.5 text-white/40 hover:bg-red-500/10 hover:text-red-400"
                        aria-label="Remove category"
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
                        <div className="border-t border-white/10 p-4">
                          <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                            <div>
                              <label className="mb-1 block text-xs text-white/40">Label</label>
                              <input
                                value={cat.label}
                                onChange={(e) => updateCategory(ci, { label: e.target.value })}
                                className={inputClass}
                              />
                            </div>
                            <div>
                              <label className="mb-1 block text-xs text-white/40">Id</label>
                              <input
                                value={cat.id}
                                onChange={(e) => updateCategory(ci, { id: e.target.value })}
                                className={inputClass}
                              />
                            </div>
                            <div>
                              <label className="mb-1 block text-xs text-white/40">Color</label>
                              <input
                                type="color"
                                value={cat.color}
                                onChange={(e) => updateCategory(ci, { color: e.target.value })}
                                className="h-10 w-full rounded-lg border border-white/10 bg-black/30"
                              />
                            </div>
                          </div>

                          <div className="mb-4">
                            <label className="mb-1 block text-xs text-white/40">
                              Description (shown on the Skills page)
                            </label>
                            <textarea
                              value={cat.description ?? ""}
                              onChange={(e) => updateCategory(ci, { description: e.target.value })}
                              rows={2}
                              placeholder="A short line about this discipline…"
                              className={`${inputClass} resize-none`}
                            />
                          </div>

                          <div className="mb-2 flex items-center justify-between">
                            <span className="text-xs text-white/40">Skills</span>
                            <button
                              onClick={() => addSkill(ci)}
                              className="flex items-center gap-1 text-xs text-white/50 hover:text-neon-cyan"
                            >
                              <FiPlus /> Add skill
                            </button>
                          </div>
                          <div className="space-y-2">
                            {cat.skills.map((skill, si) => (
                              <div key={si} className="flex items-center gap-2">
                                <input
                                  value={skill.label}
                                  onChange={(e) => updateSkill(ci, si, { label: e.target.value })}
                                  placeholder="Skill name"
                                  className={`${inputClass} flex-1`}
                                />
                                <input
                                  type="number"
                                  min={0}
                                  max={100}
                                  value={skill.level}
                                  onChange={(e) => updateSkill(ci, si, { level: Number(e.target.value) })}
                                  className={`${inputClass} w-20`}
                                />
                                <button
                                  onClick={() => removeSkill(ci, si)}
                                  className="rounded-full p-2 text-white/40 hover:bg-red-500/10 hover:text-red-400"
                                  aria-label="Remove skill"
                                >
                                  <FiTrash2 size={14} />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </>
      )}
      {status && <p className="mt-3 text-xs text-white/50">{status}</p>}
    </div>
  );
}
