"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export default function LiquidButton({
  children,
  className,
  onClick,
  type = "button",
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit";
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      data-cursor="pointer"
      className={cn(
        "group relative inline-flex items-center justify-center overflow-hidden rounded-full px-8 py-3.5 text-sm font-semibold text-black transition-transform active:scale-95",
        className
      )}
    >
      <span className="absolute inset-0 bg-gradient-to-r from-neon-cyan via-neon-blue to-neon-purple bg-[length:200%_100%] transition-[background-position] duration-700 ease-out group-hover:bg-[position:100%_0]" />
      <span className="relative z-10">{children}</span>
    </button>
  );
}
