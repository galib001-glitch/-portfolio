"use client";

export default function AuroraBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-20 overflow-hidden bg-[#05060a]">
      <div className="grid-bg absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_top,black,transparent_75%)]" />
      <div
        className="animate-aurora absolute -top-1/4 left-[10%] h-[60vh] w-[60vh] rounded-full blur-[120px]"
        style={{ background: "radial-gradient(circle, rgba(59,167,255,0.55), transparent 65%)" }}
      />
      <div
        className="animate-aurora absolute top-[10%] right-[5%] h-[55vh] w-[55vh] rounded-full blur-[130px]"
        style={{ background: "radial-gradient(circle, rgba(168,85,247,0.5), transparent 65%)", animationDelay: "-6s" }}
      />
      <div
        className="animate-aurora absolute bottom-[-10%] left-[30%] h-[50vh] w-[50vh] rounded-full blur-[130px]"
        style={{ background: "radial-gradient(circle, rgba(34,211,238,0.45), transparent 65%)", animationDelay: "-12s" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#05060a]" />
    </div>
  );
}
