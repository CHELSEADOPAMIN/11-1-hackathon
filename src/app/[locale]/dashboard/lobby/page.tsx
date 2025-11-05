'use client'

import { lobbyPosts } from '@/lib/mockData'
import { useParty } from '@/lib/PartyContext'
import { cn } from '@/lib/utils'
import { ArrowRight, Calendar, Heart, Image, LogOut, MessageCircle, Send, Smile, User, Users } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function LobbyPage() {
  const { joinedParty, setJoinedParty } = useParty()
  const [newPost, setNewPost] = useState('')
  const [posts, setPosts] = useState(lobbyPosts)

  const handleSubmitPost = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPost.trim()) return

    const post = {
      id: Date.now().toString(),
      author: {
        id: '1',
        name: 'Alex Chen',
        avatar: '/api/placeholder/40/40',
        injuryType: 'Knee Rehabilitation',
        joinDate: '2024-09-15',
        isOnline: true
      },
      content: newPost,
      timestamp: new Date().toISOString(),
      likes: 0,
      comments: 0
    }

    setPosts([post, ...posts])
    setNewPost('')
  }

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date()
    const postTime = new Date(timestamp)
    const diffInMinutes = Math.floor((now.getTime() - postTime.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`

    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours}h ago`

    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays}d ago`
  }

  const handleLike = (postId: string) => {
    setPosts(posts.map(post =>
      post.id === postId
        ? { ...post, likes: post.likes + 1 }
        : post
    ))
  }

  if (!joinedParty) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
        <div className="text-center max-w-md">
          <Users className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">No Active Party</h1>
          <p className="text-gray-600 mb-6">
            You haven't joined any party yet. Discover and join a party that matches your interests to start participating in the community.
          </p>
          <Link
            href="/dashboard/discover"
            className="inline-flex items-center px-6 py-3 bg-[#8573bd] text-white rounded-lg hover:bg-[#E8B98A] transition-colors font-medium"
          >
            Discover Parties
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const handleLeaveParty = () => {
    if (confirm('Are you sure you want to leave this party?')) {
      setJoinedParty(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Party Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900">{joinedParty.name}</h1>
              <span className="px-3 py-1 bg-[#EAE6F5] text-[#8573bd] rounded-full text-sm font-medium">
                {joinedParty.category}
              </span>
            </div>
            <p className="text-gray-600 mb-4">{joinedParty.description}</p>
            <div className="flex items-center space-x-6 text-sm text-gray-500">
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-2" />
                {joinedParty.memberCount}
                {joinedParty.maxMembers && ` / ${joinedParty.maxMembers} members`}
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                Created {formatDate(joinedParty.createdAt)}
              </div>
              <div className="flex items-center">
                <User className="w-4 h-4 mr-2" />
                Organized by {joinedParty.organizer.name}
              </div>
            </div>
          </div>
          <button
            onClick={handleLeaveParty}
            className="flex items-center px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors ml-4"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Leave Party
          </button>
        </div>
      </div>

      {/* 发布新动态 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <form onSubmit={handleSubmitPost}>
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 bg-[#8573bd] rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-5 h-5 text-white" />
            </div>

            <div className="flex-1">
              <textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="Share your recovery insights and encourage more companions..."
                className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                rows={3}
              />

              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    className="flex items-center px-3 py-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Image className="w-4 h-4 mr-1" />
                    Image
                  </button>
                  <button
                    type="button"
                    className="flex items-center px-3 py-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Smile className="w-4 h-4 mr-1" />
                    Emoji
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={!newPost.trim()}
                  className={cn(
                    "flex items-center px-4 py-2 rounded-lg font-medium transition-colors",
                    newPost.trim()
                      ? "bg-[#8573bd] text-white hover:bg-[#E8B98A]"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  )}
                >
                  <Send className="w-4 h-4 mr-2" />
                  Post
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* 动态列表 */}
      <div className="space-y-4">
        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-6 h-6 text-white" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="font-semibold text-gray-900">{post.author.name}</h3>
                  <span className="px-2 py-1 bg-[#EAE6F5] text-[#8573bd] text-xs rounded-full">
                    {post.author.injuryType}
                  </span>
                  <span className="text-gray-400">·</span>
                  <span className="text-sm text-gray-500">{formatTimeAgo(post.timestamp)}</span>
                </div>

                <p className="text-gray-700 mb-4 leading-relaxed">
                  {post.content}
                </p>

                {post.images && post.images.length > 0 && (
                  <div className="mb-4">
                    <div className="grid grid-cols-2 gap-2">
                      {post.images.map((image, index) => (
                        <div
                          key={index}
                          className="aspect-video bg-gray-100 rounded-lg overflow-hidden"
                        >
                          <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                            <Image className="w-8 h-8 text-gray-400" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center space-x-6 pt-3 border-t border-gray-100">
                  <button
                    onClick={() => handleLike(post.id)}
                    className="flex items-center space-x-2 text-gray-500 hover:text-red-500 transition-colors"
                  >
                    <Heart className="w-4 h-4" />
                    <span className="text-sm">{post.likes}</span>
                  </button>

                  <button className="flex items-center space-x-2 text-gray-500 hover:text-[#8573bd] transition-colors">
                    <MessageCircle className="w-4 h-4" />
                    <span className="text-sm">{post.comments}</span>
                  </button>

                  <button className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
                    Share
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 加载更多 */}
      <div className="text-center py-8">
        <button className="px-6 py-3 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors">
          Load More Posts
        </button>
      </div>
    </div>
  )
}
