// Mock data for the rehabilitation companion platform

export interface User {
  id: string
  name: string
  avatar: string
  injuryType: string
  joinDate: string
  isOnline: boolean
  lastCheckIn?: string
}

export interface Task {
  id: string
  title: string
  description: string
  completed: boolean
  type: 'exercise' | 'medication' | 'therapy' | 'check'
  duration?: number // 分钟
  completedAt?: string
}

export interface Post {
  id: string
  author: User
  content: string
  timestamp: string
  likes: number
  comments: number
  images?: string[]
}

export interface Article {
  id: string
  title: string
  summary: string
  category: string
  readTime: number
  thumbnail: string
  publishDate: string
  author: string
}

export interface WeeklyProgress {
  day: string
  completed: number
  total: number
}

export interface Party {
  id: string
  name: string
  description: string
  category: string // Injury category like 'Knee', 'Shoulder', etc.
  memberCount: number
  maxMembers?: number
  createdAt: string
  organizer: User
  thumbnail?: string
}

export interface ChatMessage {
  id: string
  senderId: string
  receiverId: string
  content: string
  timestamp: string
}

export interface PublicChatMessage {
  id: string
  senderId: string
  partyId: string
  content: string
  timestamp: string
}

export interface Chat {
  friendId: string
  messages: ChatMessage[]
  lastMessage?: ChatMessage
}

// Current user with interests
export const currentUser: User = {
  id: '1',
  name: 'Alex Chen',
  avatar: '/api/placeholder/40/40',
  injuryType: 'Knee Rehabilitation',
  joinDate: '2024-09-15',
  isOnline: true,
  lastCheckIn: '2024-11-01T08:30:00Z'
}

// User's interest categories (for party filtering)
export const userInterests: string[] = ['Knee', 'Shoulder', 'Spine']

// Currently joined party (can only be one at a time)
export let joinedParty: Party | null = null

// Function to set joined party (enforces single party rule)
export function setJoinedParty(party: Party | null) {
  joinedParty = party
}

// Today's tasks
export const todaysTasks: Task[] = [
  {
    id: '1',
    title: 'Morning Stretching',
    description: 'Perform 15-minute knee joint stretching exercises',
    completed: true,
    type: 'exercise',
    duration: 15,
    completedAt: '2024-11-01T07:00:00Z'
  },
  {
    id: '2',
    title: 'Take Anti-inflammatory',
    description: 'Take Ibuprofen 200mg after meals',
    completed: true,
    type: 'medication',
    completedAt: '2024-11-01T08:30:00Z'
  },
  {
    id: '3',
    title: 'Physical Therapy',
    description: 'Physical therapy session at rehabilitation center at 2 PM',
    completed: false,
    type: 'therapy',
    duration: 60
  },
  {
    id: '4',
    title: 'Evening Walk',
    description: '20-minute gentle walk after dinner',
    completed: false,
    type: 'exercise',
    duration: 20
  },
  {
    id: '5',
    title: 'Pain Log',
    description: 'Record today\'s pain level and feelings',
    completed: false,
    type: 'check'
  }
]

// Rehabilitation companions list
export const friends: User[] = [
  {
    id: '2',
    name: 'Sarah Johnson',
    avatar: '/api/placeholder/40/40',
    injuryType: 'Shoulder Rehabilitation',
    joinDate: '2024-08-20',
    isOnline: true,
    lastCheckIn: '2024-11-01T09:15:00Z'
  },
  {
    id: '3',
    name: 'Mike Wilson',
    avatar: '/api/placeholder/40/40',
    injuryType: 'Spine Rehabilitation',
    joinDate: '2024-07-10',
    isOnline: false,
    lastCheckIn: '2024-10-31T19:30:00Z'
  },
  {
    id: '4',
    name: 'Emma Davis',
    avatar: '/api/placeholder/40/40',
    injuryType: 'Ankle Rehabilitation',
    joinDate: '2024-10-01',
    isOnline: true,
    lastCheckIn: '2024-11-01T08:45:00Z'
  },
  {
    id: '5',
    name: 'Linda Brown',
    avatar: '/api/placeholder/40/40',
    injuryType: 'Hip Rehabilitation',
    joinDate: '2024-06-15',
    isOnline: false,
    lastCheckIn: '2024-10-31T16:20:00Z'
  },
  {
    id: '6',
    name: 'David Lee',
    avatar: '/api/placeholder/40/40',
    injuryType: 'Wrist Rehabilitation',
    joinDate: '2024-09-05',
    isOnline: true,
    lastCheckIn: '2024-11-01T10:00:00Z'
  }
]

