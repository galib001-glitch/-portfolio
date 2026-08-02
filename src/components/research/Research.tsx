import SectionHeading from "@/components/ui/SectionHeading";
import PaperCard from "./PaperCard";
import { readContent } from "@/lib/content";
import type { ResearchPaper } from "@/lib/types";
import defaultResearch from "@/data/research.json";

export default async function Research() {
  const papers = (await readContent<ResearchPaper[]>("research")) ?? (defaultResearch as ResearchPaper[]);

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
