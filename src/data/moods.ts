import type { EmotionId } from '../types'

export interface SampleMood {
  id: string
  emotion: EmotionId
  optedIn: boolean
}

function rows(emotion: EmotionId, count: number, optedIn: boolean, prefix: string): SampleMood[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `${prefix}-${index + 1}`,
    emotion,
    optedIn,
  }))
}

/** Fictional mood records. The chart counts these objects; it does not use a hardcoded chart series. */
export const SAMPLE_MOODS: SampleMood[] = [
  ...rows('happy', 6, true, 'sample-happy'),
  ...rows('anxious', 5, true, 'sample-anxious'),
  ...rows('nervous', 4, true, 'sample-nervous'),
  ...rows('angry', 2, true, 'sample-angry'),
  ...rows('vulnerable', 3, true, 'sample-vulnerable'),
  ...rows('confused', 3, true, 'sample-confused'),
  ...rows('neutral', 4, true, 'sample-neutral'),
  ...rows('other', 2, true, 'sample-other'),
  { id: 'sample-out-1', emotion: 'angry', optedIn: false },
  { id: 'sample-out-2', emotion: 'anxious', optedIn: false },
  { id: 'sample-out-3', emotion: 'happy', optedIn: false },
  { id: 'sample-out-4', emotion: 'neutral', optedIn: false },
]

export const MIN_RESPONSES = 8
