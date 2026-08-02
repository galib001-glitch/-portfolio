import type { Metadata } from "next";
import Projects from "@/components/projects/Projects";
import CircuitBackground from "@/components/background/CircuitBackground";

export const metadata: Metadata = {
  title: "Projects",
  description: "Hand-picked projects from my GitHub, with details on how each one works.",
};

export default function ProjectsPage() {
  return (
    <div className="pt-24">
      <CircuitBackground />
      <Projects />
    </div>
  );
}
