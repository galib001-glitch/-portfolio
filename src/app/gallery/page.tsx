import type { Metadata } from "next";
import SectionHeading from "@/components/ui/SectionHeading";
import MasonryGallery, { type GalleryImage } from "@/components/gallery/MasonryGallery";
import { readContent } from "@/lib/content";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "Gallery",
  description: "A visual look at events, labs and design work.",
};

export default async function GalleryPage() {
  const images = (await readContent<GalleryImage[]>("gallery")) ?? [];

  return (
    <div className="pt-32 pb-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <SectionHeading
          eyebrow="Gallery"
          title="Moments & workspaces"
          description="Events, workshops, lab sessions and design work — click any photo to expand."
          align="center"
        />
        <MasonryGallery images={images} />
      </div>
    </div>
  );
}
