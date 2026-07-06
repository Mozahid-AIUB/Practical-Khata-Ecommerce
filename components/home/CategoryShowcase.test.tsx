import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { NextIntlClientProvider } from "next-intl";
import { CategoryShowcase } from "./CategoryShowcase";
import type { Category } from "@/lib/mock-data";

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

function renderWith(locale: string, category: Category) {
  return render(
    <NextIntlClientProvider locale={locale} messages={messages}>
      <CategoryShowcase category={category} />
    </NextIntlClientProvider>,
  );
}

describe("CategoryShowcase", () => {
  it("renders the English category heading", () => {
    renderWith("en", hscCategory);
    expect(screen.getByRole("heading", { name: "HSC Practical Khata" })).toBeInTheDocument();
  });

  it("renders the Bengali heading under bn locale", () => {
    renderWith("bn", hscCategory);
    expect(screen.getByRole("heading", { name: "HSC প্র্যাকটিক্যাল খাতা" })).toBeInTheDocument();
  });

  it("renders products from that category", () => {
    renderWith("en", hscCategory);
    expect(screen.getByText("Physics 1st Paper")).toBeInTheDocument();
    expect(screen.getByText("Physics 2nd Paper")).toBeInTheDocument();
  });

  it("shows paper tabs for HSC (two-paper subjects)", () => {
    renderWith("en", hscCategory);
    expect(screen.getByRole("button", { name: "1st Paper" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "2nd Paper" })).toBeInTheDocument();
  });

  it("hides paper tabs for SSC (single-paper subjects)", () => {
    renderWith("en", sscCategory);
    expect(screen.queryByRole("button", { name: "1st Paper" })).not.toBeInTheDocument();
  });
});
