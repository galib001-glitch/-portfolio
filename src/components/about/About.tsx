import Image from "next/image";
import { FiMapPin, FiMail } from "react-icons/fi";
import SectionHeading from "@/components/ui/SectionHeading";
import GlassCard from "@/components/ui/GlassCard";
import Timeline from "./Timeline";
import { readContent } from "@/lib/content";
import type { Profile, EducationItem, ExperienceItem, AchievementItem } from "@/lib/types";
import defaultProfile from "@/data/profile.json";
import defaultEducation from "@/data/education.json";
import defaultExperience from "@/data/experience.json";
import defaultAchievements from "@/data/achievements.json";

export default async function About() {
  const profile = (await readContent<Profile>("profile")) ?? (defaultProfile as Profile);
  const education = (await readContent<EducationItem[]>("education")) ?? defaultEducation;
  const experience = (await readContent<ExperienceItem[]>("experience")) ?? defaultExperience;
  const achievements = (await readContent<AchievementItem[]>("achievements")) ?? defaultAchievements;

  return (
    <section id="about" className="relative py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <SectionHeading
          eyebrow="About"
          title="Engineer, researcher, and builder"
          description={profile.bio}
        />

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.7fr_1fr_1fr]">
          <div className="space-y-4">
            <div className="glass-strong overflow-hidden rounded-2xl border border-white/10 p-2">
              <div className="relative aspect-[4/5] overflow-hidden rounded-xl">
                <Image
                  src={profile.avatar}
                  alt={profile.name}
                  fill
                  sizes="(max-width: 1024px) 90vw, 320px"
                  className="object-cover"
                />
              </div>
            </div>
            <div className="space-y-2 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-white/60">
              <p className="flex items-center gap-2">
                <FiMapPin className="shrink-0 text-neon-cyan" /> {profile.location}
              </p>
              <p className="flex items-center gap-2">
                <FiMail className="shrink-0 text-neon-cyan" /> {profile.email}
              </p>
            </div>
          </div>

          <Timeline education={education} experience={experience} />

          <div className="space-y-6">
            <GlassCard>
              <h3 className="font-display mb-4 text-lg font-semibold text-white">Achievements & Activities</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {achievements.map((a) => (
                  <div key={a.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                    <p className="font-mono-term text-xs text-neon-cyan">{a.year}</p>
                    <p className="mt-1 font-medium text-white">{a.title}</p>
                    <p className="text-xs text-white/50">{a.org}</p>
                    <p className="mt-2 text-xs text-white/50">{a.detail}</p>
                  </div>
                ))}
              </div>
            </GlassCard>

            <GlassCard>
              <h3 className="font-display mb-4 text-lg font-semibold text-white">Languages</h3>
              <div className="flex flex-wrap gap-3">
                {profile.languages.map((l) => (
                  <span
                    key={l.name}
                    className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 text-sm text-white/70"
                  >
                    {l.name} <span className="text-white/30">·</span> {l.level}
                  </span>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </section>
  );
}
