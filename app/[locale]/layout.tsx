import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { setRequestLocale, getMessages } from "next-intl/server";
import { Baloo_Da_2, Hind_Siliguri } from "next/font/google";
import { routing } from "@/i18n/routing";
import { Header } from "@/components/layout/Header";
import { TrustBar } from "@/components/layout/TrustBar";
import { Footer } from "@/components/layout/Footer";

// display: Baloo Da 2 — sturdy, friendly Bengali display with a matching Latin
const balooDa2 = Baloo_Da_2({
  variable: "--font-display",
  subsets: ["bengali", "latin"],
  weight: ["400", "500", "600", "700", "800"],
});
// body: Hind Siliguri — crisp Bengali UI face, clean Latin coverage
const hindSiliguri = Hind_Siliguri({
  variable: "--font-body",
  subsets: ["bengali", "latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${balooDa2.variable} ${hindSiliguri.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <NextIntlClientProvider messages={messages}>
          <Header />
          <div className="flex-1">{children}</div>
          <TrustBar />
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
