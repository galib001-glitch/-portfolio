"use client";

import { useEffect, useState } from "react";
import { FiImage, FiTrash2, FiRefreshCw } from "react-icons/fi";
import type { GalleryImage } from "@/components/gallery/MasonryGallery";

export default function PhotoUploader({ password }: { password: string }) {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [alt, setAlt] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/photos");
      const json = await res.json();
      setImages(json.ok ? json.data : []);
    } catch {
      setStatus("Failed to load gallery.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setStatus("Uploading…");
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("alt", alt || file.name);
      form.append("password", password);
      const res = await fetch("/api/admin/photos", { method: "POST", body: form });
      const json = await res.json();
      setStatus(json.ok ? "Uploaded." : json.error ?? "Upload failed.");
      if (json.ok) {
        setAlt("");
        await load();
      }
    } catch {
      setStatus("Network error during upload.");
    } finally {
      setBusy(false);
    }
  }

  async function removePhoto(id: string) {
    setDeletingId(id);
    setStatus(null);
    try {
      const res = await fetch("/api/admin/photos", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, password }),
      });
      const json = await res.json();
      if (json.ok) {
        setImages((prev) => prev.filter((img) => img.id !== id));
      } else {
        setStatus(json.error ?? "Failed to remove photo.");
      }
    } catch {
      setStatus("Network error while removing photo.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="glass rounded-2xl border border-white/10 p-5">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-display text-base font-semibold text-white">
          Gallery Photos <span className="text-xs font-normal text-white/30">({images.length})</span>
        </h3>
        <button
          onClick={load}
          className="flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 text-xs text-white/60 hover:border-neon-cyan/40"
        >
          <FiRefreshCw /> Reload
        </button>
      </div>

      {loading ? (
        <p className="text-xs text-white/40">Loading…</p>
      ) : images.length === 0 ? (
        <p className="mb-4 text-xs text-white/30">No photos yet — upload one below.</p>
      ) : (
        <div className="mb-4 grid grid-cols-3 gap-2 sm:grid-cols-4">
          {images.map((img) => (
            <div key={img.id} className="group relative overflow-hidden rounded-lg border border-white/10">
              {/* eslint-disable-next-line @next/next/no-img-element -- admin thumbnail grid, sizes unknown */}
              <img src={img.src} alt={img.alt} className="aspect-square w-full object-cover" />
              <button
                onClick={() => removePhoto(img.id)}
                disabled={deletingId === img.id}
                aria-label={`Remove ${img.alt}`}
                className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/70 text-white/70 opacity-0 transition-opacity hover:bg-red-500/80 hover:text-white group-hover:opacity-100 disabled:opacity-50"
              >
                <FiTrash2 size={12} />
              </button>
              <p className="truncate bg-black/60 px-1.5 py-1 text-[10px] text-white/60">{img.alt}</p>
            </div>
          ))}
        </div>
      )}

      <div className="border-t border-white/10 pt-4">
        <input
          value={alt}
          onChange={(e) => setAlt(e.target.value)}
          placeholder="Caption / alt text"
          className="mb-3 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none focus:border-neon-blue/40"
        />
        <label className="flex cursor-pointer items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white/70 hover:border-neon-cyan/40">
          <FiImage />
          {busy ? "Uploading…" : "Choose photo"}
          <input type="file" accept="image/*" className="hidden" onChange={onFileChange} disabled={busy} />
        </label>
      </div>
      {status && <p className="mt-3 text-xs text-white/50">{status}</p>}
    </div>
  );
}
