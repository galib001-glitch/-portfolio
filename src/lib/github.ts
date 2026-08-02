import type { GithubRepo } from "./types";

const GITHUB_API = "https://api.github.com";

function authHeaders(): HeadersInit {
  const headers: HeadersInit = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  return headers;
}

export async function getRepos(username: string): Promise<GithubRepo[]> {
  try {
    const res = await fetch(
      `${GITHUB_API}/users/${username}/repos?per_page=100&sort=updated`,
      {
        headers: authHeaders(),
        next: { revalidate: 3600 },
      }
    );
    if (!res.ok) return [];
    const repos: GithubRepo[] = await res.json();
    return repos
      .filter((r) => !r.fork && !r.archived)
      .sort((a, b) => new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime());
  } catch {
    return [];
  }
}

export async function getReadme(repoFullName: string): Promise<string | null> {
  try {
    const res = await fetch(`${GITHUB_API}/repos/${repoFullName}/readme`, {
      headers: { ...authHeaders(), Accept: "application/vnd.github.raw+json" },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const text = await res.text();
    return text;
  } catch {
    return null;
  }
}

export interface GithubProfileStats {
  followers: number;
  following: number;
  public_repos: number;
  avatar_url: string;
  bio: string | null;
  name: string | null;
  html_url: string;
}

export async function getProfileStats(username: string): Promise<GithubProfileStats | null> {
  try {
    const res = await fetch(`${GITHUB_API}/users/${username}`, {
      headers: authHeaders(),
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}
