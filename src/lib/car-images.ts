/**
 * Actual Indian car images — matched to each model
 * Sources: Wikimedia Commons (CC BY-SA/CC BY), Unsplash
 */

// Maruti Suzuki Swift — India (Wikimedia)
export const SWIFT = "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/2018_Maruti_Suzuki_Swift_%28India%29_front_8.6.18.jpg/960px-2018_Maruti_Suzuki_Swift_%28India%29_front_8.6.18.jpg";
// Hyundai Creta — India (Wikimedia)
export const CRETA = "https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Hyundai_Creta_India.jpg/960px-Hyundai_Creta_India.jpg";
// Tata Nexon 2023 — India (Wikimedia)
export const NEXON = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Tata_Nexon_2023_Rear_View_2.jpg/960px-Tata_Nexon_2023_Rear_View_2.jpg";
// Tata Nexon EV — India (Wikimedia) — for EV listings
export const NEXON_EV = "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/2020_Tata_Nexon_EV_%28India%29_front_view.png/960px-2020_Tata_Nexon_EV_%28India%29_front_view.png";
// Mahindra XUV700 AX7 — India (Wikimedia)
export const XUV700 = "https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/2021_Mahindra_XUV700_2.2_AX7_%28India%29_front_view.png/960px-2021_Mahindra_XUV700_2.2_AX7_%28India%29_front_view.png";
// Toyota Fortuner — India (Wikimedia)
export const FORTUNER = "https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Toyota_Fortuners.jpg/960px-Toyota_Fortuners.jpg";
// Honda City 6th gen — India (Wikimedia)
export const SEDAN = "https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/0_Honda_City_%286th_generation%29.jpg/960px-0_Honda_City_%286th_generation%29.jpg";
// Kia Seltos 2024 — Kerala, India (Wikimedia)
export const KIA = "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Kia_Seltos_2024_2.jpg/960px-Kia_Seltos_2024_2.jpg";
// Maruti Suzuki Brezza ZXi+ — India (Wikimedia)
export const BREZZA = "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/2022_Maruti_Suzuki_Vitara_Brezza_1.5_ZXi%2B_%28India%29_front_view.png/960px-2022_Maruti_Suzuki_Vitara_Brezza_1.5_ZXi%2B_%28India%29_front_view.png";

// Interior / dashboard (Unsplash — generic)
const U = (id: string, w = 800) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&q=80`;
export const INTERIOR = U("1503376780353-7e6692767b70");

/** Returns resized URL for different use cases */
export function resizeUrl(url: string, width: number): string {
  if (url.includes("unsplash.com")) return url.replace(/w=\d+/, `w=${width}`);
  if (url.includes("wikimedia.org")) return url.replace(/\d+px-/, `${width}px-`);
  return url;
}
/** Hero full-bleed backgrounds (1920px) */
export const toHeroUrl = (url: string) => resizeUrl(url, 1920);

export const INDIAN_CARS = [CRETA, SWIFT, NEXON, XUV700, FORTUNER, SEDAN] as const;
export const HERO_CARS = [SWIFT, CRETA, NEXON] as const;

/** Tiny neutral placeholder for next/image blur loading */
export const BLUR_DATA_URL =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAADCAIAAAA7ljmRAAAADklEQVQIW2N4y8BQDwAEcAF/cB+sOQAAAABJRU5ErkJggg==";
