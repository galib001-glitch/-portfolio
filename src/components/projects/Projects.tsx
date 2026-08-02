"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { FiSearch, FiGithub } from "react-icons/fi";
import SectionHeading from "@/components/ui/SectionHeading";
import ProjectCard from "./ProjectCard";
import projectsData from "@/data/manual-projects.json";
import type { ManualProject } from "@/lib/types";

export default function Projects() {
  const projects = projectsData as ManualProject[];
  const [query, setQuery] = useState("");
  const [language, setLanguage] = useState<string>("All");

  const languages = useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => p.languages?.forEach((l) => set.add(l)));
    return ["All", ...Array.from(set)];
  }, [projects]);

  const matches = (p: ManualProject) => {
    const matchesQuery =
      query.trim() === "" ||
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.description.toLowerCase().includes(query.toLowerCase());
    const matchesLang = language === "All" || p.languages?.includes(language);
    return matchesQuery && matchesLang;
  };

  const featured = useMemo(() => projects.filter((p) => p.category === "featured" && matches(p)), [projects, query, language]);
  const practice = useMemo(() => projects.filter((p) => p.category === "practice" && matches(p)), [projects, query, language]);

  return (
    <section id="projects" className="relative py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <SectionHeading
          eyebrow="Projects"
          title="Things I've built"
          description="Hand-picked from my GitHub, with the details that matter — what each one does, how it's built, and a link straight to the source."
        />

        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-xs">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search projects…"
              className="w-full rounded-full border border-white/10 bg-white/[0.04] py-2.5 pl-11 pr-4 text-sm text-white placeholder:text-white/30 outline-none transition-colors focus:border-neon-blue/50"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {languages.map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                data-cursor="pointer"
                className={`rounded-full border px-4 py-1.5 text-xs transition-colors ${
                  language === lang
                    ? "border-neon-blue bg-neon-blue/15 text-neon-blue"
                    : "border-white/10 bg-white/[0.03] text-white/50 hover:border-white/20"
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>

        {featured.length === 0 && practice.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-12 text-center text-white/40">
            No projects match your search.
          </div>
        ) : (
          <>
            {featured.length > 0 && (
              <motion.div layout className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {featured.map((p) => (
                  <motion.div
                    key={p.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.4 }}
                  >
                    <ProjectCard project={{ source: "manual", data: p }} />
                  </motion.div>
                ))}
              </motion.div>
            )}

            {practice.length > 0 && (
              <div className="mt-14">
                <h3 className="font-display mb-5 text-sm uppercase tracking-[0.2em] text-white/40">
                  Practice & problem solving
                </h3>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {practice.map((p) => (
                    <motion.a
                      key={p.id}
                      href={p.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      data-cursor="pointer"
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-40px" }}
                      transition={{ duration: 0.3 }}
                      className="group flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/[0.02] px-5 py-4 transition-colors hover:border-neon-blue/30"
                    >
                      <div>
                        <p className="font-medium text-white">{p.name}</p>
                        <p className="mt-0.5 text-xs text-white/50">{p.description}</p>
                      </div>
                      <div className="flex shrink-0 items-center gap-3 text-white/40 group-hover:text-neon-cyan">
                        {p.languages?.[0] && (
                          <span className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-0.5 text-[11px]">
                            {p.languages[0]}
                          </span>
                        )}
                        <FiGithub />
                      </div>
                    </motion.a>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
