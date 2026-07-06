"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Sprout } from "lucide-react";

export function ComingSoon({ heading }: { heading: string }) {
  const locale = useLocale();
  const t = useTranslations("comingSoon");

  return (
    <main className="mx-auto flex max-w-3xl flex-col items-center gap-5 px-4 py-24 text-center">
      <Sprout className="h-14 w-14 text-brand-500" strokeWidth={1.5} />
      <p className="text-sm font-medium uppercase tracking-wide text-brand-600">{heading}</p>
      <h1 className="font-serif text-4xl font-bold text-brand-900">{t("title")}</h1>
      <p className="max-w-md text-brand-700">{t("text")}</p>
      <Link
        href={`/${locale}`}
        className="mt-2 rounded-full bg-brand-600 px-6 py-3 font-medium text-white transition hover:bg-brand-700"
      >
        {t("back")}
      </Link>
    </main>
  );
}
