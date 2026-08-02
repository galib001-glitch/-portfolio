import type { Metadata } from "next";
import "./globals.css";
import AppShell from "@/components/AppShell";
import profile from "@/data/profile.json";
import links from "@/data/links.json";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://galib-portfolio.vercel.app";

export const metadata: Metadata = {
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
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
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
