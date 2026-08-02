import type { Metadata } from "next";
import GithubStats from "@/components/githubstats/GithubStats";
import PulseGridBackground from "@/components/background/PulseGridBackground";
import { getProfileStats } from "@/lib/github";
import { getContributionData } from "@/lib/githubGraphql";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "GitHub",
  description: "Live GitHub activity — repositories, stars and contribution history.",
};

export default async function GithubPage() {
  const [stats, contributions] = await Promise.all([getProfileStats(), getContributionData()]);

  return (
    <div className="pt-24">
      <PulseGridBackground />
      <GithubStats stats={stats} contributions={contributions} />
    </div>
  );
}
