import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { NextIntlClientProvider } from "next-intl";
import { CategorySidebar } from "./CategorySidebar";
import type { Category } from "@/lib/mock-data";

const messages = {
  sidebar: {
    menu: "Khata List",
    step1: "1. Pick your khata",
    step2: "2. Pay via bKash/Nagad",
    step3: "3. Home delivery in 2-3 days",
    customNote: "We make custom khata, not ready-made",
  },
};

const categories: Category[] = [
  { id: "c1", name: { en: "SSC Practical Khata", bn: "SSC প্র্যাকটিক্যাল খাতা" }, slug: "ssc-khata" },
  { id: "c2", name: { en: "HSC Practical Khata", bn: "HSC প্র্যাকটিক্যাল খাতা" }, slug: "hsc-khata" },
  { id: "c3", name: { en: "Full Package & Assignments", bn: "ফুল প্যাকেজ ও অ্যাসাইনমেন্ট" }, slug: "full-set" },
];
const productCounts = [6, 10, 3];

function renderWith(locale: string) {
  return render(
    <NextIntlClientProvider locale={locale} messages={messages}>
      <CategorySidebar categories={categories} productCounts={productCounts} />
    </NextIntlClientProvider>,
  );
}

describe("CategorySidebar", () => {
  it("renders the menu header and 3 categories", () => {
    renderWith("en");
    expect(screen.getByText("Khata List")).toBeInTheDocument();
    expect(screen.getByText("SSC Practical Khata")).toBeInTheDocument();
    expect(screen.getAllByRole("link").length).toBe(3);
  });

  it("renders Bengali category names under bn locale", () => {
    renderWith("bn");
    expect(screen.getByText("HSC প্র্যাকটিক্যাল খাতা")).toBeInTheDocument();
  });

  it("renders the how-to-order steps", () => {
    renderWith("en");
    expect(screen.getByText("2. Pay via bKash/Nagad")).toBeInTheDocument();
  });

  it("states khata is custom-made, not ready-made", () => {
    renderWith("en");
    expect(screen.getByText("We make custom khata, not ready-made")).toBeInTheDocument();
  });
});
