'use client'

import { AgendaMilestone, TreatmentPlan, agendaMilestones, currentTreatmentPlan, currentUser } from '@/lib/mockData'
import { addMonths, differenceInDays, eachDayOfInterval, endOfMonth, format, isSameDay, isSameMonth, parseISO, startOfMonth, subMonths } from 'date-fns'
import { AlertCircle, Calendar as CalendarIcon, CheckCircle2, ChevronLeft, ChevronRight, Clock, FileText, MapPin, Send, User } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'



// Mock calendar event data
const initialcalendarEvents = [
  {
    id: '1',
    title: 'Physical Therapy',
    date: new Date(2025, 10, 1, 14, 0), // 11月1日 14:00
    duration: 60,
    type: 'therapy',
    location: 'Rehabilitation Center A',
    therapist: 'Dr. Li'
  },
  {
    id: '2',
    title: 'Follow-up Appointment',
    date: new Date(2025, 10, 5, 9, 30), // 11月5日 9:30
    duration: 30,
    type: 'checkup',
    location: 'Orthopedic Clinic',
    doctor: 'Dr. Wang'
  },
  {
    id: '3',
    title: 'Rehabilitation Training',
    date: new Date(2025, 10, 8, 16, 0), // 11月8日 16:00
    duration: 45,
    type: 'exercise',
    location: 'Training Room B',
    trainer: 'Coach Zhang'
  },
  {
    id: '4',
    title: 'Nutrition Consultation',
    date: new Date(2025, 10, 12, 10, 0), // 11月12日 10:00
    duration: 30,
    type: 'consultation',
    location: 'Nutrition Department',
    nutritionist: 'Nutritionist Chen'
  },
  {
    id: '5',
    title: 'Physical Therapy',
    date: new Date(2025, 10, 15, 14, 0), // 11月15日 14:00
    duration: 60,
    type: 'therapy',
    location: 'Rehabilitation Center A',
    therapist: 'Dr. Li'
  }
]


const eventTypeNames = {
  therapy: 'Physical Therapy',
  checkup: 'Follow-up',
  exercise: 'Rehab Training',
  consultation: 'Nutrition Consult',
  deadline: 'Deadline',
  milestone: 'Milestone',
  checkpoint: 'Checkpoint'
}

const eventTypeColors = {
  therapy: 'bg-blue-100 text-blue-700 border-blue-200',
  checkup: 'bg-green-100 text-green-700 border-green-200',
  exercise: 'bg-purple-100 text-purple-700 border-purple-200',
  consultation: 'bg-orange-100 text-orange-700 border-orange-200',
  deadline: 'bg-red-100 text-red-700 border-red-300',
  milestone: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  checkpoint: 'bg-yellow-100 text-yellow-700 border-yellow-200'
}

