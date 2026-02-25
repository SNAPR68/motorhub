"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { MaterialIcon } from "@/components/MaterialIcon";

interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  max?: number;
  /** Index of the image marked as the 360° panoramic. undefined = unset. */
  panoramaImageIdx?: number | null;
  /** Called when the dealer taps the 360° badge to set/clear the panoramic image */
  onPanoramaChange?: (idx: number | null) => void;
}

export function ImageUploader({
  images,
  onChange,
  max = 10,
  panoramaImageIdx,
  onPanoramaChange,
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    if (images.length >= max) {
      setError(`Max ${max} images allowed`);
      return;
    }

    setUploading(true);
    setError(null);

    const toUpload = Array.from(files).slice(0, max - images.length);
    const uploaded: string[] = [];

    for (const file of toUpload) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error ?? "Upload failed");
        uploaded.push(json.url);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload failed");
      }
    }

    onChange([...images, ...uploaded]);
    setUploading(false);
  };

  const remove = (idx: number) => {
    const next = images.filter((_, i) => i !== idx);
    onChange(next);
    // If the removed image was the panoramic, clear the marker
    if (panoramaImageIdx === idx && onPanoramaChange) {
      onPanoramaChange(null);
    } else if (
      panoramaImageIdx !== null &&
      panoramaImageIdx !== undefined &&
      panoramaImageIdx > idx &&
      onPanoramaChange
    ) {
      // Shift the index down since an image before it was removed
      onPanoramaChange(panoramaImageIdx - 1);
    }
  };

  const togglePanorama = (idx: number) => {
    if (!onPanoramaChange) return;
    onPanoramaChange(panoramaImageIdx === idx ? null : idx);
  };

  const showPanoramaControls = typeof onPanoramaChange === "function";

  return (
    <div className="space-y-3">
      {/* Uploaded images grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {images.map((url, i) => {
            const isPanorama = panoramaImageIdx === i;
            return (
              <div key={url} className="relative aspect-square rounded-lg overflow-hidden group">
                <Image src={url} alt={`Photo ${i + 1}`} fill className="object-cover" sizes="120px" />

                {/* Remove button */}
                <button
                  type="button"
                  onClick={() => remove(i)}
                  className="absolute top-1 right-1 h-6 w-6 rounded-full bg-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
                >
                  <MaterialIcon name="close" className="text-[14px] text-white" />
                </button>

                {/* Cover badge (index 0) */}
                {i === 0 && (
                  <span
                    className="absolute bottom-1 left-1 rounded px-1.5 py-0.5 text-[9px] font-bold text-white z-10"
                    style={{ background: "rgba(17,82,212,0.85)" }}
                  >
                    Cover
                  </span>
                )}

                {/* 360° panorama toggle badge */}
                {showPanoramaControls && (
                  <button
                    type="button"
                    onClick={() => togglePanorama(i)}
                    title={isPanorama ? "Remove 360° marker" : "Mark as 360° panoramic"}
                    className="absolute top-1 left-1 rounded-lg px-1.5 py-0.5 text-[9px] font-black flex items-center gap-0.5 z-10 transition-all active:scale-95"
                    style={{
                      background: isPanorama
                        ? "rgba(19,127,236,0.92)"
                        : "rgba(0,0,0,0.55)",
                      border: isPanorama
                        ? "1px solid rgba(19,127,236,0.8)"
                        : "1px solid rgba(255,255,255,0.15)",
                      backdropFilter: "blur(4px)",
                      color: isPanorama ? "#fff" : "rgba(255,255,255,0.6)",
                    }}
                  >
                    <MaterialIcon name="360" className="text-[11px]" />
                    <span>360</span>
                  </button>
                )}

                {/* Active panorama glow ring */}
                {isPanorama && (
                  <div
                    className="absolute inset-0 rounded-lg pointer-events-none"
                    style={{ boxShadow: "inset 0 0 0 2px rgba(19,127,236,0.85)" }}
                  />
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Panorama hint */}
      {showPanoramaControls && images.length > 0 && (
        <p className="text-[10px] text-slate-500 flex items-center gap-1">
          <MaterialIcon name="360" className="text-[13px] text-slate-500" />
          Tap the <span className="font-bold text-slate-400">360</span> badge on any photo to mark it for the Virtual Tour.
        </p>
      )}

      {/* Upload button */}
      {images.length < max && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-full rounded-lg border-2 border-dashed py-4 flex flex-col items-center gap-2 transition-colors disabled:opacity-50"
          style={{ borderColor: "rgba(19,127,236,0.3)", background: "rgba(19,127,236,0.04)" }}
        >
          {uploading ? (
            <>
              <MaterialIcon name="hourglass_empty" className="text-[28px] text-[#137fec] animate-spin" />
              <span className="text-xs text-slate-400">Uploading...</span>
            </>
          ) : (
            <>
              <MaterialIcon name="add_photo_alternate" className="text-[28px] text-[#137fec]" />
              <span className="text-xs font-semibold text-slate-300">Add Photos</span>
              <span className="text-[10px] text-slate-500">{images.length}/{max} · JPEG, PNG, WebP · Max 10MB each</span>
            </>
          )}
        </button>
      )}

      {error && (
        <p className="text-xs text-red-400">{error}</p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
}
