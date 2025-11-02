'use client'

import SessionRoom from '@/components/dashboard/SessionRoom'
import WaitingRoom from '@/components/dashboard/WaitingRoom'
import { groupExercises } from '@/lib/mockData'
import { formatDistanceToNow } from 'date-fns'
import { Clock, Pin, Users } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function SessionPage() {
  const router = useRouter()
  const [inSession, setInSession] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null)
  const [showWaitingRoom, setShowWaitingRoom] = useState(false)

  // Sort groups: pinned first, then by start time
  const sortedGroups = [...groupExercises].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1
    if (!a.isPinned && b.isPinned) return 1
    return new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
  })

  const handleJoinGroup = (groupId: string) => {
    setSelectedGroup(groupId)
    setShowWaitingRoom(true)
  }

  const handleJoinSession = () => {
    setInSession(true)
  }

  const handleLeave = () => {
    setInSession(false)
    setShowWaitingRoom(false)
    setSelectedGroup(null)
  }

  const getSelectedGroupData = () => {
    return groupExercises.find(g => g.id === selectedGroup)
  }

  const formatStartTime = (startTime: string) => {
    const date = new Date(startTime)
    const now = new Date()
    const diffInMinutes = Math.floor((date.getTime() - now.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return 'Starting now'
    if (diffInMinutes < 60) return `Starting in ${diffInMinutes} minutes`
    return `Starting ${formatDistanceToNow(date, { addSuffix: true })}`
  }

  // Show session room if in active session
  if (inSession) {
    const groupData = getSelectedGroupData()
    return (
      <SessionRoom
        sessionTitle={groupData?.title || "Group Exercise"}
        onLeave={handleLeave}
        participantCount={groupData?.participantCount || 6}
      />
    )
  }

  // Show waiting room if a group is selected
  if (showWaitingRoom && selectedGroup) {
    const groupData = getSelectedGroupData()
    return (
      <div className="p-6">
        <WaitingRoom
          sessionTitle={groupData?.title || "Group Exercise"}
          startTime={formatStartTime(groupData?.startTime || new Date().toISOString())}
          onJoinSession={handleJoinSession}
          onLeave={handleLeave}
          participantCount={groupData?.participantCount || 6}
        />
      </div>
    )
  }

  // Show group list (default view)
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Group Exercise</h1>
        <p className="text-gray-600">Join a strength training session and exercise together with others</p>
      </div>

      {/* Pinned Exercises Section */}
      {sortedGroups.some(g => g.isPinned) && (
        <div>
          <div className="flex items-center mb-4">
            <Pin className="w-5 h-5 text-blue-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">Recommended for You</h2>
            <span className="ml-2 text-sm text-gray-500">Based on your training plan</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedGroups
              .filter(g => g.isPinned)
              .map((group) => (
                <div
                  key={group.id}
                  className="bg-white rounded-xl shadow-sm border-2 border-blue-200 p-5 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleJoinGroup(group.id)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <Pin className="w-4 h-4 text-blue-600 mr-1" />
                        <h3 className="font-semibold text-gray-900">{group.title}</h3>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{group.exerciseType}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <div className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          <span>{formatStartTime(group.startTime)}</span>
                        </div>
                        <div className="flex items-center">
                          <Users className="w-3 h-3 mr-1" />
                          <span>{group.participantCount}/{group.maxParticipants}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button className="w-full mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm">
                    Join Exercise
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* All Exercises Section */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">All Exercises</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedGroups.map((group) => (
            <div
              key={group.id}
              className={group.isPinned
                ? "hidden"
                : "bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow cursor-pointer"
              }
              onClick={() => handleJoinGroup(group.id)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-2">{group.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{group.exerciseType} · {group.category}</p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <div className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      <span>{formatStartTime(group.startTime)}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="w-3 h-3 mr-1" />
                      <span>{group.participantCount}/{group.maxParticipants}</span>
                    </div>
                  </div>
                </div>
              </div>
              <button className="w-full mt-3 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm">
                Join Exercise
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

