import { currentUser } from '@/lib/mockData'
import { formatDate, getGreetingKey } from '@/lib/utils'
import { useLocale, useTranslations } from 'next-intl'

export default function Greeting() {
  const locale = useLocale()
  const t = useTranslations('Dashboard.Greeting')
  const greetingKey = getGreetingKey()
  const greeting = t(`greetings.${greetingKey}`)
  const today = formatDate(new Date(), locale)
  const recoveryDay = Math.floor((Date.now() - new Date(currentUser.joinDate).getTime()) / (1000 * 60 * 60 * 24))

  return (
    <div className="bg-[#8573bd] rounded-xl p-6 text-white mb-6">
      <h1 className="text-2xl font-bold mb-2">
        {greeting}, {currentUser.name}!
      </h1>
      <p className="text-white/80 mb-4">
        {t('todayMessage', { date: today })}
      </p>
      <div className="flex items-center text-sm text-white/70">
        <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
        {t('recoveryDay', { day: recoveryDay })}
      </div>
    </div>
  )
}
