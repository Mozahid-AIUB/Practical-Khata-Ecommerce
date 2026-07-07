"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { useTranslations } from "next-intl";

const QUOTES = [1, 2, 3, 4] as const;

export function Testimonials() {
  const t = useTranslations("testimonials");

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5 }}
      className="mx-auto max-w-7xl px-4 py-10"
    >
      <div className="mb-6 flex flex-wrap items-baseline justify-between gap-3 border-b border-rule pb-3">
        <h2 className="flex items-center gap-3 font-display text-2xl font-bold text-ink-900">
          <span className="h-7 w-1.5 rounded-full bg-accent-500" aria-hidden />
          {t("heading")}
        </h2>
        <p className="text-sm font-medium text-ink-800/60">{t("sub")}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {QUOTES.map((i) => (
          <figure
            key={i}
            className="khata-rules flex flex-col gap-3 rounded-2xl border border-rule bg-white p-6 leading-8 shadow-sm"
          >
            <div className="flex gap-0.5 text-amber-400" aria-label="5 out of 5 stars" role="img">
              {Array.from({ length: 5 }).map((_, s) => (
                <Star key={s} className="h-4 w-4" fill="currentColor" strokeWidth={0} />
              ))}
            </div>
            <blockquote className="text-sm font-medium leading-8 text-ink-800">
              “{t(`q${i}`)}”
            </blockquote>
            <figcaption className="mt-auto text-sm">
              <span className="font-bold text-ink-900">{t(`n${i}`)}</span>
              <span className="text-ink-800/60"> — {t(`r${i}`)}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </motion.section>
  );
}
