"use client";

import { useEffect, useState } from "react";

interface Node {
  x: number;
  y: number;
  delay: number;
  duration: number;
}

export default function ConvergeBackground() {
  const [nodes, setNodes] = useState<Node[]>([]);

  useEffect(() => {
    setNodes(
      Array.from({ length: 22 }, () => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 5,
        duration: 4 + Math.random() * 4,
      }))
    );
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden opacity-50" aria-hidden>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full">
        {nodes.map((n, i) => (
          <line
            key={i}
            x1={n.x}
            y1={n.y}
            x2={50}
            y2={50}
            stroke="rgba(59,167,255,0.15)"
            strokeWidth={0.12}
          />
        ))}
        {nodes.map((n, i) => (
          <circle
            key={`n-${i}`}
            cx={n.x}
            cy={n.y}
            r={0.5}
            fill="#3ba7ff"
            className="animate-twinkle"
            style={{ animationDelay: `${n.delay}s`, animationDuration: `${n.duration}s`, transformBox: "fill-box", transformOrigin: "center" }}
          />
        ))}
        <circle cx={50} cy={50} r={1.4} fill="#22d3ee" className="animate-pulse-glow" />
      </svg>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#05060a]" />
    </div>
  );
}
