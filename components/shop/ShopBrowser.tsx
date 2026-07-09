"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { SlidersHorizontal, Check, ArrowUpDown, X } from "lucide-react";
import type { Category, Localized, Product } from "@/lib/mock-data";
import { ProductCard } from "@/components/home/ProductCard";

type CategoryWithProducts = Category & { products: Product[] };

type SortKey = "popular" | "priceLow" | "priceHigh";

type PriceBand = { id: string; min: number; max: number | null };

const PRICE_BANDS: PriceBand[] = [
  { id: "under350", min: 0, max: 349 },
  { id: "350to500", min: 350, max: 500 },
  { id: "over500", min: 501, max: null },
];

const LEVELS = ["ssc", "hsc"] as const;

export function ShopBrowser({ categories }: { categories: CategoryWithProducts[] }) {
  const locale = useLocale() as keyof Localized;
  const t = useTranslations("shop");
  const tProduct = useTranslations("product");

  const [levels, setLevels] = useState<Set<string>>(new Set());
  const [band, setBand] = useState<string | null>(null);
  const [sort, setSort] = useState<SortKey>("popular");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const hasFilters = levels.size > 0 || band !== null;

  function toggleLevel(level: string) {
    setLevels((prev) => {
      const next = new Set(prev);
      next.has(level) ? next.delete(level) : next.add(level);
      return next;
    });
  }

  function clearAll() {
    setLevels(new Set());
    setBand(null);
  }

  function matches(product: Product): boolean {
    if (levels.size > 0 && (!product.level || !levels.has(product.level))) return false;
    if (band) {
      const b = PRICE_BANDS.find((x) => x.id === band)!;
      if (product.priceMin < b.min) return false;
      if (b.max !== null && product.priceMin > b.max) return false;
    }
    return true;
  }

  function sortProducts(products: Product[]): Product[] {
    const copy = [...products];
    if (sort === "priceLow") copy.sort((a, b) => a.priceMin - b.priceMin);
    else if (sort === "priceHigh") copy.sort((a, b) => b.priceMin - a.priceMin);
    else copy.sort((a, b) => Number(b.bestSeller ?? false) - Number(a.bestSeller ?? false));
    return copy;
  }

  const groups = useMemo(
    () =>
      categories
        .map((c) => ({ category: c, products: sortProducts(c.products.filter(matches)) }))
        .filter((g) => g.products.length > 0),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [categories, levels, band, sort]
  );

  const totalCount = groups.reduce((sum, g) => sum + g.products.length, 0);

  function bandLabel(b: PriceBand): string {
    if (b.min === 0) return t("under", { max: b.max! });
    if (b.max === null) return t("over", { min: b.min });
    return t("between", { min: b.min, max: b.max });
  }

  const filterPanel = (
    <div className="space-y-6">
      {/* level */}
      <div>
        <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-gray-500">{t("level")}</h3>
        <div className="space-y-1">
          {LEVELS.map((level) => {
            const active = levels.has(level);
            return (
              <button
                key={level}
                type="button"
                onClick={() => toggleLevel(level)}
                className="flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm text-ink-800 transition hover:bg-brand-50"
              >
                <span
                  className={`flex h-4 w-4 items-center justify-center rounded border transition ${
                    active ? "border-brand-600 bg-brand-600 text-white" : "border-gray-300"
                  }`}
                >
                  {active && <Check className="h-3 w-3" strokeWidth={3} />}
                </span>
                {tProduct(level)}
              </button>
            );
          })}
        </div>
      </div>

      {/* price */}
      <div>
        <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-gray-500">{t("priceRange")}</h3>
        <div className="space-y-1">
          {PRICE_BANDS.map((b) => {
            const active = band === b.id;
            return (
              <button
                key={b.id}
                type="button"
                onClick={() => setBand(active ? null : b.id)}
                className="currency flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm text-ink-800 transition hover:bg-brand-50"
              >
                <span
                  className={`flex h-4 w-4 items-center justify-center rounded-full border transition ${
                    active ? "border-brand-600" : "border-gray-300"
                  }`}
                >
                  {active && <span className="h-2 w-2 rounded-full bg-brand-600" />}
                </span>
                {bandLabel(b)}
              </button>
            );
          })}
        </div>
      </div>

      {hasFilters && (
        <button
          type="button"
          onClick={clearAll}
          className="text-sm font-semibold text-accent-500 transition hover:text-accent-600"
        >
          {t("clearFilters")}
        </button>
      )}
    </div>
  );

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[15rem_1fr]">
      {/* desktop sidebar */}
      <aside className="hidden lg:block">
        <div className="sticky top-40 overflow-hidden rounded-xl border border-rule bg-white shadow-sm">
          <div className="flex items-center gap-2 bg-brand-600 px-4 py-3 font-semibold text-white">
            <SlidersHorizontal className="h-4.5 w-4.5" />
            {t("filters")}
          </div>
          <div className="p-4">{filterPanel}</div>
        </div>
      </aside>

      <div className="min-w-0">
        {/* toolbar: count + sort */}
        <div className="mb-4 flex items-center justify-between gap-3 border-b border-rule pb-3">
          <p className="text-sm text-gray-500">{t("productsFound", { count: totalCount })}</p>

          <div className="flex items-center gap-2">
            {/* mobile filter trigger */}
            <button
              type="button"
              onClick={() => setMobileFiltersOpen(true)}
              className="flex items-center gap-1.5 rounded-full border border-rule px-3 py-1.5 text-sm font-medium text-ink-800 transition hover:border-brand-300 lg:hidden"
            >
              <SlidersHorizontal className="h-4 w-4" />
              {t("filters")}
            </button>

            <label className="flex items-center gap-1.5 rounded-full border border-rule px-3 py-1.5 text-sm">
              <ArrowUpDown className="h-3.5 w-3.5 text-gray-400" />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="bg-transparent font-medium text-ink-800 focus:outline-none"
                aria-label={t("sortBy")}
              >
                <option value="popular">{t("sortPopular")}</option>
                <option value="priceLow">{t("sortPriceLow")}</option>
                <option value="priceHigh">{t("sortPriceHigh")}</option>
              </select>
            </label>
          </div>
        </div>

        {totalCount === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-rule py-20 text-center">
            <p className="font-semibold text-ink-900">{t("noResults")}</p>
            <p className="text-sm text-gray-500">{t("noResultsText")}</p>
            <button
              type="button"
              onClick={clearAll}
              className="mt-2 rounded-full bg-brand-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-brand-700"
            >
              {t("clearFilters")}
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {groups.map(({ category, products }) => (
              <section key={category.id}>
                <h2 className="mb-4 flex items-center gap-3 border-b border-rule pb-3 font-display text-xl font-bold text-ink-900">
                  <span className="h-6 w-1.5 rounded-full bg-accent-500" aria-hidden />
                  {category.name[locale] ?? category.name.en}
                  <span className="text-sm font-normal text-gray-400">({products.length})</span>
                </h2>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>

      {/* mobile filter drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-[80] lg:hidden">
          <div className="absolute inset-0 bg-ink-900/40" onClick={() => setMobileFiltersOpen(false)} />
          <div className="absolute inset-y-0 left-0 flex w-72 max-w-[85%] flex-col bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-rule px-4 py-3">
              <span className="font-display text-lg font-bold text-ink-900">{t("filters")}</span>
              <button
                type="button"
                aria-label="Close"
                onClick={() => setMobileFiltersOpen(false)}
                className="rounded-full p-1.5 text-ink-800/70 transition hover:bg-brand-50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">{filterPanel}</div>
          </div>
        </div>
      )}
    </div>
  );
}
