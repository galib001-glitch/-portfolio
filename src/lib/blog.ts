import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

export interface BlogPostMeta {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  category: string;
  tags: string[];
  cover?: string;
}

export interface BlogPost extends BlogPostMeta {
  content: string;
}

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

export async function getAllPosts(): Promise<BlogPostMeta[]> {
  try {
    const files = await fs.readdir(BLOG_DIR);
    const posts = await Promise.all(
      files
        .filter((f) => f.endsWith(".mdx"))
        .map(async (file) => {
          const raw = await fs.readFile(path.join(BLOG_DIR, file), "utf-8");
          const { data } = matter(raw);
          return {
            slug: file.replace(/\.mdx$/, ""),
            title: data.title ?? file,
            date: data.date ?? "",
            excerpt: data.excerpt ?? "",
            category: data.category ?? "General",
            tags: data.tags ?? [],
            cover: data.cover ?? undefined,
          } as BlogPostMeta;
        })
    );
    return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch {
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const raw = await fs.readFile(path.join(BLOG_DIR, `${slug}.mdx`), "utf-8");
    const { data, content } = matter(raw);
    return {
      slug,
      title: data.title ?? slug,
      date: data.date ?? "",
      excerpt: data.excerpt ?? "",
      category: data.category ?? "General",
      tags: data.tags ?? [],
      cover: data.cover ?? undefined,
      content,
    };
  } catch {
    return null;
  }
}
