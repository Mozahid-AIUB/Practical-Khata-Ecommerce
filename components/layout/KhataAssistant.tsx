"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { X, Truck, Wallet, CreditCard, PackageSearch, PenLine, MessageCircle } from "lucide-react";
import { WhatsApp } from "./SocialIcons";

const WHATSAPP_NUMBER = "8801611987955";

const QUICK_REPLIES = [
  { key: "delivery", Icon: Truck },
  { key: "price", Icon: Wallet },
  { key: "payment", Icon: CreditCard },
  { key: "tracking", Icon: PackageSearch },
] as const;

type Turn = { from: "bot" | "user"; text: string };

export function KhataAssistant() {
  const t = useTranslations("assistant");
  const [open, setOpen] = useState(false);
  const [turns, setTurns] = useState<Turn[]>([]);

  function ask(key: (typeof QUICK_REPLIES)[number]["key"]) {
    setTurns((prev) => [
      ...prev,
      { from: "user", text: t(`${key}Label`) },
      { from: "bot", text: t(`${key}Answer`) },
    ]);
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      {/* Khata Assistant — answers questions right here, never leaves the site */}
      {open && (
        <div className="khata-rules flex w-[calc(100vw-2.5rem)] max-w-sm flex-col overflow-hidden rounded-2xl border border-rule bg-white shadow-2xl">
          <div className="flex items-center gap-3 bg-brand-900 px-4 py-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-600 text-white">
              <PenLine className="h-4.5 w-4.5" strokeWidth={2.25} />
            </span>
            <div className="flex-1">
              <p className="text-sm font-bold text-white">{t("title")}</p>
              <p className="flex items-center gap-1.5 text-xs text-white/70">
                <span className="h-1.5 w-1.5 rounded-full bg-tick-500" aria-hidden />
                {t("online")}
              </p>
            </div>
            <button
              type="button"
              aria-label={t("close")}
              onClick={() => setOpen(false)}
              className="rounded-full p-1 text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex max-h-80 flex-col gap-3 overflow-y-auto px-4 py-4">
            <div className="max-w-[85%] self-start rounded-2xl rounded-tl-sm bg-brand-50 px-3.5 py-2.5 text-sm text-ink-900">
              {t("greeting")}
            </div>

            {turns.map((turn, i) =>
              turn.from === "user" ? (
                <div
                  key={i}
                  className="max-w-[85%] self-end rounded-2xl rounded-tr-sm bg-brand-600 px-3.5 py-2.5 text-sm text-white"
                >
                  {turn.text}
                </div>
              ) : (
                <div
                  key={i}
                  className="max-w-[85%] self-start rounded-2xl rounded-tl-sm bg-brand-50 px-3.5 py-2.5 text-sm text-ink-900"
                >
                  {turn.text}
                </div>
              ),
            )}

            <div className="flex flex-wrap gap-2">
              {QUICK_REPLIES.map(({ key, Icon }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => ask(key)}
                  className="flex items-center gap-1.5 rounded-full bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-brand-700"
                >
                  <Icon className="h-3.5 w-3.5" />
                  {t(`${key}Label`)}
                </button>
              ))}
            </div>
          </div>

          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 border-t border-rule bg-brand-50 px-4 py-3 text-sm font-semibold text-brand-700 transition hover:bg-brand-100"
          >
            <WhatsApp className="h-4 w-4 text-[#25D366]" />
            {t("continueOnWhatsapp")}
          </a>
        </div>
      )}

      {/* two independent launchers: Khata Assistant (in-page) and WhatsApp (external chat) */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label={open ? t("close") : t("open")}
          onClick={() => setOpen((v) => !v)}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-700 text-white shadow-lg transition hover:bg-brand-800"
        >
          {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
        </button>
        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t("whatsappLabel")}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition hover:brightness-95"
        >
          <WhatsApp className="h-7 w-7" />
        </a>
      </div>
    </div>
  );
}
