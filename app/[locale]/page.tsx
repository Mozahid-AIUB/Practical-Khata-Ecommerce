import { setRequestLocale } from "next-intl/server";
import { CategorySidebar } from "@/components/layout/CategorySidebar";
import { KhataHero } from "@/components/home/KhataHero";
import { BundleCard } from "@/components/home/BundleCard";
import { CategoryShowcase } from "@/components/home/CategoryShowcase";
import { Testimonials } from "@/components/home/Testimonials";
import { getCategories } from "@/lib/mock-data";

type Props = { params: Promise<{ locale: string }> };

export default async function Home({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const categories = getCategories();

  return (
    <main className="mx-auto max-w-7xl px-4 py-6">
      {/* sidebar · khata-page hero · bundle offer — equal-height columns (desktop) */}
      <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-[16rem_1fr_19rem]">
        <div className="hidden lg:block">
          <CategorySidebar />
        </div>
        <div className="flex min-w-0">
          <KhataHero />
        </div>
        <div className="hidden min-w-0 lg:flex">
          <BundleCard />
        </div>
      </div>

      {/* mobile/tablet: bundle offer + khata list stacked below the hero */}
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:hidden">
        <BundleCard />
        <CategorySidebar />
      </div>

      {/* SSC · HSC · full set rows */}
      <div className="mt-4">
        {categories.map((category) => (
          <CategoryShowcase key={category.id} category={category} />
        ))}
      </div>

      <Testimonials />
    </main>
  );
}
