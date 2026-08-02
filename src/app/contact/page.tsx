import type { Metadata } from "next";
import SectionHeading from "@/components/ui/SectionHeading";
import Terminal from "@/components/contact/Terminal";
import { readContent } from "@/lib/content";
import type { Profile, Links } from "@/lib/types";
import defaultProfile from "@/data/profile.json";
import defaultLinks from "@/data/links.json";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch through the terminal-style contact console.",
};

export default async function ContactPage() {
  const profile = (await readContent<Profile>("profile")) ?? (defaultProfile as Profile);
  const links = (await readContent<Links>("links")) ?? (defaultLinks as Links);

  return (
    <div className="pt-32 pb-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <SectionHeading
          eyebrow="Contact"
          title="Let's talk"
          description="Type 'help' in the terminal below, or run 'contact' to send a message directly."
          align="center"
        />
        <Terminal profile={profile} links={links} />
      </div>
    </div>
  );
}
