import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export default function Marquee({
  children,
  className,
  reverse = false,
}: {
  children: ReactNode;
  className?: string;
  reverse?: boolean;
}) {
  return (
    <div className={cn("group relative flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]", className)}>
      <div
        className={cn("animate-marquee flex shrink-0 items-center gap-8 group-hover:[animation-play-state:paused]", reverse && "[animation-direction:reverse]")}
      >
        {children}
      </div>
      <div
        aria-hidden
        className={cn("animate-marquee flex shrink-0 items-center gap-8 group-hover:[animation-play-state:paused]", reverse && "[animation-direction:reverse]")}
      >
        {children}
      </div>
    </div>
  );
}
