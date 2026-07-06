import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";
import en from "../messages/en.json";
import bn from "../messages/bn.json";

// Static map instead of a dynamic import path so the bundler always includes
// both catalogs (a templated `import(\`../messages/${locale}.json\`)` can fail
// to resolve in production bundling and crash with a 500).
const messages = { en, bn } as const;

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale,
    messages: messages[locale],
  };
});
