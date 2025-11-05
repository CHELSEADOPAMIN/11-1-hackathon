'use client';

import { knowledgeArticles } from '@/lib/mockData';
import { cn, formatDate } from '@/lib/utils';
import { BookOpen, Clock, Filter, Search, User } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';

type CategoryId = 'all' | 'Knee' | 'Shoulder' | 'Spine' | 'Ankle' | 'Hip' | 'Wrist';

export default function KnowledgePage() {
  const locale = useLocale();
  const t = useTranslations('Knowledge');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('all');

  const categories = useMemo(() => {
    const base: Array<{ id: CategoryId; count: number }> = [
      { id: 'all', count: knowledgeArticles.length },
      { id: 'Knee', count: knowledgeArticles.filter((a) => a.category === 'Knee').length },
      { id: 'Shoulder', count: knowledgeArticles.filter((a) => a.category === 'Shoulder').length },
      { id: 'Spine', count: knowledgeArticles.filter((a) => a.category === 'Spine').length },
      { id: 'Ankle', count: knowledgeArticles.filter((a) => a.category === 'Ankle').length },
      { id: 'Hip', count: knowledgeArticles.filter((a) => a.category === 'Hip').length },
      { id: 'Wrist', count: knowledgeArticles.filter((a) => a.category === 'Wrist').length }
    ];

    const getLabel = (id: CategoryId) =>
      id === 'all' ? t('filters.categories.all') : t(`filters.categories.${id.toLowerCase()}` as const);

    return base.map((category) => ({
      ...category,
      label: getLabel(category.id),
      labelWithCount: t('filters.categoryWithCount', {
        name: getLabel(category.id),
        count: category.count
      })
    }));
  }, [t]);

  const filteredArticles = knowledgeArticles.filter((article) => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    const matchesSearch =
      !normalizedSearch ||
      article.title.toLowerCase().includes(normalizedSearch) ||
      article.summary.toLowerCase().includes(normalizedSearch);
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const formatPublishDate = (dateString: string) =>
    formatDate(new Date(dateString), locale, { year: 'numeric', month: 'long', day: 'numeric' });

  const totalAuthors = useMemo(
    () => new Set(knowledgeArticles.map((article) => article.author)).size,
    []
  );

  const averageReadingTime = useMemo(
    () =>
      Math.round(
        knowledgeArticles.reduce((sum, article) => sum + article.readTime, 0) /
          knowledgeArticles.length
      ),
    []
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('title')}</h1>
        <p className="text-gray-600">{t('subtitle')}</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder={t('search.placeholder')}
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={selectedCategory}
              onChange={(event) => setSelectedCategory(event.target.value as CategoryId)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.labelWithCount}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={cn(
              'px-4 py-2 rounded-full text-sm font-medium transition-colors',
              selectedCategory === category.id
                ? 'bg-[#8573bd] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            )}
          >
            {category.labelWithCount}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-[#EAE6F5] rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-[#8573bd]" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">{t('stats.totalArticles')}</p>
              <p className="text-2xl font-bold text-gray-900">{knowledgeArticles.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <User className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">{t('stats.expertAuthors')}</p>
              <p className="text-2xl font-bold text-gray-900">{totalAuthors}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-[#E8B98A]" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">{t('stats.avgReadingTime')}</p>
              <p className="text-2xl font-bold text-gray-900">
                {t('stats.minutes', { minutes: averageReadingTime })}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {t('list.heading', { count: filteredArticles.length })}
          </h2>
        </div>

        <div className="p-6">
          {filteredArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.map((article) => (
                <div
                  key={article.id}
                  className="border border-gray-200 rounded-lg overflow-hidden hover:border-gray-300 hover:shadow-sm transition-all cursor-pointer"
                >
                  <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                    <BookOpen className="w-12 h-12 text-[#8573bd]" />
                  </div>

                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2 py-1 bg-[#EAE6F5] text-[#8573bd] text-xs rounded-full">
                        {t(`filters.categories.${article.category.toLowerCase()}` as const, {
                          defaultValue: article.category
                        })}
                      </span>
                      <div className="flex items-center text-xs text-gray-500">
                        <Clock className="w-3 h-3 mr-1" />
                        {t('list.readingTime', { minutes: article.readTime })}
                      </div>
                    </div>

                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{article.title}</h3>

                    <p className="text-sm text-gray-600 mb-3 line-clamp-3">{article.summary}</p>

                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{article.author}</span>
                      <span>{formatPublishDate(article.publishDate)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">{t('empty.title')}</h3>
              <p className="text-gray-500">{t('empty.description')}</p>
            </div>
          )}
        </div>
      </div>

      {filteredArticles.length > 0 && (
        <div className="text-center py-8">
          <button className="px-6 py-3 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors">
            {t('list.loadMore')}
          </button>
        </div>
      )}
    </div>
  );
}
