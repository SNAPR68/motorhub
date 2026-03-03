/**
 * Local car images — stored in /public/cars/
 * Sources: Unsplash (free license), Wikimedia Commons (CC license)
 */

// Maruti Suzuki
export const SWIFT = "/cars/swift.jpg";
export const BREZZA = "/cars/brezza.jpg";
export const ERTIGA = "/cars/ertiga.jpg";

// Hyundai
export const CRETA = "/cars/creta.jpg";
export const I20 = "/cars/i20.jpg";

// Tata Motors
export const NEXON = "/cars/nexon.jpg";
export const NEXON_EV = "/cars/nexon-ev.jpg";
export const PUNCH = "/cars/punch.jpg";

// Mahindra
export const XUV700 = "/cars/xuv700.jpg";
export const THAR = "/cars/thar.jpg";

// Toyota
export const FORTUNER = "/cars/fortuner.jpg";
export const HYRYDER = "/cars/hyryder.jpg";

// Honda
export const SEDAN = "/cars/sedan.jpg";

// Kia
export const KIA = "/cars/seltos.jpg";
export const SONET = "/cars/sonet.jpg";

// MG Motor
export const HECTOR = "/cars/hector.jpg";

// Interior / dashboard placeholder
export const INTERIOR = "/cars/creta.jpg";

/** Returns resized URL for different use cases */
export function resizeUrl(url: string, width: number): string {
  if (url.includes("unsplash.com")) return url.replace(/w=\d+/, `w=${width}`);
  return url;
}
/** Hero full-bleed backgrounds (1920px) */
export const toHeroUrl = (url: string) => resizeUrl(url, 1920);

export const INDIAN_CARS = [CRETA, SWIFT, NEXON, XUV700, FORTUNER, SEDAN] as const;
export const HERO_CARS = [SWIFT, CRETA, NEXON] as const;

/** Tiny neutral placeholder for next/image blur loading */
export const BLUR_DATA_URL =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAADCAIAAAA7ljmRAAAADklEQVQIW2N4y8BQDwAEcAF/cB+sOQAAAABJRU5ErkJggg==";
