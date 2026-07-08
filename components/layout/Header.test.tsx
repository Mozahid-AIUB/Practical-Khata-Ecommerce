import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { NextIntlClientProvider } from "next-intl";
import { Header } from "./Header";
import { CartProvider } from "@/components/cart/CartContext";

vi.mock("next/navigation", () => ({
  usePathname: () => "/en",
  useRouter: () => ({ push: vi.fn() }),
}));

vi.mock("@/lib/api", () => ({
  getCart: vi.fn().mockResolvedValue({ id: 0, items: [], totalPrice: 0 }),
  addCartItem: vi.fn(),
  updateCartItem: vi.fn(),
  removeCartItem: vi.fn(),
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
    customBn: "রেডিমেড নয়, প্রতিটি খাতা তৈরি হয় আপনার চাহিদা অনুযায়ী — ইনডেক্স ও PDF পাঠালেই আমাদের এক্সপার্ট আর্টিস্টরা হুবহু কপি করে দেবেন",
    customEn: "Never off-the-shelf, every khata is made to your requirements — send your index & PDF and our expert artists will copy it exactly",
  },
};

describe("Header", () => {
  it("renders the brand and primary nav", () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <CartProvider>
          <Header />
        </CartProvider>
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
        <CartProvider>
          <Header />
        </CartProvider>
      </NextIntlClientProvider>,
    );
    expect(screen.getAllByText(/Never off-the-shelf/).length).toBeGreaterThanOrEqual(1);
  });

  it("shows the WhatsApp phone number", () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <CartProvider>
          <Header />
        </CartProvider>
      </NextIntlClientProvider>,
    );
    expect(screen.getByRole("link", { name: /01611-987955/ })).toBeInTheDocument();
  });
});
