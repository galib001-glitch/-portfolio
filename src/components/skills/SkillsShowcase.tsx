"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import { cn } from "@/lib/utils";
import type { SkillData } from "@/lib/types";

export default function SkillsShowcase({ skillData }: { skillData: SkillData }) {
  const [activeId, setActiveId] = useState(skillData.categories[0]?.id ?? "");
  const activeIndex = Math.max(
    0,
    skillData.categories.findIndex((c) => c.id === activeId)
  );
  const active = skillData.categories[activeIndex] ?? skillData.categories[0];
  const totalSkills = skillData.categories.reduce((n, c) => n + c.skills.length, 0);

  if (!active) return null;

  return (
    <section className="relative py-28">
      <div className="mx-auto max-w-6xl px-6 lg:px-10">
        <SectionHeading
          eyebrow="Skills"
          title="What I bring to the table"
          description="Click through each discipline to see the tools, frameworks and research areas behind it."
          align="center"
        />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[260px_1fr] lg:gap-10">
          {/* category tabs — horizontal pills on mobile, vertical list on desktop */}
          <div className="-mx-6 flex gap-2 overflow-x-auto px-6 pb-2 lg:mx-0 lg:flex-col lg:gap-1.5 lg:overflow-visible lg:px-0 lg:pb-0">
            {skillData.categories.map((cat) => {
              const isActive = cat.id === active.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveId(cat.id)}
                  className={cn(
                    "group relative flex shrink-0 items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-colors lg:shrink",
                    isActive
                      ? "border-white/15 bg-white/[0.06] text-white"
                      : "border-white/10 bg-white/[0.02] text-white/50 hover:border-white/20 hover:text-white/80"
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId="skill-tab-indicator"
                      className="absolute inset-0 rounded-xl"
                      style={{ boxShadow: `inset 0 0 0 1px ${cat.color}66, 0 0 24px -8px ${cat.color}` }}
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                  <span
                    className="relative h-2 w-2 shrink-0 rounded-full transition-transform group-hover:scale-125"
                    style={{ background: cat.color, boxShadow: isActive ? `0 0 10px ${cat.color}` : undefined }}
                  />
                  <span className="relative whitespace-nowrap font-medium lg:whitespace-normal">{cat.label}</span>
                  <span className="relative ml-auto hidden text-xs text-white/30 lg:inline">{cat.skills.length}</span>
                </button>
              );
            })}
          </div>

          {/* active category panel */}
          <div className="relative min-h-[420px] overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] p-6 sm:p-8">
            <div
              className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full opacity-20 blur-3xl transition-colors duration-500"
              style={{ background: active.color }}
            />
            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="relative"
              >
                <div className="flex items-center gap-3">
                  <span
                    className="h-3 w-3 shrink-0 rounded-full"
                    style={{ background: active.color, boxShadow: `0 0 14px ${active.color}` }}
                  />
                  <h3 className="font-display text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                    {active.label}
                  </h3>
                </div>

                {active.description && (
                  <p className="mt-4 max-w-2xl text-base text-white/60">{active.description}</p>
                )}

                <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {active.skills.map((skill, si) => (
                    <motion.div
                      key={skill.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.05 + si * 0.03 }}
                      className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 transition-colors hover:border-white/20"
                    >
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-white/80">{skill.label}</span>
                        <span className="font-mono-term text-xs text-white/35">{skill.level}%</span>
                      </div>
                      <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-white/10">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${skill.level}%` }}
                          transition={{ duration: 0.6, delay: 0.1 + si * 0.03, ease: "easeOut" }}
                          className="h-full rounded-full"
                          style={{ background: active.color }}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-10 text-center text-sm text-white/40"
        >
          {skillData.categories.length} disciplines · {totalSkills} tools & technologies
        </motion.p>
      </div>
    </section>
  );
}
