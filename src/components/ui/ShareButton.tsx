"use client";

import { useState } from "react";
import { FiShare2, FiCheck } from "react-icons/fi";
import profile from "@/data/profile.json";

export default function ShareButton({ className }: { className?: string }) {
  const [copied, setCopied] = useState(false);

  async function share() {
    const url = window.location.href;
    const shareData = {
      title: `${profile.name} — ${profile.title}`,
      text: profile.tagline,
      url,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // user cancelled the native share sheet — no-op
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // clipboard unavailable — nothing else we can do
    }
  }

  return (
    <button
      onClick={share}
      aria-label="Share this page"
      data-cursor="pointer"
      className={
        className ??
        "flex items-center justify-center rounded-full border border-white/10 bg-white/[0.03] p-2 text-white/50 transition-colors hover:border-neon-cyan/40 hover:text-neon-cyan"
      }
    >
      {copied ? <FiCheck size={14} /> : <FiShare2 size={14} />}
    </button>
  );
}
