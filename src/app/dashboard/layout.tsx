import Sidebar from '@/components/dashboard/Sidebar'
import { PartyProvider } from '@/lib/PartyContext'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <PartyProvider>
      <div className="flex h-screen bg-gray-50">
        {/* 左侧固定导航栏 */}
        <Sidebar />

        {/* 右侧主内容区域 */}
        <main className="flex-1 overflow-auto">
          <div className="p-8">
            {children}
          </div>
        </main>
      </div>
    </PartyProvider>
  )
}
