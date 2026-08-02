"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, useScroll, useSpring } from "framer-motion";
import { FiMenu, FiX, FiLock } from "react-icons/fi";
import ShareButton from "@/components/ui/ShareButton";
import type { Profile } from "@/lib/types";

const SECTION_LINKS = [
  { href: "/about", label: "About" },
  { href: "/skills", label: "Skills" },
  { href: "/projects", label: "Projects" },
  { href: "/research", label: "Research" },
  { href: "/collaborations", label: "Collaborations" },
  { href: "/certifications", label: "Certs" },
];

const PAGE_LINKS = [
  { href: "/gallery", label: "Gallery" },
  { href: "/lab", label: "Lab" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar({ profile }: { profile: Profile }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <motion.div
        className="fixed left-0 right-0 top-0 z-50 h-[2px] origin-left bg-gradient-to-r from-neon-blue via-neon-purple to-neon-cyan"
        style={{ scaleX: progress }}
      />
      <header
        className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${
          scrolled ? "backdrop-blur-xl bg-black/40 border-b border-white/10" : ""
        }`}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
          <Link href="/" className="font-display text-lg font-semibold tracking-tight text-white" data-cursor="pointer">
            Home
          </Link>

          <div className="hidden items-center gap-6 lg:flex">
            {[...SECTION_LINKS, ...PAGE_LINKS].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-sm text-white/60 transition-colors hover:text-white"
                data-cursor="pointer"
              >
                {l.label}
              </Link>
            ))}
            <ShareButton profile={profile} />
            <Link
              href="/admin"
              aria-label="Admin"
              data-cursor="pointer"
              className="flex items-center justify-center rounded-full border border-white/10 bg-white/[0.03] p-2 text-white/50 transition-colors hover:border-neon-cyan/40 hover:text-neon-cyan"
            >
              <FiLock size={14} />
            </Link>
          </div>

          <div className="flex items-center gap-3 lg:hidden">
            <ShareButton profile={profile} />
            <Link
              href="/admin"
              aria-label="Admin"
              className="flex items-center justify-center rounded-full border border-white/10 bg-white/[0.03] p-2 text-white/50 hover:text-neon-cyan"
            >
              <FiLock size={14} />
            </Link>
            <button className="text-white" onClick={() => setOpen((o) => !o)} aria-label="Toggle menu">
              {open ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>
          </div>
        </nav>

        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="glass-strong mx-4 mb-4 rounded-2xl border border-white/10 p-4 lg:hidden"
          >
            <div className="flex flex-col gap-3">
              {[...SECTION_LINKS, ...PAGE_LINKS].map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm text-white/70 hover:bg-white/5 hover:text-white"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </header>
    </>
  );
}
