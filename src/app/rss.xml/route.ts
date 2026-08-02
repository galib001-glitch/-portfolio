import { NextResponse } from "next/server";
import { getAllPosts } from "@/lib/blog";
import { readContent } from "@/lib/content";
import type { Profile } from "@/lib/types";
import defaultProfile from "@/data/profile.json";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://galib-portfolio.vercel.app";

function escapeXml(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const posts = await getAllPosts();
  const profile = (await readContent<Profile>("profile")) ?? (defaultProfile as Profile);

  const items = posts
    .map(
      (p) => `
    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${siteUrl}/blog/${p.slug}</link>
      <guid>${siteUrl}/blog/${p.slug}</guid>
      <pubDate>${new Date(p.date).toUTCString()}</pubDate>
      <description>${escapeXml(p.excerpt)}</description>
    </item>`
    )
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(profile.name)} — Blog</title>
    <link>${siteUrl}/blog</link>
    <description>${escapeXml(profile.tagline)}</description>
    ${items}
  </channel>
</rss>`;

  return new NextResponse(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
