import Hero from "@/components/hero/Hero";
import ExploreGrid from "@/components/home/ExploreGrid";
import { readContent } from "@/lib/content";
import type { Profile, Links } from "@/lib/types";
import defaultProfile from "@/data/profile.json";
import defaultLinks from "@/data/links.json";

export const revalidate = 0;

export default async function Home() {
  const profile = (await readContent<Profile>("profile")) ?? (defaultProfile as Profile);
  const links = (await readContent<Links>("links")) ?? (defaultLinks as Links);

  return (
    <>
      <Hero profile={profile} links={links} />
      <ExploreGrid />
    </>
  );
}
