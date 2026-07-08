"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { NotebookText, ChevronRight } from "lucide-react";
import type { Category, Localized } from "@/lib/mock-data";

export function CategorySidebar({
  categories,
  productCounts,
  showOrderingNote = true,
}: {
  categories: Category[];
  productCounts: number[];
  showOrderingNote?: boolean;
}) {
  const locale = useLocale() as keyof Localized;
  const t = useTranslations("sidebar");

  return (
    <aside className="w-full overflow-hidden rounded-xl border border-rule bg-white shadow-sm">
      <div className="flex items-center gap-2 bg-brand-600 px-4 py-3 font-semibold text-white">
        <NotebookText className="h-5 w-5" />
        {t("menu")}
      </div>
      <ul className="divide-y divide-rule/60">
        {categories.map((c, i) => (
          <li key={c.id}>
            <Link
              href={`/${locale}/shop?category=${c.slug}`}
              className="group flex items-center justify-between px-4 py-3 text-sm font-medium text-ink-800 transition hover:bg-brand-50 hover:text-brand-700"
            >
              <span className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-400 transition group-hover:bg-brand-600" aria-hidden />
                {c.name[locale] ?? c.name.en}
              </span>
              <span className="flex items-center gap-1 text-xs text-gray-400">
                {productCounts[i]}
                <ChevronRight className="h-4 w-4 text-gray-300 transition group-hover:translate-x-0.5 group-hover:text-brand-500" />
              </span>
            </Link>
          </li>
        ))}
      </ul>

      {/* how ordering works — the khata-margin note */}
      {showOrderingNote && (
        <div className="khata-margin khata-rules border-t border-rule py-4 pl-16 pr-4 text-xs leading-8">
          <p className="font-semibold text-ink-900">{t("step1")}</p>
          <p className="font-semibold text-ink-900">{t("step2")}</p>
          <p className="font-semibold text-ink-900">{t("step3")}</p>
          <p className="font-semibold text-accent-500">{t("customNote")}</p>
        </div>
      )}
    </aside>
  );
}
