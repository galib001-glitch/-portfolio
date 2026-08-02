"use client";

export default function OrbitBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
      <div className="absolute right-[-10%] top-[-10%] h-[70vh] w-[70vh] opacity-40">
        {[420, 320, 220].map((size, i) => (
          <div
            key={size}
            className="animate-orbit absolute rounded-full border border-dashed"
            style={{
              width: size,
              height: size,
              left: `calc(50% - ${size / 2}px)`,
              top: `calc(50% - ${size / 2}px)`,
              borderColor: i === 0 ? "rgba(59,167,255,0.25)" : i === 1 ? "rgba(168,85,247,0.25)" : "rgba(34,211,238,0.25)",
              animationDuration: `${28 + i * 10}s`,
              animationDirection: i % 2 === 0 ? "normal" : "reverse",
            }}
          >
            <span
              className="absolute h-2.5 w-2.5 rounded-full"
              style={{
                top: -5,
                left: "50%",
                background: i === 0 ? "#3ba7ff" : i === 1 ? "#a855f7" : "#22d3ee",
                boxShadow: "0 0 12px 2px currentColor",
              }}
            />
          </div>
        ))}
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#05060a]" />
    </div>
  );
}
