"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FiCopy, FiCheck, FiFileText, FiExternalLink } from "react-icons/fi";
import GlassCard from "@/components/ui/GlassCard";
import { formatApaCitation } from "@/lib/citation";
import type { ResearchPaper } from "@/lib/types";

export default function PaperCard({ paper, index }: { paper: ResearchPaper; index: number }) {
  const [copied, setCopied] = useState<"apa" | "bibtex" | null>(null);

  async function copy(text: string, kind: "apa" | "bibtex") {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(kind);
      setTimeout(() => setCopied(null), 1800);
    } catch {
      // clipboard may be unavailable; ignore silently
    }
  }

  function downloadBibtex() {
    const blob = new Blob([paper.bibtex], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${paper.id}.bib`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
    >
      <GlassCard strong className="relative overflow-hidden">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-neon-purple/30 bg-neon-purple/10 px-3 py-1 text-xs text-neon-purple">
            {paper.type}
          </span>
          <span className="font-mono-term text-xs text-white/40">
            {paper.venue ? `${paper.venue} · ${paper.year}` : paper.year}
          </span>
          {paper.status && (
            <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-300">
              {paper.status}
            </span>
          )}
        </div>

        <h3 className="font-display mb-2 text-xl font-semibold text-white">{paper.title}</h3>
        <p className="mb-4 text-sm text-white/50">{paper.authors.join(", ")}</p>
        <p className="mb-5 text-sm leading-relaxed text-white/60">{paper.abstract}</p>

        <div className="mb-5 flex flex-wrap gap-2">
          {paper.keywords.map((k) => (
            <span key={k} className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-0.5 text-xs text-white/45">
              {k}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3 border-t border-white/10 pt-4 text-xs">
          <button
            onClick={() => copy(formatApaCitation(paper), "apa")}
            data-cursor="pointer"
            className="flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 text-white/60 hover:border-neon-cyan/50 hover:text-neon-cyan"
          >
            {copied === "apa" ? <FiCheck /> : <FiCopy />} Copy Citation
          </button>
          <button
            onClick={downloadBibtex}
            data-cursor="pointer"
            className="flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 text-white/60 hover:border-neon-cyan/50 hover:text-neon-cyan"
          >
            <FiFileText /> Download BibTeX
          </button>
          {paper.doi && (
            <a
              href={`https://doi.org/${paper.doi}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 text-white/60 hover:border-neon-cyan/50 hover:text-neon-cyan"
            >
              <FiExternalLink /> DOI
            </a>
          )}
          {paper.pdfUrl && (
            <a
              href={paper.pdfUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 text-white/60 hover:border-neon-cyan/50 hover:text-neon-cyan"
            >
              <FiFileText /> PDF
            </a>
          )}
        </div>
      </GlassCard>
    </motion.div>
  );
}
