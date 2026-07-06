"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { getProductsByCategory, type Category, type Localized } from "@/lib/mock-data";
import { ProductCard } from "./ProductCard";

const INITIAL_COUNT = 5;
const TABS = ["tabAll", "tabFirst", "tabSecond"] as const;
type Tab = (typeof TABS)[number];

export function CategoryShowcase({ category }: { category: Category }) {
  const locale = useLocale() as keyof Localized;
  const t = useTranslations("sections");
  const products = getProductsByCategory(category.slug);
  const [activeTab, setActiveTab] = useState<Tab>("tabAll");
  const [expanded, setExpanded] = useState(false);

  if (products.length === 0) {
    return null;
  }

  // paper tabs only make sense where subjects come in two papers (HSC)
  const hasPapers = products.some((p) => p.paper !== null);
  const filtered =
    activeTab === "tabAll"
      ? products
      : products.filter((p) => p.paper === (activeTab === "tabFirst" ? 1 : 2));
  const visible = expanded ? filtered : filtered.slice(0, INITIAL_COUNT);
  const hasMore = filtered.length > INITIAL_COUNT;

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5 }}
      className="mx-auto max-w-7xl px-4 py-10"
    >
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-rule pb-3">
        <div className="flex flex-wrap items-center gap-4">
          <h2 className="flex items-center gap-3 font-display text-2xl font-bold text-ink-900">
            <span className="h-7 w-1.5 rounded-full bg-accent-500" aria-hidden />
            {category.name[locale] ?? category.name.en}
          </h2>
          {hasPapers && (
            <div className="flex flex-wrap gap-1 text-sm">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-full px-3 py-1 transition ${
                    activeTab === tab
                      ? "bg-brand-50 font-semibold text-brand-700"
                      : "text-gray-500 hover:text-brand-600"
                  }`}
                >
                  {t(tab)}
                </button>
              ))}
            </div>
          )}
        </div>
        <Link
          href={`/${locale}/shop?category=${category.slug}`}
          className="text-sm font-semibold text-brand-600 transition hover:text-brand-700"
        >
          {t("viewAll")} →
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {visible.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {hasMore && !expanded && (
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() => setExpanded(true)}
            className="rounded-full border border-brand-300 px-6 py-2.5 text-sm font-semibold text-brand-700 transition hover:bg-brand-600 hover:text-white"
          >
            {t("loadMore")}
          </button>
        </div>
      )}
    </motion.section>
  );
}
