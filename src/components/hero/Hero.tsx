"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import { FiArrowDown, FiGithub, FiDownload } from "react-icons/fi";
import MagneticButton from "@/components/ui/MagneticButton";
import TypingRoles from "./TypingRoles";
import type { Profile, Links } from "@/lib/types";

const GlobeScene = dynamic(() => import("./GlobeScene"), { ssr: false });

const letterVariants: Variants = {
  hidden: { y: "110%" },
  visible: (i: number) => ({
    y: "0%",
    transition: { duration: 0.7, delay: 0.3 + i * 0.035, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

export default function Hero({ profile, links }: { profile: Profile; links: Links }) {
  const name = profile.name;

  return (
    <section id="home" className="relative flex min-h-[100svh] items-center overflow-hidden pt-28 pb-20">
      <div className="absolute inset-0 -z-0">
        <GlobeScene />
      </div>
      <div className="absolute inset-0 -z-0 bg-gradient-to-b from-transparent via-transparent to-[#05060a]" />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 gap-10 px-6 lg:grid-cols-[1.6fr_0.8fr] lg:px-10">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="font-mono-term mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs uppercase tracking-[0.3em] text-white/60"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            {profile.availability}
          </motion.div>

          <h1
            className="font-display flex flex-nowrap whitespace-nowrap font-bold leading-[1.05] tracking-tight text-white"
            style={{ fontSize: "clamp(1.6rem, 4.1vw, 3.75rem)" }}
          >
            {name.split("").map((char, i) => (
              <span key={i} className="overflow-hidden">
                <motion.span
                  custom={i}
                  variants={letterVariants}
                  initial="hidden"
                  animate="visible"
                  className="inline-block text-gradient"
                >
                  {char === " " ? " " : char}
                </motion.span>
              </span>
            ))}
          </h1>

          <div className="mt-6 h-8 text-xl sm:text-2xl">
            <TypingRoles roles={profile.roles} />
          </div>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.6 }}
            className="mt-6 max-w-xl text-base text-white/60 sm:text-lg"
          >
            {profile.tagline}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 0.6 }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <MagneticButton as="a" href="/projects" className="bg-white text-black hover:bg-white/90">
              View Projects <FiArrowDown className="transition-transform group-hover:translate-y-0.5" />
            </MagneticButton>
            <MagneticButton as="a" href={profile.resumeUrl}>
              Download CV <FiDownload />
            </MagneticButton>
            <MagneticButton as="a" href={links.github}>
              <FiGithub /> GitHub
            </MagneticButton>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative mx-auto w-full max-w-sm lg:mx-0"
        >
          <div className="absolute inset-0 -z-10 rounded-[2rem] bg-gradient-to-br from-neon-blue/30 via-neon-purple/20 to-neon-cyan/30 blur-2xl" />
          <div className="glass-strong relative overflow-hidden rounded-[2rem] border border-white/10 p-3">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem]">
              <Image
                src={profile.avatar}
                alt={profile.name}
                fill
                priority
                sizes="(max-width: 1024px) 90vw, 400px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.2, duration: 0.5 }}
            className="font-mono-term glass-strong absolute -bottom-4 -left-4 rounded-xl border border-white/10 px-4 py-2 text-xs text-white/70 shadow-lg"
          >
            <span className="text-neon-cyan">{"//"}</span> {profile.location}
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-white/40"
      >
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.8 }}>
          <FiArrowDown size={18} />
        </motion.div>
      </motion.div>
    </section>
  );
}
