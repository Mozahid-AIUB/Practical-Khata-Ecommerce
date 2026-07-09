import type { MetadataRoute } from "next";
import { getCategories } from "@/lib/api";
import { routing } from "@/i18n/routing";

const BASE_URL = "https://shop.practicalkhata.pro.bd";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const categories = await getCategories();

  const staticPaths = ["", "/shop", "/about", "/contact", "/track"];

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of routing.locales) {
    for (const path of staticPaths) {
      entries.push({
        url: `${BASE_URL}/${locale}${path}`,
        lastModified: new Date(),
      });
    }
    for (const category of categories) {
      entries.push({
        url: `${BASE_URL}/${locale}/shop?category=${category.slug}`,
        lastModified: new Date(),
      });
    }
  }

  return entries;
}
