'use client'

import { Task, todaysTasks } from '@/lib/mockData'
import { cn, formatTime } from '@/lib/utils'
import { CheckCircle2, Circle, Clipboard, Clock, Dumbbell, Pill, Stethoscope } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { useState } from 'react'

const taskIcons = {
  exercise: Dumbbell,
  medication: Pill,
  therapy: Stethoscope,
  check: Clipboard
}

const taskColors = {
  exercise: 'text-green-600',
  medication: 'text-[#8573bd]',
  therapy: 'text-[#E8B98A]',
  check: 'text-orange-600'
}

export default function TodaysPlan() {
  const t = useTranslations('Dashboard.TodaysPlan')
  const locale = useLocale()
  const [tasks, setTasks] = useState<Task[]>(todaysTasks)

  const toggleTask = (taskId: string) => {
    setTasks(tasks.map(task =>
      task.id === taskId
        ? { ...task, completed: !task.completed, completedAt: !task.completed ? new Date().toISOString() : undefined }
        : task
    ))
  }

  const completedCount = tasks.filter(task => task.completed).length
  const totalCount = tasks.length
  const progressPercentage = (completedCount / totalCount) * 100

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">{t('title')}</h2>
        <div className="text-sm text-gray-500">
          {t('status', { completed: completedCount, total: totalCount })}
        </div>
      </div>

      {/* 进度条 */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>{t('progress')}</span>
          <span>{Math.round(progressPercentage)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-[#8573bd] h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* 任务列表 */}
      <div className="space-y-3">
        {tasks.map((task) => {
          const Icon = taskIcons[task.type]
          const iconColor = taskColors[task.type]
          const title = t(`tasks.${task.id}.title`, { defaultMessage: task.title })
          const description = t(`tasks.${task.id}.description`, { defaultMessage: task.description ?? '' })
          const completedTime = task.completedAt ? formatTime(new Date(task.completedAt), locale) : null

          return (
            <div
              key={task.id}
              className={cn(
                "flex items-start space-x-3 p-3 rounded-lg border transition-all duration-200 cursor-pointer hover:shadow-sm",
                task.completed
                  ? "bg-gray-50 border-gray-200"
                  : "bg-white border-gray-200 hover:border-gray-300"
              )}
              onClick={() => toggleTask(task.id)}
            >
              <button className="mt-0.5">
                {task.completed ? (
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                ) : (
                  <Circle className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                )}
              </button>

              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <Icon className={cn("w-4 h-4", iconColor)} />
                  <h3 className={cn(
                    "font-medium",
                    task.completed ? "text-gray-500 line-through" : "text-gray-900"
                  )}>
                    {title}
                  </h3>
                </div>

                <p className={cn(
                  "text-sm",
                  task.completed ? "text-gray-400" : "text-gray-600"
                )}>
                  {description}
                </p>

                {task.duration && (
                  <div className="flex items-center mt-2 text-xs text-gray-500">
                    <Clock className="w-3 h-3 mr-1" />
                    {t('minutes', { count: task.duration })}
                  </div>
                )}

                {task.completed && completedTime && (
                  <div className="text-xs text-green-600 mt-1">
                    {t('completedAt', { time: completedTime })}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* 鼓励信息 */}
      {completedCount === totalCount && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center">
            <CheckCircle2 className="w-5 h-5 text-green-500 mr-2" />
            <span className="text-green-800 font-medium">
              {t('allComplete')}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
