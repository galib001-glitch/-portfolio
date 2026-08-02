import type { Metadata } from "next";
import SectionHeading from "@/components/ui/SectionHeading";
import LabDashboard from "@/components/lab/LabDashboard";

export const metadata: Metadata = {
  title: "Research Lab",
  description: "A virtual IoT + edge AI laboratory dashboard.",
};

export default function LabPage() {
  return (
    <div className="pt-32 pb-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <SectionHeading
          eyebrow="Research Lab"
          title="Virtual IoT + Edge AI Lab"
          description="ESP32 sensor nodes, a Raspberry Pi gateway, a Jetson inference node and cloud dashboard, visualized as a live network."
          align="center"
        />
        <LabDashboard />
      </div>
    </div>
  );
}
