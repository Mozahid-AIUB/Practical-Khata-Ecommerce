"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ShoppingCart, Heart, Loader2, Check } from "lucide-react";
import { discountPercent, type Product, type Localized } from "@/lib/mock-data";
import { useCart } from "@/components/cart/CartContext";
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
  const { addItem } = useCart();
  const [status, setStatus] = useState<"idle" | "loading" | "added">("idle");

  async function handleAddToCart() {
    if (status === "loading") return;
    setStatus("loading");
    try {
      await addItem(product.id);
      setStatus("added");
      setTimeout(() => setStatus("idle"), 1500);
    } catch {
      setStatus("idle");
    }
  }

  return (
    <div className="card-premium group relative flex flex-col overflow-hidden rounded-2xl border border-rule/70 bg-white shadow-[0_1px_3px_rgba(23,45,85,0.07),0_1px_2px_rgba(23,45,85,0.05)]">
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
          <button
            type="button"
            aria-label={t("addToCart")}
            disabled={product.soldOut || status === "loading"}
            onClick={handleAddToCart}
            className="rounded-full bg-white p-2 text-ink-800 shadow-md transition hover:bg-brand-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status === "loading" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : status === "added" ? (
              <Check className="h-4 w-4" />
            ) : (
              <ShoppingCart className="h-4 w-4" />
            )}
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

      <div className="flex flex-1 flex-col gap-1.5 p-3">
        <h3 title={name} className="line-clamp-2 min-h-[2.2em] text-xs font-semibold leading-tight text-ink-900">{name}</h3>
        {product.subject !== "bundle" && product.subject !== "assignment" && (
          <span className="w-fit max-w-full whitespace-nowrap rounded-md border border-brand-200 bg-brand-50 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-brand-700">
            Drawing + Writing
          </span>
        )}
        <div className="currency flex flex-wrap items-baseline gap-1.5">
          <span className="text-base font-extrabold tracking-tight text-brand-700">{formatPrice(product)}</span>
          {discount && product.originalPrice && (
            <span className="text-[11px] text-gray-400 line-through">৳{product.originalPrice}</span>
          )}
        </div>
        <button
          type="button"
          disabled={product.soldOut || status === "loading"}
          onClick={handleAddToCart}
          className="flex items-center justify-center gap-1.5 rounded-lg bg-gradient-to-b from-brand-500 to-brand-700 px-2 py-2 text-xs font-medium text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_2px_6px_-1px_rgba(23,45,85,0.45)] transition-all duration-300 hover:from-brand-400 hover:to-brand-600 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_4px_10px_-1px_rgba(23,45,85,0.5)] active:scale-[0.97] disabled:cursor-not-allowed disabled:from-gray-300 disabled:to-gray-300 disabled:shadow-none disabled:active:scale-100"
        >
          {status === "loading" && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
          {status === "added" && <Check className="h-3.5 w-3.5" />}
          {product.soldOut
            ? t("outOfStock")
            : status === "added"
              ? t("addedToCart")
              : t("addToCart")}
        </button>
      </div>
    </div>
  );
}
