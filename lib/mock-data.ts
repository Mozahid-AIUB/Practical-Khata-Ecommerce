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

export const categories: Category[] = [
  { id: "c1", name: { en: "SSC Practical Khata", bn: "SSC প্র্যাকটিক্যাল খাতা" }, slug: "ssc-khata" },
  { id: "c2", name: { en: "HSC Practical Khata", bn: "HSC প্র্যাকটিক্যাল খাতা" }, slug: "hsc-khata" },
  { id: "c3", name: { en: "Full Package & Assignments", bn: "ফুল প্যাকেজ ও অ্যাসাইনমেন্ট" }, slug: "full-set" },
];

// Prices per practicalkhata.pro.bd (2026 batch offer): Physics/Chemistry/
// Higher Math ৳310 per paper, Biology ৳385 (1st) / ৳465 (2nd), ICT ৳350,
// Agriculture ৳350, PCMB+ICT full package ৳3,060 (was ৳4,500).
export const products: Product[] = [
  // --- SSC (single-paper subjects) ---
  { id: "s1", name: { en: "Physics", bn: "পদার্থবিজ্ঞান" }, slug: "ssc-physics", priceMin: 310, priceMax: null, subject: "physics", level: "ssc", paper: null, soldOut: false, category: "ssc-khata" },
  { id: "s2", name: { en: "Chemistry", bn: "রসায়ন" }, slug: "ssc-chemistry", priceMin: 310, priceMax: null, subject: "chemistry", level: "ssc", paper: null, soldOut: false, category: "ssc-khata" },
  { id: "s3", name: { en: "Biology", bn: "জীববিজ্ঞান" }, slug: "ssc-biology", priceMin: 385, priceMax: null, subject: "biology", level: "ssc", paper: null, soldOut: false, category: "ssc-khata" },
  { id: "s4", name: { en: "Higher Math", bn: "উচ্চতর গণিত" }, slug: "ssc-higher-math", priceMin: 310, priceMax: null, subject: "math", level: "ssc", paper: null, soldOut: false, category: "ssc-khata" },
  { id: "s5", name: { en: "ICT", bn: "আইসিটি" }, slug: "ssc-ict", priceMin: 350, priceMax: null, subject: "ict", level: "ssc", paper: null, soldOut: false, category: "ssc-khata" },
  { id: "s6", name: { en: "Agriculture Studies", bn: "কৃষিশিক্ষা" }, slug: "ssc-agriculture", priceMin: 350, priceMax: null, subject: "agriculture", level: "ssc", paper: null, soldOut: false, category: "ssc-khata" },

  // --- HSC (two papers per subject) ---
  { id: "h1", name: { en: "Physics 1st Paper", bn: "পদার্থবিজ্ঞান ১ম পত্র" }, slug: "hsc-physics-1", priceMin: 310, priceMax: null, subject: "physics", level: "hsc", paper: 1, soldOut: false, category: "hsc-khata" },
  { id: "h2", name: { en: "Physics 2nd Paper", bn: "পদার্থবিজ্ঞান ২য় পত্র" }, slug: "hsc-physics-2", priceMin: 310, priceMax: null, subject: "physics", level: "hsc", paper: 2, soldOut: false, category: "hsc-khata" },
  { id: "h3", name: { en: "Chemistry 1st Paper", bn: "রসায়ন ১ম পত্র" }, slug: "hsc-chemistry-1", priceMin: 310, priceMax: null, subject: "chemistry", level: "hsc", paper: 1, soldOut: false, category: "hsc-khata" },
  { id: "h4", name: { en: "Chemistry 2nd Paper", bn: "রসায়ন ২য় পত্র" }, slug: "hsc-chemistry-2", priceMin: 310, priceMax: null, subject: "chemistry", level: "hsc", paper: 2, soldOut: false, category: "hsc-khata" },
  { id: "h5", name: { en: "Biology 1st Paper", bn: "জীববিজ্ঞান ১ম পত্র" }, slug: "hsc-biology-1", priceMin: 385, priceMax: null, subject: "biology", level: "hsc", paper: 1, soldOut: false, category: "hsc-khata" },
  { id: "h6", name: { en: "Biology 2nd Paper", bn: "জীববিজ্ঞান ২য় পত্র" }, slug: "hsc-biology-2", priceMin: 465, priceMax: null, subject: "biology", level: "hsc", paper: 2, soldOut: false, category: "hsc-khata" },
  { id: "h7", name: { en: "Higher Math 1st Paper", bn: "উচ্চতর গণিত ১ম পত্র" }, slug: "hsc-math-1", priceMin: 310, priceMax: null, subject: "math", level: "hsc", paper: 1, soldOut: false, category: "hsc-khata" },
  { id: "h8", name: { en: "Higher Math 2nd Paper", bn: "উচ্চতর গণিত ২য় পত্র" }, slug: "hsc-math-2", priceMin: 310, priceMax: null, subject: "math", level: "hsc", paper: 2, soldOut: false, category: "hsc-khata" },
  { id: "h9", name: { en: "ICT", bn: "আইসিটি" }, slug: "hsc-ict", priceMin: 350, priceMax: null, subject: "ict", level: "hsc", paper: null, soldOut: false, category: "hsc-khata" },
  { id: "h10", name: { en: "Agriculture Studies", bn: "কৃষিশিক্ষা" }, slug: "hsc-agriculture", priceMin: 350, priceMax: null, subject: "agriculture", level: "hsc", paper: null, soldOut: false, category: "hsc-khata" },

  // --- Full package & assignments ---
  { id: "f1", name: { en: "PCMB + ICT Full Package (Practical + Drawing)", bn: "PCMB + ICT ফুল প্যাকেজ (প্র্যাকটিক্যাল + ড্রয়িং)" }, slug: "full-package-pcmb-ict", priceMin: 3060, priceMax: null, originalPrice: 4500, subject: "bundle", level: null, paper: null, soldOut: false, category: "full-set" },
  { id: "f2", name: { en: "Handwritten Assignment", bn: "হাতে লেখা অ্যাসাইনমেন্ট" }, slug: "assignment", priceMin: 700, priceMax: null, subject: "assignment", level: null, paper: null, soldOut: false, category: "full-set" },
  { id: "f3", name: { en: "Custom Order (Any Khata)", bn: "কাস্টম অর্ডার (যেকোনো খাতা)" }, slug: "custom-order", priceMin: 310, priceMax: 465, subject: "assignment", level: null, paper: null, soldOut: false, category: "full-set" },
];

export function getTopSellers(): Product[] {
  const ids = ["h1", "h3", "h5", "f1"];
  return products.filter((p) => ids.includes(p.id));
}

export function getCategories(): Category[] {
  return categories;
}

export function getProductsByCategory(categorySlug: string): Product[] {
  return products.filter((p) => p.category === categorySlug);
}
