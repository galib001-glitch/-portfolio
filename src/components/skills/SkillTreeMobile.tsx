"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiChevronDown } from "react-icons/fi";
import type { SkillData } from "@/lib/types";

export default function SkillTreeMobile({ skillData }: { skillData: SkillData }) {
  const [openId, setOpenId] = useState<string | null>(skillData.categories[0]?.id ?? null);

  return (
    <div className="space-y-3 md:hidden">
      {skillData.categories.map((cat, ci) => {
        const isOpen = openId === cat.id;
        return (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.35, delay: ci * 0.05 }}
            className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]"
          >
            <button
              type="button"
              onClick={() => setOpenId(isOpen ? null : cat.id)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left active:bg-white/5"
            >
              <span className="flex min-w-0 items-center gap-3">
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ background: cat.color, boxShadow: `0 0 10px ${cat.color}` }}
                />
                <span className="min-w-0">
                  <span className="block font-display text-sm font-semibold text-white">{cat.label}</span>
                  <span className="block text-xs text-white/40">{cat.skills.length} skills</span>
                </span>
              </span>
              <motion.span
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.25 }}
                className="shrink-0 text-white/40"
              >
                <FiChevronDown size={16} />
              </motion.span>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="flex flex-wrap gap-2 border-t border-white/10 px-4 py-4">
                    {cat.skills.map((skill, si) => (
                      <motion.span
                        key={skill.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.25, delay: si * 0.03 }}
                        className="font-mono-term inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs text-white/80"
                        style={{ borderColor: `${cat.color}40`, background: `${cat.color}14` }}
                      >
                        {skill.label}
                        <span className="text-white/40">{skill.level}%</span>
                      </motion.span>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}
