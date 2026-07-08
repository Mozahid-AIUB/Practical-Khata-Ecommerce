"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Loader2, CheckCircle2 } from "lucide-react";

export function ContactForm() {
  const t = useTranslations("about");
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    // no backend endpoint for contact messages yet — this simply confirms
    // receipt in the UI; wire up to POST /api/v1/contact once it exists
    setTimeout(() => setStatus("sent"), 600);
  }

  if (status === "sent") {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-rule bg-white p-8 text-center">
        <CheckCircle2 className="h-10 w-10 text-tick-500" strokeWidth={1.5} />
        <p className="font-display text-lg font-bold text-ink-900">{t("formSuccessTitle")}</p>
        <p className="max-w-sm text-sm text-gray-600">{t("formSuccessText")}</p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-2 text-sm font-semibold text-brand-600 transition hover:text-brand-700"
        >
          {t("formSuccessAnother")}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 rounded-xl border border-rule bg-white p-6 shadow-sm">
      <h3 className="font-display text-lg font-bold text-ink-900">{t("formHeading")}</h3>
      <input
        type="text"
        required
        placeholder={t("formName")}
        className="rounded-lg border border-rule px-3.5 py-2.5 text-sm focus:border-brand-400 focus:outline-none"
      />
      <input
        type="tel"
        required
        placeholder={t("formPhone")}
        className="rounded-lg border border-rule px-3.5 py-2.5 text-sm focus:border-brand-400 focus:outline-none"
      />
      <textarea
        required
        rows={4}
        placeholder={t("formMessage")}
        className="resize-none rounded-lg border border-rule px-3.5 py-2.5 text-sm focus:border-brand-400 focus:outline-none"
      />
      <button
        type="submit"
        disabled={status === "sending"}
        className="mt-1 flex items-center justify-center gap-2 rounded-lg bg-gradient-to-b from-brand-500 to-brand-700 px-4 py-2.5 text-sm font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_2px_6px_-1px_rgba(23,45,85,0.45)] transition-all hover:from-brand-400 hover:to-brand-600 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {status === "sending" && <Loader2 className="h-4 w-4 animate-spin" />}
        {status === "sending" ? t("formSending") : t("formSubmit")}
      </button>
    </form>
  );
}
