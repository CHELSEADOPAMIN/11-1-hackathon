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
  Video,
  Flame,
  Target
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

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col">
      {/* User Info Area */}
      <div className="p-6 border-b border-gray-200">
        <Link
          href="/dashboard/profile"
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
        <div className="mt-3 flex items-center">
          <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
          <span className="text-sm text-gray-500">Online</span>
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
              <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
                <Target className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-900 text-xs">Physical Therapy</h4>
              </div>
            </div>
            
            {/* Horizontal Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden mb-3">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all"
                style={{ width: '40%' }}
              ></div>
            </div>
            
            {/* Bottom: Progress and Streak */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center text-gray-500">
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-1.5"></span>
                <span>40% complete</span>
              </div>
              <div className="flex items-center text-orange-600">
                <Flame className="w-3 h-3 mr-1" />
                <span>5 day streak</span>
              </div>
            </div>
          </div>

          {/* Tooltip on Right Side on Hover */}
          <div className="absolute left-full top-0 ml-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 pointer-events-none">
            <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-lg w-64">
              <h4 className="font-semibold text-gray-900 text-sm mb-2">Physical Therapy</h4>
              <p className="text-xs text-gray-600 mb-3">
                Therapy sessions provide professional guidance and ensure your recovery stays on track with expert supervision.
              </p>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">2/5 missions completed today</span>
                <div className="flex items-center text-orange-600">
                  <Flame className="w-3 h-3 mr-1" />
                  <span>5 day streak</span>
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
          Settings
        </button>
        <button
          className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors"
          onClick={() => {
            if (window.confirm('Are you sure you want to logout?')) {
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
  )
}
