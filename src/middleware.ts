import createMiddleware from 'next-intl/middleware';
import { locales } from './i18n';

export default createMiddleware({
  // A list of all locales that are supported
  locales,

  // Used when no locale matches
  defaultLocale: 'en',

  // Always use locale prefix
  localePrefix: 'always',

  // Always fall back to default locale instead of Accept-Language header
  localeDetection: false
});

export const config = {
  // Match only internationalized pathnames, exclude root path to let page.tsx handle it
  matcher: ['/(en|zh|th|id|de|es|fr|ja|ko|vi)/:path*']
};
