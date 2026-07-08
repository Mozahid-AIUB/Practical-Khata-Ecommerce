export type Localized = { en: string; bn: string };

/** subject drives the cover art (color + icon) on product cards */
export type Subject =
  | "physics"
  | "chemistry"
  | "biology"
  | "math"
  | "ict"
  | "agriculture"
  | "bundle"
  | "assignment";

export type Product = {
  id: string;
  name: Localized;
  slug: string;
  priceMin: number;
  priceMax: number | null;
  /** original (pre-discount) price; when set and > priceMin, a discount is shown */
  originalPrice?: number | null;
  subject: Subject;
  level: "ssc" | "hsc" | null;
  /** board paper number — used by the ১ম/২য় পত্র filter tabs */
  paper: 1 | 2 | null;
  /** most-sold subjects get a badge on the cover */
  bestSeller?: boolean;
  soldOut: boolean;
  category: string;
};

/** discount % from original→current, or null if no discount */
export function discountPercent(p: Product): number | null {
  if (!p.originalPrice || p.originalPrice <= p.priceMin) return null;
  return Math.round((1 - p.priceMin / p.originalPrice) * 100);
}

export type Category = {
  id: string;
  name: Localized;
  slug: string;
};
