"use client";

export default function DataOrbitBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
      <div className="absolute left-1/2 top-1/2 h-[60vh] w-[60vh] -translate-x-1/2 -translate-y-1/2 opacity-45">
        <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-neon-purple shadow-[0_0_20px_6px_rgba(168,85,247,0.5)]" />
        {[
          { size: 260, duration: 22, color: "#3ba7ff" },
          { size: 380, duration: 34, color: "#22d3ee" },
          { size: 500, duration: 46, color: "#f472b6" },
        ].map((ring, i) => (
          <div
            key={ring.size}
            className="animate-orbit absolute rounded-full border border-dashed border-white/10"
            style={{
              width: ring.size,
              height: ring.size,
              left: `calc(50% - ${ring.size / 2}px)`,
              top: `calc(50% - ${ring.size / 2}px)`,
              animationDuration: `${ring.duration}s`,
              animationDirection: i % 2 ? "reverse" : "normal",
            }}
          >
            <span
              className="absolute h-2 w-2 rounded-full"
              style={{ top: -4, left: "50%", background: ring.color, boxShadow: `0 0 10px 2px ${ring.color}` }}
            />
          </div>
        ))}
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#05060a]" />
    </div>
  );
}
