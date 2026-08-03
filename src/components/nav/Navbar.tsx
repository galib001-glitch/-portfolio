"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import { FiMenu, FiX, FiLock } from "react-icons/fi";
import ShareButton from "@/components/ui/ShareButton";
import { cn } from "@/lib/utils";
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
        className={cn(
          "fixed inset-x-0 top-0 z-40 border-b transition-all duration-300",
          // Mobile always keeps a legible glass backdrop — a fully transparent
          // bar over scrolling content was unreadable on small screens.
          "border-white/10 bg-black/60 backdrop-blur-lg",
          "lg:border-transparent lg:bg-transparent lg:backdrop-blur-none",
          scrolled && "bg-black/75 backdrop-blur-xl lg:border-white/10 lg:bg-black/40 lg:backdrop-blur-xl"
        )}
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
            <motion.button
              className="text-white"
              onClick={() => setOpen((o) => !o)}
              aria-label="Toggle menu"
              whileTap={{ scale: 0.9 }}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={open ? "close" : "menu"}
                  initial={{ opacity: 0, rotate: -45 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 45 }}
                  transition={{ duration: 0.15 }}
                  className="flex"
                >
                  {open ? <FiX size={22} /> : <FiMenu size={22} />}
                </motion.span>
              </AnimatePresence>
            </motion.button>
          </div>
        </nav>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="mx-4 mb-4 overflow-hidden rounded-2xl border border-white/10 lg:hidden"
            >
              <div className="glass-strong flex flex-col gap-1 p-3">
                {[...SECTION_LINKS, ...PAGE_LINKS].map((l, i) => (
                  <motion.div
                    key={l.href}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.25, delay: 0.03 * i }}
                  >
                    <Link
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className="block rounded-lg px-3 py-2.5 text-sm text-white/70 transition-colors hover:bg-white/5 hover:text-white active:bg-white/10"
                    >
                      {l.label}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
