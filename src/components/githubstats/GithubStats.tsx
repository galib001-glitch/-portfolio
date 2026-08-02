import { FiUsers, FiFolder, FiGitPullRequest, FiStar } from "react-icons/fi";
import SectionHeading from "@/components/ui/SectionHeading";
import GlassCard from "@/components/ui/GlassCard";
import ContributionGraph from "./ContributionGraph";
import type { GithubProfileStats } from "@/lib/github";
import type { ContributionData } from "@/lib/githubGraphql";
import type { Links } from "@/lib/types";

export default function GithubStats({
  stats,
  contributions,
  links,
}: {
  stats: GithubProfileStats | null;
  contributions: ContributionData | null;
  links: Links;
}) {
  const cards = [
    { label: "Public Repos", value: stats?.public_repos ?? "—", icon: FiFolder },
    { label: "Followers", value: stats?.followers ?? "—", icon: FiUsers },
    {
      label: "Contributions (12mo)",
      value: contributions?.totalContributions ?? "—",
      icon: FiGitPullRequest,
    },
    {
      label: "Pinned Repos",
      value: contributions?.pinnedRepos?.length ?? 0,
      icon: FiStar,
    },
  ];

  return (
    <section id="github" className="relative py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <SectionHeading
          eyebrow="GitHub"
          title="Live activity"
          description={`Pulled straight from github.com/${links.githubUsername}.`}
        />

        <div className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {cards.map((c) => (
            <GlassCard key={c.label} className="text-center">
              <c.icon className="mx-auto mb-2 text-neon-cyan" size={20} />
              <p className="font-display text-2xl font-semibold text-white">{c.value}</p>
              <p className="mt-1 text-xs text-white/40">{c.label}</p>
            </GlassCard>
          ))}
        </div>

        {contributions ? (
          <GlassCard>
            <ContributionGraph data={contributions} />
          </GlassCard>
        ) : (
          <GlassCard className="text-center text-sm text-white/40">
            Set a <code className="rounded bg-white/10 px-1.5 py-0.5 text-neon-cyan">GITHUB_TOKEN</code> environment
            variable to unlock the live contribution graph and pinned repositories via the GitHub GraphQL API.
          </GlassCard>
        )}

        {contributions && contributions.pinnedRepos.length > 0 && (
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {contributions.pinnedRepos.map((r) => (
              <a
                key={r.name}
                href={r.url}
                target="_blank"
                rel="noreferrer"
                className="glass rounded-xl border border-white/10 p-4 transition-colors hover:border-neon-blue/40"
              >
                <p className="font-display text-sm font-semibold text-white">{r.name}</p>
                <p className="mt-1 line-clamp-2 text-xs text-white/50">{r.description}</p>
                <div className="mt-3 flex items-center gap-3 text-xs text-white/40">
                  {r.primaryLanguage && (
                    <span className="flex items-center gap-1">
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: r.primaryLanguage.color }}
                      />
                      {r.primaryLanguage.name}
                    </span>
                  )}
                  <span>★ {r.stargazerCount}</span>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
