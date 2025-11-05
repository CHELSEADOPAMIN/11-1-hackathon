'use client'

import { chatMessages, currentUser, friends as initialFriends, availableUsers, PendingFriendRequest } from '@/lib/mockData'
import { cn } from '@/lib/utils'
import { MessageCircle, MoreVertical, Search, Send, User, UserPlus, Check, X, Clock } from 'lucide-react'
import { useState } from 'react'
import AddFriendModal from '@/components/dashboard/AddFriendModal'

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
  const [friendsList, setFriendsList] = useState(initialFriends)
  // Initialize with some mock received requests for demonstration
  const [pendingRequests, setPendingRequests] = useState<PendingFriendRequest[]>([
    {
      id: 'received-1',
      senderId: '7', // James Anderson
      receiverId: currentUser.id,
      requestedAt: '2024-11-01T08:00:00Z',
      status: 'pending'
    },
    {
      id: 'received-2',
      senderId: '10', // Olivia White
      receiverId: currentUser.id,
      requestedAt: '2024-11-01T09:15:00Z',
      status: 'pending'
    }
  ])
  const [selectedFriend, setSelectedFriend] = useState<string | null>(friendsList[0]?.id || null)
  const [messageInput, setMessageInput] = useState('')
  const [messages, setMessages] = useState<Record<string, typeof chatMessages[string]>>(chatMessages)
  const [searchTerm, setSearchTerm] = useState('')
  const [isAddFriendModalOpen, setIsAddFriendModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'friends' | 'received' | 'sent'>('friends')

  const selectedFriendData = friendsList.find(f => f.id === selectedFriend)
  
  // Separate sent and received requests
  const receivedRequests = pendingRequests.filter(r => 
    r.receiverId === currentUser.id && r.status === 'pending'
  )
  const sentRequests = pendingRequests.filter(r => 
    r.senderId === currentUser.id && r.status === 'pending'
  )

  // Filter friends based on search term
  const filteredFriends = friendsList.filter(friend => {
    if (!searchTerm.trim()) return true
    const searchLower = searchTerm.toLowerCase()
    return (
      friend.name.toLowerCase().includes(searchLower) ||
      friend.injuryType.toLowerCase().includes(searchLower)
    )
  })

  // Handle adding a new friend (sends request to the other user)
  const handleAddFriend = (userId: string) => {
    const userToAdd = availableUsers.find(u => u.id === userId)
    // Check if already friends or request already exists
    const alreadyFriends = friendsList.find(f => f.id === userId)
    const existingRequest = pendingRequests.find(p => 
      (p.senderId === currentUser.id && p.receiverId === userId && p.status === 'pending') ||
      (p.senderId === userId && p.receiverId === currentUser.id && p.status === 'pending')
    )
    
    if (userToAdd && !alreadyFriends && !existingRequest) {
      const newRequest: PendingFriendRequest = {
        id: `request-${Date.now()}`,
        senderId: currentUser.id,
        receiverId: userId,
        requestedAt: new Date().toISOString(),
        status: 'pending'
      }
      setPendingRequests([...pendingRequests, newRequest])
      // Close modal after sending request
      setIsAddFriendModalOpen(false)
    }
  }

  // Handle accepting a received friend request
  const handleAcceptRequest = (requestId: string) => {
    const request = pendingRequests.find(r => r.id === requestId)
    if (request && request.receiverId === currentUser.id) {
      // Get the sender (the person who sent the request)
      const sender = availableUsers.find(u => u.id === request.senderId) || 
                    friendsList.find(f => f.id === request.senderId)
      
      if (sender && !friendsList.find(f => f.id === request.senderId)) {
        // Add to friends list
        const userToAdd = availableUsers.find(u => u.id === request.senderId)
        if (userToAdd) {
          setFriendsList([...friendsList, userToAdd])
        }
        // Update request status
        setPendingRequests(pendingRequests.map(r => 
          r.id === requestId ? { ...r, status: 'accepted' } : r
        ))
        // Switch to friends tab and select the new friend
        if (activeTab === 'received') {
          setActiveTab('friends')
          setSelectedFriend(request.senderId)
        }
      }
    }
  }

  // Handle rejecting a received friend request
  const handleRejectRequest = (requestId: string) => {
    const request = pendingRequests.find(r => r.id === requestId)
    if (request && request.receiverId === currentUser.id) {
      // Update status to rejected
      setPendingRequests(pendingRequests.map(r => 
        r.id === requestId ? { ...r, status: 'rejected' } : r
      ))
    }
  }

  // Handle canceling a sent request
  const handleCancelSentRequest = (requestId: string) => {
    const request = pendingRequests.find(r => r.id === requestId)
    if (request && request.senderId === currentUser.id) {
      // Remove the sent request
      setPendingRequests(pendingRequests.filter(r => r.id !== requestId))
    }
  }

  // Get existing friend IDs and pending request IDs for the modal
  const existingFriendIds = friendsList.map(f => f.id)
  const pendingReceiverIds = pendingRequests
    .filter(r => r.senderId === currentUser.id && r.status === 'pending')
    .map(r => r.receiverId)
  const pendingSenderIds = pendingRequests
    .filter(r => r.receiverId === currentUser.id && r.status === 'pending')
    .map(r => r.senderId)
  const excludedUserIds = [...existingFriendIds, ...pendingReceiverIds, ...pendingSenderIds]

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
            <button
              onClick={() => setIsAddFriendModalOpen(true)}
              className="flex items-center justify-center px-4 py-2 bg-[#EAE6F5] text-[#8573bd] rounded-lg hover:bg-[#8573bd] hover:text-white transition-colors"
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Add Friends
            </button>
          </div>
          {/* Tabs for Friends, Received Requests, and Sent Requests */}
          <div className="flex border-b border-gray-200 -mx-6 px-6 overflow-x-auto">
            <button
              onClick={() => setActiveTab('friends')}
              className={cn(
                "px-4 py-2 text-sm font-medium border-b-2 transition-colors relative whitespace-nowrap",
                activeTab === 'friends'
                  ? "border-[#8573bd] text-[#8573bd]"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              )}
            >
              Friends
              {friendsList.length > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-[#EAE6F5] text-[#8573bd] rounded-full text-xs">
                  {friendsList.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('received')}
              className={cn(
                "px-4 py-2 text-sm font-medium border-b-2 transition-colors relative flex items-center whitespace-nowrap",
                activeTab === 'received'
                  ? "border-[#8573bd] text-[#8573bd]"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              )}
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Received
              {receivedRequests.length > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-[#EAE6F5] text-[#8573bd] rounded-full text-xs">
                  {receivedRequests.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('sent')}
              className={cn(
                "px-4 py-2 text-sm font-medium border-b-2 transition-colors relative flex items-center whitespace-nowrap",
                activeTab === 'sent'
                  ? "border-[#8573bd] text-[#8573bd]"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              )}
            >
              <Clock className="w-4 h-4 mr-2" />
              Sent
              {sentRequests.length > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-[#EAE6F5] text-[#8573bd] rounded-full text-xs">
                  {sentRequests.length}
                </span>
              )}
            </button>
          </div>
          {activeTab === 'friends' && (
            <div className="relative mt-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search friends by name or injury type..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
          )}
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto">
          {activeTab === 'friends' ? (
            <>
              {filteredFriends.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-400">
                  <div className="text-center">
                    <User className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">
                      {searchTerm.trim() 
                        ? `No friends found matching &quot;${searchTerm}&quot;`
                        : 'No friends yet. Add some friends to get started!'
                      }
                    </p>
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
                      isSelected ? "bg-[#EAE6F5] border-2 border-[#8573bd]" : "hover:bg-gray-50 border-2 border-transparent"
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
                        <p className={cn("font-medium", isSelected ? "text-[#8573bd]" : "text-gray-900")}>
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
            </>
          ) : activeTab === 'received' ? (
            <>
              {receivedRequests.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-400">
                  <div className="text-center">
                    <UserPlus className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No received friend requests</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {receivedRequests.map((request) => {
                      const senderUser = availableUsers.find(u => u.id === request.senderId) || 
                                        friendsList.find(f => f.id === request.senderId)
                      if (!senderUser) return null
                      
                      return (
                        <div
                          key={request.id}
                          className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-[#8573bd] hover:bg-[#EAE6F5]/30 transition-all"
                        >
                          <div className="flex items-center space-x-4">
                            <div className="relative">
                              <div className="w-12 h-12 bg-gradient-to-br from-[#8573bd] to-[#E8B98A] rounded-full flex items-center justify-center">
                                <User className="w-6 h-6 text-white" />
                              </div>
                              {senderUser.isOnline && (
                                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
                              )}
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">{senderUser.name}</h3>
                              <p className="text-sm text-gray-500">{senderUser.injuryType}</p>
                              <p className="text-xs text-gray-400 mt-1">
                                Sent {formatTime(request.requestedAt)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleAcceptRequest(request.id)}
                              className="flex items-center px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                              title="Accept friend request"
                            >
                              <Check className="w-4 h-4 mr-1" />
                              <span className="text-xs">Accept</span>
                            </button>
                            <button
                              onClick={() => handleRejectRequest(request.id)}
                              className="flex items-center px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                              title="Reject friend request"
                            >
                              <X className="w-4 h-4 mr-1" />
                              <span className="text-xs">Reject</span>
                            </button>
                          </div>
                        </div>
                      )
                    })}
                </div>
              )}
            </>
          ) : (
            <>
              {sentRequests.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-400">
                  <div className="text-center">
                    <Clock className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No sent friend requests</p>
                    <p className="text-xs text-gray-400 mt-1">Waiting for responses...</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {sentRequests.map((request) => {
                      const receiverUser = availableUsers.find(u => u.id === request.receiverId)
                      if (!receiverUser) return null
                      
                      return (
                        <div
                          key={request.id}
                          className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-gray-50/50"
                        >
                          <div className="flex items-center space-x-4">
                            <div className="relative">
                              <div className="w-12 h-12 bg-gradient-to-br from-[#8573bd] to-[#E8B98A] rounded-full flex items-center justify-center">
                                <User className="w-6 h-6 text-white" />
                              </div>
                              {receiverUser.isOnline && (
                                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
                              )}
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">{receiverUser.name}</h3>
                              <p className="text-sm text-gray-500">{receiverUser.injuryType}</p>
                              <p className="text-xs text-gray-400 mt-1">
                                Sent {formatTime(request.requestedAt)} · Waiting for response
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleCancelSentRequest(request.id)}
                            className="flex items-center px-3 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                            title="Cancel request"
                          >
                            <X className="w-4 h-4 mr-1" />
                            <span className="text-xs">Cancel</span>
                          </button>
                        </div>
                      )
                    })}
                </div>
              )}
            </>
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
                              ? "bg-[#8573bd] text-white"
                              : "bg-gray-100 text-gray-900"
                          )}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p className={cn("text-xs mt-1", isOwnMessage ? "text-white/70" : "text-gray-500")}>
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
                      ? "bg-[#8573bd] text-white hover:bg-[#E8B98A]"
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

      {/* Add Friend Modal */}
      <AddFriendModal
        isOpen={isAddFriendModalOpen}
        onClose={() => setIsAddFriendModalOpen(false)}
        onAddFriend={handleAddFriend}
        existingFriendIds={excludedUserIds}
      />
    </div>
  );
}