// Mock data for the rehabilitation companion platform

export interface User {
  id: string
  name: string
  avatar: string
  injuryType: string
  joinDate: string
  isOnline: boolean
  lastCheckIn?: string
  email?: string
  role?: 'patient' | 'admin' // 添加角色字段
}

export interface PendingFriendRequest {
  id: string
  senderId: string // User who sent the request
  receiverId: string // User who received the request
  requestedAt: string
  status: 'pending' | 'accepted' | 'rejected'
}

export interface PatientRiskData {
  patientId: string
  patientName: string
  email: string
  injury: string
  weeksInTherapy: number
  data: {
    hepComplianceLastWeek: string // 家庭作业完成率
    loginsLastWeek: number // 上周登录次数
    lastCommunityPost: string // 最后一次社区发帖时间
    recentAppointments: {
      lastMinuteCancellations: number
      noShows: number
    }
    painScoreTrend: 'improving' | 'stagnant' | 'worsening' // 疼痛趋势
    recentPostSentiment: string // 最近帖子情感分析
    goalAchievementRate: string // 目标达成率
  }
}

export interface RiskAnalysisResult {
  riskScore: number
  reasoning: string
  recommendations: string[]
}

// 患者康复画像数据
export interface PatientProfile {
  userId: string
  injuryType: string

  // 康复阶段数据
  injuryDate: string  // 受伤日期
  surgeryDate?: string  // 手术日期
  currentPhase: 'early' | 'mid' | 'late' | 'maintenance'  // 康复阶段
  recoveryProgress: number  // 0-100%

  // 训练数据
  weeklyTrainingDays: number  // 每周训练天数
  dailyTrainingMinutes: number  // 每日训练分钟数
  complianceRate: number  // 依从性 0-100%
  currentDifficulty: 'beginner' | 'intermediate' | 'advanced'

  // 目标数据
  recoveryGoal: 'work' | 'sport' | 'daily_life' | 'professional_athlete'
  targetSport?: string  // 目标运动
  targetTimeline: number  // 目标时间（月）

  // 情感数据
  averageSentimentScore: number  // -1 到 1
  activityLevel: 'low' | 'medium' | 'high'
  helpfulnessScore: number  // 帮助他人的得分

  // 个人信息
  ageGroup: '18-30' | '31-45' | '46-60' | '60+'
  occupation?: string
}

// AI 匹配结果
export interface AIMatchResult {
  userId: string
  partyId: string
  partyName: string
  matchScore: number  // 0-100 匹配度
  reasons: string[]  // 匹配原因
  expectedBenefit: string
}

