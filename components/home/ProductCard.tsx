"use client";

import { useLocale, useTranslations } from "next-intl";
import { ShoppingCart, Search, Heart } from "lucide-react";
import { discountPercent, type Product, type Localized } from "@/lib/mock-data";
import { SubjectCover } from "./SubjectCover";

function formatPrice(product: Product): string {
  if (product.priceMax === null) {
    return `৳${product.priceMin}`;
  }
  return `৳${product.priceMin} – ৳${product.priceMax}`;
}

export function ProductCard({ product }: { product: Product }) {
  const locale = useLocale() as keyof Localized;
  const t = useTranslations("product");
  const name = product.name[locale] ?? product.name.en;
  const discount = discountPercent(product);

  return (
    <div className="card-premium group relative flex flex-col overflow-hidden rounded-2xl border border-rule bg-white shadow-sm">
      <div className="relative w-full overflow-hidden">
        <SubjectCover product={product} />

        {/* discount / best-seller badge — top left */}
        {discount ? (
          <span className="absolute left-2 top-2 rounded bg-accent-500 px-2 py-1 text-xs font-bold text-white shadow">
            -{discount}%
          </span>
        ) : (
          product.bestSeller && (
            <span className="absolute left-2 top-2 rounded bg-amber-400 px-2 py-1 text-xs font-bold text-ink-900 shadow">
              ★ {t("bestSeller")}
            </span>
          )
        )}

        {/* hover action icons — slide in from the right */}
        <div className="absolute right-2 top-9 flex translate-x-12 flex-col gap-2 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
          <button type="button" aria-label={t("addToCart")} className="rounded-full bg-white p-2 text-ink-800 shadow-md transition hover:bg-brand-600 hover:text-white">
            <ShoppingCart className="h-4 w-4" />
          </button>
          <button type="button" aria-label="Quick view" className="rounded-full bg-white p-2 text-ink-800 shadow-md transition hover:bg-brand-600 hover:text-white">
            <Search className="h-4 w-4" />
          </button>
          <button type="button" aria-label="Add to wishlist" className="rounded-full bg-white p-2 text-ink-800 shadow-md transition hover:bg-brand-600 hover:text-white">
            <Heart className="h-4 w-4" />
          </button>
        </div>

        {/* sold out overlay */}
        {product.soldOut && (
          <div className="absolute inset-0 flex items-center justify-center bg-ink-900/40">
            <span className="rounded bg-ink-900/90 px-3 py-1 text-sm font-bold uppercase tracking-wide text-white">
              {t("soldOut")}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="line-clamp-1 text-sm font-semibold text-ink-900">{name}</h3>
        <div className="flex items-baseline gap-2">
          <span className="text-base font-bold text-brand-600">{formatPrice(product)}</span>
          {discount && product.originalPrice && (
            <span className="text-xs text-gray-400 line-through">৳{product.originalPrice}</span>
          )}
        </div>
        <button
          type="button"
          disabled={product.soldOut}
          className="mt-auto rounded-xl bg-brand-600 px-3 py-2.5 text-sm font-medium text-white transition-all duration-300 hover:bg-brand-700 hover:shadow-md active:scale-[0.97] disabled:cursor-not-allowed disabled:bg-gray-300 disabled:active:scale-100"
        >
          {product.soldOut ? t("outOfStock") : t("addToCart")}
        </button>
      </div>
    </div>
  );
}
