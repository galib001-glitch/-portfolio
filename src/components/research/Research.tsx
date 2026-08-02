import SectionHeading from "@/components/ui/SectionHeading";
import PaperCard from "./PaperCard";
import research from "@/data/research.json";
import type { ResearchPaper } from "@/lib/types";

export default function Research() {
  const papers = research as ResearchPaper[];

  return (
    <section id="research" className="relative py-28">
      <div className="mx-auto max-w-5xl px-6 lg:px-10">
        <SectionHeading
          eyebrow="Research"
          title="Published & ongoing research"
          description="Conference papers, journal work, and applied research at the intersection of IoT and embedded healthcare systems."
        />
        <div className="space-y-6">
          {papers.map((p, i) => (
            <PaperCard key={p.id} paper={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
