"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Facebook, Instagram } from "./SocialIcons";
import { Bkash, Nagad, Rocket, SHIPPING_PARTNERS } from "./PaymentIcons";

const PAYMENT_METHODS = [Bkash, Nagad, Rocket] as const;
import { getCategories, getProductsByCategory, type Localized } from "@/lib/mock-data";

const USEFUL_LINKS = ["about", "contactUs", "track", "privacy", "returns", "terms"] as const;

export function Footer() {
  const locale = useLocale() as keyof Localized;
  const t = useTranslations("footer");
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink-900 text-white/70">
      {/* main columns */}
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-12 md:grid-cols-2 lg:grid-cols-5">
        {/* brand + contact */}
        <div className="lg:col-span-2">
          <h3 className="font-display text-2xl font-bold text-white">
            Practical<span className="text-brand-400"> Khata</span>
          </h3>
          <p className="mt-1 text-sm italic text-white/50">{t("tagline")}</p>
          <p className="mt-4 font-semibold text-white">{t("questions")}</p>
          <a href="tel:01611987955" className="text-lg font-bold text-brand-300 transition hover:text-white">
            01611-987955
          </a>
          <p className="mt-1 text-sm">WhatsApp · bKash · Nagad: 01611-987955</p>
          <p className="mt-4 max-w-sm text-sm">{t("delivery")}</p>
        </div>

        {/* one column per khata category */}
        {getCategories().map((category) => (
          <div key={category.id}>
            <h4 className="font-semibold text-white">{category.name[locale] ?? category.name.en}</h4>
            <ul className="mt-3 space-y-2 text-sm">
              {getProductsByCategory(category.slug).slice(0, 6).map((p) => (
                <li key={p.id}>
                  <Link href={`/${locale}/shop?category=${category.slug}`} className="transition hover:text-white">
                    {p.name[locale] ?? p.name.en}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* useful links */}
        <div>
          <h4 className="font-semibold text-white">{t("quickLinks")}</h4>
          <ul className="mt-3 space-y-2 text-sm">
            {USEFUL_LINKS.map((key) => (
              <li key={key}>
                <Link href={`/${locale}`} className="transition hover:text-white">
                  {t(key)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* payment / shipping / social strip */}
      <div className="border-t border-white/10">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-8 sm:grid-cols-3">
          <div>
            <p className="mb-2 font-semibold text-white">{t("paymentSystem")}</p>
            <div className="flex flex-wrap gap-2">
              {PAYMENT_METHODS.map((Method, i) => (
                <Method key={i} />
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 font-semibold text-white">{t("shippingSystem")}</p>
            <div className="flex flex-wrap gap-2">
              {SHIPPING_PARTNERS.map((Partner, i) => (
                <Partner key={i} />
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 font-semibold text-white">{t("followUs")}</p>
            <div className="flex gap-3">
              <a href="#" aria-label="Facebook" className="rounded-full bg-white/10 p-2 transition hover:bg-brand-600 hover:text-white"><Facebook className="h-5 w-5" /></a>
              <a href="#" aria-label="Instagram" className="rounded-full bg-white/10 p-2 transition hover:bg-brand-600 hover:text-white"><Instagram className="h-5 w-5" /></a>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-4 text-center text-xs text-white/50">
        © {year} Practical Khata. {t("rights")}
      </div>
    </footer>
  );
}