// Public lobby posts
export const lobbyPosts: Post[] = [
  {
    id: '1',
    author: friends[0],
    content: 'Completed all my shoulder rehab exercises today, feeling much better than yesterday! Keep going everyone 💪',
    timestamp: '2024-11-01T09:30:00Z',
    likes: 12,
    comments: 3
  },
  {
    id: '2',
    author: friends[1],
    content: 'Sharing a spine rehab tip: Do 10 minutes of cat-cow stretches before bed every day, it really works! Anyone with similar issues should try it.',
    timestamp: '2024-11-01T08:45:00Z',
    likes: 18,
    comments: 7,
    images: ['/api/placeholder/300/200']
  },
  {
    id: '3',
    author: friends[2],
    content: 'Today marks my 30th day of recovery. Still some pain, but so much better than when I started. Thanks to this platform for connecting me with amazing friends!',
    timestamp: '2024-11-01T07:20:00Z',
    likes: 25,
    comments: 8
  },
  {
    id: '4',
    author: friends[4],
    content: 'Does anyone know what exercises I can do during wrist rehabilitation? Doctor said moderate activity, but I\'m not sure what counts as moderate.',
    timestamp: '2024-10-31T20:15:00Z',
    likes: 6,
    comments: 12
  }
]

// Knowledge base articles
export const knowledgeArticles: Article[] = [
  {
    id: '1',
    title: 'Golden Period of Knee Rehabilitation: Key Training in the First 6 Weeks Post-Surgery',
    summary: 'Detailed introduction to knee rehabilitation essentials in the first 6 weeks after surgery, including pain management, range of motion training, and strength recovery.',
    category: 'Knee',
    readTime: 8,
    thumbnail: '/api/placeholder/300/200',
    publishDate: '2024-10-28',
    author: 'Dr. Li, Rehabilitation Physician'
  },
  {
    id: '2',
    title: 'Prevention and Treatment of Shoulder Joint Adhesion',
    summary: 'How to prevent adhesion after shoulder surgery and effective treatment methods when adhesion has already occurred.',
    category: 'Shoulder',
    readTime: 6,
    thumbnail: '/api/placeholder/300/200',
    publishDate: '2024-10-25',
    author: 'Wang, Physical Therapist'
  },
  {
    id: '3',
    title: 'Home Rehabilitation Guide for Lumbar Disc Herniation',
    summary: 'Suitable spinal rehabilitation exercises for home practice, including core muscle strengthening and spinal stability exercises.',
    category: 'Spine',
    readTime: 10,
    thumbnail: '/api/placeholder/300/200',
    publishDate: '2024-10-22',
    author: 'Zhang, Rehabilitation Expert'
  },
  {
    id: '4',
    title: 'Phased Rehabilitation Plan for Ankle Sprains',
    summary: 'Complete rehabilitation timeline and training plan for ankle sprains from acute phase to recovery phase.',
    category: 'Ankle',
    readTime: 7,
    thumbnail: '/api/placeholder/300/200',
    publishDate: '2024-10-20',
    author: 'Dr. Chen, Sports Medicine Physician'
  },
  {
    id: '5',
    title: 'Post-Hip Replacement Rehabilitation Considerations for Elderly Patients',
    summary: 'Safe and effective hip rehabilitation recommendations addressing the special rehabilitation needs of elderly patients.',
    category: 'Hip',
    readTime: 9,
    thumbnail: '/api/placeholder/300/200',
    publishDate: '2024-10-18',
    author: 'Liu, Geriatric Rehabilitation Expert'
  },
  {
    id: '6',
    title: 'Fine Motor Skills Training After Wrist Fracture',
    summary: 'How to restore fine motor abilities during wrist rehabilitation, including grip strength training and flexibility exercises.',
    category: 'Wrist',
    readTime: 5,
    thumbnail: '/api/placeholder/300/200',
    publishDate: '2024-10-15',
    author: 'Dr. Wu, Hand Surgeon'
  }
]

