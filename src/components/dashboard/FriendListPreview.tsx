import { friends } from '@/lib/mockData'
import { ArrowRight, MessageCircle, User } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import Link from 'next/link'

export default function FriendListPreview() {
  // 只显示前4个在线的朋友
  const t = useTranslations('Dashboard.Friends')
  const common = useTranslations('Common')
  const locale = useLocale()
  const onlineFriends = friends.filter(friend => friend.isOnline).slice(0, 4)

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">{t('title')}</h2>
        <Link
          href={`/${locale}/dashboard/friends`}
          className="flex items-center text-sm text-[#8573bd] hover:text-[#E8B98A] transition-colors"
        >
          {common('viewAll')}
          <ArrowRight className="w-4 h-4 ml-1" />
        </Link>
      </div>

      <div className="space-y-3">
        {onlineFriends.map((friend) => (
          <div
            key={friend.id}
            className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 bg-[#8573bd] rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
              </div>

              <div>
                <h3 className="font-medium text-gray-900">{friend.name}</h3>
                <p className="text-sm text-gray-500">{friend.injuryType}</p>
              </div>
            </div>

            <button className="p-2 text-gray-400 hover:text-[#8573bd] hover:bg-[#EAE6F5] rounded-lg transition-colors">
              <MessageCircle className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {onlineFriends.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <User className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>{t('noFriends')}</p>
        </div>
      )}

      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>{t('onlineFriends')}</span>
          <span className="flex items-center">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
            {t('peopleCount', { count: friends.filter(f => f.isOnline).length })}
          </span>
        </div>
      </div>
    </div>
  )
}
