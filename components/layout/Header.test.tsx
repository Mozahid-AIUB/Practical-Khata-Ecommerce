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
    customBn: "আমরা সবসময় কাস্টম খাতা তৈরি করি, রেডিমেড না — ইনডেক্স ও PDF পাঠান, আমরা হুবহু ড্রয়িং + লিখে দেব",
    customEn: "We always make custom khata, never off-the-shelf — send your index & PDF, we write it exactly",
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

  it("renders the custom-khata marquee message", () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <Header />
      </NextIntlClientProvider>,
    );
    expect(screen.getAllByText(/We always make custom khata/).length).toBeGreaterThanOrEqual(1);
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
