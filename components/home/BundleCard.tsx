"use client";

import Link from "next/link";
import { Check, Layers } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

const ITEMS = ["item1", "item2", "item3"] as const;

export function BundleCard() {
  const locale = useLocale();
  const t = useTranslations("bundle");

  return (
    <aside className="flex h-full w-full flex-col overflow-hidden rounded-xl border border-rule bg-white shadow-sm">
      <div className="flex items-center gap-2 bg-accent-500 px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-white">
        <Layers className="h-4 w-4" />
        {t("eyebrow")}
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div>
          <h2 className="font-display text-2xl font-bold leading-snug text-ink-900">{t("title")}</h2>
          <p className="mt-1 text-xs font-medium text-ink-800/60">{t("subtitle")}</p>
        </div>

        <ul className="space-y-2 text-sm font-medium text-ink-800/90">
          {ITEMS.map((key) => (
            <li key={key} className="flex items-start gap-2">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-tick-500" strokeWidth={3} />
              {t(key)}
            </li>
          ))}
        </ul>

        <div>
          <p className="flex items-baseline gap-2.5">
            <span className="font-display text-4xl font-bold text-brand-600">{t("price")}</span>
            <span className="text-base font-semibold text-gray-400 line-through">{t("oldPrice")}</span>
          </p>
          <p className="mt-1 text-xs font-bold text-accent-500">{t("offer")}</p>
        </div>

        <div className="mt-auto flex flex-col gap-2">
          <Link
            href={`/${locale}/shop?category=full-set`}
            className="rounded-xl bg-brand-600 px-4 py-3 text-center font-semibold text-white transition hover:bg-brand-700 hover:shadow-md"
          >
            {t("cta")}
          </Link>
          <p className="text-center text-xs text-ink-800/60">{t("note")}</p>
        </div>
      </div>
    </aside>
  );
}
