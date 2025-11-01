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

// Pixelated cartoon avatar component with floating animation - aivilization.ai style
function PixelatedAvatar({ 
  isCurrentUser, 
  color, 
  delay,
  avatarIndex
}: { 
  isCurrentUser: boolean
  color: string
  delay: number
  avatarIndex: number
}) {
  // Different hair/hat styles for variety
  const hairStyles = ['none', 'spike', 'cap', 'long']
  const hairStyle = hairStyles[avatarIndex % hairStyles.length]
  
  return (
    <>
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-10px) rotate(2deg); }
          50% { transform: translateY(-5px) rotate(0deg); }
          75% { transform: translateY(-8px) rotate(-2deg); }
        }
        @keyframes pixelBounce {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes blink {
          0%, 90%, 100% { transform: scaleY(1); }
          95% { transform: scaleY(0.1); }
        }
        .pixel-float {
          animation: float 3s ease-in-out infinite;
        }
        .pixel-bounce {
          animation: pixelBounce 2s ease-in-out infinite;
        }
        .pixel-avatar {
          image-rendering: pixelated;
          image-rendering: -moz-crisp-edges;
          image-rendering: crisp-edges;
        }
      `}</style>
      <div 
        className="relative pixel-float"
        style={{
          animationDelay: `${delay}s`
        }}
      >
        {/* Pixelated avatar container - 32x32 pixel grid */}
        <div 
          className="relative pixel-avatar pixel-bounce"
          style={{
            width: '96px',
            height: '96px',
            animationDelay: `${delay}s`,
            transform: 'scale(1)',
            imageRendering: 'pixelated'
          }}
        >
          {/* Face base - square pixel art style */}
          <div 
            className="absolute"
            style={{
              left: '20px',
              top: '28px',
              width: '56px',
              height: '56px',
              backgroundColor: color,
              border: '2px solid #000',
              boxShadow: 'inset -2px -2px 0 rgba(0,0,0,0.3), inset 2px 2px 0 rgba(255,255,255,0.4)'
            }}
          />
          
          {/* Hair/Hat */}
          {hairStyle === 'spike' && (
            <>
              <div className="absolute" style={{ left: '16px', top: '24px', width: '8px', height: '12px', backgroundColor: '#8B4513', border: '2px solid #000' }} />
              <div className="absolute" style={{ left: '24px', top: '20px', width: '8px', height: '16px', backgroundColor: '#8B4513', border: '2px solid #000' }} />
              <div className="absolute" style={{ left: '32px', top: '18px', width: '8px', height: '18px', backgroundColor: '#8B4513', border: '2px solid #000' }} />
              <div className="absolute" style={{ left: '40px', top: '20px', width: '8px', height: '16px', backgroundColor: '#8B4513', border: '2px solid #000' }} />
              <div className="absolute" style={{ left: '48px', top: '24px', width: '8px', height: '12px', backgroundColor: '#8B4513', border: '2px solid #000' }} />
            </>
          )}
          {hairStyle === 'cap' && (
            <div 
              className="absolute"
              style={{
                left: '18px',
                top: '20px',
                width: '60px',
                height: '20px',
                backgroundColor: '#654321',
                border: '2px solid #000',
                borderRadius: '2px',
                boxShadow: 'inset -2px -2px 0 rgba(0,0,0,0.3)'
              }}
            />
          )}
          {hairStyle === 'long' && (
            <>
              <div className="absolute" style={{ left: '18px', top: '20px', width: '56px', height: '20px', backgroundColor: '#654321', border: '2px solid #000', borderBottom: 'none' }} />
              <div className="absolute" style={{ left: '20px', top: '24px', width: '12px', height: '32px', backgroundColor: '#654321', border: '2px solid #000', borderLeft: 'none' }} />
              <div className="absolute" style={{ right: '20px', top: '24px', width: '12px', height: '32px', backgroundColor: '#654321', border: '2px solid #000', borderRight: 'none' }} />
            </>
          )}
          
          {/* Eyes - pixelated squares with blink */}
          <div 
            className="absolute"
            style={{
              left: '32px',
              top: '40px',
              width: '6px',
              height: '6px',
              backgroundColor: '#000',
              border: '1px solid #000',
              animation: `blink 3s infinite`,
              animationDelay: `${delay + 1}s`
            }}
          />
          <div 
            className="absolute"
            style={{
              right: '32px',
              top: '40px',
              width: '6px',
              height: '6px',
              backgroundColor: '#000',
              border: '1px solid #000',
              animation: `blink 3s infinite`,
              animationDelay: `${delay + 1}s`
            }}
          />
          
          {/* Eye shine */}
          <div className="absolute" style={{ left: '33px', top: '41px', width: '2px', height: '2px', backgroundColor: '#FFF' }} />
          <div className="absolute" style={{ right: '33px', top: '41px', width: '2px', height: '2px', backgroundColor: '#FFF' }} />
          
          {/* Mouth - pixel smile */}
          <div 
            className="absolute"
            style={{
              left: '36px',
              top: '58px',
              width: '24px',
              height: '8px',
              border: '2px solid #000',
              borderTop: 'none',
              borderRadius: '0 0 12px 12px',
              backgroundColor: '#FFB6C1'
            }}
          />
          
          {/* Body */}
          <div 
            className="absolute"
            style={{
              left: '28px',
              top: '84px',
              width: '40px',
              height: '48px',
              backgroundColor: color,
              border: '2px solid #000',
              boxShadow: 'inset -2px -2px 0 rgba(0,0,0,0.3)'
            }}
          />
          
          {/* Pixel border grid effect */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `
                repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.05) 3px, rgba(0,0,0,0.05) 6px),
                repeating-linear-gradient(90deg, transparent, transparent 3px, rgba(0,0,0,0.05) 3px, rgba(0,0,0,0.05) 6px)
              `,
              opacity: 0.3
            }}
          />
        </div>
        
        {/* User indicator */}
        {isCurrentUser && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full border-2 border-gray-900 flex items-center justify-center shadow-lg">
            <div className="w-2 h-2 bg-white rounded-full" />
          </div>
        )}
      </div>
    </>
  )
}

export default function SessionRoom({ 
  sessionTitle = 'Group Exercise',
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
  
  // Limit to 4 participants max
  const participants = [
    currentUser,
    ...friends.slice(0, 3)
  ]
  
  const avatarColors = [
    '#3B82F6', // blue
    '#10B981', // green
    '#F59E0B', // orange
    '#EF4444'  // red
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
      <div className="flex-1 flex overflow-hidden relative">
        {/* Main Session Area - Central video with floating users */}
        <div className={cn(
          "flex-1 relative transition-all duration-300",
          showChat ? "w-2/3" : "w-full"
        )}>
          {/* Central Exercise Video */}
          <div className="absolute inset-0 flex items-center justify-center p-8">
            <div className="relative w-full max-w-4xl aspect-video bg-gray-800 rounded-xl overflow-hidden border-4 border-gray-700 shadow-2xl">
              {/* Video Placeholder */}
              <div className="w-full h-full bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col items-center justify-center">
                <Video className="w-24 h-24 text-gray-600 mb-4" />
                <p className="text-white text-xl font-semibold mb-2">Exercise Instruction Video</p>
                <p className="text-gray-400 text-sm">Follow along with the guided exercise</p>
              </div>
              
              {/* Play overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 bg-blue-600 bg-opacity-80 rounded-full flex items-center justify-center cursor-pointer hover:bg-opacity-100 transition-opacity">
                  <div className="w-0 h-0 border-l-[16px] border-l-white border-t-[12px] border-t-transparent border-b-[12px] border-b-transparent ml-1" />
                </div>
              </div>
            </div>
          </div>

          {/* Floating Users Around Video */}
          <div className="absolute inset-0 pointer-events-none">
            {participants.map((participant, index) => {
              const isCurrent = participant.id === currentUser.id
              const position = [
                { top: '10%', left: '10%' },  // Top-left
                { top: '10%', right: '10%' }, // Top-right
                { bottom: '10%', left: '10%' }, // Bottom-left
                { bottom: '10%', right: '10%' } // Bottom-right
              ][index] || { top: '50%', left: '50%' }
              
              return (
                <div
                  key={participant.id}
                  className="absolute flex flex-col items-center"
                  style={position}
                >
                  {/* Pixelated Avatar */}
                  <div className="relative mb-2">
                    <PixelatedAvatar 
                      isCurrentUser={isCurrent}
                      color={avatarColors[index]}
                      delay={index * 0.5}
                      avatarIndex={index}
                    />
                    
                    {/* Audio Status */}
                    <div className="absolute -bottom-1 -right-1">
                      {micEnabled && isCurrent ? (
                        <Mic className="w-4 h-4 text-green-400 bg-gray-900 rounded-full p-1" />
                      ) : (
                        <MicOff className="w-4 h-4 text-red-400 bg-gray-900 rounded-full p-1" />
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
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

