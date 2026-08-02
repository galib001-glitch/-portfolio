import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { getAllPosts, getPostBySlug } from "@/lib/blog";
import { formatDate } from "@/lib/utils";

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  return { title: post.title, description: post.excerpt };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  return (
    <article className="pt-32 pb-24">
      <div className="mx-auto max-w-3xl px-6 lg:px-10">
        <Link href="/blog" className="mb-8 inline-flex items-center gap-2 text-sm text-white/50 hover:text-neon-cyan">
          <FiArrowLeft /> Back to blog
        </Link>
        <div className="mb-3 flex items-center gap-3 text-xs text-white/40">
          <span className="rounded-full border border-neon-purple/30 bg-neon-purple/10 px-3 py-0.5 text-neon-purple">
            {post.category}
          </span>
          <span>{formatDate(post.date)}</span>
        </div>
        <h1 className="font-display mb-8 text-4xl font-bold text-white sm:text-5xl">{post.title}</h1>
        <div className="prose prose-invert prose-headings:font-display max-w-none prose-a:text-neon-cyan">
          <MDXRemote
            source={post.content}
            options={{
              mdxOptions: {
                remarkPlugins: [remarkGfm],
                rehypePlugins: [rehypeSlug, rehypeHighlight],
              },
            }}
          />
        </div>
      </div>
    </article>
  );
}
