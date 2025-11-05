'use client'

import { weeklyProgress } from '@/lib/mockData'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useTranslations } from 'next-intl'

type ChartDatum = {
  day: string
  completed: number
  total: number
  completionRate: number
  label: string
}

type CustomTooltipProps = {
  active?: boolean
  payload?: Array<{ payload: ChartDatum }>
  label?: string
}

export default function WeeklyProgressChart() {
  const t = useTranslations('Dashboard.WeeklyProgress')
  const data: ChartDatum[] = weeklyProgress.map(day => {
    const completionRate = Math.round((day.completed / day.total) * 100)
    const dayKey = day.day.toLowerCase()
    const label = t(`days.${dayKey}`, { defaultMessage: day.day })
    return {
      ...day,
      completionRate,
      label
    }
  })

  const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{label}</p>
          <p className="text-sm text-gray-600">
            {t('tooltip.completed', { completed: data.completed, total: data.total })}
          </p>
          <p className="text-sm text-[#8573bd]">
            {t('tooltip.rate', { rate: data.completionRate })}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">{t('title')}</h2>
        <div className="text-sm text-gray-500">
          {t('subtitle')}
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6b7280' }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6b7280' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="completed"
              fill="#8573bd"
              radius={[4, 4, 0, 0]}
              name={t('bars.completed')}
            />
            <Bar
              dataKey="total"
              fill="#e5e7eb"
              radius={[4, 4, 0, 0]}
              name={t('bars.total')}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 flex items-center justify-center space-x-6 text-sm">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-[#8573bd] rounded mr-2"></div>
          <span className="text-gray-600">{t('bars.completed')}</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-gray-300 rounded mr-2"></div>
          <span className="text-gray-600">{t('bars.total')}</span>
        </div>
      </div>

      {/* 周总结 */}
      <div className="mt-6 p-4 bg-[#EAE6F5] rounded-lg">
        <h3 className="font-medium text-gray-900 mb-2">{t('summaryTitle')}</h3>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="text-center">
            <div className="text-lg font-semibold text-[#8573bd]">
              {data.reduce((sum, day) => sum + day.completed, 0)}
            </div>
            <div className="text-gray-700">{t('summary.totalCompleted')}</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-[#8573bd]">
              {Math.round(data.reduce((sum, day) => sum + day.completionRate, 0) / data.length)}%
            </div>
            <div className="text-gray-700">{t('summary.averageRate')}</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-[#8573bd]">
              {data.filter(day => day.completionRate === 100).length}
            </div>
            <div className="text-gray-700">{t('summary.perfectDays')}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
