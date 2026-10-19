import type { EmotionId } from '../types'

export interface EmotionOption {
  id: EmotionId
  label: string
  emoji: string
  color: string
  hint: string
}

export const EMOTIONS: EmotionOption[] = [
  { id: 'happy', label: 'Happy', emoji: '😊', color: '#5F7F68', hint: 'Light, glad, or quietly pleased' },
  { id: 'anxious', label: 'Anxious', emoji: '😰', color: '#7A93A8', hint: 'Worried, tight, or on edge' },
  { id: 'nervous', label: 'Nervous', emoji: '😬', color: '#C4A574', hint: 'Jittery about something ahead' },
  { id: 'angry', label: 'Angry', emoji: '😡', color: '#C4847A', hint: 'Frustrated, heated, or unfairly treated' },
  { id: 'vulnerable', label: 'Vulnerable', emoji: '🫂', color: '#B7A6CB', hint: 'Open, tender, or in need of care' },
  { id: 'confused', label: 'Confused', emoji: '😕', color: '#8AA0A8', hint: 'Unsure, foggy, or mixed' },
  { id: 'neutral', label: 'Neutral', emoji: '😐', color: '#A8A296', hint: 'Steady, ordinary, or in between' },
  { id: 'other', label: 'Other', emoji: '', color: '#6E8B74', hint: 'Something else, and that is allowed' },
]

export function emotionById(id: EmotionId) {
  return EMOTIONS.find((emotion) => emotion.id === id) ?? EMOTIONS[7]
}
