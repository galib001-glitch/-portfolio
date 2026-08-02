import Link from "next/link";
import { FiActivity, FiUserPlus, FiArrowRight } from "react-icons/fi";
import SectionHeading from "@/components/ui/SectionHeading";
import GlassCard from "@/components/ui/GlassCard";
import JoinRequestForm from "./JoinRequestForm";
import collaborations from "@/data/collaborations.json";
import research from "@/data/research.json";
import type { Collaboration, ResearchPaper } from "@/lib/types";

const items = collaborations as Collaboration[];
const researchIds = new Set((research as ResearchPaper[]).map((r) => r.id));

export default function Collaborations() {
  const running = items.filter((c) => c.status === "running");
  const open = items.filter((c) => c.status === "open");

  return (
    <section className="relative py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <SectionHeading
          eyebrow="Collaborations"
          title="Research collaborations"
          description="What's currently running, and where there's room for someone new to join."
          align="center"
        />

        <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-white">
          <FiActivity className="text-emerald-400" /> Running
        </div>
        <div className="mb-14 grid grid-cols-1 gap-5 lg:grid-cols-2">
          {running.map((c) => (
            <GlassCard key={c.id} className="relative">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-300">
                  Running
                </span>
                <span className="font-mono-term text-xs text-white/40">{c.area}</span>
              </div>
              <h3 className="font-display mb-2 text-lg font-semibold text-white">{c.title}</h3>
              <p className="mb-4 text-sm text-white/60">{c.description}</p>
              <div className="flex flex-wrap items-center gap-3 text-xs text-white/40">
                {c.role && <span>{c.role}</span>}
                {c.since && <span>· Since {c.since}</span>}
              </div>
              {c.relatedResearchId && researchIds.has(c.relatedResearchId) && (
                <Link
                  href="/research"
                  className="mt-4 inline-flex items-center gap-1.5 text-xs text-neon-cyan hover:underline"
                >
                  View research paper <FiArrowRight />
                </Link>
              )}
            </GlassCard>
          ))}
        </div>

        <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-white">
          <FiUserPlus className="text-neon-blue" /> Open for collaboration
        </div>
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {open.map((c) => (
            <GlassCard key={c.id} strong className="relative border-neon-blue/20">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-neon-blue/30 bg-neon-blue/10 px-3 py-1 text-xs text-neon-blue">
                  Open — looking for members
                </span>
                <span className="font-mono-term text-xs text-white/40">{c.area}</span>
              </div>
              <h3 className="font-display mb-2 text-lg font-semibold text-white">{c.title}</h3>
              <p className="mb-4 text-sm text-white/60">{c.description}</p>
              {c.seekingRoles && c.seekingRoles.length > 0 && (
                <div className="mb-5 flex flex-wrap gap-1.5">
                  {c.seekingRoles.map((r) => (
                    <span
                      key={r}
                      className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-0.5 text-xs text-white/50"
                    >
                      {r}
                    </span>
                  ))}
                </div>
              )}
              <JoinRequestForm collaborationTitle={c.title} />
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}
