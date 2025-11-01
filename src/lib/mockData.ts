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

// Current user
export const currentUser: User = {
  id: '1',
  name: 'Alex Chen',
  avatar: '/api/placeholder/40/40',
  injuryType: 'Knee Rehabilitation',
  joinDate: '2024-09-15',
  isOnline: true,
  lastCheckIn: '2024-11-01T08:30:00Z'
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

// Navigation menu items
export const navigationItems = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: 'Home'
  },
  {
    name: 'Friends',
    href: '/dashboard/friends',
    icon: 'Users'
  },
  {
    name: 'Community',
    href: '/dashboard/lobby',
    icon: 'MessageSquare'
  },
  {
    name: 'Group Session',
    href: '/dashboard/session',
    icon: 'Video'
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
