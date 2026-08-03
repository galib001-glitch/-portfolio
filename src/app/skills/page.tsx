import type { Metadata } from "next";
import SkillsShowcase from "@/components/skills/SkillsShowcase";
import NetworkBackground from "@/components/background/NetworkBackground";
import { readContent } from "@/lib/content";
import type { SkillData } from "@/lib/types";
import defaultSkills from "@/data/skills.json";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "Skills",
  description: "Languages, web, systems, AI/ML, security, design and leadership skills.",
};

export default async function SkillsPage() {
  const skillData = (await readContent<SkillData>("skills")) ?? (defaultSkills as SkillData);

  return (
    <div className="pt-24">
      <NetworkBackground />
      <SkillsShowcase skillData={skillData} />
    </div>
  );
}
