import type { Metadata } from "next";
import SectionHeading from "@/components/ui/SectionHeading";
import Terminal from "@/components/contact/Terminal";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch through the terminal-style contact console.",
};

export default function ContactPage() {
  return (
    <div className="pt-32 pb-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <SectionHeading
          eyebrow="Contact"
          title="Let's talk"
          description="Type 'help' in the terminal below, or run 'contact' to send a message directly."
          align="center"
        />
        <Terminal />
      </div>
    </div>
  );
}
