import { setRequestLocale, getTranslations } from "next-intl/server";
import { ShopBrowser } from "@/components/shop/ShopBrowser";
import { getCategories, getProductsByCategory } from "@/lib/api";
import type { Localized } from "@/lib/mock-data";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string }>;
};

export default async function ShopPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { category: activeCategorySlug } = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations("shop");

  const categories = await getCategories();
  const categoriesWithProducts = await Promise.all(
    categories.map(async (category) => ({
      ...category,
      products: await getProductsByCategory(category.slug),
    }))
  );

  const visible = activeCategorySlug
    ? categoriesWithProducts.filter((c) => c.slug === activeCategorySlug)
    : categoriesWithProducts;

  const heading =
    activeCategorySlug && visible[0]
      ? visible[0].name[locale as keyof Localized] ?? visible[0].name.en
      : t("heading");

  return (
    <main className="mx-auto max-w-7xl px-4 pb-24 pt-5">
      <h1 className="mb-4 font-display text-2xl font-bold text-ink-900 sm:text-3xl">{heading}</h1>
      <ShopBrowser categories={visible} />
    </main>
  );
}
