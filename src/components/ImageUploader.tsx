"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { MaterialIcon } from "@/components/MaterialIcon";

interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  max?: number;
}

export function ImageUploader({ images, onChange, max = 10 }: ImageUploaderProps) {
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
    onChange(images.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-3">
      {/* Uploaded images grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {images.map((url, i) => (
            <div key={url} className="relative aspect-square rounded-lg overflow-hidden group">
              <Image src={url} alt={`Photo ${i + 1}`} fill className="object-cover" sizes="120px" />
              <button
                type="button"
                onClick={() => remove(i)}
                className="absolute top-1 right-1 h-6 w-6 rounded-full bg-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MaterialIcon name="close" className="text-[14px] text-white" />
              </button>
              {i === 0 && (
                <span className="absolute bottom-1 left-1 rounded px-1.5 py-0.5 text-[9px] font-bold text-white" style={{ background: "rgba(17,82,212,0.85)" }}>
                  Cover
                </span>
              )}
            </div>
          ))}
        </div>
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
