import Link from "next/link";
import { FiGithub, FiLinkedin, FiFacebook, FiMail } from "react-icons/fi";
import profile from "@/data/profile.json";
import links from "@/data/links.json";

export default function Footer() {
  return (
    <footer className="relative border-t border-white/10 py-14">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-center">
          <div>
            <p className="font-display text-lg font-semibold text-white">{profile.name}</p>
            <p className="mt-1 text-sm text-white/40">{profile.location}</p>
          </div>
          <div className="flex items-center gap-5 text-white/50">
            <a href={links.github} target="_blank" rel="noreferrer" aria-label="GitHub" className="hover:text-neon-cyan">
              <FiGithub size={20} />
            </a>
            <a href={links.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="hover:text-neon-cyan">
              <FiLinkedin size={20} />
            </a>
            <a href={links.facebook} target="_blank" rel="noreferrer" aria-label="Facebook" className="hover:text-neon-cyan">
              <FiFacebook size={20} />
            </a>
            <a href={links.email} aria-label="Email" className="hover:text-neon-cyan">
              <FiMail size={20} />
            </a>
          </div>
        </div>
        <div className="mt-10 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs text-white/30 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {profile.name}. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/admin" className="hover:text-white/60">Admin</Link>
            <Link href="/blog" className="hover:text-white/60">Blog</Link>
            <Link href="/contact" className="hover:text-white/60">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
