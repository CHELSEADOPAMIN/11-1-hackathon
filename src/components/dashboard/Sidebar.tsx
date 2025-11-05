'use client'

import LanguageSwitcher from '@/components/LanguageSwitcher'
import { currentUser, NavigationItem, navigationItems } from '@/lib/mockData'
import { cn } from '@/lib/utils'
import {
  BookOpen,
  Calendar,
  ChevronDown,
  ChevronRight,
  Compass,
  Flame,
  Home,
  LogOut,
  MessageSquare,
  Settings,
  Target,
  User,
  Users,
  Video
} from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

const iconMap = {
  Home,
  Users,
  MessageSquare,
  Compass,
  Video,
  BookOpen,
  Calendar
}

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const t = useTranslations('Navigation')
  const common = useTranslations('Common')
  const sidebarT = useTranslations('Sidebar')
  const locale = useLocale()
  const withLocaleHref = (href?: string) => (href ? `/${locale}${href}` : undefined)
  const progressPercent = 40
  const missionsCompleted = 2
  const missionsTotal = 5
  const streakDays = 5

  const isItemActive = (item: NavigationItem): boolean => {
    const href = withLocaleHref(item.href)
    if (href && pathname === href) return true
    if (item.children) {
      return item.children.some(child => isItemActive(child))
    }
    return false
  }

  const isAnyChildActive = (item: NavigationItem): boolean => {
    if (!item.children) return false
    return item.children.some(child => isItemActive(child))
  }

  const getInitialExpanded = () => {
    const expanded: string[] = []
    navigationItems.forEach(item => {
      if (item.children && isAnyChildActive(item)) {
        expanded.push(item.translationKey)
      }
    })
    if (expanded.length === 0) {
      expanded.push('community')
    }
    return expanded
  }

  const [expandedItems, setExpandedItems] = useState<string[]>(getInitialExpanded)

  useEffect(() => {
    const expanded: string[] = []
    navigationItems.forEach(item => {
      if (item.children && isAnyChildActive(item)) {
        expanded.push(item.translationKey)
      }
    })
    if (expanded.length === 0) {
      expanded.push('community')
    }
    setExpandedItems(expanded)
  }, [pathname])

  const toggleExpand = (itemKey: string) => {
    setExpandedItems(prev =>
      prev.includes(itemKey)
        ? prev.filter(name => name !== itemKey)
        : [...prev, itemKey]
    )
  }

  const renderNavItem = (item: NavigationItem) => {
    const Icon = iconMap[item.icon as keyof typeof iconMap]
    const hasChildren = item.children && item.children.length > 0
    const isExpanded = expandedItems.includes(item.translationKey)
    const isActive = isItemActive(item)
    const isChildActive = isAnyChildActive(item)

    if (hasChildren) {
      return (
        <li key={item.translationKey}>
          <button
            onClick={() => toggleExpand(item.translationKey)}
            className={cn(
              "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors",
              isChildActive
                ? "bg-blue-50 text-blue-700"
                : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
            )}
          >
            <div className="flex items-center">
              <Icon className="w-5 h-5 mr-3" />
              {t(item.translationKey)}
            </div>
            {isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
          {isExpanded && (
            <ul className="ml-4 mt-1 space-y-1">
              {item.children!.map((child) => {
                const ChildIcon = iconMap[child.icon as keyof typeof iconMap]

                return (
                  <li key={child.translationKey}>
                    <Link
                      href={withLocaleHref(child.href) ?? '#'}
                      className={cn(
                        "flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                        isItemActive(child)
                          ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      )}
                    >
                      <ChildIcon className="w-4 h-4 mr-3" />
                      {t(child.translationKey)}
                    </Link>
                  </li>
                )
              })}
            </ul>
          )}
        </li>
      )
    }

    return (
      <li key={item.translationKey}>
        <Link
          href={withLocaleHref(item.href) ?? '#'}
          className={cn(
            "flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors",
            isActive
              ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
              : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
          )}
        >
          <Icon className="w-5 h-5 mr-3" />
          {t(item.translationKey)}
        </Link>
      </li>
    )
  }

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col overflow-visible relative z-10">
      {/* User Info Area */}
      <div className="p-6 border-b border-gray-200">
        <Link
          href={`/${locale}/dashboard/profile`}
          className="flex items-center space-x-3 hover:bg-gray-50 rounded-lg p-2 -m-2 transition-colors group"
        >
          <div className="w-10 h-10 bg-[#8573bd] rounded-full flex items-center justify-center group-hover:bg-[#E8B98A] transition-colors">
            <User className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 group-hover:text-[#8573bd]">{currentUser.name}</h3>
            <p className="text-sm text-gray-500">{currentUser.injuryType}</p>
          </div>
        </Link>
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
            <span className="text-sm text-gray-500">{common('online')}</span>
          </div>
          <LanguageSwitcher />
        </div>
      </div>

      {/* Navigation Area */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navigationItems.map(item => renderNavItem(item))}
        </ul>
      </nav>

      {/* Progress Card with Tooltip - Right above divider */}
      <div className="px-4 pb-4">
        <div className="relative group">
          {/* Main Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-all cursor-pointer">
              <div className="flex items-center gap-3 mb-3">
                {/* Left: Icon and Title */}
                <div className="w-10 h-10 bg-[#EAE6F5] rounded-full flex items-center justify-center flex-shrink-0">
                  <Target className="w-5 h-5 text-[#8573bd]" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 text-xs">{sidebarT('progressCard.title')}</h4>
                </div>
              </div>

              {/* Horizontal Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden mb-3">
                <div
                  className="h-full bg-[#8573bd] rounded-full transition-all"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>

              {/* Bottom: Progress and Streak */}
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center text-gray-500">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-1.5"></span>
                  <span>{sidebarT('progressCard.progress', { percent: progressPercent })}</span>
                </div>
                <div className="flex items-center text-orange-600">
                  <Flame className="w-3 h-3 mr-1" />
                  <span>{sidebarT('progressCard.streak', { days: streakDays })}</span>
                </div>
              </div>
            </div>

            {/* Tooltip on Right Side on Hover */}
          <div className="absolute left-full top-0 ml-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[100] pointer-events-none" style={{ willChange: 'opacity, visibility' }}>
            <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-lg w-64">
              <h4 className="font-semibold text-gray-900 text-sm mb-2">{sidebarT('progressCard.title')}</h4>
              <p className="text-xs text-gray-600 mb-3">
                {sidebarT('progressCard.description')}
              </p>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">
                  {sidebarT('progressCard.missions', { completed: missionsCompleted, total: missionsTotal })}
                </span>
                <div className="flex items-center text-orange-600">
                  <Flame className="w-3 h-3 mr-1" />
                  <span>{sidebarT('progressCard.streak', { days: streakDays })}</span>
                </div>
              </div>
            </div>
            {/* Tooltip Arrow */}
            <div className="absolute left-0 top-4 -ml-1 w-2 h-2 bg-white border-l border-t border-gray-200 transform rotate-45"></div>
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-gray-200 space-y-2">
        <button className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors">
          <Settings className="w-5 h-5 mr-3" />
          {common('settings')}
        </button>
        <button
          className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors"
          onClick={() => {
            if (window.confirm(common('confirmLogout'))) {
              // Redirect to login page
              router.push(`/${locale}/login`)
            }
          }}
        >
          <LogOut className="w-5 h-5 mr-3" />
          {common('logout')}
        </button>
      </div>
    </div>
  )
}
