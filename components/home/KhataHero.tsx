"use client";

import Link from "next/link";
import { Check, FileText } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

const TICKS = ["tick1", "tick2", "tick3", "tick4"] as const;

export function KhataHero() {
  const locale = useLocale();
  const t = useTranslations("hero");

  return (
    <section className="khata-rules khata-margin relative flex min-h-[460px] w-full min-w-0 max-w-full flex-col justify-center overflow-hidden rounded-xl border border-rule bg-white py-10 pl-20 pr-6 shadow-sm sm:pr-10">
      {/* teacher's marks — the one flourish */}
      <div
        aria-hidden
        className="absolute right-6 top-6 rotate-6 rounded-full border-2 border-accent-500/70 px-3.5 py-1.5 font-display text-lg font-bold text-accent-500 sm:right-10 sm:top-8 sm:text-xl"
      >
        {t("marks")} ✓
      </div>

      <div className="flex max-w-xl flex-col items-start gap-5">
        <span className="rounded-md bg-accent-500 px-3 py-1 text-xs font-bold uppercase tracking-widest text-white">
          {t("stamp")}
        </span>

        <h1 className="font-display text-3xl font-bold leading-[1.25] text-ink-900 sm:text-[2.6rem] sm:leading-[1.2]">
          {t("titleA")}
          <br />
          <span className="text-brand-600">{t("titleB")}</span>
        </h1>

        <ul className="grid grid-cols-1 gap-x-6 gap-y-1.5 text-sm font-medium text-ink-800/90 sm:grid-cols-2">
          {TICKS.map((key) => (
            <li key={key} className="flex items-center gap-2">
              <Check className="h-4 w-4 shrink-0 text-tick-500" strokeWidth={3} />
              {t(key)}
            </li>
          ))}
        </ul>

        <div className="mt-1 flex flex-wrap items-center gap-4">
          <Link
            href={`/${locale}/shop`}
            className="rounded-full bg-brand-600 px-7 py-3 font-semibold text-white shadow-md transition hover:bg-brand-700"
          >
            {t("cta")}
          </Link>
          <Link
            href={`/${locale}/shop?category=full-set`}
            className="font-semibold text-brand-600 underline decoration-brand-300 decoration-2 underline-offset-4 transition hover:text-brand-700"
          >
            {t("ctaSecondary")}
          </Link>
        </div>

        <p className="text-sm text-ink-800/60">{t("from")}</p>

        <div className="flex items-start gap-2.5 rounded-lg border border-brand-100 bg-brand-50/70 px-4 py-3">
          <FileText className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" strokeWidth={2} />
          <p className="text-sm font-medium leading-6 text-brand-900">{t("customNote")}</p>
        </div>
      </div>
    </section>
  );
}
