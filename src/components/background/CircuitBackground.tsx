"use client";

const TRACES = [
  "M -5 15 H 30 V 40 H 70 V 15 H 110",
  "M -5 55 H 20 V 30 H 55 V 75 H 110",
  "M -5 85 H 45 V 60 H 90 V 85 H 110",
  "M 15 -5 V 20 H 45",
  "M 85 -5 V 25 H 60 V 50",
];

export default function CircuitBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden opacity-40" aria-hidden>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full">
        {TRACES.map((d, i) => (
          <path
            key={i}
            d={d}
            fill="none"
            stroke="rgba(56,189,248,0.22)"
            strokeWidth={0.25}
            strokeDasharray="2 3"
            className="animate-dash"
            style={{ animationDuration: `${5 + i}s`, animationDelay: `${i * 0.4}s` }}
          />
        ))}
        {TRACES.map((d, i) => {
          const m = d.match(/M ([\d.-]+) ([\d.-]+)/);
          if (!m) return null;
          return (
            <circle
              key={`n-${i}`}
              cx={m[1]}
              cy={m[2]}
              r={0.6}
              fill="#22d3ee"
              className="animate-pulse-glow"
              style={{ animationDelay: `${i * 0.3}s` }}
            />
          );
        })}
      </svg>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#05060a]" />
    </div>
  );
}
