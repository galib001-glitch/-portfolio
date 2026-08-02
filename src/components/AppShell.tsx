"use client";

import { useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import BootSequence from "@/components/boot/BootSequence";
import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";
import CursorProvider from "@/components/providers/CursorProvider";
import AuroraBackground from "@/components/background/AuroraBackground";
import ParticleField from "@/components/background/ParticleField";
import Navbar from "@/components/nav/Navbar";
import Footer from "@/components/footer/Footer";

export default function AppShell({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);

  return (
    <>
      <BootSequence onDone={() => setReady(true)} />
      <AuroraBackground />
      <ParticleField />
      <div className="noise-overlay" />
      <CursorProvider />
      <SmoothScrollProvider>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: ready ? 1 : 0 }}
          transition={{ duration: 0.8 }}
        >
          <Navbar />
          <main className="relative z-10">{children}</main>
          <Footer />
        </motion.div>
      </SmoothScrollProvider>
    </>
  );
}
