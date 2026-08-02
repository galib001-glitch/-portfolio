"use client";

import { useEffect, useState } from "react";

interface Node {
  id: number;
  x: number;
  y: number;
  r: number;
  delay: number;
}

export default function NetworkBackground() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<{ a: Node; b: Node }[]>([]);

  useEffect(() => {
    const generated: Node[] = Array.from({ length: 18 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      r: Math.random() * 1.6 + 1,
      delay: Math.random() * 4,
    }));
    const list: { a: Node; b: Node }[] = [];
    generated.forEach((a, i) => {
      const b = generated[(i + 3) % generated.length];
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      if (dist < 45) list.push({ a, b });
    });
    setNodes(generated);
    setEdges(list);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden opacity-50" aria-hidden>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full">
        {edges.map(({ a, b }, i) => (
          <line
            key={i}
            x1={a.x}
            y1={a.y}
            x2={b.x}
            y2={b.y}
            stroke="rgba(59,167,255,0.18)"
            strokeWidth={0.15}
          />
        ))}
        {nodes.map((n) => (
          <circle
            key={n.id}
            cx={n.x}
            cy={n.y}
            r={n.r * 0.3}
            className="animate-twinkle"
            style={{ animationDelay: `${n.delay}s`, transformBox: "fill-box", transformOrigin: "center" }}
            fill="#22d3ee"
          />
        ))}
      </svg>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#05060a]" />
    </div>
  );
}
