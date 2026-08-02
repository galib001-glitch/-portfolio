import type { Metadata } from "next";
import Certifications from "@/components/certifications/Certifications";
import SparkleBackground from "@/components/background/SparkleBackground";
import { readContent } from "@/lib/content";
import type { Certification, Links } from "@/lib/types";
import defaultCertifications from "@/data/certifications.json";
import defaultLinks from "@/data/links.json";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "Certifications",
  description: "Licenses & certifications earned across cybersecurity, marketing and applied AI.",
};

export default async function CertificationsPage() {
  const certs = (await readContent<Certification[]>("certifications")) ?? defaultCertifications;
  const links = (await readContent<Links>("links")) ?? (defaultLinks as Links);

  return (
    <div className="pt-24">
      <SparkleBackground />
      <Certifications certs={certs} links={links} />
    </div>
  );
}
