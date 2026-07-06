"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";

const LOCALES = [
  { code: "bn", label: "বাংলা" },
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
    <div className="flex items-center gap-1 text-sm">
      {LOCALES.map((l) => (
        <button
          key={l.code}
          type="button"
          onClick={() => switchTo(l.code)}
          className={`rounded px-2 py-1 transition ${
            locale === l.code
              ? "bg-brand-600 text-white"
              : "text-white/70 hover:bg-white/10"
          }`}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}
