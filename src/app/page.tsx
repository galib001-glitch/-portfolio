import Hero from "@/components/hero/Hero";
import ExploreGrid from "@/components/home/ExploreGrid";
import SkillTree from "@/components/skills/SkillTree";
import { readContent } from "@/lib/content";
import type { Profile, Links, SkillData } from "@/lib/types";
import defaultProfile from "@/data/profile.json";
import defaultLinks from "@/data/links.json";
import defaultSkills from "@/data/skills.json";

export const revalidate = 0;

export default async function Home() {
  const profile = (await readContent<Profile>("profile")) ?? (defaultProfile as Profile);
  const links = (await readContent<Links>("links")) ?? (defaultLinks as Links);
  const skillData = (await readContent<SkillData>("skills")) ?? (defaultSkills as SkillData);

  return (
    <>
      <Hero profile={profile} links={links} />
      <SkillTree skillData={skillData} />
      <ExploreGrid />
    </>
  );
}
