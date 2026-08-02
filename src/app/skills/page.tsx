import type { Metadata } from "next";
import SkillTree from "@/components/skills/SkillTree";
import NetworkBackground from "@/components/background/NetworkBackground";
import { readContent } from "@/lib/content";
import type { SkillData } from "@/lib/types";
import defaultSkills from "@/data/skills.json";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "Skills",
  description: "An interactive skill network across languages, web, systems and design.",
};

export default async function SkillsPage() {
  const skillData = (await readContent<SkillData>("skills")) ?? (defaultSkills as SkillData);

  return (
    <div className="pt-24">
      <NetworkBackground />
      <SkillTree skillData={skillData} />
    </div>
  );
}
