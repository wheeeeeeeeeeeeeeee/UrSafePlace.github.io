import type { CommentItem, EmotionId, FeedPost } from '../types'

const ago = (hours: number) => new Date(Date.now() - hours * 60 * 60 * 1000).toISOString()

export const SAMPLE_POSTS: FeedPost[] = [
  {
    id: 'p-sky',
    authorLabel: 'Student 011',
    emotion: 'happy',
    body: 'I sat outside after class and the sky was doing that soft gold thing. Nothing else was fixed, but I noticed it.',
    createdAt: ago(0.6),
    mine: false,
    baseReactions: { support: 6, hear: 3, alone: 4 },
  },
  {
    id: 'p-deadlines',
    authorLabel: 'Student 027',
    emotion: 'anxious',
    body: 'I have two deadlines close together and my brain keeps rehearsing the worst version. I am tired of pretending I am fine with the pace.',
    createdAt: ago(5),
    mine: false,
    baseReactions: { support: 11, hear: 8, alone: 7 },
  },
  {
    id: 'p-lunch',
    authorLabel: 'Student 034',
    emotion: 'vulnerable',
    body: 'I ate lunch alone again and felt silly for minding. If you have been there, I just wanted to say it out loud somewhere.',
    createdAt: ago(26),
    mine: false,
    baseReactions: { support: 9, hear: 12, alone: 10 },
  },
  {
    id: 'p-path',
    authorLabel: 'Student 058',
    emotion: 'confused',
    body: 'I am not sure I chose the right path. Everyone else sounds certain. I mostly feel foggy, and I do not want advice that rushes me.',
    createdAt: ago(30),
    mine: false,
    baseReactions: { support: 5, hear: 7, alone: 6 },
  },
  {
    id: 'p-rain',
    authorLabel: 'Student 063',
    emotion: 'neutral',
    body: 'Did my laundry, answered one email, and watched the rain. An ordinary day, and that was enough.',
    createdAt: ago(8),
    mine: false,
    baseReactions: { support: 4, hear: 2, alone: 3 },
  },
  {
    id: 'p-presentation',
    authorLabel: 'Student 072',
    emotion: 'nervous',
    body: 'Presentation tomorrow. My voice shakes even when I know the material. I would like a steady breath more than a perfect performance.',
    createdAt: ago(14),
    mine: false,
    baseReactions: { support: 8, hear: 6, alone: 5 },
  },
  {
    id: 'p-group',
    authorLabel: 'Student 081',
    emotion: 'angry',
    body: 'A group member disappeared and the rest of us are carrying the work. I am angry, and I am trying not to send the message I would regret.',
    createdAt: ago(52),
    mine: false,
    baseReactions: { support: 7, hear: 9, alone: 4 },
  },
  {
    id: 'p-door',
    authorLabel: 'Student 090',
    emotion: 'happy',
    body: 'Someone held the door and used my name. It was small, and it helped more than I expected.',
    createdAt: ago(2),
    mine: false,
    baseReactions: { support: 5, hear: 1, alone: 2 },
  },
]

export const SAMPLE_COMMENTS: CommentItem[] = [
  {
    id: 'c-deadlines-1',
    postId: 'p-deadlines',
    parentId: null,
    authorLabel: 'Student 044',
    body: 'The workload spike is real. Thank you for saying it without dressing it up.',
    createdAt: ago(4),
  },
  {
    id: 'c-deadlines-2',
    postId: 'p-deadlines',
    parentId: 'c-deadlines-1',
    authorLabel: 'Student 019',
    body: 'Same here. I am trying one small task, then a glass of water. It is not a fix. It is a pause.',
    createdAt: ago(3),
  },
  {
    id: 'c-lunch-1',
    postId: 'p-lunch',
    parentId: null,
    authorLabel: 'Student 052',
    body: 'You are not the only one eating alone. I hear you, and you do not have to make it smaller.',
    createdAt: ago(20),
  },
  {
    id: 'c-path-1',
    postId: 'p-path',
    parentId: null,
    authorLabel: 'Student 015',
    body: 'Foggy is an honest place to be. You do not owe anyone a neat answer today.',
    createdAt: ago(18),
  },
]

export const RESERVED_ALIASES = [
  ...SAMPLE_POSTS.map((post) => post.authorLabel),
  ...SAMPLE_COMMENTS.map((comment) => comment.authorLabel),
]

export const REACTION_META: { id: 'support' | 'hear' | 'alone'; label: string }[] = [
  { id: 'support', label: 'Sending support' },
  { id: 'hear', label: 'I hear you' },
  { id: 'alone', label: "You're not alone" },
]

export const DEMO_NOTE =
  'Prototype forum. Posts stay in this browser. This is not real anonymity, live moderation, or a support team.'

export function isEmotionId(value: string): value is EmotionId {
  return [
    'happy',
    'anxious',
    'nervous',
    'angry',
    'vulnerable',
    'confused',
    'neutral',
    'other',
  ].includes(value)
}
