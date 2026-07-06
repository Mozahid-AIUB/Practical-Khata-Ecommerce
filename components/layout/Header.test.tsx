import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { NextIntlClientProvider } from "next-intl";
import { Header } from "./Header";

vi.mock("next/navigation", () => ({
  usePathname: () => "/en",
  useRouter: () => ({ push: vi.fn() }),
}));

const messages = {
  nav: { home: "Home", shop: "Khata", about: "About Us", contact: "Contact", track: "Track Order" },
  header: {
    searchPlaceholder: "Which khata do you need? e.g. HSC Physics 1st Paper",
    wishlist: "Wishlist",
    cart: "Cart",
    account: "Account",
    callUs: "Call or WhatsApp",
  },
  marquee: {
    i1: "SSC & HSC practical khata",
    i2: "Physics · Chemistry · Biology · Higher Math · ICT · Agriculture",
    i3: "Professional handwriting",
    i4: "Perfect figures & diagrams",
    i5: "Fast delivery nationwide",
    i6: "Top quality at the lowest price",
    i7: "Custom khata — send a PDF & index, we write it exactly",
  },
};

describe("Header", () => {
  it("renders the brand and primary nav", () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <Header />
      </NextIntlClientProvider>,
    );
    expect(screen.getByText(/Practical/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Khata" })).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Which khata do you need? e.g. HSC Physics 1st Paper"),
    ).toBeInTheDocument();
  });

  it("renders the running marquee items", () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <Header />
      </NextIntlClientProvider>,
    );
    expect(screen.getAllByText("Professional handwriting").length).toBeGreaterThanOrEqual(1);
  });

  it("shows the WhatsApp phone number", () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <Header />
      </NextIntlClientProvider>,
    );
    expect(screen.getByRole("link", { name: /01611-987955/ })).toBeInTheDocument();
  });
});
