import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

// Supported locales for the application
export const locales = ['en', 'zh', 'th', 'id', 'de', 'es', 'fr', 'ja', 'ko', 'vi'] as const;
export type Locale = (typeof locales)[number];

function isSupportedLocale(value: string | undefined): value is Locale {
  return Boolean(value) && locales.includes(value as Locale);
}

export default getRequestConfig(async ({ locale, requestLocale }) => {
  // `locale` is provided when an explicit locale override is used.
  // Otherwise we need to read it from `requestLocale`.
  const resolvedLocale = locale ?? (await requestLocale);

  if (!isSupportedLocale(resolvedLocale)) {
    notFound();
  }

  return {
    locale: resolvedLocale,
    messages: (await import(`../messages/${resolvedLocale}.json`)).default
  };
});
