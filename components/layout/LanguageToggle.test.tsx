import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { NextIntlClientProvider } from "next-intl";
import { LanguageToggle } from "./LanguageToggle";

vi.mock("next/navigation", () => ({
  usePathname: () => "/bn",
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
}));

function renderWith(locale: string) {
  return render(
    <NextIntlClientProvider locale={locale} messages={{}}>
      <LanguageToggle />
    </NextIntlClientProvider>,
  );
}

describe("LanguageToggle", () => {
  it("renders both language options", () => {
    renderWith("bn");
    expect(screen.getByRole("button", { name: /বাংলা/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /EN/ })).toBeInTheDocument();
  });
});
