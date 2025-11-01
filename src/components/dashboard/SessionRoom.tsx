'use client'

import { friends, currentUser } from '@/lib/mockData'
import { cn } from '@/lib/utils'
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Users, 
  MessageSquare, 
  Settings,
  PhoneOff,
  Maximize2,
  Share2,
  User
} from 'lucide-react'
import { useState } from 'react'

interface SessionRoomProps {
  sessionTitle?: string
  onLeave?: () => void
  isHost?: boolean
}

interface Message {
  id: string
  author: string
  content: string
  timestamp: Date
}

export default function SessionRoom({ 
  sessionTitle = 'Group Support Session',
  onLeave,
  isHost = false
}: SessionRoomProps) {
  const [micEnabled, setMicEnabled] = useState(false)
  const [videoEnabled, setVideoEnabled] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      author: friends[0].name,
      content: 'Thanks everyone for joining!',
      timestamp: new Date()
    }
  ])
  
  // Mock active participants
  const participants = [
    currentUser,
    ...friends.slice(0, 6)
  ]

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return

    const newMessage: Message = {
      id: Date.now().toString(),
      author: currentUser.name,
      content: message,
      timestamp: new Date()
    }

    setMessages([...messages, newMessage])
    setMessage('')
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="h-screen flex flex-col bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-gray-300" />
              <h2 className="text-xl font-semibold text-white">{sessionTitle}</h2>
            </div>
            <span className="text-sm text-gray-400">
              {participants.length} participants
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            {isHost && (
              <button className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
                Host Controls
              </button>
            )}
            <button className="p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Video Grid */}
        <div className={cn(
          "flex-1 p-4 overflow-y-auto transition-all duration-300",
          showChat ? "w-2/3" : "w-full"
        )}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 h-full">
            {participants.map((participant, index) => (
              <div
                key={participant.id}
                className={cn(
                  "relative rounded-lg overflow-hidden bg-gray-800 border-2 aspect-video",
                  participant.id === currentUser.id
                    ? "border-blue-500"
                    : "border-gray-700"
                )}
              >
                {/* Video Placeholder */}
                <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 flex flex-col items-center justify-center">
                  <div className={cn(
                    "w-20 h-20 rounded-full flex items-center justify-center mb-3",
                    participant.id === currentUser.id
                      ? "bg-gradient-to-br from-blue-500 to-blue-600"
                      : "bg-gradient-to-br from-green-400 to-blue-500"
                  )}>
                    <span className="text-white font-semibold text-2xl">
                      {participant.name.charAt(0)}
                    </span>
                  </div>
                  <p className="text-white font-medium">{participant.name}</p>
                  <p className="text-gray-400 text-sm mt-1">{participant.injuryType}</p>
                </div>

                {/* User Badge */}
                {participant.id === currentUser.id && (
                  <div className="absolute top-2 left-2 px-2 py-1 bg-blue-600 text-white text-xs rounded">
                    You
                  </div>
                )}

                {/* Audio Status */}
                <div className="absolute bottom-2 left-2">
                  {micEnabled && participant.id === currentUser.id ? (
                    <Mic className="w-4 h-4 text-green-400" />
                  ) : (
                    <MicOff className="w-4 h-4 text-red-400" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Sidebar */}
        {showChat && (
          <div className="w-1/3 bg-gray-800 border-l border-gray-700 flex flex-col">
            {/* Chat Header */}
            <div className="px-4 py-3 border-b border-gray-700 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Chat</h3>
              <button
                onClick={() => setShowChat(false)}
                className="p-1 text-gray-400 hover:text-white rounded"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex flex-col",
                    msg.author === currentUser.name ? "items-end" : "items-start"
                  )}
                >
                  <div className={cn(
                    "px-3 py-2 rounded-lg max-w-[80%]",
                    msg.author === currentUser.name
                      ? "bg-blue-600 text-white"
                      : "bg-gray-700 text-gray-100"
                  )}>
                    {msg.author !== currentUser.name && (
                      <p className="text-xs font-medium mb-1 text-gray-300">{msg.author}</p>
                    )}
                    <p className="text-sm">{msg.content}</p>
                    <p className="text-xs mt-1 opacity-70">
                      {formatTime(msg.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="px-4 py-3 border-t border-gray-700">
              <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <MessageSquare className="w-5 h-5" />
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Controls Bar */}
      <div className="bg-gray-800 border-t border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setMicEnabled(!micEnabled)}
              className={cn(
                "flex items-center justify-center w-12 h-12 rounded-full transition-colors",
                micEnabled
                  ? "bg-gray-700 text-white hover:bg-gray-600"
                  : "bg-red-600 text-white hover:bg-red-700"
              )}
            >
              {micEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
            </button>
            
            <button
              onClick={() => setVideoEnabled(!videoEnabled)}
              className={cn(
                "flex items-center justify-center w-12 h-12 rounded-full transition-colors",
                videoEnabled
                  ? "bg-gray-700 text-white hover:bg-gray-600"
                  : "bg-red-600 text-white hover:bg-red-700"
              )}
            >
              {videoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
            </button>

            <button
              onClick={() => setShowChat(!showChat)}
              className={cn(
                "flex items-center justify-center w-12 h-12 rounded-full transition-colors",
                showChat
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-gray-700 text-white hover:bg-gray-600"
              )}
            >
              <MessageSquare className="w-5 h-5" />
            </button>

            <button className="flex items-center justify-center w-12 h-12 bg-gray-700 text-white rounded-full hover:bg-gray-600 transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center space-x-3">
            <button className="px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors text-sm">
              Participants
              <Users className="w-4 h-4 inline ml-2" />
            </button>
            
            <button
              onClick={onLeave}
              className="flex items-center px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              <PhoneOff className="w-5 h-5 mr-2" />
              Leave Session
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

