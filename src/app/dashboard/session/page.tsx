'use client'

import WaitingRoom from '@/components/dashboard/WaitingRoom'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import SessionRoom from '@/components/dashboard/SessionRoom'

export default function SessionPage() {
  const router = useRouter()
  const [inSession, setInSession] = useState(false)

  const handleJoinSession = () => {
    setInSession(true)
  }

  const handleLeave = () => {
    setInSession(false)
    router.push('/dashboard')
  }

  if (inSession) {
    return (
      <SessionRoom
        sessionTitle="Group Support Session"
        onLeave={handleLeave}
      />
    )
  }

  return (
    <div className="p-6">
      <WaitingRoom
        sessionTitle="Group Support Session"
        startTime="5 minutes"
        onJoinSession={handleJoinSession}
        onLeave={handleLeave}
      />
    </div>
  )
}