// Weekly progress data
export const weeklyProgress: WeeklyProgress[] = [
  { day: 'Mon', completed: 4, total: 5 },
  { day: 'Tue', completed: 5, total: 5 },
  { day: 'Wed', completed: 3, total: 5 },
  { day: 'Thu', completed: 5, total: 5 },
  { day: 'Fri', completed: 4, total: 5 },
  { day: 'Sat', completed: 2, total: 4 },
  { day: 'Today', completed: 2, total: 5 }
]

// Available parties/communities
export const availableParties: Party[] = [
  {
    id: 'party-1',
    name: 'Knee Recovery Warriors',
    description: 'A supportive community for people recovering from knee injuries. Share exercises, tips, and motivation!',
    category: 'Knee',
    memberCount: 45,
    maxMembers: 100,
    createdAt: '2024-08-01',
    organizer: friends[0],
    thumbnail: '/api/placeholder/400/200'
  },
  {
    id: 'party-2',
    name: 'Shoulder Strength Circle',
    description: 'Join us for shoulder rehabilitation support and progress tracking. Weekly group exercises and check-ins.',
    category: 'Shoulder',
    memberCount: 32,
    maxMembers: 80,
    createdAt: '2024-09-10',
    organizer: friends[1],
    thumbnail: '/api/placeholder/400/200'
  },
  {
    id: 'party-3',
    name: 'Spine Wellness Group',
    description: 'Community focused on spinal rehabilitation, posture correction, and back health. Share your journey!',
    category: 'Spine',
    memberCount: 28,
    maxMembers: 60,
    createdAt: '2024-07-15',
    organizer: friends[2],
    thumbnail: '/api/placeholder/400/200'
  },
  {
    id: 'party-4',
    name: 'Ankle Recovery Squad',
    description: 'Support group for ankle rehabilitation. Tips, exercises, and encouragement from fellow recoverers.',
    category: 'Ankle',
    memberCount: 19,
    maxMembers: 50,
    createdAt: '2024-10-05',
    organizer: friends[3],
    thumbnail: '/api/placeholder/400/200'
  },
  {
    id: 'party-5',
    name: 'Hip Mobility Community',
    description: 'Dedicated to hip rehabilitation and mobility improvement. Share progress and recovery stories.',
    category: 'Hip',
    memberCount: 24,
    maxMembers: 70,
    createdAt: '2024-09-20',
    organizer: friends[4],
    thumbnail: '/api/placeholder/400/200'
  },
  {
    id: 'party-6',
    name: 'Wrist & Hand Recovery',
    description: 'For those recovering from wrist and hand injuries. Exercise ideas and daily support.',
    category: 'Wrist',
    memberCount: 15,
    maxMembers: 40,
    createdAt: '2024-10-15',
    organizer: friends[5],
    thumbnail: '/api/placeholder/400/200'
  },
  {
    id: 'party-7',
    name: 'Advanced Knee Training',
    description: 'For those in later stages of knee recovery. Advanced exercises and goal setting.',
    category: 'Knee',
    memberCount: 38,
    maxMembers: 60,
    createdAt: '2024-08-20',
    organizer: currentUser,
    thumbnail: '/api/placeholder/400/200'
  }
]

// Mock chat messages
export const chatMessages: Record<string, ChatMessage[]> = {
  '2': [ // Sarah Johnson
    {
      id: 'msg-1',
      senderId: '2',
      receiverId: '1',
      content: 'Hey Alex! How was your physical therapy session today?',
      timestamp: '2024-11-01T09:00:00Z'
    },
    {
      id: 'msg-2',
      senderId: '1',
      receiverId: '2',
      content: 'It went really well! My range of motion is improving. How about yours?',
      timestamp: '2024-11-01T09:05:00Z'
    },
    {
      id: 'msg-3',
      senderId: '2',
      receiverId: '1',
      content: 'That\'s great to hear! Keep up the good work 💪',
      timestamp: '2024-11-01T09:10:00Z'
    }
  ],
  '3': [ // Mike Wilson
    {
      id: 'msg-4',
      senderId: '3',
      receiverId: '1',
      content: 'Thanks for the spine exercise tips you shared earlier!',
      timestamp: '2024-11-01T08:00:00Z'
    }
  ],
  '4': [ // Emma Davis
    {
      id: 'msg-5',
      senderId: '1',
      receiverId: '4',
      content: 'Hi Emma! How\'s your ankle recovery going?',
      timestamp: '2024-11-01T10:00:00Z'
    },
    {
      id: 'msg-6',
      senderId: '4',
      receiverId: '1',
      content: 'Much better! The swelling has gone down significantly.',
      timestamp: '2024-11-01T10:05:00Z'
    }
  ]
}

