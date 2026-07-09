"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { X, Plus, Minus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "./CartContext";
import { SubjectCover } from "@/components/home/SubjectCover";
import type { Localized } from "@/lib/mock-data";

function formatPrice(amount: number): string {
  return `৳${amount.toLocaleString("en-US")}`;
}

export function CartDrawer() {
  const locale = useLocale() as keyof Localized;
  const t = useTranslations("cart");
  const { cart, isOpen, close, loading, updateItem, removeItem } = useCart();

  // lock background scroll while the drawer is open
  useEffect(() => {
    if (!isOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [isOpen]);

  const items = cart?.items ?? [];

  return (
    <>
      {/* backdrop */}
      <div
        aria-hidden={!isOpen}
        onClick={close}
        className={`fixed inset-0 z-[60] bg-ink-900/40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* panel */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={t("title")}
        className={`fixed inset-y-0 right-0 z-[70] flex w-full max-w-sm flex-col bg-white shadow-2xl transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-rule px-5 py-4">
          <h2 className="font-display text-lg font-bold text-ink-900">{t("title")}</h2>
          <button
            type="button"
            aria-label={t("close")}
            onClick={close}
            className="rounded-full p-1.5 text-ink-800/70 transition hover:bg-brand-50 hover:text-brand-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
            <ShoppingBag className="h-12 w-12 text-gray-300" strokeWidth={1.5} />
            <p className="font-semibold text-ink-900">{t("empty")}</p>
            <p className="text-sm text-gray-500">{t("emptyText")}</p>
            <Link
              href={`/${locale}/shop`}
              onClick={close}
              className="mt-2 rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
            >
              {t("browse")}
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-4">
              <ul className="flex flex-col gap-4">
                {items.map((item) => {
                  const name = item.product.name[locale] ?? item.product.name.en;
                  return (
                    <li key={item.id} className="flex gap-3">
                      <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border border-rule">
                        <SubjectCover product={item.product} />
                      </div>

                      <div className="flex min-w-0 flex-1 flex-col gap-1">
                        <p className="line-clamp-1 text-sm font-semibold text-ink-900">{name}</p>
                        <p className="currency text-sm font-bold text-brand-700">{formatPrice(item.unitPrice)}</p>

                        <div className="mt-1 flex items-center justify-between">
                          <div className="flex items-center rounded-full border border-rule">
                            <button
                              type="button"
                              disabled={loading || item.quantity <= 1}
                              onClick={() => updateItem(item.id, item.quantity - 1)}
                              aria-label="Decrease quantity"
                              className="flex h-7 w-7 items-center justify-center text-ink-700 transition hover:text-brand-700 disabled:opacity-40"
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </button>
                            <span className="w-6 text-center text-sm font-semibold text-ink-900">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              disabled={loading}
                              onClick={() => updateItem(item.id, item.quantity + 1)}
                              aria-label="Increase quantity"
                              className="flex h-7 w-7 items-center justify-center text-ink-700 transition hover:text-brand-700 disabled:opacity-40"
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>

                          <button
                            type="button"
                            disabled={loading}
                            onClick={() => removeItem(item.id)}
                            aria-label={t("remove")}
                            className="flex h-7 w-7 items-center justify-center rounded-full text-gray-400 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-40"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="border-t border-rule px-5 py-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="font-semibold text-ink-900">{t("subtotal")}</span>
                <span className="currency text-lg font-extrabold text-brand-700">
                  {formatPrice(cart?.totalPrice ?? 0)}
                </span>
              </div>
              <button
                type="button"
                disabled={loading}
                className="w-full rounded-xl bg-gradient-to-b from-brand-500 to-brand-700 px-4 py-3 text-sm font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_2px_6px_-1px_rgba(23,45,85,0.45)] transition-all hover:from-brand-400 hover:to-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {t("checkout")}
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
