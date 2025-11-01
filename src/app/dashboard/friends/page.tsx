'use client'

import { friends, chatMessages, currentUser } from '@/lib/mockData'
import { cn } from '@/lib/utils'
import { MoreVertical, UserPlus, Send, MessageCircle, User, Search } from 'lucide-react'
import { useState } from 'react'

// Replicating the UI components from community.tsx using existing styles

const Card = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={cn("bg-white rounded-xl shadow-sm border border-gray-200", className)}>
    {children}
  </div>
);

const CardHeader = ({ children }: { children: React.ReactNode }) => (
  <div className="p-6 border-b border-gray-200">{children}</div>
);

const CardTitle = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <h2 className={cn("text-xl font-semibold text-gray-900", className)}>{children}</h2>
);

const CardDescription = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <p className={cn("text-gray-600 mt-1", className)}>{children}</p>
);

const CardContent = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={cn("p-6", className)}>{children}</div>
);

const Avatar = ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <div className={cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full", className)}>
        {children}
    </div>
);

const AvatarFallback = ({ children }: { children: React.ReactNode }) => (
    <span className="flex h-full w-full items-center justify-center rounded-full bg-gray-100">
        {children}
    </span>
);


export default function FriendsPage() {
  const [selectedFriend, setSelectedFriend] = useState<string | null>(friends[0]?.id || null)
  const [messageInput, setMessageInput] = useState('')
  const [messages, setMessages] = useState<Record<string, typeof chatMessages[string]>>(chatMessages)
  const [searchTerm, setSearchTerm] = useState('')

  const selectedFriendData = friends.find(f => f.id === selectedFriend)

  // Filter friends based on search term
  const filteredFriends = friends.filter(friend => {
    if (!searchTerm.trim()) return true
    const searchLower = searchTerm.toLowerCase()
    return (
      friend.name.toLowerCase().includes(searchLower) ||
      friend.injuryType.toLowerCase().includes(searchLower)
    )
  })

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedFriend) return

    const newMessage = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      receiverId: selectedFriend,
      content: messageInput,
      timestamp: new Date().toISOString()
    }

    setMessages(prev => ({
      ...prev,
      [selectedFriend]: [...(prev[selectedFriend] || []), newMessage]
    }))

    setMessageInput('')
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return date.toLocaleDateString()
  }

  const currentMessages = selectedFriend ? messages[selectedFriend] || [] : []
  const filteredMessages = currentMessages.filter(
    msg => (msg.senderId === currentUser.id && msg.receiverId === selectedFriend) ||
           (msg.senderId === selectedFriend && msg.receiverId === currentUser.id)
  )

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[calc(100vh-4rem)]">
      {/* Left Column: Friends List */}
      <Card className="flex flex-col overflow-hidden h-full">
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <div>
              <CardTitle>Friends</CardTitle>
              <CardDescription>Connect with your recovery companions</CardDescription>
            </div>
            <button className="flex items-center justify-center px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
              <UserPlus className="mr-2 h-4 w-4" />
              Add Friends
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search friends by name or injury type..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto">
          {filteredFriends.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-400">
              <div className="text-center">
                <User className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No friends found matching "{searchTerm}"</p>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredFriends.map((friend) => {
              const friendMessages = messages[friend.id] || []
              const lastMessage = friendMessages[friendMessages.length - 1]
              const isSelected = selectedFriend === friend.id

              return (
                <button
                  key={friend.id}
                  onClick={() => setSelectedFriend(friend.id)}
                  className={cn(
                    "w-full flex items-center space-x-3 p-4 rounded-lg transition-colors text-left",
                    isSelected ? "bg-blue-50 border-2 border-blue-200" : "hover:bg-gray-50 border-2 border-transparent"
                  )}
                >
                  <div className="relative">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback>
                        <User className="w-6 h-6 text-gray-600" />
                      </AvatarFallback>
                    </Avatar>
                    {friend.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className={cn("font-medium", isSelected ? "text-blue-900" : "text-gray-900")}>
                        {friend.name}
                      </p>
                      {lastMessage && (
                        <span className="text-xs text-gray-500">
                          {formatTime(lastMessage.timestamp)}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 truncate">{friend.injuryType}</p>
                    {lastMessage && (
                      <p className="text-sm text-gray-400 truncate mt-1">
                        {lastMessage.content}
                      </p>
                    )}
                  </div>
                </button>
              )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Right Column: Chat Interface */}
      <Card className="flex flex-col overflow-hidden h-full">
        {selectedFriendData ? (
          <>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>
                      <User className="w-5 h-5 text-gray-600" />
                    </AvatarFallback>
                  </Avatar>
                  {selectedFriendData.isOnline && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
                  )}
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg">{selectedFriendData.name}</CardTitle>
                  <CardDescription className="text-sm">
                    {selectedFriendData.isOnline ? 'Online' : 'Offline'} · {selectedFriendData.injuryType}
                  </CardDescription>
                </div>
                <button className="p-2 rounded-lg hover:bg-gray-100">
                  <MoreVertical className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col overflow-hidden">
              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
                {filteredMessages.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    <div className="text-center">
                      <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>No messages yet. Start the conversation!</p>
                    </div>
                  </div>
                ) : (
                  filteredMessages.map((message) => {
                    const isOwnMessage = message.senderId === currentUser.id
                    return (
                      <div
                        key={message.id}
                        className={cn(
                          "flex",
                          isOwnMessage ? "justify-end" : "justify-start"
                        )}
                      >
                        <div
                          className={cn(
                            "max-w-[70%] rounded-lg px-4 py-2",
                            isOwnMessage
                              ? "bg-blue-600 text-white"
                              : "bg-gray-100 text-gray-900"
                          )}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p className={cn("text-xs mt-1", isOwnMessage ? "text-blue-100" : "text-gray-500")}>
                            {formatTime(message.timestamp)}
                          </p>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>

              {/* Message Input */}
              <div className="flex items-center space-x-2 pt-4 border-t border-gray-200">
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!messageInput.trim()}
                  className={cn(
                    "p-2 rounded-lg transition-colors",
                    messageInput.trim()
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  )}
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </CardContent>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <div className="text-center">
              <MessageCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>Select a friend to start chatting</p>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}