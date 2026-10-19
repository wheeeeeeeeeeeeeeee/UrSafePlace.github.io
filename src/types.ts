export type EmotionId =
  | 'happy'
  | 'anxious'
  | 'nervous'
  | 'angry'
  | 'vulnerable'
  | 'confused'
  | 'neutral'
  | 'other'

export interface JournalEntry {
  id: string
  primary: EmotionId
  secondary: EmotionId | null
  reflection: string
  shareAnonymously: boolean
  contributeToStats: boolean
  createdAt: string
}

export interface UserPost {
  id: string
  emotion: EmotionId
  body: string
  createdAt: string
  contributeToStats: boolean
}

export interface FeedPost {
  id: string
  authorLabel: string
  emotion: EmotionId
  body: string
  createdAt: string
  mine: boolean
  baseReactions: Record<ReactionKind, number>
}

export type ReactionKind = 'support' | 'hear' | 'alone'

export interface CommentItem {
  id: string
  postId: string
  parentId: string | null
  authorLabel: string
  body: string
  createdAt: string
  mine?: boolean
}

export interface ReportItem {
  id: string
  targetType: 'post' | 'comment'
  targetId: string
  reason: string
  details: string
  excerpt: string
  status: 'Pending review'
  createdAt: string
}

export interface MoodOptIn {
  id: string
  emotion: EmotionId
  source: 'journal' | 'post'
}

export type EventType = 'volunteering' | 'discussion' | 'outing'
export type EventFormat = 'online' | 'in-person'

export interface EventItem {
  id: string
  title: string
  description: string
  type: EventType
  category: string
  startsAt: string
  durationMinutes: number
  location: string
  format: EventFormat
  cost: number
  organiser: string
}

export type ResourceFormat = 'article' | 'video' | 'exercise'

export interface ResourceItem {
  id: string
  title: string
  category: string
  format: ResourceFormat
  minutes: number
  summary: string
  body: string[]
  related?: { label: string; to: string }[]
}

export interface SupportContact {
  id: string
  name: string
  type: string
  description: string
  contact: string
  websiteNote: string
}

export const REPORT_REASONS = [
  'Bullying or harassment',
  'Hate or discrimination',
  'Threats or violence',
  'Harmful advice',
  'Private or identifying information',
  'Spam or scams',
  'Other',
] as const