// AI 推荐响应
export interface AIRecommendationResponse {
  recommendations: AIMatchResult[]
  suggestNewGroup: boolean
  newGroupSuggestion?: {
    name: string
    targetMembers: string[]
    reason: string
    estimatedSize: number
  }
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

export interface GroupExercise {
  id: string
  title: string
  exerciseType: string
  category: string // Injury category like 'Knee', 'Shoulder', etc.
  participantCount: number
  maxParticipants: number
  startTime: string
  duration: number // in minutes
  host: User
  isPinned?: boolean // Pinned if matches user's training plan
}

// Current user with interests
export const currentUser: User = {
  id: '1',
  name: 'Alex Chen',
  avatar: '/api/placeholder/40/40',
  injuryType: 'Knee Rehabilitation',
  joinDate: '2024-09-15',
  isOnline: true,
  lastCheckIn: '2024-11-01T08:30:00Z',
  email: 'alex.chen@example.com',
  role: 'patient'
}

// 管理员账号
export const adminUser: User = {
  id: 'admin-1',
  name: 'Dr. Sarah Wilson',
  avatar: '/api/placeholder/40/40',
  injuryType: 'AI Care Specialist',
  joinDate: '2024-01-01',
  isOnline: true,
  lastCheckIn: new Date().toISOString(),
  email: 'admin@healing-together.com',
  role: 'admin'
}

// 登录验证接口
export interface LoginCredentials {
  email: string
  password: string
}

export interface LoginResult {
  success: boolean
  user?: User
  redirectTo?: string
  error?: string
}

// 模拟登录验证
export function authenticateUser(credentials: LoginCredentials): LoginResult {
  const { email, password } = credentials

  // 管理员账号验证
  if (email === 'admin@healing-together.com' && password === 'admin123') {
    return {
      success: true,
      user: adminUser,
      redirectTo: '/admin/patient-care'
    }
  }

  // 普通用户账号验证（任何有效邮箱格式 + 6位以上密码）
  const emailRegex = /\S+@\S+\.\S+/
  if (emailRegex.test(email) && password.length >= 6) {
    return {
      success: true,
      user: currentUser,
      redirectTo: '/dashboard'
    }
  }

  return {
    success: false,
    error: 'Invalid email or password'
  }
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

// Available users to add as friends (not yet in friends list)
export const availableUsers: User[] = [
  {
    id: '7',
    name: 'James Anderson',
    avatar: '/api/placeholder/40/40',
    injuryType: 'Knee Rehabilitation',
    joinDate: '2024-09-20',
    isOnline: true,
    lastCheckIn: '2024-11-01T09:30:00Z'
  },
  {
    id: '8',
    name: 'Sophia Martinez',
    avatar: '/api/placeholder/40/40',
    injuryType: 'Shoulder Rehabilitation',
    joinDate: '2024-10-05',
    isOnline: false,
    lastCheckIn: '2024-10-31T18:00:00Z'
  },
  {
    id: '9',
    name: 'Robert Taylor',
    avatar: '/api/placeholder/40/40',
    injuryType: 'Spine Rehabilitation',
    joinDate: '2024-08-15',
    isOnline: true,
    lastCheckIn: '2024-11-01T08:00:00Z'
  },
  {
    id: '10',
    name: 'Olivia White',
    avatar: '/api/placeholder/40/40',
    injuryType: 'Knee Rehabilitation',
    joinDate: '2024-10-10',
    isOnline: true,
    lastCheckIn: '2024-11-01T10:15:00Z'
  },
  {
    id: '11',
    name: 'Michael Chen',
    avatar: '/api/placeholder/40/40',
    injuryType: 'Ankle Rehabilitation',
    joinDate: '2024-09-25',
    isOnline: false,
    lastCheckIn: '2024-10-31T20:00:00Z'
  },
  {
    id: '12',
    name: 'Emily Rodriguez',
    avatar: '/api/placeholder/40/40',
    injuryType: 'Hip Rehabilitation',
    joinDate: '2024-10-01',
    isOnline: true,
    lastCheckIn: '2024-11-01T09:45:00Z'
  },
  {
    id: '13',
    name: 'William Kim',
    avatar: '/api/placeholder/40/40',
    injuryType: 'Wrist Rehabilitation',
    joinDate: '2024-09-30',
    isOnline: true,
    lastCheckIn: '2024-11-01T11:00:00Z'
  },
  {
    id: '14',
    name: 'Grace Thompson',
    avatar: '/api/placeholder/40/40',
    injuryType: 'Shoulder Rehabilitation',
    joinDate: '2024-08-25',
    isOnline: false,
    lastCheckIn: '2024-10-31T17:30:00Z'
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

// User's training plan - 3 knee-related rehabilitation exercises
export const userTrainingPlan: string[] = [
  'Knee Extension Strengthening',
  'Quadriceps Strengthening',
  'Hamstring Flexibility'
]

// Exercise Plan Schedule - exercises scheduled in the plan
export interface ExercisePlanItem {
  id: string
  title: string
  description: string
  scheduledDate: string // Date string like "2024-11-01"
  scheduledTime: string // Time string like "09:00"
  duration: number // in minutes
  type: 'exercise' | 'therapy' | 'checkup'
  location?: string
  therapist?: string
  frequency?: 'daily' | 'weekly' | 'custom' // How often to repeat
  repeatForWeeks?: number // Number of weeks to repeat
}

export interface TreatmentPlan {
  id: string
  title: string
  description: string
  startDate: string // ISO date string
  endDate: string // ISO date string (deadline)
  durationWeeks: number
  physiotherapist: string
  doctor: string
  status: 'active' | 'completed' | 'paused'
  progressPercentage: number
}

export interface AgendaMilestone {
  id: string
  weekNumber: number
  title: string
  description: string
  targetDate: string // ISO date string
  completed: boolean
  type: 'milestone' | 'checkpoint' | 'deadline'
}

export interface ProgressReport {
  id: string
  patientId: string
  treatmentPlanId: string
  reportDate: string
  weekNumber: number
  completionRate: number
  painLevel?: number
  mobilityScore?: number
  notes: string
  sentToPhysiotherapist: boolean
  sentToDoctor: boolean
  sentAt?: string
}

export const exercisePlanItems: ExercisePlanItem[] = [
  {
    id: 'plan-1',
    title: 'Morning Knee Stretching',
    description: 'Perform 15-minute knee joint stretching exercises',
    scheduledDate: '2024-11-02',
    scheduledTime: '07:00',
    duration: 15,
    type: 'exercise',
    frequency: 'daily',
    repeatForWeeks: 4
  },
  {
    id: 'plan-2',
    title: 'Quadriceps Strengthening',
    description: 'Strength training for quadriceps muscles - 3 sets of 10 reps',
    scheduledDate: '2024-11-02',
    scheduledTime: '10:00',
    duration: 30,
    type: 'exercise',
    frequency: 'daily',
    repeatForWeeks: 4
  },
  {
    id: 'plan-3',
    title: 'Balance Training Session',
    description: 'Balance and coordination exercises with therapist',
    scheduledDate: '2024-11-03',
    scheduledTime: '14:00',
    duration: 45,
    type: 'therapy',
    location: 'Rehabilitation Center A',
    therapist: 'Dr. Wang',
    frequency: 'weekly',
    repeatForWeeks: 4
  },
  {
    id: 'plan-4',
    title: 'Progress Check-up',
    description: 'Monthly progress evaluation with Dr. Wang',
    scheduledDate: '2024-11-05',
    scheduledTime: '11:00',
    duration: 30,
    type: 'checkup',
    location: 'Orthopedic Clinic',
    therapist: 'Dr. Wang'
  },
  {
    id: 'plan-5',
    title: 'Evening Flexibility Routine',
    description: 'Light stretching and flexibility exercises before bed',
    scheduledDate: '2024-11-02',
    scheduledTime: '20:00',
    duration: 20,
    type: 'exercise',
    frequency: 'daily',
    repeatForWeeks: 4
  }
]

// Treatment Plan Data
export const currentTreatmentPlan: TreatmentPlan = {
  id: 'treatment-plan-1',
  title: 'Post-ACL Reconstruction Recovery',
  description: 'Comprehensive 12-week rehabilitation program following ACL reconstruction surgery',
  startDate: new Date().toISOString().split('T')[0], // Today
  endDate: new Date(Date.now() + 12 * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 12 weeks from now
  durationWeeks: 12,
  physiotherapist: 'Dr. Wang',
  doctor: 'Dr. Li',
  status: 'active',
  progressPercentage: 0
}

// Generate 12-week agenda with daily items (84 days total)
export const generateAgendaMilestones = (startDate: string): AgendaMilestone[] => {
  const start = new Date(startDate)
  start.setHours(0, 0, 0, 0)
  const milestones: AgendaMilestone[] = []
  
  const weekTitles = [
    'Week 1: Initial Recovery Phase',
    'Week 2: Early Mobilization',
    'Week 3: Range of Motion Progress',
    'Week 4: Strength Building Begins',
    'Week 5: Intermediate Phase',
    'Week 6: Mid-term Assessment',
    'Week 7: Advanced Exercises',
    'Week 8: Functional Training',
    'Week 9: Sport-Specific Prep',
    'Week 10: Return to Activity Prep',
    'Week 11: Final Phase Assessment',
    'Week 12: Treatment Completion'
  ]
  
  // Generate daily agenda items for 12 weeks (84 days)
  for (let day = 0; day < 84; day++) {
    const currentDate = new Date(start)
    currentDate.setDate(start.getDate() + day)
    const weekNumber = Math.floor(day / 7) + 1
    const dayOfWeek = day % 7
    const isLastDay = day === 83 // Last day of 12th week
    
    // Determine agenda type based on day
    let type: 'milestone' | 'checkpoint' | 'deadline' = 'milestone'
    if (isLastDay) {
      type = 'deadline'
    } else if (dayOfWeek === 0 && weekNumber % 2 === 0) {
      // Every other Sunday is a checkpoint
      type = 'checkpoint'
    }
    
    // Generate agenda title based on day and week
    let title = ''
    if (isLastDay) {
      title = `Treatment Completion - Final Assessment`
    } else if (dayOfWeek === 0) {
      // Sunday - weekly review
      const weekTitle = weekTitles[weekNumber - 1].split(': ')[1] || weekTitles[weekNumber - 1]
      title = `Day ${day + 1}: Weekly Review - ${weekTitle}`
    } else if (dayOfWeek === 1) {
      // Monday
      title = `Day ${day + 1}: Morning Exercise Routine`
    } else if (dayOfWeek === 2) {
      // Tuesday
      title = `Day ${day + 1}: Strength Training Session`
    } else if (dayOfWeek === 3) {
      // Wednesday
      title = `Day ${day + 1}: Flexibility & Mobility Work`
    } else if (dayOfWeek === 4) {
      // Thursday
      title = `Day ${day + 1}: Balance & Coordination Training`
    } else if (dayOfWeek === 5) {
      // Friday
      title = `Day ${day + 1}: Functional Movement Practice`
    } else {
      // Saturday
      title = `Day ${day + 1}: Recovery & Light Activity`
    }
    
    milestones.push({
      id: `agenda-day-${day + 1}`,
      weekNumber: weekNumber,
      title: title,
      description: `Daily rehabilitation agenda for ${weekTitles[weekNumber - 1]}. Day ${day + 1} of 84.`,
      targetDate: currentDate.toISOString().split('T')[0],
      completed: false,
      type: type
    })
  }
  
  return milestones
}

export const agendaMilestones = generateAgendaMilestones(currentTreatmentPlan.startDate)

// Group exercises available
export const groupExercises: GroupExercise[] = [
  {
    id: '1',
    title: 'Knee Extension Strengthening',
    exerciseType: 'Strength Training',
    category: 'Knee',
    participantCount: 6,
    maxParticipants: 6,
    startTime: new Date(Date.now() + 10 * 60000).toISOString(), // 10 minutes from now
    duration: 30,
    host: friends[0],
    isPinned: true // Matches user's training plan
  },
  {
    id: '2',
    title: 'Quadriceps Strengthening',
    exerciseType: 'Strength Training',
    category: 'Knee',
    participantCount: 2,
    maxParticipants: 6,
    startTime: new Date(Date.now() + 20 * 60000).toISOString(), // 20 minutes from now
    duration: 30,
    host: friends[1],
    isPinned: true // Matches user's training plan
  },
  {
    id: '3',
    title: 'Hamstring Flexibility',
    exerciseType: 'Strength Training',
    category: 'Knee',
    participantCount: 4,
    maxParticipants: 6,
    startTime: new Date(Date.now() + 30 * 60000).toISOString(), // 30 minutes from now
    duration: 30,
    host: friends[2],
    isPinned: true // Matches user's training plan
  },
  {
    id: '4',
    title: 'Shoulder Range of Motion',
    exerciseType: 'Strength Training',
    category: 'Shoulder',
    participantCount: 2,
    maxParticipants: 6,
    startTime: new Date(Date.now() + 15 * 60000).toISOString(),
    duration: 30,
    host: friends[3],
    isPinned: false
  },
  {
    id: '5',
    title: 'Core Stability Training',
    exerciseType: 'Strength Training',
    category: 'Spine',
    participantCount: 1,
    maxParticipants: 6,
    startTime: new Date(Date.now() + 25 * 60000).toISOString(),
    duration: 30,
    host: friends[4],
    isPinned: false
  },
  {
    id: '6',
    title: 'Ankle Mobility Exercises',
    exerciseType: 'Strength Training',
    category: 'Ankle',
    participantCount: 3,
    maxParticipants: 6,
    startTime: new Date(Date.now() + 35 * 60000).toISOString(),
    duration: 30,
    host: friends[0],
    isPinned: false
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
    name: 'Group Exercise',
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

// Mock patient risk data for AI analysis
export const mockPatientRiskData: PatientRiskData[] = [
  {
    patientId: '1',
    patientName: 'Alex Chen',
    email: 'alex.chen@example.com',
    injury: 'Knee Rehabilitation',
    weeksInTherapy: 8,
    data: {
      hepComplianceLastWeek: '85%',
      loginsLastWeek: 5,
      lastCommunityPost: '2 days ago',
      recentAppointments: {
        lastMinuteCancellations: 0,
        noShows: 0
      },
      painScoreTrend: 'improving',
      recentPostSentiment: 'Positive. Recent post: "Feeling much better this week! The exercises are really helping."',
      goalAchievementRate: '80%'
    }
  },
  {
    patientId: '2',
    patientName: 'Sarah Johnson',
    email: 'yangqx0925@163.com',
    injury: 'Shoulder Rehabilitation',
    weeksInTherapy: 6,
    data: {
      hepComplianceLastWeek: '35%',
      loginsLastWeek: 1,
      lastCommunityPost: '20 days ago',
      recentAppointments: {
        lastMinuteCancellations: 1,
        noShows: 0
      },
      painScoreTrend: 'stagnant',
      recentPostSentiment: 'Negative. Recent post: "Feeling like this week had no progress, shoulder is still the same, getting a bit discouraged."',
      goalAchievementRate: '40%'
    }
  },
  {
    patientId: '3',
    patientName: 'Palm',
    email: 'rsuksawasdi@gmail.com',
    injury: 'Spine Rehabilitation',
    weeksInTherapy: 12,
    data: {
      hepComplianceLastWeek: '20%',
      loginsLastWeek: 0,
      lastCommunityPost: '35 days ago',
      recentAppointments: {
        lastMinuteCancellations: 2,
        noShows: 1
      },
      painScoreTrend: 'worsening',
      recentPostSentiment: 'Very negative. Recent post: "This is not working. Pain is getting worse and I am losing hope."',
      goalAchievementRate: '15%'
    }
  },
  {
    patientId: '4',
    patientName: 've',
    email: 'vedrosuwandi@gmail.com',
    injury: 'Ankle Rehabilitation',
    weeksInTherapy: 4,
    data: {
      hepComplianceLastWeek: '70%',
      loginsLastWeek: 3,
      lastCommunityPost: '5 days ago',
      recentAppointments: {
        lastMinuteCancellations: 0,
        noShows: 0
      },
      painScoreTrend: 'improving',
      recentPostSentiment: 'Neutral. Recent post: "Making steady progress, some days are better than others."',
      goalAchievementRate: '65%'
    }
  },
  {
    patientId: '5',
    patientName: 'Ge',
    email: 'gegeardiansyah@gmail.com',
    injury: 'ACL Tear Recovery',
    weeksInTherapy: 8,
    data: {
      hepComplianceLastWeek: '45%',
      loginsLastWeek: 2,
      lastCommunityPost: '15 days ago',
      recentAppointments: {
        lastMinuteCancellations: 1,
        noShows: 0
      },
      painScoreTrend: 'stagnant',
      recentPostSentiment: 'Frustrated. Recent post: "Feeling overwhelmed with work and rehab. Hard to find time for exercises."',
      goalAchievementRate: '50%'
    }
  },
  {
    patientId: '6',
    patientName: 'Lisa Chen',
    email: 'lisa.chen@example.com',
    injury: 'Rotator Cuff Repair',
    weeksInTherapy: 10,
    data: {
      hepComplianceLastWeek: '30%',
      loginsLastWeek: 0,
      lastCommunityPost: '28 days ago',
      recentAppointments: {
        lastMinuteCancellations: 0,
        noShows: 2
      },
      painScoreTrend: 'worsening',
      recentPostSentiment: 'Concerned. Recent post: "Not sure if the exercises are right for me. Shoulder feels more painful lately."',
      goalAchievementRate: '35%'
    }
  },
  {
    patientId: '7',
    patientName: 'Marcus Thompson',
    email: 'marcus.t@example.com',
    injury: 'Hip Replacement Recovery',
    weeksInTherapy: 5,
    data: {
      hepComplianceLastWeek: '55%',
      loginsLastWeek: 1,
      lastCommunityPost: '12 days ago',
      recentAppointments: {
        lastMinuteCancellations: 2,
        noShows: 0
      },
      painScoreTrend: 'stagnant',
      recentPostSentiment: 'Anxious. Recent post: "Progress feels slow. Expected to be further along by now. Wondering if this is normal?"',
      goalAchievementRate: '48%'
    }
  },
  {
    patientId: '8',
    patientName: 'Nina Patel',
    email: 'nina.patel@example.com',
    injury: 'Meniscus Repair',
    weeksInTherapy: 3,
    data: {
      hepComplianceLastWeek: '25%',
      loginsLastWeek: 1,
      lastCommunityPost: '18 days ago',
      recentAppointments: {
        lastMinuteCancellations: 1,
        noShows: 1
      },
      painScoreTrend: 'worsening',
      recentPostSentiment: 'Discouraged. Recent post: "Too busy with family responsibilities. Knee still hurts when I do the exercises."',
      goalAchievementRate: '30%'
    }
  },
  {
    patientId: '9',
    patientName: 'David Kim',
    email: 'david.kim@example.com',
    injury: 'Elbow Tendonitis',
    weeksInTherapy: 7,
    data: {
      hepComplianceLastWeek: '40%',
      loginsLastWeek: 2,
      lastCommunityPost: '22 days ago',
      recentAppointments: {
        lastMinuteCancellations: 0,
        noShows: 0
      },
      painScoreTrend: 'stagnant',
      recentPostSentiment: 'Neutral but concerned. Recent post: "Elbow feels the same. Not worse but not better either. Getting bored with exercises."',
      goalAchievementRate: '45%'
    }
  },
  {
    patientId: '10',
    patientName: 'Rachel Green',
    email: 'rachel.green@example.com',
    injury: 'Lower Back Pain Management',
    weeksInTherapy: 9,
    data: {
      hepComplianceLastWeek: '15%',
      loginsLastWeek: 0,
      lastCommunityPost: '40 days ago',
      recentAppointments: {
        lastMinuteCancellations: 3,
        noShows: 1
      },
      painScoreTrend: 'worsening',
      recentPostSentiment: 'Very frustrated. Recent post: "Nothing seems to help. Tried everything but back pain is still there. Feeling defeated."',
      goalAchievementRate: '20%'
    }
  },
  {
    patientId: '11',
    patientName: 'Thomas Anderson',
    email: 'thomas.a@example.com',
    injury: 'Wrist Fracture Recovery',
    weeksInTherapy: 6,
    data: {
      hepComplianceLastWeek: '50%',
      loginsLastWeek: 2,
      lastCommunityPost: '10 days ago',
      recentAppointments: {
        lastMinuteCancellations: 1,
        noShows: 0
      },
      painScoreTrend: 'stagnant',
      recentPostSentiment: 'Mixed feelings. Recent post: "Wrist movement improving slightly but range of motion still limited. Getting impatient."',
      goalAchievementRate: '52%'
    }
  },
  {
    patientId: '12',
    patientName: 'Sophia Martinez',
    email: 'sophia.m@example.com',
    injury: 'Hamstring Strain Recovery',
    weeksInTherapy: 2,
    data: {
      hepComplianceLastWeek: '35%',
      loginsLastWeek: 1,
      lastCommunityPost: '14 days ago',
      recentAppointments: {
        lastMinuteCancellations: 0,
        noShows: 1
      },
      painScoreTrend: 'stagnant',
      recentPostSentiment: 'Uncertain. Recent post: "New to this. Not sure if I am doing exercises correctly. Afraid of re-injury."',
      goalAchievementRate: '38%'
    }
  }
]

// 患者康复画像数据
export const patientProfiles: PatientProfile[] = [
  {
    userId: '1',
    injuryType: 'Knee Rehabilitation',
    injuryDate: '2024-08-15',
    surgeryDate: '2024-08-20',
    currentPhase: 'mid',
    recoveryProgress: 42,
    weeklyTrainingDays: 5,
    dailyTrainingMinutes: 45,
    complianceRate: 78,
    currentDifficulty: 'intermediate',
    recoveryGoal: 'sport',
    targetSport: 'Basketball',
    targetTimeline: 6,
    averageSentimentScore: 0.3,
    activityLevel: 'high',
    helpfulnessScore: 7,
    ageGroup: '18-30',
    occupation: 'Software Engineer'
  },
  {
    userId: '2',
    injuryType: 'Shoulder Impingement',
    injuryDate: '2024-07-10',
    currentPhase: 'mid',
    recoveryProgress: 55,
    weeklyTrainingDays: 4,
    dailyTrainingMinutes: 30,
    complianceRate: 85,
    currentDifficulty: 'intermediate',
    recoveryGoal: 'work',
    targetTimeline: 4,
    averageSentimentScore: 0.6,
    activityLevel: 'medium',
    helpfulnessScore: 9,
    ageGroup: '31-45',
    occupation: 'Teacher'
  },
  {
    userId: '3',
    injuryType: 'Knee Rehabilitation',
    injuryDate: '2024-08-01',
    surgeryDate: '2024-08-05',
    currentPhase: 'mid',
    recoveryProgress: 38,
    weeklyTrainingDays: 6,
    dailyTrainingMinutes: 50,
    complianceRate: 82,
    currentDifficulty: 'intermediate',
    recoveryGoal: 'sport',
    targetSport: 'Basketball',
    targetTimeline: 7,
    averageSentimentScore: 0.1,
    activityLevel: 'high',
    helpfulnessScore: 5,
    ageGroup: '18-30',
    occupation: 'Student'
  },
  {
    userId: '4',
    injuryType: 'Ankle Sprain Recovery',
    injuryDate: '2024-09-20',
    currentPhase: 'early',
    recoveryProgress: 25,
    weeklyTrainingDays: 3,
    dailyTrainingMinutes: 20,
    complianceRate: 45,
    currentDifficulty: 'beginner',
    recoveryGoal: 'daily_life',
    targetTimeline: 3,
    averageSentimentScore: -0.2,
    activityLevel: 'low',
    helpfulnessScore: 3,
    ageGroup: '46-60',
    occupation: 'Office Worker'
  },
  {
    userId: '5',
    injuryType: 'Hip Replacement Recovery',
    injuryDate: '2024-06-15',
    surgeryDate: '2024-06-20',
    currentPhase: 'late',
    recoveryProgress: 75,
    weeklyTrainingDays: 5,
    dailyTrainingMinutes: 40,
    complianceRate: 92,
    currentDifficulty: 'advanced',
    recoveryGoal: 'daily_life',
    targetTimeline: 2,
    averageSentimentScore: 0.8,
    activityLevel: 'high',
    helpfulnessScore: 10,
    ageGroup: '60+',
    occupation: 'Retired'
  },
  {
    userId: '6',
    injuryType: 'Knee Rehabilitation',
    injuryDate: '2024-09-01',
    surgeryDate: '2024-09-05',
    currentPhase: 'early',
    recoveryProgress: 20,
    weeklyTrainingDays: 4,
    dailyTrainingMinutes: 35,
    complianceRate: 65,
    currentDifficulty: 'beginner',
    recoveryGoal: 'sport',
    targetSport: 'Soccer',
    targetTimeline: 8,
    averageSentimentScore: -0.1,
    activityLevel: 'medium',
    helpfulnessScore: 4,
    ageGroup: '18-30',
    occupation: 'Professional Athlete'
  }
]

// 当前用户的画像数据
export const currentUserProfile: PatientProfile = patientProfiles[0]
