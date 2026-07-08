import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { NextIntlClientProvider } from "next-intl";
import { Footer } from "./Footer";
import type { Category, Product } from "@/lib/mock-data";

const messages = {
  footer: {
    tagline: "Your khata, our handwriting.",
    quickLinks: "Useful Links",
    followUs: "Our Social Links",
    rights: "All rights reserved.",
    questions: "Have questions? Call or WhatsApp 24/7",
    delivery: "Home delivery nationwide — orders confirmed on advance payment",
    paymentSystem: "Payment System",
    shippingSystem: "Shipping System",
    about: "About Us",
    contactUs: "Contact",
    privacy: "Privacy Policy",
    returns: "Returns & Corrections",
    terms: "Terms & Conditions",
    track: "Track Order",
  },
};

const physics1stPaper: Product = {
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

const categories: (Category & { products: Product[] })[] = [
  { id: "c1", name: { en: "SSC Practical Khata", bn: "SSC প্র্যাকটিক্যাল খাতা" }, slug: "ssc-khata", products: [] },
  { id: "c2", name: { en: "HSC Practical Khata", bn: "HSC প্র্যাকটিক্যাল খাতা" }, slug: "hsc-khata", products: [physics1stPaper] },
  { id: "c3", name: { en: "Full Package & Assignments", bn: "ফুল প্যাকেজ ও অ্যাসাইনমেন্ট" }, slug: "full-set", products: [] },
];

describe("Footer", () => {
  it("renders contact info, useful links and social section", () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <Footer categories={categories} />
      </NextIntlClientProvider>,
    );
    expect(screen.getByText("Have questions? Call or WhatsApp 24/7")).toBeInTheDocument();
    expect(screen.getByText("Useful Links")).toBeInTheDocument();
    expect(screen.getByText("Our Social Links")).toBeInTheDocument();
    expect(screen.getByText("Payment System")).toBeInTheDocument();
    expect(screen.getByText("01611-987955")).toBeInTheDocument();
  });

  it("renders a product column per khata category", () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <Footer categories={categories} />
      </NextIntlClientProvider>,
    );
    expect(screen.getByText("SSC Practical Khata")).toBeInTheDocument();
    expect(screen.getByText("HSC Practical Khata")).toBeInTheDocument();
    expect(screen.getAllByText("Physics 1st Paper").length).toBeGreaterThanOrEqual(1);
  });

  it("does not render a Full Package & Assignments column", () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <Footer categories={categories} />
      </NextIntlClientProvider>,
    );
    expect(screen.queryByText("Full Package & Assignments")).not.toBeInTheDocument();
  });
});
