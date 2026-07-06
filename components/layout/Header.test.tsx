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

  it("shows the WhatsApp phone number", () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <Header />
      </NextIntlClientProvider>,
    );
    expect(screen.getByRole("link", { name: /01611-987955/ })).toBeInTheDocument();
  });
});
