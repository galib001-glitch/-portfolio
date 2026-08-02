"use client";

import { useEffect, useState } from "react";

interface Cell {
  delay: number;
  duration: number;
  lit: boolean;
}

export default function PulseGridBackground() {
  const [cells, setCells] = useState<Cell[]>([]);

  useEffect(() => {
    setCells(
      Array.from({ length: 18 * 10 }, () => ({
        delay: Math.random() * 3.4,
        duration: 2.5 + Math.random() * 2.5,
        lit: Math.random() > 0.6,
      }))
    );
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden opacity-70" aria-hidden>
      <div className="grid h-full w-full grid-cols-[repeat(18,minmax(0,1fr))] grid-rows-[repeat(10,minmax(0,1fr))] gap-1.5 p-4">
        {cells.map((c, i) => (
          <div
            key={i}
            className={c.lit ? "animate-grid-pulse rounded-[2px] bg-emerald-400" : "rounded-[2px] bg-white/5"}
            style={c.lit ? { animationDelay: `${c.delay}s`, animationDuration: `${c.duration}s` } : undefined}
          />
        ))}
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-[#05060a] via-transparent to-[#05060a]" />
    </div>
  );
}
