import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { RESERVED_ALIASES } from '../data/community'
import { SAMPLE_MOODS } from '../data/moods'
import { buildFeed, tallyEmotions } from '../lib/community'
import { loadArray, loadJson, saveJson, STORAGE_KEYS } from '../lib/storage'
import type {
  CommentItem,
  EmotionId,
  JournalEntry,
  MoodOptIn,
  ReactionKind,
  ReportItem,
  UserPost,
} from '../types'

interface JournalInput {
  primary: EmotionId
  secondary: EmotionId | null
  reflection: string
  shareAnonymously: boolean
  contributeToStats: boolean
}

interface PostInput {
  emotion: EmotionId
  body: string
  contributeToStats: boolean
}

interface ReportInput {
  targetType: 'post' | 'comment'
  targetId: string
  reason: string
  details: string
  excerpt: string
}

interface AppContextValue {
  alias: string
  journal: JournalEntry[]
  feed: ReturnType<typeof buildFeed>
  comments: CommentItem[]
  reactions: Record<string, ReactionKind>
  reports: ReportItem[]
  registrations: string[]
  eventBookmarks: string[]
  resourceBookmarks: string[]
  includeSampleStats: boolean
  stats: ReturnType<typeof tallyEmotions>
  excludedSampleCount: number
  toast: string | null
  notify: (message: string) => void
  addJournal: (input: JournalInput) => void
  deleteJournal: (id: string) => void
  addPost: (input: PostInput) => void
  deletePost: (id: string) => void
  addComment: (input: { postId: string; parentId: string | null; body: string }) => void
  toggleReaction: (postId: string, kind: ReactionKind) => void
  addReport: (input: ReportInput) => void
  toggleRegistration: (eventId: string) => void
  toggleEventBookmark: (eventId: string) => void
  toggleResourceBookmark: (resourceId: string) => void
  setIncludeSampleStats: (value: boolean) => void
  resetPrototype: () => void
}

const AppContext = createContext<AppContextValue | null>(null)

function createAlias() {
  const used = new Set(RESERVED_ALIASES)
  let alias = 'Student 128'
  do {
    alias = `Student ${Math.floor(100 + Math.random() * 900)}`
  } while (used.has(alias))
  return alias
}

