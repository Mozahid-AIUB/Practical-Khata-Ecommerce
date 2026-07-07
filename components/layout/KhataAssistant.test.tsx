import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { NextIntlClientProvider } from "next-intl";
import { KhataAssistant } from "./KhataAssistant";

const messages = {
  assistant: {
    title: "Khata Assistant",
    online: "Online",
    greeting: "Assalamu Alaikum! 👋 How can I help you?",
    close: "Close",
    open: "Open chat",
    whatsappLabel: "Chat on WhatsApp",
    continueOnWhatsapp: "Continue on WhatsApp",
    placeholder: "Type a message...",
    send: "Send",
    deliveryLabel: "Delivery",
    deliveryAnswer: "Delivery takes 2-3 working days nationwide, 1-2 days in Dhaka.",
    priceLabel: "Price",
    priceAnswer: "Each khata starts from ৳310.",
    paymentLabel: "Payment",
    paymentAnswer: "We accept bKash, Nagad and Rocket.",
    trackingLabel: "Tracking",
    trackingAnswer: "Use Track Order in the menu, or message us on WhatsApp.",
    fallbackAnswer: "Sorry, please use a button below or continue on WhatsApp.",
  },
};

function renderWith() {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <KhataAssistant />
    </NextIntlClientProvider>,
  );
}

describe("KhataAssistant", () => {
  it("starts closed, showing the assistant launcher and a separate WhatsApp launcher", () => {
    renderWith();
    expect(screen.getByRole("button", { name: "Open chat" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Chat on WhatsApp" })).toBeInTheDocument();
    expect(screen.queryByText("Khata Assistant")).not.toBeInTheDocument();
  });

  it("the WhatsApp launcher links straight to WhatsApp, independent of the assistant panel", () => {
    renderWith();
    const waLauncher = screen.getByRole("link", { name: "Chat on WhatsApp" });
    expect(waLauncher).toHaveAttribute("href", "https://wa.me/8801611987955");
  });

  it("opens the assistant panel without navigating anywhere", () => {
    renderWith();
    fireEvent.click(screen.getByRole("button", { name: "Open chat" }));
    expect(screen.getByText("Khata Assistant")).toBeInTheDocument();
    expect(screen.getByText("Assalamu Alaikum! 👋 How can I help you?")).toBeInTheDocument();
  });

  it("answers quick-reply questions inline instead of opening WhatsApp", () => {
    renderWith();
    fireEvent.click(screen.getByRole("button", { name: "Open chat" }));
    fireEvent.click(screen.getByRole("button", { name: /Delivery/ }));
    expect(
      screen.getByText("Delivery takes 2-3 working days nationwide, 1-2 days in Dhaka."),
    ).toBeInTheDocument();
  });

  it("still offers a way to continue on WhatsApp from inside the panel", () => {
    renderWith();
    fireEvent.click(screen.getByRole("button", { name: "Open chat" }));
    expect(screen.getByRole("link", { name: /Continue on WhatsApp/ })).toHaveAttribute(
      "href",
      "https://wa.me/8801611987955",
    );
  });

  it("has a text input that answers typed questions inline via keyword match", () => {
    renderWith();
    fireEvent.click(screen.getByRole("button", { name: "Open chat" }));
    const input = screen.getByPlaceholderText("Type a message...");
    fireEvent.change(input, { target: { value: "how much does it cost?" } });
    fireEvent.submit(input.closest("form")!);
    expect(screen.getByText("Each khata starts from ৳310.")).toBeInTheDocument();
    expect(input).toHaveValue("");
  });

  it("falls back to a generic answer when the typed question matches nothing", () => {
    renderWith();
    fireEvent.click(screen.getByRole("button", { name: "Open chat" }));
    const input = screen.getByPlaceholderText("Type a message...");
    fireEvent.change(input, { target: { value: "xyzzy unrelated gibberish" } });
    fireEvent.submit(input.closest("form")!);
    expect(
      screen.getByText("Sorry, please use a button below or continue on WhatsApp."),
    ).toBeInTheDocument();
  });
});
