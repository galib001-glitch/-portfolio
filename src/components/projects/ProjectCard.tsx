"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiExternalLink, FiGithub, FiChevronDown } from "react-icons/fi";
import TiltCard from "@/components/ui/TiltCard";
import type { ManualProject } from "@/lib/types";

export default function ProjectCard({ project }: { project: { source: "manual"; data: ManualProject } }) {
  const [expanded, setExpanded] = useState(false);
  const p = project.data;

  return (
    <TiltCard className="flex h-full flex-col p-6">
      <div className="mb-3 flex items-start justify-between gap-3">
        <h3 className="font-display text-lg font-semibold text-white">{p.name}</h3>
        <div className="flex shrink-0 items-center gap-3 text-white/50">
          {p.unpublished && (
            <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-2.5 py-0.5 text-[11px] text-amber-300">
              Not yet published
            </span>
          )}
          {p.githubUrl && (
            <a href={p.githubUrl} target="_blank" rel="noreferrer" data-cursor="pointer" aria-label="GitHub repository">
              <FiGithub className="hover:text-neon-cyan" />
            </a>
          )}
          {p.demoUrl && (
            <a href={p.demoUrl} target="_blank" rel="noreferrer" data-cursor="pointer" aria-label="Live demo">
              <FiExternalLink className="hover:text-neon-cyan" />
            </a>
          )}
        </div>
      </div>

      <p className="mb-4 flex-1 text-sm text-white/60">{p.description}</p>

      <div className="mb-4 flex flex-wrap gap-1.5">
        {p.languages?.[0] && (
          <span className="rounded-full border border-neon-blue/30 bg-neon-blue/10 px-2.5 py-0.5 text-xs text-neon-blue">
            {p.languages[0]}
          </span>
        )}
        {p.topics?.slice(0, 4).map((t) => (
          <span key={t} className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-0.5 text-xs text-white/50">
            {t}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between border-t border-white/10 pt-3 text-xs text-white/40">
        <span>{p.year}</span>

        {p.highlights?.length > 0 && (
          <button
            onClick={() => setExpanded((e) => !e)}
            data-cursor="pointer"
            className="flex items-center gap-1 text-white/50 hover:text-neon-cyan"
          >
            Details
            <motion.span animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <FiChevronDown />
            </motion.span>
          </button>
        )}
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="mt-3 max-h-56 overflow-y-auto rounded-lg border border-white/10 bg-black/30 p-3 font-mono-term text-[11px] leading-relaxed text-white/50">
              <ul className="space-y-1.5">
                {p.highlights.map((h, i) => (
                  <li key={i}>• {h}</li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </TiltCard>
  );
}
