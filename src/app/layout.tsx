import type { Metadata } from "next";
import "./globals.css";
import AppShell from "@/components/AppShell";
import { readContent } from "@/lib/content";
import type { Profile, Links } from "@/lib/types";
import defaultProfile from "@/data/profile.json";
import defaultLinks from "@/data/links.json";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://galib-portfolio.vercel.app";

export async function generateMetadata(): Promise<Metadata> {
  const profile = (await readContent<Profile>("profile")) ?? (defaultProfile as Profile);
  const links = (await readContent<Links>("links")) ?? (defaultLinks as Links);

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: `${profile.name} — ${profile.title}`,
      template: `%s — ${profile.shortName}`,
    },
    description: profile.tagline,
    keywords: ["Abdullah Al Galib Tonmoy", "portfolio", "IoT", "software engineer", "research", "BAUST"],
    authors: [{ name: profile.name, url: links.github }],
    openGraph: {
      title: `${profile.name} — ${profile.title}`,
      description: profile.tagline,
      url: siteUrl,
      siteName: profile.name,
      type: "website",
      images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${profile.name} — ${profile.title}`,
      description: profile.tagline,
      images: ["/opengraph-image"],
    },
    robots: { index: true, follow: true },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const profile = (await readContent<Profile>("profile")) ?? (defaultProfile as Profile);
  const links = (await readContent<Links>("links")) ?? (defaultLinks as Links);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    jobTitle: profile.title,
    description: profile.tagline,
    email: profile.email,
    address: profile.location,
    url: siteUrl,
    sameAs: [links.github, links.linkedin, links.facebook],
  };

  return (
    <html lang="en" className="dark">
      <body className="antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <AppShell profile={profile} links={links}>{children}</AppShell>
      </body>
    </html>
  );
}
