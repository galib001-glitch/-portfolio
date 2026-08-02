import type { Metadata } from "next";
import SectionHeading from "@/components/ui/SectionHeading";
import MasonryGallery from "@/components/gallery/MasonryGallery";

export const metadata: Metadata = {
  title: "Gallery",
  description: "A visual look at events, labs and design work.",
};

export default function GalleryPage() {
  return (
    <div className="pt-32 pb-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <SectionHeading
          eyebrow="Gallery"
          title="Moments & workspaces"
          description="Events, workshops, lab sessions and design work — click any photo to expand."
          align="center"
        />
        <MasonryGallery />
      </div>
    </div>
  );
}
