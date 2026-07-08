import { setRequestLocale, getTranslations } from "next-intl/server";
import { CategorySidebar } from "@/components/layout/CategorySidebar";
import { CategoryShowcase } from "@/components/home/CategoryShowcase";
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
  const productsByCategory = await Promise.all(
    categories.map((category) => getProductsByCategory(category.slug))
  );

  const visibleCategories = activeCategorySlug
    ? categories.filter((c) => c.slug === activeCategorySlug)
    : categories;

  const totalCount = visibleCategories.reduce((sum, category) => {
    const i = categories.findIndex((c) => c.slug === category.slug);
    return sum + productsByCategory[i].length;
  }, 0);

  const heading =
    activeCategorySlug && visibleCategories[0]
      ? visibleCategories[0].name[locale as keyof Localized] ?? visibleCategories[0].name.en
      : t("heading");

  return (
    <main className="mx-auto max-w-7xl px-4 py-4">
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2 border-b border-rule pb-3">
        <h1 className="font-display text-xl font-bold text-ink-900 sm:text-2xl">{heading}</h1>
        <p className="text-sm text-gray-500">{t("productsFound", { count: totalCount })}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[14rem_1fr]">
        <div className="hidden lg:block">
          <CategorySidebar
            categories={categories}
            productCounts={productsByCategory.map((p) => p.length)}
            showOrderingNote={false}
          />
        </div>

        <div className="min-w-0">
          {visibleCategories.map((category) => {
            const i = categories.findIndex((c) => c.slug === category.slug);
            return (
              <CategoryShowcase key={category.id} category={category} products={productsByCategory[i]} compact />
            );
          })}
        </div>
      </div>
    </main>
  );
}
