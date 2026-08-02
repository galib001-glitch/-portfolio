"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  FiUser,
  FiShare2,
  FiFolder,
  FiBookOpen,
  FiUsers,
  FiAward,
  FiGithub,
  FiImage,
  FiCpu,
  FiEdit3,
  FiMessageSquare,
} from "react-icons/fi";
import SectionHeading from "@/components/ui/SectionHeading";

const ITEMS = [
  { href: "/about", label: "About", desc: "Background, education and experience.", icon: FiUser },
  { href: "/skills", label: "Skills", desc: "An interactive skill network.", icon: FiShare2 },
  { href: "/projects", label: "Projects", desc: "Hand-picked builds, pulled from GitHub.", icon: FiFolder },
  { href: "/research", label: "Research", desc: "Conference papers & applied research.", icon: FiBookOpen },
  { href: "/collaborations", label: "Collaborations", desc: "Running research work, and open slots to join.", icon: FiUsers },
  { href: "/certifications", label: "Certifications", desc: "Licenses & certifications from LinkedIn.", icon: FiAward },
  { href: "/github", label: "GitHub", desc: "Live activity, stars and contributions.", icon: FiGithub },
  { href: "/gallery", label: "Gallery", desc: "Events, workshops and design work.", icon: FiImage },
  { href: "/lab", label: "Lab", desc: "A virtual IoT + edge AI dashboard.", icon: FiCpu },
  { href: "/blog", label: "Blog", desc: "Writing on IoT, research and design.", icon: FiEdit3 },
  { href: "/contact", label: "Contact", desc: "Terminal-style contact console.", icon: FiMessageSquare },
];

export default function ExploreGrid() {
  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <SectionHeading eyebrow="Explore" title="Everything, in its own place" align="center" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {ITEMS.map((item, i) => (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.35, delay: i * 0.03 }}
            >
              <Link
                href={item.href}
                data-cursor="pointer"
                className="group flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.02] p-5 transition-colors hover:border-neon-blue/40 hover:bg-white/[0.04]"
              >
                <item.icon className="mb-3 text-xl text-neon-cyan" />
                <p className="font-display font-semibold text-white">{item.label}</p>
                <p className="mt-1 text-xs text-white/50">{item.desc}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
