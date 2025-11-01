'use client'

import { currentUser, navigationItems } from '@/lib/mockData'
import { cn } from '@/lib/utils'
import {
  BookOpen,
  Calendar,
  Home,
  LogOut,
  MessageSquare,
  Settings,
  User,
  Users,
  Video
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const iconMap = {
  Home,
  Users,
  MessageSquare,
  Video,
  BookOpen,
  Calendar
}

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col">
      {/* 用户信息区域 */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{currentUser.name}</h3>
            <p className="text-sm text-gray-500">{currentUser.injuryType}</p>
          </div>
        </div>
        <div className="mt-3 flex items-center">
          <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
          <span className="text-sm text-gray-600">Online</span>
        </div>
      </div>

      {/* 主导航区域 */}
      <nav className="flex-1 px-4 py-6">
        <ul className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = iconMap[item.icon as keyof typeof iconMap]
            const isActive = pathname === item.href

            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* 底部操作区域 */}
      <div className="p-4 border-t border-gray-200">
        <div className="space-y-2">
          <Link
            href="/dashboard/settings"
            className="flex items-center px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
          >
            <Settings className="w-5 h-5 mr-3" />
            Settings
          </Link>
          <button
            className="w-full flex items-center px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
            onClick={() => {
              // Add logout logic here
              console.log('User logout')
            }}
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </button>
        </div>
      </div>
    </div>
  )
}
