import type { Metadata } from "next";
import Projects from "@/components/projects/Projects";
import CircuitBackground from "@/components/background/CircuitBackground";
import { readContent } from "@/lib/content";
import type { ManualProject } from "@/lib/types";
import defaultProjects from "@/data/manual-projects.json";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "Projects",
  description: "Hand-picked projects from my GitHub, with details on how each one works.",
};

export default async function ProjectsPage() {
  const projects = (await readContent<ManualProject[]>("manual-projects")) ?? (defaultProjects as ManualProject[]);

  return (
    <div className="pt-24">
      <CircuitBackground />
      <Projects projects={projects} />
    </div>
  );
}
