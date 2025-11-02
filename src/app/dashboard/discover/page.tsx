'use client'

import AIMatchDetails from '@/components/dashboard/AIMatchDetails'
import { AIMatchResult, AIRecommendationResponse, availableParties, currentUser, currentUserProfile, friends, globalPublicChat, PublicChatMessage, userInterests } from '@/lib/mockData'
import { useParty } from '@/lib/PartyContext'
import { cn } from '@/lib/utils'
import { Brain, CheckCircle, Info, Loader2, MessageCircle, Search, Send, User, Users, XCircle, Zap } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

const Card = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={cn("bg-white rounded-xl shadow-sm border border-gray-200", className)}>
    {children}
  </div>
)

const CardHeader = ({ children }: { children: React.ReactNode }) => (
  <div className="p-6 border-b border-gray-200">{children}</div>
)

const CardTitle = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <h2 className={cn("text-xl font-semibold text-gray-900", className)}>{children}</h2>
)

const CardDescription = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <p className={cn("text-gray-600 mt-1", className)}>{children}</p>
)

const CardContent = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={cn("p-6", className)}>{children}</div>
)

export default function DiscoverPage() {
  const { joinedParty, setJoinedParty } = useParty()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedParty, setSelectedParty] = useState<string | null>(null)
  const [chatMessages, setChatMessages] = useState<PublicChatMessage[]>(globalPublicChat)
  const [messageInput, setMessageInput] = useState('')
  const chatEndRef = useRef<HTMLDivElement>(null)

  // AI 推荐相关状态
  const [aiRecommendations, setAiRecommendations] = useState<AIRecommendationResponse | null>(null)
  const [loadingRecommendations, setLoadingRecommendations] = useState(false)
  const [showAISection, setShowAISection] = useState(true)
  const [selectedMatch, setSelectedMatch] = useState<AIMatchResult | null>(null)
  const [showMatchDetails, setShowMatchDetails] = useState(false)

  // Filter parties by user interests and search term
  const filteredParties = availableParties.filter(party => {
    const matchesInterest = userInterests.includes(party.category)
    const matchesSearch = party.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      party.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesInterest && matchesSearch
  })

  const selectedPartyData = selectedParty
    ? filteredParties.find(p => p.id === selectedParty)
    : null

  // 获取 AI 推荐
  const fetchAIRecommendations = async () => {
    setLoadingRecommendations(true)
    try {
      const response = await fetch('/api/match-patients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          patientProfile: currentUserProfile
        })
      })

      if (response.ok) {
        const recommendations: AIRecommendationResponse = await response.json()
        setAiRecommendations(recommendations)
        console.log('✅ AI recommendations loaded successfully:', recommendations)
      } else {
        const errorText = await response.text()
        console.error('Failed to fetch AI recommendations:', response.status, errorText)
      }
    } catch (error) {
      console.error('Error fetching AI recommendations:', error)
    } finally {
      setLoadingRecommendations(false)
    }
  }

  // 页面加载时获取 AI 推荐
  useEffect(() => {
    if (showAISection && !aiRecommendations) {
      fetchAIRecommendations()
    }
  }, [showAISection])

  // 查看匹配详情
  const handleViewDetails = (matchResult: AIMatchResult) => {
    setSelectedMatch(matchResult)
    setShowMatchDetails(true)
  }

  const handleJoinParty = (partyId: string) => {
    if (joinedParty && joinedParty.id !== partyId) {
      // Already in another party, show warning or handle leave/join
      if (confirm('You are already in a party. Leave your current party to join this one?')) {
        setJoinedParty(filteredParties.find(p => p.id === partyId) || null)
      }
    } else {
      setJoinedParty(filteredParties.find(p => p.id === partyId) || null)
    }
  }

  const handleLeaveParty = () => {
    if (confirm('Are you sure you want to leave this party?')) {
      setJoinedParty(null)
      setSelectedParty(null)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
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

  const getSenderName = (senderId: string) => {
    if (senderId === currentUser.id) return currentUser.name
    const sender = friends.find(f => f.id === senderId)
    return sender ? sender.name : 'Unknown User'
  }

  const handleSendMessage = () => {
    if (!messageInput.trim()) return

    const newMessage: PublicChatMessage = {
      id: `global-msg-${Date.now()}`,
      senderId: currentUser.id,
      partyId: 'all',
      content: messageInput,
      timestamp: new Date().toISOString()
    }

    setChatMessages(prev => [...prev, newMessage])
    setMessageInput('')
  }

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages])

  return (
    <div className="space-y-6">
      {/* AI Recommendations Section */}
      {showAISection && (
        <div className="bg-gradient-to-r from-[#8573bd] to-[#E8B98A] rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Brain className="w-6 h-6 mr-2" />
              <h2 className="text-2xl font-bold">AI Smart Matching Recommendations</h2>
            </div>
            <button
              onClick={() => setShowAISection(false)}
              className="text-white/80 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>
          <p className="mb-4 opacity-90">
            Based on your recovery progress, training intensity, and goals, we've selected these groups for you:
          </p>

          {loadingRecommendations ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin mr-3" />
              <span>AI is analyzing your profile...</span>
            </div>
          ) : aiRecommendations?.recommendations ? (
            <div className="space-y-3">
              {aiRecommendations.recommendations.map((rec, index) => (
                <div key={rec.partyId} className="bg-white/20 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">{rec.partyName}</h3>
                      <div className="flex items-center mt-2">
                        <div className="bg-white/30 rounded-full px-3 py-1 text-sm mr-3">
                          Match: {rec.matchScore}%
                        </div>
                        <div className="bg-[#E8B98A]/30 rounded-full px-3 py-1 text-sm">
                          #{index + 1} Recommended
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewDetails(rec)}
                        className="bg-white/20 text-white px-3 py-2 rounded-lg font-medium hover:bg-white/30 transition-colors flex items-center"
                      >
                        <Info className="w-4 h-4 mr-1" />
                        Details
                      </button>
                      <button
                        onClick={() => handleJoinParty(rec.partyId)}
                        className="bg-white text-[#8573bd] px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                      >
                        Join Group
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1 mb-3">
                    {rec.reasons.slice(0, 3).map((reason, i) => (
                      <div key={i} className="flex items-center text-sm opacity-90">
                        <CheckCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                        {reason}
                      </div>
                    ))}
                  </div>

                  <div className="text-sm opacity-80 italic">
                    Expected benefit: {rec.expectedBenefit}
                  </div>
                </div>
              ))}

              {/* New Group Suggestion */}
              {aiRecommendations.suggestNewGroup && aiRecommendations.newGroupSuggestion && (
                <div className="bg-orange-200/20 border border-orange-300/30 rounded-lg p-4 mt-4">
                  <div className="flex items-center mb-2">
                    <Zap className="w-5 h-5 mr-2" />
                    <h4 className="font-semibold">AI Suggests Creating New Group</h4>
                  </div>
                  <h5 className="font-medium mb-2">{aiRecommendations.newGroupSuggestion.name}</h5>
                  <p className="text-sm opacity-90 mb-3">{aiRecommendations.newGroupSuggestion.reason}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">
                      Estimated size: {aiRecommendations.newGroupSuggestion.estimatedSize} members
                    </span>
                    <button className="bg-orange-200/30 text-white px-3 py-1 rounded text-sm hover:bg-orange-200/40 transition-colors">
                      Create Group
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="opacity-80">Unable to load recommendations. Please try again later.</p>
              <button
                onClick={fetchAIRecommendations}
                className="mt-2 bg-white/20 px-4 py-2 rounded-lg hover:bg-white/30 transition-colors"
              >
                Retry
              </button>
            </div>
          )}
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[calc(100vh-4rem)]">
        {/* Left Column: Party List */}
        <Card className="flex flex-col overflow-hidden h-full">
          <CardHeader>
            <div>
              <CardTitle>Discover Parties</CardTitle>
              <CardDescription>
                Find communities that match your interests: {userInterests.join(', ')}
              </CardDescription>
            </div>
            <div className="mt-4 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search parties..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto">
            {filteredParties.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-400">
                <div className="text-center">
                  <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No parties found matching your interests</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredParties.map((party) => {
                  const isJoined = joinedParty?.id === party.id
                  const isSelected = selectedParty === party.id

                  return (
                    <button
                      key={party.id}
                      onClick={() => setSelectedParty(party.id)}
                      className={cn(
                        "w-full p-4 rounded-lg border-2 transition-all text-left",
                        isSelected
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      )}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">{party.name}</h3>
                        {isJoined && (
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 ml-2" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {party.description}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center space-x-4">
                          <span className="flex items-center">
                            <Users className="w-4 h-4 mr-1" />
                            {party.memberCount}{party.maxMembers ? `/${party.maxMembers}` : ''}
                          </span>
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                            {party.category}
                          </span>
                        </div>
                        <span>{formatDate(party.createdAt)}</span>
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Right Column: Two Rows - Party Details and Public Chat */}
        <div className="flex flex-col gap-6 h-[calc(100vh-4rem)]">
          {/* Top Row: Party Details */}
          <Card className="flex flex-col overflow-hidden flex-1 min-h-0">
            {selectedPartyData ? (
              <>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle>{selectedPartyData.name}</CardTitle>
                      <CardDescription>{selectedPartyData.description}</CardDescription>
                    </div>
                    {joinedParty?.id === selectedPartyData.id && (
                      <span className="ml-4 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                        Joined
                      </span>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="overflow-y-auto">
                  <div className="space-y-6">
                    {/* Party Info */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Party Information</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm text-gray-600">Category</span>
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                            {selectedPartyData.category}
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm text-gray-600">Members</span>
                          <span className="text-sm font-medium text-gray-900">
                            {selectedPartyData.memberCount}
                            {selectedPartyData.maxMembers && ` / ${selectedPartyData.maxMembers}`}
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm text-gray-600">Created</span>
                          <span className="text-sm font-medium text-gray-900">
                            {formatDate(selectedPartyData.createdAt)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm text-gray-600">Organizer</span>
                          <div className="flex items-center space-x-2">
                            <User className="w-4 h-4 text-gray-400" />
                            <span className="text-sm font-medium text-gray-900">
                              {selectedPartyData.organizer.name}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-4 border-t border-gray-200">
                      {joinedParty?.id === selectedPartyData.id ? (
                        <button
                          onClick={handleLeaveParty}
                          className="w-full flex items-center justify-center px-4 py-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium"
                        >
                          <XCircle className="w-5 h-5 mr-2" />
                          Leave Party
                        </button>
                      ) : (
                        <button
                          onClick={() => handleJoinParty(selectedPartyData.id)}
                          disabled={!!joinedParty}
                          className={cn(
                            "w-full flex items-center justify-center px-4 py-3 rounded-lg font-medium transition-colors",
                            joinedParty
                              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                              : "bg-blue-600 text-white hover:bg-blue-700"
                          )}
                        >
                          {joinedParty ? (
                            <>
                              <XCircle className="w-5 h-5 mr-2" />
                              Already in another party
                            </>
                          ) : (
                            <>
                              <CheckCircle className="w-5 h-5 mr-2" />
                              Join Party
                            </>
                          )}
                        </button>
                      )}
                      {joinedParty && joinedParty.id !== selectedPartyData.id && (
                        <p className="mt-2 text-xs text-center text-gray-500">
                          You can only join one party at a time
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </>
            ) : (
              <div className="flex items-center justify-center h-full min-h-[200px] text-gray-400">
                <div className="text-center">
                  <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>Select a party to view details</p>
                </div>
              </div>
            )}
          </Card>

          {/* Bottom Row: Public Chat */}
          <Card className="flex flex-col overflow-hidden flex-1 min-h-0">
            <CardHeader>
              <div className="flex items-center">
                <MessageCircle className="w-5 h-5 mr-2" />
                <CardTitle className="text-lg">Public Chat</CardTitle>
                <span className="ml-2 text-xs text-gray-500">(All Parties)</span>
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col overflow-hidden p-0">
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {chatMessages.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    <div className="text-center">
                      <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No messages yet. Be the first to chat!</p>
                    </div>
                  </div>
                ) : (
                  chatMessages.map((message) => {
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
                            "max-w-[75%] rounded-lg px-3 py-2",
                            isOwnMessage
                              ? "bg-blue-600 text-white"
                              : "bg-white text-gray-900 border border-gray-200"
                          )}
                        >
                          {!isOwnMessage && (
                            <p className="text-xs font-medium mb-1 opacity-80">
                              {getSenderName(message.senderId)}
                            </p>
                          )}
                          <p className="text-sm">{message.content}</p>
                          <p className={cn("text-xs mt-1", isOwnMessage ? "text-blue-100" : "text-gray-500")}>
                            {formatTime(message.timestamp)}
                          </p>
                        </div>
                      </div>
                    )
                  })
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200 bg-white">
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type a message to all parties..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
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
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* AI Match Details Modal */}
      {selectedMatch && (
        <AIMatchDetails
          matchResult={selectedMatch}
          patientProfile={currentUserProfile}
          isOpen={showMatchDetails}
          onClose={() => setShowMatchDetails(false)}
          onJoin={handleJoinParty}
        />
      )}
    </div>
  )
}

