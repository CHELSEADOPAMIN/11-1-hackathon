'use client';

import { ChevronDown, Globe } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

const languages = [
  { code: 'en', flag: '🇺🇸' },
  { code: 'zh', flag: '🇨🇳' },
  { code: 'th', flag: '🇹🇭' },
  { code: 'id', flag: '🇮🇩' },
  { code: 'de', flag: '🇩🇪' },
  { code: 'es', flag: '🇪🇸' },
  { code: 'fr', flag: '🇫🇷' },
  { code: 'ja', flag: '🇯🇵' },
  { code: 'ko', flag: '🇰🇷' },
  { code: 'vi', flag: '🇻🇳' }
] as const;

export default function LanguageSwitcher() {
  const t = useTranslations('LanguageSwitcher');
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const currentLanguage = useMemo(
    () => languages.find((lang) => lang.code === locale) ?? languages[0],
    [locale]
  );

  const handleLanguageChange = (newLocale: string) => {
    const basePath = pathname.replace(new RegExp(`^/${locale}`), '') || '/';
    const normalizedPath = basePath.startsWith('/') ? basePath : `/${basePath}`;
    const targetPath = normalizedPath === '/' ? '' : normalizedPath;

    router.push(`/${newLocale}${targetPath}`);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
        aria-label={t('selectLanguage')}
      >
        <Globe className="w-4 h-4 text-gray-600" />
        <span className="text-sm font-medium text-gray-700">
          {currentLanguage.flag} {t(`languages.${currentLanguage.code}`)}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
            <div className="py-1">
              {languages.map((language) => {
                const isActive = language.code === locale;
                return (
                  <button
                    key={language.code}
                    onClick={() => handleLanguageChange(language.code)}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors flex items-center space-x-3 ${
                      isActive ? 'bg-[#8573bd]/10 text-[#8573bd]' : 'text-gray-700'
                    }`}
                  >
                    <span className="text-lg">{language.flag}</span>
                    <span className="font-medium">{t(`languages.${language.code}`)}</span>
                    {isActive && <span className="ml-auto text-[#8573bd]">✓</span>}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
