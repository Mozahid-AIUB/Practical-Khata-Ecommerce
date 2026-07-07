"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";

const LOCALES = [
  { code: "bn", label: "BN" },
  { code: "en", label: "EN" },
] as const;

export function LanguageToggle() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  function switchTo(next: string) {
    // replace the leading /<locale> segment with the next locale
    const rest = pathname.replace(/^\/(bn|en)(?=\/|$)/, "");
    router.push(`/${next}${rest || ""}`);
  }

  return (
    <div className="flex items-center gap-1 rounded-full border border-brand-200 bg-white p-1 text-sm">
      {LOCALES.map((l) => (
        <button
          key={l.code}
          type="button"
          onClick={() => switchTo(l.code)}
          className={`rounded-full px-3 py-1 font-semibold transition ${
            locale === l.code
              ? "bg-brand-600 text-white"
              : "text-ink-800/60 hover:bg-brand-50"
          }`}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}
