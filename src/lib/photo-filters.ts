/**
 * Client-side photo filters — brightness, contrast, saturation, presets
 * Used by AI Photo Studio for real-time preview and export
 */

export interface FilterValues {
  brightness: number; // 0-200, 100 = neutral
  contrast: number;   // 0-200, 100 = neutral
  saturation: number; // 0-200, 100 = neutral
  hue?: number;       // -180 to 180 (degrees)
}

export const PRESETS: Record<string, FilterValues> = {
  natural: { brightness: 100, contrast: 100, saturation: 100 },
  vivid:   { brightness: 105, contrast: 115, saturation: 130 },
  cinema:  { brightness: 95, contrast: 120, saturation: 90, hue: -5 },
  matte:   { brightness: 100, contrast: 85, saturation: 75 },
  golden:  { brightness: 108, contrast: 105, saturation: 110, hue: 15 },
  midnight:{ brightness: 85, contrast: 115, saturation: 95, hue: -15 },
};

function clamp(x: number, min: number, max: number) {
  return Math.min(Math.max(x, min), max);
}

/** Apply CSS filter string from FilterValues */
export function toCssFilter(f: FilterValues): string {
  const parts: string[] = [];
  parts.push(`brightness(${(f.brightness / 100).toFixed(2)})`);
  parts.push(`contrast(${(f.contrast / 100).toFixed(2)})`);
  parts.push(`saturate(${(f.saturation / 100).toFixed(2)})`);
  if (f.hue != null) parts.push(`hue-rotate(${f.hue}deg)`);
  return parts.join(" ");
}

/** Apply filters to canvas and return data URL */
export async function applyFiltersToCanvas(
  imageUrl: string,
  filters: FilterValues
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Could not get canvas context"));
        return;
      }
      ctx.filter = toCssFilter(filters);
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = imageUrl;
  });
}

/** Composite transparent car over gradient background */
export async function compositeWithBackground(
  carImageUrl: string,  // PNG with transparent bg (from rembg)
  gradient: string = "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)"
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Could not get canvas context"));
        return;
      }
      // Draw gradient background
      const g = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      g.addColorStop(0, "#1a1a2e");
      g.addColorStop(0.5, "#16213e");
      g.addColorStop(1, "#0f3460");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      // Draw car on top (preserves alpha)
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = carImageUrl;
  });
}
