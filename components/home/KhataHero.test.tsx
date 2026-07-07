import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { NextIntlClientProvider } from "next-intl";
import { KhataHero } from "./KhataHero";

const messages = {
  hero: {
    stamp: "SSC · HSC",
    titleA: "We always make custom khata,",
    titleB: "never off-the-shelf — send your index & PDF, we handwrite it exactly",
    tick1: "Professional handwriting",
    tick2: "Perfect figures & diagrams",
    tick3: "Nationwide delivery in 2-3 days",
    tick4: "100% neat & error-free",
    from: "Each khata from just ৳310",
    cta: "Order your khata",
    ctaSecondary: "See the full set",
    marks: "10/10",
  },
};

describe("KhataHero", () => {
  it("renders the custom-khata headline and CTA", () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <KhataHero />
      </NextIntlClientProvider>,
    );
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("We always make custom khata");
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("never off-the-shelf");
    expect(screen.getByRole("link", { name: "Order your khata" })).toBeInTheDocument();
  });

  it("renders all four feature ticks", () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <KhataHero />
      </NextIntlClientProvider>,
    );
    expect(screen.getByText("Professional handwriting")).toBeInTheDocument();
    expect(screen.getByText("Perfect figures & diagrams")).toBeInTheDocument();
    expect(screen.getByText("Nationwide delivery in 2-3 days")).toBeInTheDocument();
    expect(screen.getByText("100% neat & error-free")).toBeInTheDocument();
  });
});
