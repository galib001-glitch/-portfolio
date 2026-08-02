"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiSearch } from "react-icons/fi";
import { formatDate } from "@/lib/utils";
import type { BlogPostMeta } from "@/lib/blog";

export default function BlogList({ posts }: { posts: BlogPostMeta[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  const categories = useMemo(() => ["All", ...new Set(posts.map((p) => p.category))], [posts]);

  const filtered = useMemo(() => {
    return posts.filter((p) => {
      const matchesQuery =
        query.trim() === "" ||
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        p.excerpt.toLowerCase().includes(query.toLowerCase());
      const matchesCategory = category === "All" || p.category === category;
      return matchesQuery && matchesCategory;
    });
  }, [posts, query, category]);

  return (
    <div>
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search posts…"
            className="w-full rounded-full border border-white/10 bg-white/[0.04] py-2.5 pl-11 pr-4 text-sm text-white placeholder:text-white/30 outline-none focus:border-neon-blue/50"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`rounded-full border px-4 py-1.5 text-xs transition-colors ${
                category === c
                  ? "border-neon-blue bg-neon-blue/15 text-neon-blue"
                  : "border-white/10 bg-white/[0.03] text-white/50"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-12 text-center text-white/40">
          No posts yet — add .mdx files to <code>content/blog</code> to publish here.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {filtered.map((p, i) => (
            <motion.div
              key={p.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: (i % 4) * 0.05 }}
            >
              <Link
                href={`/blog/${p.slug}`}
                className="glass block h-full rounded-2xl border border-white/10 p-6 transition-colors hover:border-neon-blue/40"
              >
                <div className="mb-3 flex items-center gap-3 text-xs text-white/40">
                  <span className="rounded-full border border-neon-purple/30 bg-neon-purple/10 px-3 py-0.5 text-neon-purple">
                    {p.category}
                  </span>
                  <span>{formatDate(p.date)}</span>
                </div>
                <h3 className="font-display mb-2 text-lg font-semibold text-white">{p.title}</h3>
                <p className="text-sm text-white/60">{p.excerpt}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
