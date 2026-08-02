import type { Metadata } from "next";
import SkillTree from "@/components/skills/SkillTree";
import NetworkBackground from "@/components/background/NetworkBackground";

export const metadata: Metadata = {
  title: "Skills",
  description: "An interactive skill network across languages, web, systems and design.",
};

export default function SkillsPage() {
  return (
    <div className="pt-24">
      <NetworkBackground />
      <SkillTree />
    </div>
  );
}
