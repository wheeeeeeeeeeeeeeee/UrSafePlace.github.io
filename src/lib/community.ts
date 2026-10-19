import { EMOTIONS } from '../data/emotions'
import { MIN_RESPONSES } from '../data/moods'
import type { EmotionId, JournalEntry, UserPost } from '../types'
import { SAMPLE_POSTS } from '../data/community'

export function buildFeed(journal: JournalEntry[], posts: UserPost[], alias: string) {
  const shared = journal
    .filter((entry) => entry.shareAnonymously)
    .map((entry) => ({
      id: `journal-${entry.id}`,
      authorLabel: alias,
      emotion: entry.primary,
      body: entry.reflection.trim() || 'Shared a feeling without additional words.',
      createdAt: entry.createdAt,
      mine: true,
      baseReactions: { support: 0, hear: 0, alone: 0 },
    }))

  const created = posts.map((post) => ({
    id: post.id,
    authorLabel: alias,
    emotion: post.emotion,
    body: post.body,
    createdAt: post.createdAt,
    mine: true,
    baseReactions: { support: 0, hear: 0, alone: 0 },
  }))

  return [...shared, ...created, ...SAMPLE_POSTS].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )
}

export function tallyEmotions(emotions: EmotionId[]) {
  const counts = Object.fromEntries(EMOTIONS.map((emotion) => [emotion.id, 0])) as Record<EmotionId, number>
  emotions.forEach((emotion) => {
    counts[emotion] += 1
  })
  const total = emotions.length
  return {
    counts,
    total,
    ready: total >= MIN_RESPONSES,
    minimum: MIN_RESPONSES,
  }
}
