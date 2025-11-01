'use client'

import { Party } from '@/lib/mockData'
import { createContext, useContext, useState, ReactNode } from 'react'

interface PartyContextType {
  joinedParty: Party | null
  setJoinedParty: (party: Party | null) => void
}

const PartyContext = createContext<PartyContextType | undefined>(undefined)

export function PartyProvider({ children }: { children: ReactNode }) {
  const [joinedParty, setJoinedParty] = useState<Party | null>(null)

  return (
    <PartyContext.Provider value={{ joinedParty, setJoinedParty }}>
      {children}
    </PartyContext.Provider>
  )
}

export function useParty() {
  const context = useContext(PartyContext)
  if (context === undefined) {
    throw new Error('useParty must be used within a PartyProvider')
  }
  return context
}

