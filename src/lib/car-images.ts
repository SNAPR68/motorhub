/**
 * Local car images — stored in /public/cars/
 * All images are from Unsplash (free license)
 */

// Maruti Suzuki Swift
export const SWIFT = "/cars/swift.jpg";
// Hyundai Creta
export const CRETA = "/cars/creta.jpg";
// Tata Nexon
export const NEXON = "/cars/nexon.jpg";
// Tata Nexon EV
export const NEXON_EV = "/cars/nexon-ev.jpg";
// Mahindra XUV700
export const XUV700 = "/cars/xuv700.jpg";
// Toyota Fortuner
export const FORTUNER = "/cars/fortuner.jpg";
// Honda City (Sedan)
export const SEDAN = "/cars/sedan.jpg";
// Kia Seltos
export const KIA = "/cars/seltos.jpg";
// Maruti Suzuki Brezza
export const BREZZA = "/cars/brezza.jpg";

// Interior / dashboard (Unsplash — generic)
const U = (id: string, w = 800) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&q=80`;
export const INTERIOR = U("1503376780353-7e6692767b70");

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
