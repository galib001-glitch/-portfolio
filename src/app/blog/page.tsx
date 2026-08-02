import type { Metadata } from "next";
import SectionHeading from "@/components/ui/SectionHeading";
import BlogList from "@/components/blog/BlogList";
import { getAllPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog",
  description: "Notes on research, engineering and design.",
};

export default async function BlogPage() {
  const posts = await getAllPosts();
  return (
    <div className="pt-32 pb-24">
      <div className="mx-auto max-w-6xl px-6 lg:px-10">
        <SectionHeading
          eyebrow="Blog"
          title="Writing"
          description="Notes on research, engineering, and design — written between projects."
          align="center"
        />
        <BlogList posts={posts} />
      </div>
    </div>
  );
}
