"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { FiLinkedin } from "react-icons/fi";
import SectionHeading from "@/components/ui/SectionHeading";
import CertCard from "./CertCard";
import certifications from "@/data/certifications.json";
import links from "@/data/links.json";
import type { Certification } from "@/lib/types";

export default function Certifications() {
  const certs = certifications as Certification[];
  const [category, setCategory] = useState<string>("All");

  const categories = useMemo(() => {
    const set = new Set<string>();
    certs.forEach((c) => set.add(c.category));
    return ["All", ...Array.from(set)];
  }, [certs]);

  const filtered = useMemo(
    () => (category === "All" ? certs : certs.filter((c) => c.category === category)),
    [certs, category]
  );

  return (
    <section id="certifications" className="relative py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <SectionHeading
          eyebrow="Certifications"
          title="Licenses & certifications"
          description={`${certs.length} credentials earned across cybersecurity, digital marketing and applied AI — sourced from my LinkedIn profile.`}
        />

        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                data-cursor="pointer"
                className={`rounded-full border px-4 py-1.5 text-xs transition-colors ${
                  category === cat
                    ? "border-neon-blue bg-neon-blue/15 text-neon-blue"
                    : "border-white/10 bg-white/[0.03] text-white/50 hover:border-white/20"
                }`}
              >
                {cat}
                {cat !== "All" && (
                  <span className="ml-1.5 text-white/30">
                    {certs.filter((c) => c.category === cat).length}
                  </span>
                )}
              </button>
            ))}
          </div>

          <a
            href={`${links.linkedin}/details/certifications/`}
            target="_blank"
            rel="noreferrer"
            data-cursor="pointer"
            className="flex shrink-0 items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 text-xs text-white/60 hover:border-neon-blue/40 hover:text-neon-cyan"
          >
            <FiLinkedin /> View all on LinkedIn
          </a>
        </div>

        <motion.div layout className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c) => (
            <motion.div
              key={c.id}
              layout
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.35 }}
            >
              <CertCard cert={c} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
