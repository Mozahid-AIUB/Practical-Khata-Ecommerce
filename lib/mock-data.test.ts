import { describe, it, expect } from "vitest";
import { getTopSellers, getCategories, getProductsByCategory } from "./mock-data";

describe("mock-data", () => {
  it("returns at least 4 top sellers", () => {
    expect(getTopSellers().length).toBeGreaterThanOrEqual(4);
  });

  it("returns the 3 khata categories", () => {
    expect(getCategories().length).toBe(3);
  });

  it("filters products by category slug", () => {
    const firstSlug = getCategories()[0].slug;
    const products = getProductsByCategory(firstSlug);
    expect(products.length).toBeGreaterThan(0);
    expect(products.every((p) => p.category === firstSlug)).toBe(true);
  });

  it("gives every HSC two-paper subject both papers", () => {
    const hsc = getProductsByCategory("hsc-khata");
    for (const subject of ["physics", "chemistry", "biology", "math"] as const) {
      const papers = hsc.filter((p) => p.subject === subject).map((p) => p.paper);
      expect(papers).toContain(1);
      expect(papers).toContain(2);
    }
  });

  it("gives every product a bilingual name", () => {
    for (const p of getTopSellers()) {
      expect(p.name.en.length).toBeGreaterThan(0);
      expect(p.name.bn.length).toBeGreaterThan(0);
    }
  });

  it("gives every category a bilingual name", () => {
    for (const c of getCategories()) {
      expect(c.name.en.length).toBeGreaterThan(0);
      expect(c.name.bn.length).toBeGreaterThan(0);
    }
  });
});
