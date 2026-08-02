"use client";

import { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import type { GalleryImage } from "./MasonryGallery";

export default function Lightbox({
  images,
  index,
  onClose,
  onNavigate,
}: {
  images: GalleryImage[];
  index: number;
  onClose: () => void;
  onNavigate: (i: number) => void;
}) {
  const total = images.length;

  const next = useCallback(() => onNavigate((index + 1) % total), [index, total, onNavigate]);
  const prev = useCallback(() => onNavigate((index - 1 + total) % total), [index, total, onNavigate]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev, onClose]);

  const img = images[index];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[90] flex items-center justify-center bg-black/90 backdrop-blur-md"
        onClick={onClose}
      >
        <button
          onClick={onClose}
          className="absolute right-6 top-6 text-white/60 hover:text-white"
          aria-label="Close"
        >
          <FiX size={28} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            prev();
          }}
          className="absolute left-4 text-white/50 hover:text-white sm:left-10"
          aria-label="Previous"
        >
          <FiChevronLeft size={32} />
        </button>
        <motion.img
          key={img.id}
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.25 }}
          src={img.src}
          alt={img.alt}
          onClick={(e) => e.stopPropagation()}
          className="max-h-[80vh] max-w-[85vw] rounded-xl border border-white/10 object-contain shadow-2xl"
        />
        <button
          onClick={(e) => {
            e.stopPropagation();
            next();
          }}
          className="absolute right-4 text-white/50 hover:text-white sm:right-10"
          aria-label="Next"
        >
          <FiChevronRight size={32} />
        </button>
        <p className="absolute bottom-8 left-1/2 -translate-x-1/2 text-sm text-white/50">{img.alt}</p>
      </motion.div>
    </AnimatePresence>
  );
}
