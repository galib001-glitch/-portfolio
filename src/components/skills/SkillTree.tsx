"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import { cn } from "@/lib/utils";
import type { SkillData } from "@/lib/types";

interface PositionedNode {
  id: string;
  label: string;
  level: number;
  color: string;
  x: number;
  y: number;
  categoryId: string;
}

const WIDTH = 1300;
const HEIGHT = 1100;
const CENTER = { x: WIDTH / 2, y: HEIGHT / 2 };
const CAT_RADIUS = 300;

// Round to a fixed precision so server- and client-rendered coordinates
// match exactly — Math.cos/sin can differ by a float ULP between Node's and
// the browser's V8, which otherwise trips a React hydration mismatch.
const round = (n: number) => Math.round(n * 100) / 100;

export default function SkillTree({ skillData }: { skillData: SkillData }) {
  const [hovered, setHovered] = useState<string | null>(null);

  const { nodes } = useMemo(() => {
    const categories = skillData.categories;
    const catCount = categories.length;

    const nodesArr: PositionedNode[] = [];

    categories.forEach((cat, ci) => {
      const catAngle = (ci / catCount) * Math.PI * 2 - Math.PI / 2;
      const catX = round(CENTER.x + Math.cos(catAngle) * CAT_RADIUS);
      const catY = round(CENTER.y + Math.sin(catAngle) * CAT_RADIUS);

      nodesArr.push({
        id: cat.id,
        label: cat.label,
        level: 100,
        color: cat.color,
        x: catX,
        y: catY,
        categoryId: cat.id,
      });

      // Scale each category's fan radius/spread with its own skill count so
      // dense categories (e.g. 10 skills) don't overlap sparse ones (5 skills).
      // Radius is capped well under half the distance between neighboring
      // category nodes so two dense fans can't reach into each other.
      const skillRadius = Math.min(80 + cat.skills.length * 5, 115);
      const spread = Math.min(0.45 + cat.skills.length * 0.05, 0.95) * Math.PI;

      cat.skills.forEach((skill, si) => {
        const skillAngle = catAngle - spread / 2 + (si / Math.max(1, cat.skills.length - 1)) * spread;
        const x = round(catX + Math.cos(skillAngle) * skillRadius);
        const y = round(catY + Math.sin(skillAngle) * skillRadius);
        nodesArr.push({
          id: skill.id,
          label: skill.label,
          level: skill.level,
          color: cat.color,
          x,
          y,
          categoryId: cat.id,
        });
      });
    });

    return { nodes: nodesArr };
  }, [skillData]);

  const activeCategory = useMemo(() => {
    if (!hovered) return null;
    const node = nodes.find((n) => n.id === hovered);
    return node?.categoryId ?? null;
  }, [hovered, nodes]);

  return (
    <section id="skills" className="relative py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <SectionHeading
          eyebrow="Skills"
          title="An interactive skill network"
          description="Hover a node to trace its connections — from core discipline to specific tools and technologies."
          align="center"
        />

        <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02]">
          <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="h-auto w-full select-none">
            <defs>
              <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#3ba7ff" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#3ba7ff" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* core -> category lines */}
            {skillData.categories.map((cat) => {
              const catNode = nodes.find((n) => n.id === cat.id)!;
              const isActive = activeCategory === cat.id;
              return (
                <line
                  key={`core-${cat.id}`}
                  x1={CENTER.x}
                  y1={CENTER.y}
                  x2={catNode.x}
                  y2={catNode.y}
                  stroke={cat.color}
                  strokeOpacity={isActive ? 0.9 : 0.25}
                  strokeWidth={isActive ? 2 : 1}
                />
              );
            })}

            {/* category -> skill lines */}
            {nodes
              .filter((n) => n.level !== 100)
              .map((n) => {
                const catNode = nodes.find((c) => c.id === n.categoryId)!;
                const isActive = activeCategory === n.categoryId;
                return (
                  <line
                    key={`edge-${n.id}`}
                    x1={catNode.x}
                    y1={catNode.y}
                    x2={n.x}
                    y2={n.y}
                    stroke={n.color}
                    strokeOpacity={isActive ? 0.8 : 0.15}
                    strokeWidth={isActive ? 1.5 : 1}
                  />
                );
              })}

            {/* core node */}
            <circle cx={CENTER.x} cy={CENTER.y} r={70} fill="url(#coreGlow)" />
            <circle cx={CENTER.x} cy={CENTER.y} r={30} fill="#0b1120" stroke="#3ba7ff" strokeWidth={1.5} />
            <text
              x={CENTER.x}
              y={CENTER.y + 4}
              textAnchor="middle"
              className="fill-white font-mono-term"
              fontSize={11}
            >
              {skillData.core.label}
            </text>

            {/* category + skill nodes */}
            {nodes.map((n) => {
              const isCat = n.level === 100;
              const isActive = activeCategory === n.categoryId;
              const r = isCat ? 8 : 4 + n.level / 30;
              return (
                <g
                  key={n.id}
                  onMouseEnter={() => setHovered(n.id)}
                  onMouseLeave={() => setHovered((h) => (h === n.id ? null : h))}
                  className="cursor-pointer"
                >
                  <circle
                    cx={n.x}
                    cy={n.y}
                    r={r + (isActive ? 3 : 0)}
                    fill={n.color}
                    fillOpacity={isCat ? 0.85 : isActive ? 0.9 : 0.5}
                    stroke="white"
                    strokeOpacity={isActive ? 0.8 : 0.15}
                    strokeWidth={1}
                  />
                  <text
                    x={n.x}
                    y={isCat ? n.y - 16 : n.y + (n.y > CENTER.y ? 16 : -10)}
                    textAnchor="middle"
                    fontSize={isCat ? 12 : 10}
                    className={cn(
                      "font-mono-term transition-opacity",
                      isCat ? "fill-white font-semibold" : "fill-white/70"
                    )}
                    opacity={isCat || isActive || activeCategory === n.categoryId ? 1 : 0.55}
                  >
                    {n.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-6 text-center text-sm text-white/40"
        >
          {skillData.categories.length} disciplines · {nodes.length - skillData.categories.length} tools & technologies
        </motion.p>
      </div>
    </section>
  );
}
