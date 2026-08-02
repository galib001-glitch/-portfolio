"use client";

import { motion } from "framer-motion";
import type { EducationItem, ExperienceItem } from "@/lib/types";

interface TimelineEntry {
  id: string;
  period: string;
  title: string;
  subtitle: string;
  points?: string[];
  kind: "education" | "experience";
}

export default function Timeline({
  education,
  experience,
}: {
  education: EducationItem[];
  experience: ExperienceItem[];
}) {
  const entries: TimelineEntry[] = [
    ...experience.map((e) => ({
      id: e.id,
      period: e.period,
      title: e.role,
      subtitle: e.org,
      points: e.points,
      kind: "experience" as const,
    })),
    ...education.map((e) => ({
      id: e.id,
      period: e.period,
      title: e.degree,
      subtitle: e.institution,
      points: e.detail ? [e.detail] : [],
      kind: "education" as const,
    })),
  ];

  return (
    <div className="relative pl-8">
      <div className="absolute left-[9px] top-2 bottom-2 w-px bg-gradient-to-b from-neon-blue via-neon-purple to-transparent" />
      <div className="space-y-10">
        {entries.map((entry, i) => (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: (i % 5) * 0.06 }}
            className="relative"
          >
            <span
              className={`absolute -left-8 top-1.5 h-3.5 w-3.5 rounded-full border-2 ${
                entry.kind === "experience"
                  ? "border-neon-blue bg-neon-blue/40 shadow-[0_0_12px_2px_rgba(59,167,255,0.6)]"
                  : "border-neon-purple bg-neon-purple/40 shadow-[0_0_12px_2px_rgba(168,85,247,0.6)]"
              }`}
            />
            <div className="glass rounded-2xl border border-white/10 p-5">
              <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-display text-lg font-semibold text-white">{entry.title}</h3>
                <span className="font-mono-term text-xs text-white/40">{entry.period}</span>
              </div>
              <p className="mb-2 text-sm font-medium text-neon-cyan">{entry.subtitle}</p>
              {entry.points && entry.points.length > 0 && (
                <ul className="space-y-1.5 text-sm text-white/60">
                  {entry.points.map((p, idx) => (
                    <li key={idx} className="flex gap-2">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-white/30" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
