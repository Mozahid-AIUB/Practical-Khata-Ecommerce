import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { NextIntlClientProvider } from "next-intl";
import { ProductCard } from "./ProductCard";
import { CartProvider } from "@/components/cart/CartContext";
import type { Product } from "@/lib/mock-data";

vi.mock("@/lib/api", () => ({
  getCart: vi.fn().mockResolvedValue({ id: 0, items: [], totalPrice: 0 }),
  addCartItem: vi.fn(),
  updateCartItem: vi.fn(),
  removeCartItem: vi.fn(),
}));

const messages = {
  product: { addToCart: "Add to cart", outOfStock: "Out of stock", soldOut: "Sold out", ssc: "SSC", hsc: "HSC" },
};

const product: Product = {
  id: "h1",
  name: { en: "Physics 1st Paper", bn: "পদার্থবিজ্ঞান ১ম পত্র" },
  slug: "hsc-physics-1",
  priceMin: 310,
  priceMax: null,
  subject: "physics",
  level: "hsc",
  paper: 1,
  soldOut: false,
  category: "hsc-khata",
};

function renderWith(locale: string, p: Product) {
  return render(
    <NextIntlClientProvider locale={locale} messages={messages}>
      <CartProvider>
        <ProductCard product={p} />
      </CartProvider>
    </NextIntlClientProvider>,
  );
}

describe("ProductCard", () => {
  it("renders the English name under en locale", () => {
    renderWith("en", product);
    expect(screen.getByText("Physics 1st Paper")).toBeInTheDocument();
  });

  it("renders the Bengali name under bn locale", () => {
    renderWith("bn", product);
    expect(screen.getByText("পদার্থবিজ্ঞান ১ম পত্র")).toBeInTheDocument();
  });

  it("renders a single price when priceMax is null", () => {
    renderWith("en", product);
    expect(screen.getByText("৳310")).toBeInTheDocument();
  });

  it("renders a price range when priceMax is set", () => {
    renderWith("en", { ...product, priceMin: 310, priceMax: 465 });
    expect(screen.getByText("৳310 – ৳465")).toBeInTheDocument();
  });

  it("shows the level chip on the cover", () => {
    renderWith("en", product);
    expect(screen.getByText("HSC")).toBeInTheDocument();
  });

  it("shows a Sold out badge and Out of stock button when soldOut", () => {
    renderWith("en", { ...product, soldOut: true });
    expect(screen.getByText("Sold out")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Out of stock" })).toBeInTheDocument();
  });

  it("shows a discount badge and strikethrough original price", () => {
    renderWith("en", { ...product, priceMin: 3060, originalPrice: 4500 });
    expect(screen.getByText("-32%")).toBeInTheDocument();
    expect(screen.getByText("৳4500")).toBeInTheDocument();
  });

  it("shows no discount badge when there is no original price", () => {
    renderWith("en", product);
    expect(screen.queryByText(/-\d+%/)).not.toBeInTheDocument();
  });
});
