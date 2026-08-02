import type { Metadata } from "next";
import SectionHeading from "@/components/ui/SectionHeading";
import AdminDashboard from "@/components/admin/AdminDashboard";
import { readContent } from "@/lib/content";
import type { Links } from "@/lib/types";
import defaultLinks from "@/data/links.json";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const links = (await readContent<Links>("links")) ?? (defaultLinks as Links);

  return (
    <div className="pt-32 pb-24">
      <div className="mx-auto max-w-6xl px-6 lg:px-10">
        <SectionHeading
          eyebrow="Admin"
          title="Content Dashboard"
          description="Upload projects, certificates, research papers, your CV and photos — no code changes required."
        />
        <AdminDashboard links={links} />
      </div>
    </div>
  );
}
