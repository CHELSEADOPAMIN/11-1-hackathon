'use client'

import FriendListPreview from '@/components/dashboard/FriendListPreview'
import Greeting from '@/components/dashboard/Greeting'
import LobbyPreview from '@/components/dashboard/LobbyPreview'
import TodaysPlan from '@/components/dashboard/TodaysPlan'
import WeeklyProgressChart from '@/components/dashboard/WeeklyProgressChart'

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* 问候语区域 */}
      <Greeting />

      {/* 主要内容区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左侧：今日计划 */}
        <div className="lg:col-span-2">
          <TodaysPlan />
        </div>

        {/* 右侧：伙伴预览 */}
        <div>
          <FriendListPreview />
        </div>
      </div>

      {/* 下方内容区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 左侧：本周进度图表 */}
        <WeeklyProgressChart />

        {/* 右侧：公共大厅预览 */}
        <LobbyPreview />
      </div>
    </div>
  )
}
