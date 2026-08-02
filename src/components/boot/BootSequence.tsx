"use client";

import { useEffect, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useBootStore } from "@/lib/store";
import profile from "@/data/profile.json";

const LINES = [
  "BOOTING SYSTEM KERNEL...",
  "INITIALIZING AI CORE...",
  "LOADING NEURAL ENGINE...",
  "CONNECTING TO GITHUB...",
  "SYNCING RESEARCH DATABASE...",
  "AUTHENTICATING IDENTITY...",
  `WELCOME, ${profile.shortName.toUpperCase()}`,
  "ACCESS GRANTED",
];

const SKIP_KEY = "portfolio_booted_session";

export default function BootSequence({ onDone }: { onDone: () => void }) {
  const setBooted = useBootStore((s) => s.setBooted);
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const [phase, setPhase] = useState<"lines" | "granted" | "tunnel" | "done">("lines");
  const [skip, setSkip] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(SKIP_KEY)) {
      setSkip(true);
      setBooted(true);
      onDone();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const finish = useCallback(() => {
    sessionStorage.setItem(SKIP_KEY, "1");
    setBooted(true);
    onDone();
  }, [onDone, setBooted]);

  useEffect(() => {
    if (skip) return;
    if (phase !== "lines") return;
    if (visibleLines >= LINES.length) {
      const t = setTimeout(() => setPhase("granted"), 350);
      return () => clearTimeout(t);
    }
    const delay = visibleLines === LINES.length - 1 ? 550 : 240 + Math.random() * 180;
    const t = setTimeout(() => setVisibleLines((v) => v + 1), delay);
    return () => clearTimeout(t);
  }, [visibleLines, phase, skip]);

  useEffect(() => {
    if (skip) return;
    if (phase === "granted") {
      const t = setTimeout(() => setPhase("tunnel"), 700);
      return () => clearTimeout(t);
    }
    if (phase === "tunnel") {
      const t = setTimeout(() => {
        setPhase("done");
        finish();
      }, 1400);
      return () => clearTimeout(t);
    }
  }, [phase, skip, finish]);

  if (skip) return null;

  return (
    <AnimatePresence>
      {phase !== "done" && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#03040a] font-mono-term"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="grid-bg absolute inset-0 opacity-20" />

          {phase !== "tunnel" && (
            <div className="relative z-10 w-[min(90vw,560px)]">
              <div className="mb-3 flex items-center gap-2 text-xs text-white/40">
                <span className="h-2 w-2 rounded-full bg-neon-cyan animate-pulse" />
                SECURE TERMINAL // GALIB.SYS
              </div>
              <div className="space-y-2 text-sm sm:text-base">
                {LINES.slice(0, visibleLines).map((line, i) => (
                  <motion.div
                    key={line}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.25 }}
                    className={
                      i === LINES.length - 1
                        ? "text-neon-cyan font-semibold tracking-widest"
                        : "text-white/70"
                    }
                  >
                    <span className="text-neon-blue mr-2">{">"}</span>
                    {line}
                    {i === visibleLines - 1 && phase === "lines" && (
                      <span className="ml-1 inline-block h-4 w-2 animate-pulse bg-neon-cyan/80 align-middle" />
                    )}
                  </motion.div>
                ))}
              </div>
              <div className="mt-6 h-1 w-full overflow-hidden rounded-full bg-white/10">
                <motion.div
                  className="h-full bg-gradient-to-r from-neon-blue via-neon-purple to-neon-cyan"
                  initial={{ width: "0%" }}
                  animate={{ width: `${(visibleLines / LINES.length) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          )}

          {phase === "tunnel" && <TunnelFlash />}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function TunnelFlash() {
  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center overflow-hidden"
      initial={{ opacity: 1 }}
    >
      {Array.from({ length: 14 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border border-neon-blue/40"
          style={{ width: 40 + i * 60, height: 40 + i * 60 }}
          initial={{ scale: 0.2, opacity: 0 }}
          animate={{ scale: 6, opacity: [0, 0.6, 0] }}
          transition={{ duration: 1.2, delay: i * 0.05, ease: "easeIn" }}
        />
      ))}
      <motion.div
        className="absolute inset-0 bg-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0, 1] }}
        transition={{ duration: 1.3, times: [0, 0.8, 1] }}
      />
    </motion.div>
  );
}
