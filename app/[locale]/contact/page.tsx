import { setRequestLocale, getTranslations } from "next-intl/server";
import { PenLine, RefreshCcw, MessageCircle, Clock3, Phone, Clock } from "lucide-react";
import { WhatsApp } from "@/components/layout/SocialIcons";
import { ContactForm } from "@/components/about/ContactForm";

type Props = { params: Promise<{ locale: string }> };

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");

  const promises = [
    { Icon: PenLine, title: t("promise1Title"), text: t("promise1Text") },
    { Icon: RefreshCcw, title: t("promise2Title"), text: t("promise2Text") },
    { Icon: MessageCircle, title: t("promise3Title"), text: t("promise3Text") },
    { Icon: Clock3, title: t("promise4Title"), text: t("promise4Text") },
  ];

  return (
    <main>
      {/* hero intro */}
      <section className="mx-auto max-w-3xl px-4 py-14 text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">{t("eyebrow")}</p>
        <h1 className="mt-2 font-display text-3xl font-bold text-ink-900 sm:text-4xl">{t("heading")}</h1>
        <p className="mt-4 text-base leading-relaxed text-gray-600">{t("intro")}</p>
      </section>

      {/* founder story — always in Bangla regardless of site locale, khata-margin note style */}
      <section className="bg-white">
        <div className="mx-auto max-w-3xl px-4 py-12">
          <h2 className="mb-6 flex items-center gap-3 font-display text-2xl font-bold text-ink-900">
            <span className="h-7 w-1.5 rounded-full bg-accent-500" aria-hidden />
            কেন শুরু করেছিলাম
          </h2>
          <div className="khata-margin khata-rules space-y-4 rounded-lg border border-rule bg-[#fbfaf6] py-6 pl-16 pr-6 text-sm leading-8 text-ink-800">
            <p>
              শুরুটা হয়েছিল একটা চেনা সমস্যা থেকে — জমা দেওয়ার আগের রাতে শিক্ষার্থীরা ক্লান্ত হয়ে ডায়াগ্রাম আর
              পাতার পর পাতা হাতে কপি করে যাচ্ছে, তারপরও চিন্তায় থাকছে হাতের লেখা বোর্ডের জন্য যথেষ্ট নিট হবে কিনা।
            </p>
            <p>
              আমরা প্রথমে নিজেদের পরিচিত কিছু শিক্ষার্থীর খাতা হাতে লিখে দিতে শুরু করি — তাদের ইনডেক্স হুবহু কপি
              করে, বোর্ড ফরম্যাট মিলিয়ে, প্রতিটা ডায়াগ্রাম পরিষ্কার রেখে। কথা দ্রুত ছড়িয়ে পড়ে, কারণ জমা দেওয়ার
              আগের দিন একজন দুশ্চিন্তাগ্রস্ত শিক্ষার্থীর মুখে যে স্বস্তি দেখেছিলাম, সেটা ভোলার মতো না।
            </p>
            <p>
              আজ আমরা ঢাকা থেকে সিলেট, চট্টগ্রাম পর্যন্ত সারা দেশের ১,২০০+ শিক্ষার্থীর খাতা হাতে লিখে দিয়েছি —
              কিন্তু প্রক্রিয়াটা এখনও একই আছে যেটা দিয়ে শুরু করেছিলাম: তোমার ইনডেক্স, আমাদের হাতের লেখা, সঠিকভাবে
              করা।
            </p>
          </div>
        </div>
      </section>

      {/* what we promise */}
      <section className="mx-auto max-w-5xl px-4 py-12">
        <h2 className="mb-6 flex items-center gap-3 font-display text-2xl font-bold text-ink-900">
          <span className="h-7 w-1.5 rounded-full bg-accent-500" aria-hidden />
          {t("promiseHeading")}
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {promises.map(({ Icon, title, text }) => (
            <div key={title} className="flex gap-4 rounded-xl border border-rule bg-white p-5 shadow-sm">
              <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                <Icon className="h-5 w-5" strokeWidth={1.75} />
              </span>
              <div>
                <p className="font-semibold text-ink-900">{title}</p>
                <p className="mt-1 text-sm text-gray-600">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* contact */}
      <section className="bg-brand-50/60">
        <div className="mx-auto max-w-5xl px-4 py-12">
          <h2 className="mb-2 font-display text-2xl font-bold text-ink-900">{t("contactHeading")}</h2>
          <p className="mb-6 max-w-2xl text-sm text-gray-600">{t("contactText")}</p>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.2fr]">
            <div className="flex flex-col gap-4">
              <a
                href="tel:01611987955"
                className="flex items-center gap-4 rounded-xl border border-rule bg-white p-5 shadow-sm transition hover:border-brand-300"
              >
                <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                  <Phone className="h-5 w-5" strokeWidth={1.75} />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{t("callLabel")}</p>
                  <p className="font-bold text-ink-900">01611-987955</p>
                </div>
              </a>

              <a
                href="https://wa.me/8801611987955"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 rounded-xl border border-rule bg-white p-5 shadow-sm transition hover:border-brand-300"
              >
                <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-[#25D366]/10 text-[#25D366]">
                  <WhatsApp className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{t("whatsappLabel")}</p>
                  <p className="font-bold text-ink-900">01611-987955</p>
                </div>
              </a>

              <div className="flex items-center gap-4 rounded-xl border border-rule bg-white p-5 shadow-sm">
                <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                  <Clock className="h-5 w-5" strokeWidth={1.75} />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{t("hoursLabel")}</p>
                  <p className="font-bold text-ink-900">{t("hoursText")}</p>
                </div>
              </div>
            </div>

            <ContactForm />
          </div>
        </div>
      </section>
    </main>
  );
}
