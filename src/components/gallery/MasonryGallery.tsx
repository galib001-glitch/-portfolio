"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Lightbox from "./Lightbox";
import galleryData from "@/data/gallery.json";

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  height: number;
}

export default function MasonryGallery() {
  const images = galleryData as GalleryImage[];
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <>
      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
        {images.map((img, i) => (
          <motion.button
            key={img.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: (i % 6) * 0.05 }}
            onClick={() => setActiveIndex(i)}
            data-cursor="pointer"
            className="group relative block w-full overflow-hidden rounded-2xl border border-white/10"
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- masonry tiles use variable, admin-uploaded image dimensions unknown at build time */}
            <img
              src={img.src}
              alt={img.alt}
              className="w-full transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/70 via-transparent to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <span className="text-sm text-white">{img.alt}</span>
            </div>
          </motion.button>
        ))}
      </div>

      {activeIndex !== null && (
        <Lightbox
          images={images}
          index={activeIndex}
          onClose={() => setActiveIndex(null)}
          onNavigate={setActiveIndex}
        />
      )}
    </>
  );
}
