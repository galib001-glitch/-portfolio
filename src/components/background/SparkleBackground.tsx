"use client";

import { useEffect, useState } from "react";

interface Twinkle {
  left: number;
  top: number;
  size: number;
  delay: number;
  duration: number;
}

interface Riser {
  left: number;
  size: number;
  delay: number;
  duration: number;
  color: string;
}

export default function SparkleBackground() {
  const [twinkles, setTwinkles] = useState<Twinkle[]>([]);
  const [risers, setRisers] = useState<Riser[]>([]);

  useEffect(() => {
    setTwinkles(
      Array.from({ length: 40 }, () => ({
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: Math.random() * 2 + 1,
        delay: Math.random() * 4,
        duration: 2.5 + Math.random() * 3,
      }))
    );
    setRisers(
      Array.from({ length: 14 }, () => ({
        left: Math.random() * 100,
        size: Math.random() * 3 + 2,
        delay: Math.random() * 9,
        duration: 7 + Math.random() * 6,
        color: ["#facc15", "#a855f7", "#22d3ee"][Math.floor(Math.random() * 3)],
      }))
    );
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
      {twinkles.map((t, i) => (
        <span
          key={`tw-${i}`}
          className="animate-twinkle absolute rounded-full bg-white"
          style={{
            left: `${t.left}%`,
            top: `${t.top}%`,
            width: t.size,
            height: t.size,
            animationDelay: `${t.delay}s`,
            animationDuration: `${t.duration}s`,
          }}
        />
      ))}
      {risers.map((r, i) => (
        <span
          key={`rise-${i}`}
          className="animate-rise absolute bottom-0 rounded-full"
          style={{
            left: `${r.left}%`,
            width: r.size,
            height: r.size,
            background: r.color,
            boxShadow: `0 0 8px 2px ${r.color}55`,
            animationDelay: `${r.delay}s`,
            animationDuration: `${r.duration}s`,
          }}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#05060a]" />
    </div>
  );
}
