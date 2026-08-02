import type { Metadata } from "next";
import Collaborations from "@/components/collaborations/Collaborations";
import ConvergeBackground from "@/components/background/ConvergeBackground";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "Collaborations",
  description: "Research collaborations that are currently running, and which ones are open to new members.",
};

export default function CollaborationsPage() {
  return (
    <div className="pt-24">
      <ConvergeBackground />
      <Collaborations />
    </div>
  );
}
