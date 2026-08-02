import type { Metadata } from "next";
import About from "@/components/about/About";
import OrbitBackground from "@/components/background/OrbitBackground";

export const metadata: Metadata = {
  title: "About",
  description: "Engineer, researcher, and builder — background, education and experience.",
};

export default function AboutPage() {
  return (
    <div className="pt-24">
      <OrbitBackground />
      <About />
    </div>
  );
}
