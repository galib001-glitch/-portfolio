# Abdullah Al Galib Tonmoy — Portfolio

An interactive, cinematic portfolio built with Next.js 15, React 19, TypeScript, Tailwind CSS 4,
Framer Motion, GSAP, Three.js / React Three Fiber, and Lenis smooth scroll.

## Getting started

```bash
npm install
npm run dev
```

Visit http://localhost:3000. First load plays a boot sequence + tunnel transition (skipped on
repeat visits within the same browser session).

## Environment variables

Copy `.env.example` to `.env.local` and fill in as needed:

- `NEXT_PUBLIC_SITE_URL` — used for SEO metadata, sitemap and RSS feed.
- `GITHUB_TOKEN` — optional. Enables the live contribution graph and pinned repos via the GitHub
  GraphQL API (Settings → Developer settings → Personal access tokens, scopes: `public_repo`,
  `read:user`). Without it, the Projects section still pulls live repos via the public REST API,
  but the contributions graph section shows a setup hint instead.
- `ADMIN_PASSWORD` — required to unlock `/admin`, the no-code content dashboard.

## Content model

Structured content lives in `src/data/*.json` (profile, links, education, experience,
achievements, certifications, research, skills, manual-projects) and is editable through
`/admin` without touching code. Blog posts are MDX files in `content/blog`.

GitHub projects are pulled live from `github.com/galib001-glitch` via the REST API
(`src/lib/github.ts`) and merged with `src/data/manual-projects.json` for work that isn't hosted
on GitHub (desktop apps, etc).

**Note on `/admin` persistence:** the admin dashboard writes directly to the JSON files in
`src/data` and to `public/`. This works great for local development and for traditional
always-on servers. On serverless platforms (Vercel, Netlify Functions), the filesystem is
read-only at runtime, so admin edits won't persist across deploys/instances — swap the functions
in `src/lib/content.ts` for calls to a database or headless CMS to make edits persistent in that
kind of deployment.

## LinkedIn data

LinkedIn blocks live scraping, so the `/admin` LinkedIn Import panel expects a JSON payload you
export or curate yourself (LinkedIn: Settings & Privacy → Get a copy of your data), reshaped to
`{ experience: [], education: [], certifications: [], skills: [] }`. Paste it in and optionally
merge it into the site's structured content.

## Deploying

Optimized for Vercel — connect the repo and set the environment variables above. The GitHub
Projects and stats sections work with zero configuration since they hit GitHub's public API
directly; add `GITHUB_TOKEN` for the contribution graph and pinned repos.

## Tech stack

Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Framer Motion · GSAP ·
Three.js / React Three Fiber / Drei · Lenis · react-icons · next-mdx-remote · pdf-parse
