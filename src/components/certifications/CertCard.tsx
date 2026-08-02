"use client";

import { useRef, type MouseEvent } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { FiAward, FiLinkedin } from "react-icons/fi";
import type { Certification } from "@/lib/types";

export default function CertCard({ cert }: { cert: Certification }) {
  const ref = useRef<HTMLDivElement>(null);
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const sx = useSpring(px, { stiffness: 200, damping: 22 });
  const sy = useSpring(py, { stiffness: 200, damping: 22 });
  const rotateX = useTransform(sy, [0, 1], [8, -8]);
  const rotateY = useTransform(sx, [0, 1], [-8, 8]);
  const sheenX = useTransform(sx, [0, 1], ["-20%", "120%"]);

  function onMove(e: MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    px.set((e.clientX - rect.left) / rect.width);
    py.set((e.clientY - rect.top) / rect.height);
  }
  function onLeave() {
    px.set(0.5);
    py.set(0.5);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      className="glass group relative overflow-hidden rounded-2xl border border-white/10 p-6"
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/25 to-transparent opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-100"
        style={{ left: sheenX }}
      />
      <div className="relative z-10 mb-4 flex items-center justify-between">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-neon-purple/30 bg-neon-purple/10 text-neon-purple">
          <FiAward />
        </span>
        <span className="font-mono-term text-xs text-white/40">{cert.date}</span>
      </div>
      <h3 className="font-display relative z-10 mb-1 text-base font-semibold text-white">{cert.name}</h3>
      <p className="relative z-10 mb-2 text-sm text-neon-cyan">{cert.issuer}</p>
      {cert.summary && <p className="relative z-10 mb-3 text-xs text-white/50">{cert.summary}</p>}
      {cert.skills && cert.skills.length > 0 && (
        <div className="relative z-10 mb-3 flex flex-wrap gap-1.5">
          {cert.skills.map((s) => (
            <span
              key={s}
              className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-0.5 text-[11px] text-white/50"
            >
              {s}
            </span>
          ))}
        </div>
      )}
      {cert.credentialUrl && (
        <a
          href={cert.credentialUrl}
          target="_blank"
          rel="noreferrer"
          className="relative z-10 inline-flex items-center gap-1 text-xs text-white/50 hover:text-neon-cyan"
        >
          <FiLinkedin /> View credential
        </a>
      )}
    </motion.div>
  );
}
