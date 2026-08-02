"use client";

import type { ReactNode } from "react";
import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";
import CursorProvider from "@/components/providers/CursorProvider";
import AuroraBackground from "@/components/background/AuroraBackground";
import ParticleField from "@/components/background/ParticleField";
import Navbar from "@/components/nav/Navbar";
import Footer from "@/components/footer/Footer";
import type { Profile, Links } from "@/lib/types";

export default function AppShell({
  children,
  profile,
  links,
}: {
  children: ReactNode;
  profile: Profile;
  links: Links;
}) {
  return (
    <>
      <AuroraBackground />
      <ParticleField />
      <div className="noise-overlay" />
      <CursorProvider />
      <SmoothScrollProvider>
        <Navbar profile={profile} />
        <main className="relative z-10">{children}</main>
        <Footer profile={profile} links={links} />
      </SmoothScrollProvider>
    </>
  );
}
