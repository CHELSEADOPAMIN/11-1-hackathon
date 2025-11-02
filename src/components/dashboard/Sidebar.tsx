'use client'

import { currentUser, NavigationItem, navigationItems } from '@/lib/mockData'
import { cn } from '@/lib/utils'
import {
  BookOpen,
  Calendar,
  ChevronDown,
  ChevronRight,
  Compass,
  Home,
  LogOut,
  MessageSquare,
  Settings,
  User,
  Users,
  Video
} from 'lucide-react'
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
  
  const isAnyChildActive = (item: NavigationItem): boolean => {
    if (!item.children) return false
    return item.children.some(child => pathname === child.href)
  }

  // Auto-expand items that have active children
  const getInitialExpanded = () => {
    const expanded: string[] = []
    navigationItems.forEach(item => {
      if (item.children && isAnyChildActive(item)) {
        expanded.push(item.name)
      }
    })
    // If no active child found, default to expanding Community
    if (expanded.length === 0) {
      expanded.push('Community')
    }
    return expanded
  }

  const [expandedItems, setExpandedItems] = useState<string[]>(getInitialExpanded)

  // Auto-expand parent items when navigating to their children
  useEffect(() => {
    const expanded: string[] = []
    navigationItems.forEach(item => {
      if (item.children && isAnyChildActive(item)) {
        expanded.push(item.name)
      }
    })
    // If no active child found, default to expanding Community
    if (expanded.length === 0) {
      expanded.push('Community')
    }
    setExpandedItems(expanded)
  }, [pathname])

  const toggleExpand = (itemName: string) => {
    setExpandedItems(prev =>
      prev.includes(itemName)
        ? prev.filter(name => name !== itemName)
        : [...prev, itemName]
    )
  }

  const isItemActive = (item: NavigationItem): boolean => {
    if (item.href && pathname === item.href) return true
    if (item.children) {
      return item.children.some(child => isItemActive(child))
    }
    return false
  }

  const renderNavItem = (item: NavigationItem) => {
    const Icon = iconMap[item.icon as keyof typeof iconMap]
    const hasChildren = item.children && item.children.length > 0
    const isExpanded = expandedItems.includes(item.name)
    const isActive = isItemActive(item)
    const isChildActive = isAnyChildActive(item)

    if (hasChildren) {
      return (
        <li key={item.name}>
          <button
            onClick={() => toggleExpand(item.name)}
            className={cn(
              "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors",
              isChildActive
                ? "bg-blue-50 text-blue-700"
                : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
            )}
          >
            <div className="flex items-center">
              <Icon className="w-5 h-5 mr-3" />
              {item.name}
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
                const isChildActive = pathname === child.href

                return (
                  <li key={child.name}>
                    <Link
                      href={child.href!}
                      className={cn(
                        "flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                        isChildActive
                          ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      )}
                    >
                      <ChildIcon className="w-4 h-4 mr-3" />
                      {child.name}
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
      <li key={item.name}>
        <Link
          href={item.href!}
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
  }

  const isAnyChildActive = (item: NavigationItem): boolean => {
    if (!item.children) return false
    return item.children.some(child => pathname === child.href)
  }

  // Auto-expand items that have active children
  const getInitialExpanded = () => {
    const expanded: string[] = []
    navigationItems.forEach(item => {
      if (item.children && isAnyChildActive(item)) {
        expanded.push(item.name)
      }
    })
    // If no active child found, default to expanding Community
    if (expanded.length === 0) {
      expanded.push('Community')
    }
    return expanded
  }

  const [expandedItems, setExpandedItems] = useState<string[]>(getInitialExpanded)

  // Auto-expand parent items when navigating to their children
  useEffect(() => {
    const expanded: string[] = []
    navigationItems.forEach(item => {
      if (item.children && isAnyChildActive(item)) {
        expanded.push(item.name)
      }
    })
    // If no active child found, default to expanding Community
    if (expanded.length === 0) {
      expanded.push('Community')
    }
    setExpandedItems(expanded)
  }, [pathname])

  const toggleExpand = (itemName: string) => {
    setExpandedItems(prev =>
      prev.includes(itemName)
        ? prev.filter(name => name !== itemName)
        : [...prev, itemName]
    )
  }

  const isItemActive = (item: NavigationItem): boolean => {
    if (item.href && pathname === item.href) return true
    if (item.children) {
      return item.children.some(child => isItemActive(child))
    }
    return false
  }

  const renderNavItem = (item: NavigationItem) => {
    const Icon = iconMap[item.icon as keyof typeof iconMap]
    const hasChildren = item.children && item.children.length > 0
    const isExpanded = expandedItems.includes(item.name)
    const isActive = isItemActive(item)
    const isChildActive = isAnyChildActive(item)

    if (hasChildren) {
      return (
        <li key={item.name}>
          <button
            onClick={() => toggleExpand(item.name)}
            className={cn(
              "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors",
              isChildActive
                ? "bg-[#EAE6F5] text-[#8573bd]"
                : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
            )}
          >
            <div className="flex items-center">
              <Icon className="w-5 h-5 mr-3" />
              {item.name}
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
                const isChildActive = pathname === child.href

                return (
                  <li key={child.name}>
                    <Link
                      href={child.href!}
                      className={cn(
                        "flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                        isChildActive
                          ? "bg-[#EAE6F5] text-[#8573bd] border-r-2 border-[#8573bd]"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      )}
                    >
                      <ChildIcon className="w-4 h-4 mr-3" />
                      {child.name}
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
      <li key={item.name}>
        <Link
          href={item.href!}
          className={cn(
            "flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors",
            isActive
              ? "bg-[#EAE6F5] text-[#8573bd] border-r-2 border-[#8573bd]"
              : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
          )}
        >
          <Icon className="w-5 h-5 mr-3" />
          {item.name}
        </Link>
      </li>
    )
  }

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col">
      {/* 用户信息区域 */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-[#8573bd] rounded-full flex items-center justify-center">
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
      <nav className="flex-1 px-4 py-6 overflow-y-auto">
        <ul className="space-y-2">
          {navigationItems.map((item) => renderNavItem(item))}
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
              // Show confirmation dialog
              const confirmed = window.confirm('Are you sure you want to logout?')

              if (confirmed) {
                // Clear any stored auth data (if you have any)
                // localStorage.removeItem('authToken') // Example

                // Redirect to login page
                router.push('/login')
              }
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