function uid(prefix: string) {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return `${prefix}-${crypto.randomUUID()}`
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [alias] = useState(() => {
    const existing = loadJson('ursafe.alias', '')
    if (existing) return existing
    const created = createAlias()
    saveJson('ursafe.alias', created)
    return created
  })
  const [journal, setJournal] = useState<JournalEntry[]>(() => loadArray<JournalEntry>('ursafe.journal'))
  const [posts, setPosts] = useState<UserPost[]>(() => loadArray<UserPost>('ursafe.posts'))
  const [userComments, setUserComments] = useState<CommentItem[]>(() => loadArray<CommentItem>('ursafe.comments'))
  const [reactions, setReactions] = useState<Record<string, ReactionKind>>(() =>
    loadJson<Record<string, ReactionKind>>('ursafe.reactions', {}),
  )
  const [reports, setReports] = useState<ReportItem[]>(() => loadArray<ReportItem>('ursafe.reports'))
  const [registrations, setRegistrations] = useState<string[]>(() => loadArray<string>('ursafe.registrations'))
  const [eventBookmarks, setEventBookmarks] = useState<string[]>(() => loadArray<string>('ursafe.eventBookmarks'))
  const [resourceBookmarks, setResourceBookmarks] = useState<string[]>(() =>
    loadArray<string>('ursafe.resourceBookmarks'),
  )
  const [moodOptIns, setMoodOptIns] = useState<MoodOptIn[]>(() => loadArray<MoodOptIn>('ursafe.moodOptIns'))
  const [includeSampleStats, setIncludeSampleStatsState] = useState(() => loadJson('ursafe.includeSampleStats', true))
  const [toast, setToast] = useState<{ id: number; message: string } | null>(null)

  useEffect(() => {
    saveJson('ursafe.journal', journal)
    saveJson('ursafe.posts', posts)
    saveJson('ursafe.comments', userComments)
    saveJson('ursafe.reactions', reactions)
    saveJson('ursafe.reports', reports)
    saveJson('ursafe.registrations', registrations)
    saveJson('ursafe.eventBookmarks', eventBookmarks)
    saveJson('ursafe.resourceBookmarks', resourceBookmarks)
    saveJson('ursafe.moodOptIns', moodOptIns)
    saveJson('ursafe.includeSampleStats', includeSampleStats)
  }, [
    journal,
    posts,
    userComments,
    reactions,
    reports,
    registrations,
    eventBookmarks,
    resourceBookmarks,
    moodOptIns,
    includeSampleStats,
  ])

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(null), 5200)
    return () => window.clearTimeout(timer)
  }, [toast])

  const feed = useMemo(() => buildFeed(journal, posts, alias), [journal, posts, alias])

  const stats = useMemo(() => {
    const sample = includeSampleStats ? SAMPLE_MOODS.filter((mood) => mood.optedIn).map((mood) => mood.emotion) : []
    return tallyEmotions([...sample, ...moodOptIns.map((mood) => mood.emotion)])
  }, [includeSampleStats, moodOptIns])

  const notify = (message: string) => setToast({ id: Date.now(), message })

  const addJournal = (input: JournalInput) => {
    const entry: JournalEntry = { id: uid('journal'), createdAt: new Date().toISOString(), ...input }
    setJournal((current) => [entry, ...current])
    setMoodOptIns((current) => {
      const rest = current.filter((mood) => mood.id !== entry.id)
      return input.contributeToStats ? [...rest, { id: entry.id, emotion: input.primary, source: 'journal' }] : rest
    })
    notify(
      input.shareAnonymously
        ? 'Saved on this device and shared anonymously in Community.'
        : 'Saved privately on this device.',
    )
  }

  const deleteJournal = (id: string) => {
    setJournal((current) => current.filter((entry) => entry.id !== id))
    setMoodOptIns((current) => current.filter((mood) => mood.id !== id))
    notify('Entry deleted from this browser.')
  }

  const addPost = (input: PostInput) => {
    const post: UserPost = { id: uid('post'), createdAt: new Date().toISOString(), ...input }
    setPosts((current) => [post, ...current])
    if (input.contributeToStats) {
      setMoodOptIns((current) => [...current, { id: post.id, emotion: input.emotion, source: 'post' }])
    }
    notify('Anonymous post added on this device.')
  }

  const deletePost = (id: string) => {
    setPosts((current) => current.filter((post) => post.id !== id))
    setMoodOptIns((current) => current.filter((mood) => mood.id !== id))
    notify('Your post was removed from this browser.')
  }

  const addComment = (input: { postId: string; parentId: string | null; body: string }) => {
    const comment: CommentItem = {
      id: uid('comment'),
      authorLabel: alias,
      createdAt: new Date().toISOString(),
      mine: true,
      ...input,
    }
    setUserComments((current) => [...current, comment])
    notify('Comment saved on this device.')
  }

  const toggleReaction = (postId: string, kind: ReactionKind) => {
    setReactions((current) => {
      const next = { ...current }
      if (next[postId] === kind) delete next[postId]
      else next[postId] = kind
      return next
    })
  }

  const addReport = (input: ReportInput) => {
    const report: ReportItem = {
      id: uid('report'),
      status: 'Pending review',
      createdAt: new Date().toISOString(),
      ...input,
    }
    setReports((current) => [report, ...current])
    notify('Report stored on this device. Status: Pending review.')
  }

  const toggleRegistration = (eventId: string) => {
    const exists = registrations.includes(eventId)
    setRegistrations(exists ? registrations.filter((id) => id !== eventId) : [...registrations, eventId])
    notify(exists ? 'Demo registration cancelled.' : 'Registered for this fictional event on this device.')
  }

  const toggleEventBookmark = (eventId: string) => {
    const exists = eventBookmarks.includes(eventId)
    setEventBookmarks(exists ? eventBookmarks.filter((id) => id !== eventId) : [...eventBookmarks, eventId])
    notify(exists ? 'Event bookmark removed.' : 'Event bookmarked on this device.')
  }

  const toggleResourceBookmark = (resourceId: string) => {
    const exists = resourceBookmarks.includes(resourceId)
    setResourceBookmarks(
      exists ? resourceBookmarks.filter((id) => id !== resourceId) : [...resourceBookmarks, resourceId],
    )
    notify(exists ? 'Resource bookmark removed.' : 'Resource saved on this device.')
  }

  const setIncludeSampleStats = (value: boolean) => setIncludeSampleStatsState(value)

  const resetPrototype = () => {
    STORAGE_KEYS.forEach((key) => localStorage.removeItem(key))
    window.location.reload()
  }

  const value: AppContextValue = {
    alias,
    journal,
    feed,
    comments: userComments,
    reactions,
    reports,
    registrations,
    eventBookmarks,
    resourceBookmarks,
    includeSampleStats,
    stats,
    excludedSampleCount: SAMPLE_MOODS.filter((mood) => !mood.optedIn).length,
    toast: toast?.message ?? null,
    notify,
    addJournal,
    deleteJournal,
    addPost,
    deletePost,
    addComment,
    toggleReaction,
    addReport,
    toggleRegistration,
    toggleEventBookmark,
    toggleResourceBookmark,
    setIncludeSampleStats,
    resetPrototype,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) throw new Error('useApp must be used within AppStateProvider')
  return context
}
