import { setRequestLocale, getTranslations } from "next-intl/server";
import { ComingSoon } from "@/components/layout/ComingSoon";

type Props = { params: Promise<{ locale: string }> };

export default async function ShopPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("nav");
  return <ComingSoon heading={t("shop")} />;
}
