import { ImageResponse } from "next/og";
import { readContent } from "@/lib/content";
import type { Profile } from "@/lib/types";
import defaultProfile from "@/data/profile.json";

export const alt = `${defaultProfile.name} — ${defaultProfile.title}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage() {
  const profile = (await readContent<Profile>("profile")) ?? (defaultProfile as Profile);
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #05060a 0%, #0b1120 60%, #130a2a 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
          <div style={{ width: 12, height: 12, borderRadius: 999, background: "#22d3ee" }} />
          <span style={{ fontSize: 22, color: "#67e8f9", letterSpacing: 4 }}>PORTFOLIO</span>
        </div>
        <div style={{ fontSize: 68, fontWeight: 700, lineHeight: 1.1, display: "flex" }}>{profile.name}</div>
        <div style={{ fontSize: 32, color: "#93c5fd", marginTop: 20, display: "flex" }}>{profile.title}</div>
        <div style={{ fontSize: 24, color: "rgba(255,255,255,0.5)", marginTop: 28, maxWidth: 900, display: "flex" }}>
          {profile.tagline}
        </div>
      </div>
    ),
    { ...size }
  );
}
