import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { NextIntlClientProvider } from "next-intl";
import { Footer } from "./Footer";

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

describe("Footer", () => {
  it("renders contact info, useful links and social section", () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <Footer />
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
        <Footer />
      </NextIntlClientProvider>,
    );
    expect(screen.getByText("SSC Practical Khata")).toBeInTheDocument();
    expect(screen.getByText("HSC Practical Khata")).toBeInTheDocument();
    expect(screen.getAllByText("Physics 1st Paper").length).toBeGreaterThanOrEqual(1);
  });
});
