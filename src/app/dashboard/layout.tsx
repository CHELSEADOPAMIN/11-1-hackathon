import Sidebar from '@/components/dashboard/Sidebar'
import { CalendarProvider } from '@/lib/CalendarContext'
import { PartyProvider } from '@/lib/PartyContext'
import { Toaster } from 'react-hot-toast'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <PartyProvider>
      <CalendarProvider>
        <div className="flex h-screen bg-gray-50 overflow-hidden">
          {/* 左侧固定导航栏 */}
          <Sidebar />

          {/* 右侧主内容区域 */}
          <main className="flex-1 overflow-auto relative z-0">
            <div className="flex flex-col">
              <div className="px-8 pt-8 pb-8">
                {children}
              </div>
              {/* Footer */}
              <footer className="border-t border-gray-200 bg-white px-8 py-4">
                <p className="text-sm text-gray-500 text-center">
                  Built by{' '}
                  <span className="font-medium text-gray-700">
                    <a
                      href="https://www.linkedin.com/in/chelsea-yang-21204930b"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#8573bd] hover:text-[#E8B98A] hover:underline transition-colors"
                    >
                      Chelsea Yang
                    </a>
                    ,{' '}
                    <a
                      href="https://www.linkedin.com/in/gege-ardiyansyah"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#8573bd] hover:text-[#E8B98A] hover:underline transition-colors"
                    >
                      Gege Ardiyansyah
                    </a>
                    ,{' '}
                    <a
                      href="https://github.com/HanRU01"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#8573bd] hover:text-[#E8B98A] hover:underline transition-colors"
                    >
                      Hang Li
                    </a>
                    , Jane Kittiyanpanya,{' '}
                    <a
                      href="https://www.linkedin.com/in/ravicha-suksawasdi-na-ayuthaya"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#8573bd] hover:text-[#E8B98A] hover:underline transition-colors"
                    >
                      Ravicha Suksawasdi Na Ayuthaya
                    </a>
                    ,{' '}
                    <a
                      href="https://github.com/zechromes"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#8573bd] hover:text-[#E8B98A] hover:underline transition-colors"
                    >
                      Vedro Suwandi
                    </a>
                  </span>
                </p>
              </footer>
            </div>
          </main>
        </div>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#fff',
              color: '#333',
              border: '1px solid #e5e7eb',
              borderRadius: '0.5rem',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
          }}
        />
      </CalendarProvider>
    </PartyProvider>
  )
}
