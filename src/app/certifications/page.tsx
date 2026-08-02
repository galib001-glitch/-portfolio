import type { Metadata } from "next";
import Certifications from "@/components/certifications/Certifications";
import SparkleBackground from "@/components/background/SparkleBackground";

export const metadata: Metadata = {
  title: "Certifications",
  description: "Licenses & certifications earned across cybersecurity, marketing and applied AI.",
};

export default function CertificationsPage() {
  return (
    <div className="pt-24">
      <SparkleBackground />
      <Certifications />
    </div>
  );
}