// Mock public chat messages for parties
export const partyChatMessages: Record<string, PublicChatMessage[]> = {
  'party-1': [
    {
      id: 'party-msg-1',
      senderId: '2',
      partyId: 'party-1',
      content: 'Welcome everyone! Excited to be part of this knee recovery community!',
      timestamp: '2024-11-01T08:00:00Z'
    },
    {
      id: 'party-msg-2',
      senderId: '6',
      partyId: 'party-1',
      content: 'Thanks for organizing this! Looking forward to sharing progress with everyone.',
      timestamp: '2024-11-01T08:15:00Z'
    },
    {
      id: 'party-msg-3',
      senderId: '2',
      partyId: 'party-1',
      content: 'Has anyone tried the new exercises from the knowledge base? They\'re really helpful!',
      timestamp: '2024-11-01T09:00:00Z'
    }
  ],
  'party-2': [
    {
      id: 'party-msg-4',
      senderId: '3',
      partyId: 'party-2',
      content: 'Hello shoulder recovery friends! How is everyone doing today?',
      timestamp: '2024-11-01T07:30:00Z'
    },
    {
      id: 'party-msg-5',
      senderId: '5',
      partyId: 'party-2',
      content: 'Doing great! Just completed my morning exercises 💪',
      timestamp: '2024-11-01T08:00:00Z'
    }
  ],
  'party-3': [
    {
      id: 'party-msg-6',
      senderId: '4',
      partyId: 'party-3',
      content: 'Welcome to the spine wellness group! Let\'s support each other!',
      timestamp: '2024-11-01T08:00:00Z'
    },
    {
      id: 'party-msg-7',
      senderId: '1',
      partyId: 'party-3',
      content: 'Great to be here! Any tips for managing back pain during exercises?',
      timestamp: '2024-11-01T08:30:00Z'
    }
  ]
}

// Global public chat messages (combining all parties)
export const globalPublicChat: PublicChatMessage[] = [
  {
    id: 'global-msg-1',
    senderId: '2',
    partyId: 'all',
    content: 'Hey everyone! Great to see such an active community supporting each other through recovery! 💪',
    timestamp: '2024-11-01T07:00:00Z'
  },
  {
    id: 'global-msg-2',
    senderId: '4',
    partyId: 'all',
    content: 'Does anyone have tips for staying motivated during the recovery process?',
    timestamp: '2024-11-01T07:15:00Z'
  },
  {
    id: 'global-msg-3',
    senderId: '6',
    partyId: 'all',
    content: 'Setting daily small goals really helped me! Celebrate every little win! 🎉',
    timestamp: '2024-11-01T07:30:00Z'
  },
  {
    id: 'global-msg-4',
    senderId: '3',
    partyId: 'all',
    content: 'I completely agree! Progress is progress, no matter how small.',
    timestamp: '2024-11-01T08:00:00Z'
  },
  {
    id: 'global-msg-5',
    senderId: '5',
    partyId: 'all',
    content: 'Has anyone tried the new rehabilitation exercises from the knowledge base?',
    timestamp: '2024-11-01T08:45:00Z'
  },
  {
    id: 'global-msg-6',
    senderId: '2',
    partyId: 'all',
    content: 'Yes! I\'ve been doing them daily and noticed improvement in my range of motion.',
    timestamp: '2024-11-01T09:00:00Z'
  }
]

// Navigation menu items
export interface NavigationItem {
  name: string
  href?: string
  icon: string
  children?: NavigationItem[]
}

export const navigationItems: NavigationItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: 'Home'
  },
  {
    name: 'Community',
    icon: 'MessageSquare',
    children: [
      {
        name: 'Friends',
        href: '/dashboard/friends',
        icon: 'Users'
      },
      {
        name: 'Discover',
        href: '/dashboard/discover',
        icon: 'Compass'
      },
      {
        name: 'Lobby',
        href: '/dashboard/lobby',
        icon: 'MessageSquare'
      }
    ]
  },
  {
    name: 'Knowledge',
    href: '/dashboard/knowledge',
    icon: 'BookOpen'
  },
  {
    name: 'Calendar',
    href: '/dashboard/calendar',
    icon: 'Calendar'
  }
]
