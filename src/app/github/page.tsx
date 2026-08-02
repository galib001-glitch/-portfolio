import type { Metadata } from "next";
import GithubStats from "@/components/githubstats/GithubStats";
import PulseGridBackground from "@/components/background/PulseGridBackground";
import { getProfileStats } from "@/lib/github";
import { getContributionData } from "@/lib/githubGraphql";
import { readContent } from "@/lib/content";
import type { Links } from "@/lib/types";
import defaultLinks from "@/data/links.json";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "GitHub",
  description: "Live GitHub activity — repositories, stars and contribution history.",
};

export default async function GithubPage() {
  const links = (await readContent<Links>("links")) ?? (defaultLinks as Links);
  const [stats, contributions] = await Promise.all([
    getProfileStats(links.githubUsername),
    getContributionData(links.githubUsername),
  ]);

  return (
    <div className="pt-24">
      <PulseGridBackground />
      <GithubStats stats={stats} contributions={contributions} links={links} />
    </div>
  );
}