export default function CalendarPage() {
  const t = useTranslations('Calendar')
  const tCommon = useTranslations('Common')
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())

  // Original events to state
  const [calendarEvents, setCalendarEvents] = useState(initialcalendarEvents)
  const [treatmentPlan] = useState<TreatmentPlan>(currentTreatmentPlan)
  const [milestones, setMilestones] = useState<AgendaMilestone[]>(agendaMilestones)
  const [showAgendaView, setShowAgendaView] = useState(false)

  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    time: '14:00',
    duration: 60,
    therapist: 'Dr. Li',
    location: 'Rehabilitation Center A'
  })

  // Convert milestones to calendar events
  useEffect(() => {
    const milestoneEvents: any[] = milestones.map((milestone) => ({
      id: milestone.id,
      title: milestone.title,
      date: new Date(milestone.targetDate),
      duration: 0,
      type: milestone.type as 'deadline' | 'milestone' | 'checkpoint',
      description: milestone.description,
      weekNumber: milestone.weekNumber
    }))

    // Add deadline event for treatment plan
    const deadlineEvent: any = {
      id: 'treatment-deadline',
      title: `Treatment Plan Deadline: ${treatmentPlan.title}`,
      date: new Date(treatmentPlan.endDate),
      duration: 0,
      type: 'deadline' as const,
      description: `Final deadline for ${treatmentPlan.title}`,
      doctor: treatmentPlan.doctor,
      therapist: treatmentPlan.physiotherapist
    }

    setCalendarEvents((prev: any[]) => {
      // Remove all old agenda/milestone events first
      const filtered = prev.filter((e: any) =>
        !e.id?.startsWith('agenda-day-') &&
        !e.id?.startsWith('milestone-') &&
        e.id !== 'treatment-deadline'
      )

      // Remove duplicates by checking date and title
      const uniqueMilestoneEvents = milestoneEvents.filter((me: any, index: number, self: any[]) => {
        return index === self.findIndex((other: any) =>
          other.id === me.id ||
          (other.date.getTime() === me.date.getTime() &&
            other.title === me.title &&
            (other.type === 'milestone' || other.type === 'checkpoint' || other.type === 'deadline'))
        )
      })

      return [...filtered, ...uniqueMilestoneEvents, deadlineEvent]
    })
  }, [milestones, treatmentPlan])

  // Function to send progress report
  const handleSendProgressReport = useCallback((dueMilestones: AgendaMilestone[], daysUntilDeadline: number, isDeadlineDay: boolean = false) => {
    // Calculate progress based on completed agenda items
    const completedAgendas = milestones.filter(m => m.completed).length
    const totalAgendas = milestones.length
    const agendaCompletionRate = totalAgendas > 0 ? Math.round((completedAgendas / totalAgendas) * 100) : 0

    // Calculate progress based on completed events
    const completedEvents = calendarEvents.filter((e: any) => {
      const eventDate = new Date(e.date)
      eventDate.setHours(0, 0, 0, 0)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      return eventDate <= today
    }).length
    const totalEvents = calendarEvents.length
    const eventCompletionRate = totalEvents > 0 ? Math.round((completedEvents / totalEvents) * 100) : 0

    const report = {
      treatmentPlanId: treatmentPlan.id,
      weekNumber: dueMilestones.length > 0 ? dueMilestones[0].weekNumber : Math.floor((differenceInDays(new Date(), parseISO(treatmentPlan.startDate)) / 7) + 1),
      completionRate: agendaCompletionRate,
      eventCompletionRate: eventCompletionRate,
      notes: isDeadlineDay
        ? `Final treatment completion report. ${completedAgendas} of ${totalAgendas} daily agendas completed (${agendaCompletionRate}%). Treatment plan ended.`
        : `Progress report. ${dueMilestones.length > 0 ? `Agendas due: ${dueMilestones.map(m => m.title).join(', ')}. ` : ''}Days until deadline: ${daysUntilDeadline}`,
      sentToPhysiotherapist: !isDeadlineDay,
      sentToDoctor: isDeadlineDay || daysUntilDeadline <= 3
    }

    // On deadline day, send final report to doctor
    if (isDeadlineDay) {
      toast.success(
        `📋 Final progress report sent to Dr. ${treatmentPlan.doctor}`,
        {
          duration: 6000,
          icon: '✅',
        }
      )
      toast.success(
        `Treatment plan completed! ${agendaCompletionRate}% of daily agendas completed.`,
        {
          duration: 5000,
          icon: '🎉',
        }
      )
    } else if (daysUntilDeadline <= 7 && daysUntilDeadline > 0) {
      // Regular progress report to physiotherapist
      toast.success(
        `Progress report sent to ${treatmentPlan.physiotherapist}`,
        {
          duration: 4000,
          icon: '📤',
        }
      )
    }
  }, [milestones, calendarEvents, treatmentPlan])

  // Check deadlines and send progress reports
  useEffect(() => {
    const checkDeadlines = () => {
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      // Check treatment plan deadline (end of 12th week)
      const deadlineDate = new Date(treatmentPlan.endDate)
      deadlineDate.setHours(0, 0, 0, 0)
      const daysUntilDeadline = differenceInDays(deadlineDate, today)
      const isDeadlineDay = daysUntilDeadline === 0

      // Check for today's agenda items
      const todayAgendas = milestones.filter(m => {
        const agendaDate = new Date(m.targetDate)
        agendaDate.setHours(0, 0, 0, 0)
        return isSameDay(agendaDate, today)
      })

      // On deadline day (end of 12th week), send final progress report to doctor
      if (isDeadlineDay) {
        handleSendProgressReport(todayAgendas, 0, true) // true = isDeadlineDay
      } else if (todayAgendas.length > 0) {
        // For regular days, just track completion (no report sent)
        // Reports are only sent on the deadline
      }
    }

    // Check on mount and set interval to check daily
    checkDeadlines()
    const interval = setInterval(checkDeadlines, 24 * 60 * 60 * 1000) // Check daily

    return () => clearInterval(interval)
  }, [milestones, treatmentPlan, handleSendProgressReport])

  // 从 localStorage 加载数据
  useEffect(() => {
    const savedEvents = localStorage.getItem('calendarEvents')

    if (savedEvents) {
      try {
        const parsedEvents = JSON.parse(savedEvents)
        const eventsWithDates = parsedEvents.map((event: any) => ({
          ...event,
          date: new Date(event.date)
        }))
        setCalendarEvents((prev: any[]) => {
          // Filter out agenda/milestone events from localStorage (they're handled by milestones useEffect)
          const nonAgendaEvents = eventsWithDates.filter((event: any) => {
            return !event.id?.startsWith('agenda-day-') &&
              !event.id?.startsWith('milestone-') &&
              event.id !== 'treatment-deadline' &&
              !event.weekNumber
          })

          // Only add non-agenda events that don't already exist
          const newEvents = nonAgendaEvents.filter((e: any) =>
            !prev.some((existing: any) => existing.id === e.id)
          )

          return [...prev, ...newEvents]
        })
      } catch (error) {
        console.error('Failed to load events from localStorage:', error)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 保存数据到 localStorage
  useEffect(() => {
    localStorage.setItem('calendarEvents', JSON.stringify(calendarEvents))
  }, [calendarEvents])

  // Function to manually send progress report
  const handleManualSendReport = () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const deadlineDate = new Date(treatmentPlan.endDate)
    deadlineDate.setHours(0, 0, 0, 0)
    const daysUntilDeadline = differenceInDays(deadlineDate, today)
    const isDeadlineDay = daysUntilDeadline === 0

    const todayAgendas = milestones.filter(m => {
      const agendaDate = new Date(m.targetDate)
      agendaDate.setHours(0, 0, 0, 0)
      return isSameDay(agendaDate, today)
    })

    handleSendProgressReport(todayAgendas, daysUntilDeadline, isDeadlineDay)
  }

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const goToPreviousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1))
  }

  const goToNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1))
  }

  const handleBookPhysicalTherapy = () => {
    setFormData({
      date: format(selectedDate, 'yyyy-MM-dd'), // 使用选中的日期
      time: '14:00',
      duration: 60,
      therapist: 'Dr. Li',
      location: 'Rehabilitation Center A'
    })
    setShowModal(true) // 打开弹窗
  }

  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault()

    const newEvent = {
      id: `evt-${Date.now()}`,
      title: 'Physical Therapy',
      date: new Date(`${formData.date}T${formData.time}`),
      duration: formData.duration,
      type: 'therapy' as const,
      location: formData.location,
      therapist: formData.therapist
    }

    setCalendarEvents(prev => [...prev, newEvent])
    setShowModal(false)
    alert('Successfully booked')
  }

  // 👇 添加这个函数 - 更新表单数据
  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }


  const getEventsForDate = (date: Date) => {
    return calendarEvents.filter((event: any) =>
      isSameDay(event.date, date)
    )
  }

  const selectedDateEvents = getEventsForDate(selectedDate)

  // Calculate progress
  const completedMilestones = milestones.filter(m => m.completed).length
  const progressPercentage = Math.round((completedMilestones / milestones.length) * 100)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const deadlineDate = new Date(treatmentPlan.endDate)
  deadlineDate.setHours(0, 0, 0, 0)
  const daysUntilDeadline = differenceInDays(deadlineDate, today)

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('title')}</h1>
          <p className="text-gray-600">{t('subtitle')}</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowAgendaView(!showAgendaView)}
            className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors flex items-center"
          >
            <FileText className="w-4 h-4 mr-2" />
            {showAgendaView ? t('buttons.calendarView') : t('buttons.agendaView')}
          </button>
          {currentUser.role === 'admin' && (
            <button
              onClick={handleManualSendReport}
              className="px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors flex items-center"
            >
              <Send className="w-4 h-4 mr-2" />
              {t('buttons.sendReport')}
            </button>
          )}
        </div>
      </div>

      {/* Treatment Plan Status Card */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl shadow-sm border border-indigo-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">{treatmentPlan.title}</h2>
            <p className="text-gray-600 text-sm mb-4">{treatmentPlan.description}</p>
            <div className="flex items-center space-x-6 text-sm">
              <div>
                <span className="text-gray-500">Physiotherapist:</span>
                <span className="ml-2 font-medium text-gray-900">{treatmentPlan.physiotherapist}</span>
              </div>
              <div>
                <span className="text-gray-500">Doctor:</span>
                <span className="ml-2 font-medium text-gray-900">{treatmentPlan.doctor}</span>
              </div>
              <div>
                <span className="text-gray-500">Deadline:</span>
                <span className={`ml-2 font-medium ${daysUntilDeadline <= 7 ? 'text-red-600' : 'text-gray-900'}`}>
                  {format(deadlineDate, 'MMM dd, yyyy')} ({daysUntilDeadline > 0 ? `${daysUntilDeadline} days left` : 'Deadline passed'})
                </span>
              </div>
            </div>
          </div>
          <div className="text-center ml-6">
            <div className="text-3xl font-bold text-indigo-600 mb-1">{progressPercentage}%</div>
            <div className="text-sm text-gray-600">Progress</div>
            <div className="w-24 bg-gray-200 rounded-full h-2 mt-2">
              <div
                className="bg-indigo-600 h-2 rounded-full transition-all"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
        {daysUntilDeadline <= 7 && daysUntilDeadline > 0 && (
          <div className="mt-4 flex items-center p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-yellow-600 mr-2" />
            <span className="text-sm text-yellow-800">
              <strong>Reminder:</strong> Treatment plan deadline is in {daysUntilDeadline} days. Progress report will be automatically sent.
            </span>
          </div>
        )}
      </div>

      {/* Agenda View */}
      {showAgendaView && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">{t('agenda.title')}</h2>
            <div className="text-sm text-gray-600">
              {milestones.filter(m => m.completed).length} of {milestones.length} completed
            </div>
          </div>

          {/* Group by week for better organization */}
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((weekNum) => {
            const weekAgendas = milestones.filter(m => m.weekNumber === weekNum)
            const completedCount = weekAgendas.filter(m => m.completed).length
            const weekTitle = weekAgendas[0]?.title.split(':')[0] || `Week ${weekNum}`

            return (
              <div key={weekNum} className="mb-6">
                <div className="flex items-center justify-between mb-3 p-3 bg-indigo-50 rounded-lg">
                  <h3 className="font-semibold text-indigo-900">{weekTitle}</h3>
                  <span className="text-sm text-indigo-700">{completedCount} / {weekAgendas.length} {t('agenda.daysCompleted')}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-2">
                  {weekAgendas.map((milestone) => {
                    const milestoneDate = new Date(milestone.targetDate)
                    const isPast = milestoneDate < today
                    const isDue = isSameDay(milestoneDate, today)

                    return (
                      <div
                        key={milestone.id}
                        className={`p-3 rounded-lg border-2 text-sm ${milestone.completed
                            ? 'bg-green-50 border-green-300'
                            : isDue
                              ? 'bg-yellow-50 border-yellow-300'
                              : isPast
                                ? 'bg-gray-50 border-gray-300'
                                : 'bg-white border-gray-200'
                          }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-xs font-semibold px-1.5 py-0.5 rounded ${milestone.type === 'deadline'
                              ? 'bg-red-100 text-red-700'
                              : milestone.type === 'checkpoint'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-indigo-100 text-indigo-700'
                            }`}>
                            Day {(weekNum - 1) * 7 + weekAgendas.indexOf(milestone) + 1}
                          </span>
                          {milestone.completed && (
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                          )}
                        </div>
                        <h4 className="font-semibold text-gray-900 text-xs mb-1 line-clamp-2">{milestone.title}</h4>
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                          <span>{format(milestoneDate, 'MMM d')}</span>
                        </div>
                        <button
                          onClick={() => {
                            setMilestones(prev =>
                              prev.map(m =>
                                m.id === milestone.id ? { ...m, completed: !m.completed } : m
                              )
                            )
                          }}
                          className={`w-full px-2 py-1 rounded text-xs ${milestone.completed
                              ? 'bg-green-100 text-green-700 hover:bg-green-200'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                          {milestone.completed ? '✓ ' + t('agenda.done') : t('agenda.markDone')}
                        </button>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 日历主体 */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            {/* 日历头部 */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {format(currentDate, 'MMMM yyyy')}
              </h2>
              <div className="flex items-center space-x-2">
                <button
                  onClick={goToPreviousMonth}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={goToNextMonth}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* 星期标题 */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                  {day}
                </div>
              ))}
            </div>

            {/* 日历网格 */}
            <div className="grid grid-cols-7 gap-1">
              {monthDays.map((day) => {
                const dayEvents = getEventsForDate(day)
                const isSelected = isSameDay(day, selectedDate)
                const isToday = isSameDay(day, new Date())

                return (
                  <button
                    key={day.toISOString()}
                    onClick={() => setSelectedDate(day)}
                    className={`
                      relative p-2 h-20 border border-gray-100 hover:bg-gray-50 transition-colors
                      ${isSelected ? 'bg-blue-50 border-blue-200' : ''}
                      ${isToday ? 'bg-yellow-50 border-yellow-200' : ''}
                    `}
                  >
                    <div className={`
                      text-sm font-medium mb-1
                      ${!isSameMonth(day, currentDate) ? 'text-gray-300' : 'text-gray-900'}
                      ${isToday ? 'text-yellow-700' : ''}
                      ${isSelected ? 'text-blue-700' : ''}
                    `}>
                      {format(day, 'd')}
                    </div>

                    {dayEvents.length > 0 && (
                      <div className="space-y-1">
                        {dayEvents.slice(0, 2).map((event: any) => (
                          <div
                            key={event.id}
                            className={`
                              px-1 py-0.5 text-xs rounded truncate
                              ${eventTypeColors[event.type as keyof typeof eventTypeColors]}
                            `}
                          >
                            {event.title}
                          </div>
                        ))}
                        {dayEvents.length > 2 && (
                          <div className="text-xs text-gray-500">
                            +{dayEvents.length - 2} more
                          </div>
                        )}
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* 右侧详情面板 */}
        <div className="space-y-6">
          {/* 选中日期信息 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <CalendarIcon className="w-5 h-5 text-blue-600 mr-2" />
              <h3 className="font-semibold text-gray-900">
                {format(selectedDate, 'MMMM d, EEEE')}
              </h3>
            </div>

            {selectedDateEvents.length > 0 ? (
              <div className="space-y-3">
                {selectedDateEvents.map((event: any) => (
                  <div
                    key={event.id}
                    className={`
                      p-3 rounded-lg border
                      ${eventTypeColors[event.type as keyof typeof eventTypeColors]}
                    `}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{event.title}</h4>
                      <span className="text-xs px-2 py-1 bg-white rounded">
                        {eventTypeNames[event.type as keyof typeof eventTypeNames]}
                      </span>
                    </div>

                    <div className="space-y-1 text-sm">
                      <div className="flex items-center">
                        <Clock className="w-3 h-3 mr-2" />
                        {format(event.date, 'HH:mm')} ({event.duration}mins)
                      </div>

                      <div className="flex items-center">
                        <MapPin className="w-3 h-3 mr-2" />
                        {event.location}
                      </div>

                      {event.therapist && (
                        <div className="flex items-center">
                          <User className="w-3 h-3 mr-2" />
                          {event.therapist}
                        </div>
                      )}

                      {event.doctor && (
                        <div className="flex items-center">
                          <User className="w-3 h-3 mr-2" />
                          {event.doctor}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <CalendarIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No appointments scheduled</p>
              </div>
            )}
          </div>

          {/* 快速统计 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">{t('stats.title')}</h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{t('stats.totalAppointments')}</span>
                <span className="font-medium">{calendarEvents.length} times</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{t('stats.physicalTherapy')}</span>
                <span className="font-medium">
                  {calendarEvents.filter((e: any) => e.type === 'therapy').length} times
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{t('stats.rehabTraining')}</span>
                <span className="font-medium">
                  {calendarEvents.filter((e: any) => e.type === 'exercise').length} times
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{t('stats.followUps')}</span>
                <span className="font-medium">
                  {calendarEvents.filter((e: any) => e.type === 'checkup').length} times
                </span>
              </div>
            </div>
          </div>

          {/* 快速操作 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">{t('quick.title')}</h3>

            <div className="space-y-2">
              <button
                onClick={handleBookPhysicalTherapy}
                className="w-full px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
                {t('quick.bookTherapy')}
              </button>

              <button className="w-full px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors">
                {t('quick.bookFollowup')}
              </button>

              <button className="w-full px-4 py-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors">
                {t('quick.scheduleTraining')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 预约表单 */}
      {showModal && (
        <div
          className="fixed inset-0 bg-white bg-opacity-70 flex items-center justify-center z-50"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 关闭按钮 X */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              type="button"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h3 className="text-2xl font-bold text-gray-900 mb-6">{t('modal.bookTitle')}</h3>

            <form onSubmit={handleSubmitBooking} className="space-y-4">
              {/* 日期 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('modal.date')}</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={e => handleInputChange('date', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {/* 时间 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('modal.time')}</label>
                <input
                  type="time"
                  value={formData.time}
                  onChange={e => handleInputChange('time', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {/* 时长 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('modal.duration')}</label>
                <select
                  value={formData.duration}
                  onChange={e => handleInputChange('duration', Number(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={30}>{t('modal.minutes', { count: 30 })}</option>
                  <option value={60}>{t('modal.minutes', { count: 60 })}</option>
                  <option value={90}>{t('modal.minutes', { count: 90 })}</option>
                  <option value={120}>{t('modal.minutes', { count: 120 })}</option>
                </select>
              </div>

              {/* 治疗师 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('modal.therapist')}</label>
                <select
                  value={formData.therapist}
                  onChange={e => handleInputChange('therapist', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Dr. Li">Dr. Li</option>
                  <option value="Dr. Wang">Dr. Wang</option>
                  <option value="Dr. Zhang">Dr. Zhang</option>
                  <option value="Dr. Chen">Dr. Chen</option>
                </select>
              </div>

              {/* 地点 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('modal.location')}</label>
                <select
                  value={formData.location}
                  onChange={e => handleInputChange('location', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Rehabilitation Center A">Rehabilitation Center A</option>
                  <option value="Rehabilitation Center B">Rehabilitation Center B</option>
                  <option value="Orthopedic Clinic">Orthopedic Clinic</option>
                  <option value="Training Room B">Training Room B</option>
                </select>
              </div>

              {/* 按钮组 */}
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {tCommon('cancel')}
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {t('modal.confirm')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

