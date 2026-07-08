"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Search, Heart, ShoppingCart, User, PenLine, Menu, X } from "lucide-react";
import { WhatsApp } from "./SocialIcons";
import { LanguageToggle } from "./LanguageToggle";
import { useCart } from "@/components/cart/CartContext";

function MarqueeStrip() {
  const t = useTranslations("marquee");
  const items = (copy: number) => (
    <div className="flex shrink-0 items-center pr-20" aria-hidden={copy > 0 || undefined}>
      <span className="whitespace-nowrap">{t("customBn")}</span>
      <span className="mx-6 text-accent-400" aria-hidden>
        ✦
      </span>
      <span className="whitespace-nowrap">{t("customEn")}</span>
    </div>
  );

  return (
    <div className="overflow-hidden bg-brand-900 py-3 text-sm font-bold text-white sm:text-base">
      <div className="marquee-track flex w-max">
        {items(0)}
        {items(1)}
      </div>
    </div>
  );
}

export function Header() {
  const locale = useLocale();
  const pathname = usePathname();
  const tNav = useTranslations("nav");
  const tHeader = useTranslations("header");
  const p = (path: string) => `/${locale}${path}`;
  const [mobileOpen, setMobileOpen] = useState(false);
  const { itemCount } = useCart();

  const navItems = [
    { key: "home", href: "" },
    { key: "shop", href: "/shop" },
    { key: "contact", href: "/contact" },
    { key: "track", href: "/track" },
  ] as const;

  function isActive(href: string) {
    const target = p(href);
    return href === "" ? pathname === target : pathname.startsWith(target);
  }

  return (
    <header className="sticky top-0 z-50 bg-[#fdfcf9]/95 text-ink-900 shadow-sm backdrop-blur">
      <MarqueeStrip />
      <div className="mx-auto max-w-7xl px-4">
        {/* top bar: logo · nav · phone + toggle */}
        <div className="flex items-center justify-between gap-4 py-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Menu"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((v) => !v)}
              className="text-ink-900 md:hidden"
            >
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            <Link href={p("")} className="flex items-center gap-2 font-display text-xl font-bold sm:text-2xl">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white">
                <PenLine className="h-4.5 w-4.5" strokeWidth={2.25} />
              </span>
              <span>
                Practical<span className="text-brand-600"> Khata</span>
              </span>
            </Link>
          </div>
          <nav className="hidden items-center gap-7 text-sm font-semibold md:flex">
            {navItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.key}
                  href={p(item.href)}
                  aria-current={active ? "page" : undefined}
                  className={`relative rounded py-1 outline-none transition focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 ${
                    active ? "text-brand-600" : "text-ink-800/70 hover:text-brand-600"
                  }`}
                >
                  {tNav(item.key)}
                  {active && (
                    <span className="absolute -bottom-1 left-0 h-0.5 w-full rounded-full bg-brand-600" aria-hidden />
                  )}
                </Link>
              );
            })}
          </nav>
          <div className="flex items-center gap-3">
            <a
              href="https://wa.me/8801611987955"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden items-center gap-2 rounded-full border border-brand-200 px-3.5 py-2 text-sm font-bold text-brand-700 transition hover:bg-brand-50 lg:flex"
            >
              <WhatsApp className="h-4.5 w-4.5 text-[#25D366]" />
              01611-987955
            </a>
            <LanguageToggle />
          </div>
        </div>

        {/* search row: search fills the space, icons sit right beside it */}
        <div className="flex items-center gap-4 pb-3">
          <form className="flex h-11 flex-1 items-stretch overflow-hidden rounded-full border border-brand-200 bg-white shadow-sm">
            <input
              type="search"
              placeholder={tHeader("searchPlaceholder")}
              className="min-w-0 flex-1 bg-white pl-5 pr-2 text-sm text-ink-900 placeholder:text-gray-400 focus:outline-none"
            />
            <button
              type="submit"
              aria-label="Search"
              className="flex w-12 items-center justify-center bg-brand-600 text-white transition hover:bg-brand-700"
            >
              <Search className="h-4 w-4" />
            </button>
          </form>
          <div className="flex items-center gap-4">
            <button type="button" aria-label={tHeader("wishlist")} className="relative text-ink-800/80 hover:text-brand-600">
              <Heart className="h-6 w-6" />
              <span className="absolute -right-2 -top-2 rounded-full bg-accent-500 px-1.5 text-xs text-white">0</span>
            </button>
            <button type="button" aria-label={tHeader("cart")} className="relative text-ink-800/80 hover:text-brand-600">
              <ShoppingCart className="h-6 w-6" />
              <span className="absolute -right-2 -top-2 rounded-full bg-accent-500 px-1.5 text-xs text-white">{itemCount}</span>
            </button>
            <button type="button" aria-label={tHeader("account")} className="text-ink-800/80 hover:text-brand-600">
              <User className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* mobile nav drawer */}
        {mobileOpen && (
          <nav className="flex flex-col gap-1 border-t border-rule pb-3 md:hidden">
            {navItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.key}
                  href={p(item.href)}
                  onClick={() => setMobileOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={`rounded px-2 py-2.5 text-sm font-semibold transition ${
                    active
                      ? "bg-brand-50 text-brand-700"
                      : "text-ink-800/80 hover:bg-brand-50 hover:text-brand-700"
                  }`}
                >
                  {tNav(item.key)}
                </Link>
              );
            })}
          </nav>
        )}
      </div>

      {/* the khata's double red rule closes the header */}
      <div aria-hidden>
        <div className="h-px bg-accent-500/70" />
        <div className="mt-[3px] h-px bg-accent-500/30" />
      </div>
    </header>
  );
}
