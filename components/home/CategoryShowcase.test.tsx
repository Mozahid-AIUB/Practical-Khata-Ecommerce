import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { NextIntlClientProvider } from "next-intl";
import { CategoryShowcase } from "./CategoryShowcase";
import { CartProvider } from "@/components/cart/CartContext";
import type { Category, Product } from "@/lib/mock-data";

vi.mock("@/lib/api", () => ({
  getCart: vi.fn().mockResolvedValue({ id: 0, items: [], totalPrice: 0 }),
  addCartItem: vi.fn(),
  updateCartItem: vi.fn(),
  removeCartItem: vi.fn(),
}));

const messages = {
  sections: {
    viewAll: "View all",
    loadMore: "Load more khata",
    tabAll: "All",
    tabFirst: "1st Paper",
    tabSecond: "2nd Paper",
  },
  product: { addToCart: "Add to cart", outOfStock: "Out of stock", soldOut: "Sold out", ssc: "SSC", hsc: "HSC" },
};

const hscCategory: Category = {
  id: "c2",
  name: { en: "HSC Practical Khata", bn: "HSC প্র্যাকটিক্যাল খাতা" },
  slug: "hsc-khata",
};

const sscCategory: Category = {
  id: "c1",
  name: { en: "SSC Practical Khata", bn: "SSC প্র্যাকটিক্যাল খাতা" },
  slug: "ssc-khata",
};

const hscProducts: Product[] = [
  { id: "h1", name: { en: "Physics 1st Paper", bn: "পদার্থবিজ্ঞান ১ম পত্র" }, slug: "hsc-physics-1", priceMin: 310, priceMax: null, subject: "physics", level: "hsc", paper: 1, soldOut: false, category: "hsc-khata" },
  { id: "h2", name: { en: "Physics 2nd Paper", bn: "পদার্থবিজ্ঞান ২য় পত্র" }, slug: "hsc-physics-2", priceMin: 310, priceMax: null, subject: "physics", level: "hsc", paper: 2, soldOut: false, category: "hsc-khata" },
];

const sscProducts: Product[] = [
  { id: "s1", name: { en: "Physics", bn: "পদার্থবিজ্ঞান" }, slug: "ssc-physics", priceMin: 310, priceMax: null, subject: "physics", level: "ssc", paper: null, soldOut: false, category: "ssc-khata" },
];

function renderWith(locale: string, category: Category, products: Product[]) {
  return render(
    <NextIntlClientProvider locale={locale} messages={messages}>
      <CartProvider>
        <CategoryShowcase category={category} products={products} />
      </CartProvider>
    </NextIntlClientProvider>,
  );
}

describe("CategoryShowcase", () => {
  it("renders the English category heading", () => {
    renderWith("en", hscCategory, hscProducts);
    expect(screen.getByRole("heading", { name: "HSC Practical Khata" })).toBeInTheDocument();
  });

  it("renders the Bengali heading under bn locale", () => {
    renderWith("bn", hscCategory, hscProducts);
    expect(screen.getByRole("heading", { name: "HSC প্র্যাকটিক্যাল খাতা" })).toBeInTheDocument();
  });

  it("renders products from that category", () => {
    renderWith("en", hscCategory, hscProducts);
    expect(screen.getByText("Physics 1st Paper")).toBeInTheDocument();
    expect(screen.getByText("Physics 2nd Paper")).toBeInTheDocument();
  });

  it("shows paper tabs for HSC (two-paper subjects)", () => {
    renderWith("en", hscCategory, hscProducts);
    expect(screen.getByRole("button", { name: "1st Paper" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "2nd Paper" })).toBeInTheDocument();
  });

  it("hides paper tabs for SSC (single-paper subjects)", () => {
    renderWith("en", sscCategory, sscProducts);
    expect(screen.queryByRole("button", { name: "1st Paper" })).not.toBeInTheDocument();
  });
});
