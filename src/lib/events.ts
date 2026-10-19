import type { EventFormat, EventItem, EventType } from '../types'
import { endOfWeek, parseDateInput, sameDay, startOfWeek } from './format'

export interface EventFilters {
  query: string
  type: EventType | 'all'
  dateMode: 'all' | 'today' | 'week' | 'month' | 'custom'
  from: string
  to: string
  location: string
  format: EventFormat | 'all'
  category: string
  cost: 'all' | 'free' | 'paid'
}

export const EMPTY_EVENT_FILTERS: EventFilters = {
  query: '',
  type: 'all',
  dateMode: 'all',
  from: '',
  to: '',
  location: 'all',
  format: 'all',
  category: 'all',
  cost: 'all',
}

function matchesDate(event: EventItem, filters: EventFilters) {
  const start = new Date(event.startsAt)
  const now = new Date()
  if (filters.dateMode === 'all') return true
  if (filters.dateMode === 'today') return sameDay(start, now)
  if (filters.dateMode === 'week') return start >= startOfWeek(now) && start <= endOfWeek(now)
  if (filters.dateMode === 'month') return start.getFullYear() === now.getFullYear() && start.getMonth() === now.getMonth()
  const from = parseDateInput(filters.from, false)
  const to = parseDateInput(filters.to, true)
  if (from && start < from) return false
  if (to && start > to) return false
  return true
}

export function filterEvents(events: EventItem[], filters: EventFilters) {
  const needle = filters.query.trim().toLowerCase()
  return events
    .filter((event) => {
      if (filters.type !== 'all' && event.type !== filters.type) return false
      if (filters.format !== 'all' && event.format !== filters.format) return false
      if (filters.location !== 'all' && event.location !== filters.location) return false
      if (filters.category !== 'all' && event.category !== filters.category) return false
      if (filters.cost === 'free' && event.cost !== 0) return false
      if (filters.cost === 'paid' && event.cost === 0) return false
      if (!matchesDate(event, filters)) return false
      if (!needle) return true
      const haystack = [event.title, event.description, event.location, event.organiser, event.category, event.type]
        .join(' ')
        .toLowerCase()
      return haystack.includes(needle)
    })
    .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime())
}
