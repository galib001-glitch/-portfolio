"use client";

import type { ContributionData } from "@/lib/githubGraphql";

const LEVEL_COLORS = ["#151b26", "#0e3a5f", "#1b5a8c", "#2c8ecf", "#3ba7ff"];

export default function ContributionGraph({ data }: { data: ContributionData }) {
  return (
    <div className="overflow-x-auto">
      <div className="flex gap-[3px]">
        {data.weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-[3px]">
            {week.days.map((day) => (
              <div
                key={day.date}
                title={`${day.date}: ${day.count} contributions`}
                className="h-[10px] w-[10px] rounded-[2px]"
                style={{ backgroundColor: LEVEL_COLORS[day.level] }}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center justify-end gap-1.5 text-[10px] text-white/40">
        Less
        {LEVEL_COLORS.map((c) => (
          <span key={c} className="h-[10px] w-[10px] rounded-[2px]" style={{ backgroundColor: c }} />
        ))}
        More
      </div>
    </div>
  );
}
