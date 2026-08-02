"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { FiCpu, FiCloud, FiMonitor, FiWifi } from "react-icons/fi";

interface LabNode {
  id: string;
  label: string;
  sub: string;
  icon: typeof FiCpu;
  x: number;
  y: number;
  color: string;
}

const NODES: LabNode[] = [
  { id: "esp32", label: "ESP32", sub: "Sensor Node", icon: FiWifi, x: 8, y: 20, color: "#3ba7ff" },
  { id: "rpi", label: "Raspberry Pi", sub: "Edge Gateway", icon: FiCpu, x: 8, y: 75, color: "#22d3ee" },
  { id: "jetson", label: "Jetson", sub: "Inference Node", icon: FiCpu, x: 50, y: 50, color: "#a855f7" },
  { id: "cloud", label: "Cloud", sub: "Storage & Compute", icon: FiCloud, x: 88, y: 20, color: "#f472b6" },
  { id: "dashboard", label: "Dashboard", sub: "Live Telemetry", icon: FiMonitor, x: 88, y: 78, color: "#facc15" },
];

const LINKS: [string, string][] = [
  ["esp32", "jetson"],
  ["rpi", "jetson"],
  ["jetson", "cloud"],
  ["jetson", "dashboard"],
  ["cloud", "dashboard"],
];

function useMetric(base: number, jitter: number) {
  const [value, setValue] = useState(base);
  useEffect(() => {
    const id = setInterval(() => {
      setValue(Math.max(0, base + (Math.random() - 0.5) * jitter));
    }, 1400);
    return () => clearInterval(id);
  }, [base, jitter]);
  return value;
}

export default function LabDashboard() {
  const temp = useMetric(27.4, 1.2);
  const humidity = useMetric(58, 4);
  const latency = useMetric(42, 12);
  const throughput = useMetric(3.2, 0.6);
  const svgRef = useRef<SVGSVGElement>(null);

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.4fr_1fr]">
      <div className="glass relative overflow-hidden rounded-2xl border border-white/10 p-4">
        <svg ref={svgRef} viewBox="0 0 100 100" className="h-[420px] w-full">
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="0.8" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {LINKS.map(([a, b], i) => {
            const na = NODES.find((n) => n.id === a)!;
            const nb = NODES.find((n) => n.id === b)!;
            return (
              <g key={i}>
                <line
                  x1={na.x}
                  y1={na.y}
                  x2={nb.x}
                  y2={nb.y}
                  stroke="rgba(255,255,255,0.12)"
                  strokeWidth={0.4}
                />
                <circle r={0.8} fill={na.color} filter="url(#glow)">
                  <animateMotion
                    dur={`${2.4 + (i % 3) * 0.6}s`}
                    repeatCount="indefinite"
                    path={`M${na.x},${na.y} L${nb.x},${nb.y}`}
                  />
                </circle>
              </g>
            );
          })}

          {NODES.map((n) => (
            <g key={n.id}>
              <circle cx={n.x} cy={n.y} r={5.4} fill="#0b1120" stroke={n.color} strokeWidth={0.5} />
              <circle cx={n.x} cy={n.y} r={7.2} fill="none" stroke={n.color} strokeOpacity={0.25} strokeWidth={0.4}>
                <animate attributeName="r" values="5.5;9;5.5" dur="3s" repeatCount="indefinite" />
                <animate attributeName="stroke-opacity" values="0.35;0;0.35" dur="3s" repeatCount="indefinite" />
              </circle>
              <text x={n.x} y={n.y + 9.5} textAnchor="middle" fontSize={3} fill="white" opacity={0.85}>
                {n.label}
              </text>
              <text x={n.x} y={n.y + 13} textAnchor="middle" fontSize={2.2} fill="white" opacity={0.4}>
                {n.sub}
              </text>
            </g>
          ))}
        </svg>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {[
          { label: "Temperature", value: `${temp.toFixed(1)}°C`, color: "#3ba7ff" },
          { label: "Humidity", value: `${humidity.toFixed(0)}%`, color: "#22d3ee" },
          { label: "Edge Latency", value: `${latency.toFixed(0)}ms`, color: "#a855f7" },
          { label: "Throughput", value: `${throughput.toFixed(1)} Mb/s`, color: "#facc15" },
        ].map((m) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass rounded-xl border border-white/10 p-4"
          >
            <p className="text-xs text-white/40">{m.label}</p>
            <p className="font-display mt-1 text-2xl font-semibold" style={{ color: m.color }}>
              {m.value}
            </p>
          </motion.div>
        ))}
        <div className="glass col-span-2 rounded-xl border border-white/10 p-4 text-xs leading-relaxed text-white/40">
          Simulated telemetry from a distributed edge network — ESP32 sensor nodes feed a Raspberry Pi
          gateway, which streams to a Jetson inference node for on-device AI, syncing results to the cloud
          and a live dashboard. Wire this panel to a real MQTT/WebSocket feed to visualize live hardware.
        </div>
      </div>
    </div>
  );
}
