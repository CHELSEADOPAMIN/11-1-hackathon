import { lobbyPosts } from '@/lib/mockData'
import { ArrowRight, Heart, MessageCircle, MessageSquare, User } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import Link from 'next/link'

export default function LobbyPreview() {
  // 只显示最新的3条帖子
  const locale = useLocale()
  const t = useTranslations('Dashboard.Lobby')
  const common = useTranslations('Common')
  const time = useTranslations('Time')
  const recentPosts = lobbyPosts.slice(0, 3)

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date()
    const postTime = new Date(timestamp)
    const diffInHours = Math.floor((now.getTime() - postTime.getTime()) / (1000 * 60 * 60))
    const diffInMinutes = Math.floor((now.getTime() - postTime.getTime()) / (1000 * 60))

    if (diffInMinutes < 60) return time('justNow')
    if (diffInHours < 24) return time('hoursAgo', { count: diffInHours })
    return time('daysAgo', { count: Math.floor(diffInHours / 24) })
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">{t('title')}</h2>
        <Link
          href={`/${locale}/dashboard/lobby`}
          className="flex items-center text-sm text-[#8573bd] hover:text-[#E8B98A] transition-colors"
        >
          {common('viewAll')}
          <ArrowRight className="w-4 h-4 ml-1" />
        </Link>
      </div>

      <div className="space-y-4">
        {recentPosts.map((post) => (
          <div
            key={post.id}
            className="p-4 border border-gray-100 rounded-lg hover:border-gray-200 transition-colors"
          >
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-[#8573bd] rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-white" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="font-medium text-gray-900">{post.author.name}</h3>
                  <span className="text-xs text-gray-500">{post.author.injuryType}</span>
                  <span className="text-xs text-gray-400">·</span>
                  <span className="text-xs text-gray-500">{formatTimeAgo(post.timestamp)}</span>
                </div>

                <p className="text-sm text-gray-700 line-clamp-2 mb-3">
                  {post.content}
                </p>

                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <button className="flex items-center space-x-1 hover:text-red-500 transition-colors">
                    <Heart className="w-3 h-3" />
                    <span>{post.likes}</span>
                  </button>
                  <button className="flex items-center space-x-1 hover:text-[#8573bd] transition-colors">
                    <MessageCircle className="w-3 h-3" />
                    <span>{post.comments}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <Link
          href={`/${locale}/dashboard/lobby`}
          className="flex items-center justify-center w-full py-2 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
        >
          <MessageSquare className="w-4 h-4 mr-2" />
          {common('joinDiscussion')}
        </Link>
      </div>
    </div>
  )
}
