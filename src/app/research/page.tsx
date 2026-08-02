import type { Metadata } from "next";
import Research from "@/components/research/Research";
import DataOrbitBackground from "@/components/background/DataOrbitBackground";

export const metadata: Metadata = {
  title: "Research",
  description: "Conference papers, journal work and applied research.",
};

export default function ResearchPage() {
  return (
    <div className="pt-24">
      <DataOrbitBackground />
      <Research />
    </div>
  );
}
