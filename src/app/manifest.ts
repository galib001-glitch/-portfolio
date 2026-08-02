import type { MetadataRoute } from "next";
import { readContent } from "@/lib/content";
import type { Profile } from "@/lib/types";
import defaultProfile from "@/data/profile.json";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const profile = (await readContent<Profile>("profile")) ?? (defaultProfile as Profile);
  return {
    name: profile.name,
    short_name: profile.shortName,
    description: profile.tagline,
    start_url: "/",
    display: "standalone",
    background_color: "#05060a",
    theme_color: "#05060a",
    icons: [
      { src: "/favicon.ico", sizes: "any", type: "image/x-icon" },
    ],
  };
}
