import { useMemo, useState } from 'react'
import { Bookmark, MapPin, Search, SlidersHorizontal } from 'lucide-react'
import { Modal } from '../components/Modal'
import { useApp } from '../context/AppState'
import { EVENT_CATEGORIES, EVENT_LOCATIONS, EVENT_TYPE_LABELS, EVENTS } from '../data/events'
import { EMPTY_EVENT_FILTERS, filterEvents, type EventFilters } from '../lib/events'
import { cx, formatCost, formatDuration, formatWhen } from '../lib/format'
import type { EventFormat, EventItem, EventType } from '../types'

export function Events() {
  const { registrations, eventBookmarks, toggleRegistration, toggleEventBookmark } = useApp()
  const [filters, setFilters] = useState<EventFilters>(EMPTY_EVENT_FILTERS)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [selected, setSelected] = useState<EventItem | null>(null)
  const [tab, setTab] = useState<'discover' | 'mine'>('discover')

  const results = useMemo(() => filterEvents(EVENTS, filters), [filters])
  const mineRegistered = EVENTS.filter((event) => registrations.includes(event.id))
  const mineSaved = EVENTS.filter((event) => eventBookmarks.includes(event.id))
  const chips = activeChips(filters, setFilters)

  return (
    <div className="space-y-5">
      <section>
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-sage-600">Fictional demo calendar</p>
        <h1 className="mt-2 font-display text-4xl text-sage-700">Events</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-soft">
          Volunteering, discussion groups, and fun outings. Organisers, places, costs, and availability are not real, and registration is stored only in this browser.
        </p>
      </section>

      <div className="flex flex-wrap gap-2">
        <button className={tab === 'discover' ? 'btn-primary' : 'btn-ghost'} onClick={() => setTab('discover')}>
          Discover
        </button>
        <button className={tab === 'mine' ? 'btn-primary' : 'btn-ghost'} onClick={() => setTab('mine')}>
          My Events
        </button>
        <button className="btn-ghost lg:hidden" onClick={() => setFiltersOpen(true)}>
          <SlidersHorizontal className="h-4 w-4" /> Filters
        </button>
      </div>

      {tab === 'mine' ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <EventGroup title="Registrations" events={mineRegistered} empty="You have not registered for a demo event yet." registrations={registrations} bookmarks={eventBookmarks} onOpen={setSelected} onRegister={toggleRegistration} onBookmark={toggleEventBookmark} />
          <EventGroup title="Bookmarks" events={mineSaved} empty="Bookmarks you save will stay on this device." registrations={registrations} bookmarks={eventBookmarks} onOpen={setSelected} onRegister={toggleRegistration} onBookmark={toggleEventBookmark} />
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="hidden lg:block">
            <FilterPanel filters={filters} setFilters={setFilters} />
          </aside>
          <div className="space-y-4">
            <label className="relative block">
              <Search className="pointer-events-none absolute left-4 top-3.5 h-4 w-4 text-ink-soft" />
              <input
                className="field pl-11"
                value={filters.query}
                onChange={(event) => setFilters({ ...filters, query: event.target.value })}
                placeholder="Search title, place, or topic"
              />
            </label>
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-bold">{results.length} events</p>
              {chips.map((chip) => (
                <button key={chip.key} className="chip" onClick={chip.clear}>
                  {chip.label} ×
                </button>
              ))}
              {chips.length > 0 && (
                <button className="text-sm font-bold text-sage-700" onClick={() => setFilters(EMPTY_EVENT_FILTERS)}>
                  Clear all
                </button>
              )}
            </div>
            {results.length === 0 ? (
              <div className="card p-5 text-sm leading-6">
                No demo events match all of these filters together. Remove one, or clear them all.
              </div>
            ) : (
              <div className="grid gap-4 xl:grid-cols-2">
                {results.map((event) => (
                  <EventCard key={event.id} event={event} registered={registrations.includes(event.id)} bookmarked={eventBookmarks.includes(event.id)} onOpen={() => setSelected(event)} onRegister={() => toggleRegistration(event.id)} onBookmark={() => toggleEventBookmark(event.id)} />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {filtersOpen && (
        <Modal title="Filter events" onClose={() => setFiltersOpen(false)} wide>
          <FilterPanel filters={filters} setFilters={setFilters} />
          <button className="btn-primary mt-4 w-full" onClick={() => setFiltersOpen(false)}>
            Show {results.length} events
          </button>
        </Modal>
      )}

      {selected && (
        <Modal title={selected.title} onClose={() => setSelected(null)}>
          <EventDetails event={selected} />
          <div className="mt-5 flex flex-wrap gap-2">
            <button className="btn-primary" onClick={() => toggleRegistration(selected.id)}>
              {registrations.includes(selected.id) ? 'Cancel registration' : 'Register'}
            </button>
            <button className="btn-ghost" onClick={() => toggleEventBookmark(selected.id)}>
              <Bookmark className="h-4 w-4" />
              {eventBookmarks.includes(selected.id) ? 'Bookmarked' : 'Bookmark'}
            </button>
          </div>
          <p className="mt-3 text-xs leading-5 text-ink-soft">Demo only. This does not contact an organiser or reserve a place.</p>
        </Modal>
      )}
    </div>
  )
}

function activeChips(filters: EventFilters, setFilters: (filters: EventFilters) => void) {
  const chips: { key: string; label: string; clear: () => void }[] = []
  if (filters.type !== 'all') chips.push({ key: 'type', label: EVENT_TYPE_LABELS[filters.type], clear: () => setFilters({ ...filters, type: 'all' }) })
  if (filters.dateMode !== 'all') {
    const label = filters.dateMode === 'custom' ? 'Custom dates' : filters.dateMode === 'today' ? 'Today' : filters.dateMode === 'week' ? 'This week' : 'This month'
    chips.push({ key: 'date', label, clear: () => setFilters({ ...filters, dateMode: 'all', from: '', to: '' }) })
  }
  if (filters.location !== 'all') chips.push({ key: 'location', label: filters.location, clear: () => setFilters({ ...filters, location: 'all' }) })
  if (filters.format !== 'all') chips.push({ key: 'format', label: filters.format === 'online' ? 'Online' : 'Face-to-face', clear: () => setFilters({ ...filters, format: 'all' }) })
  if (filters.category !== 'all') chips.push({ key: 'category', label: filters.category, clear: () => setFilters({ ...filters, category: 'all' }) })
  if (filters.cost !== 'all') chips.push({ key: 'cost', label: filters.cost === 'free' ? 'Free' : 'Paid', clear: () => setFilters({ ...filters, cost: 'all' }) })
  if (filters.query.trim()) chips.push({ key: 'query', label: `“${filters.query.trim()}”`, clear: () => setFilters({ ...filters, query: '' }) })
  return chips
}

function FilterPanel({ filters, setFilters }: { filters: EventFilters; setFilters: (filters: EventFilters) => void }) {
  const set = (patch: Partial<EventFilters>) => setFilters({ ...filters, ...patch })
  return (
    <div className="card space-y-4 p-4">
      <label className="block text-sm font-bold">
        Event type
        <select className="field mt-2" value={filters.type} onChange={(event) => set({ type: event.target.value as EventType | 'all' })}>
          <option value="all">All types</option>
          <option value="volunteering">Volunteering</option>
          <option value="discussion">Discussion groups</option>
          <option value="outing">Fun outings</option>
        </select>
      </label>
      <label className="block text-sm font-bold">
        Date
        <select className="field mt-2" value={filters.dateMode} onChange={(event) => set({ dateMode: event.target.value as EventFilters['dateMode'] })}>
          <option value="all">Any date</option>
          <option value="today">Today</option>
          <option value="week">This week</option>
          <option value="month">This month</option>
          <option value="custom">Custom range</option>
        </select>
      </label>
      {filters.dateMode === 'custom' && (
        <div className="grid grid-cols-2 gap-2">
          <label className="text-sm font-bold">
            From
            <input className="field mt-2" type="date" value={filters.from} onChange={(event) => set({ from: event.target.value })} />
          </label>
          <label className="text-sm font-bold">
            To
            <input className="field mt-2" type="date" value={filters.to} onChange={(event) => set({ to: event.target.value })} />
          </label>
        </div>
      )}
      <label className="block text-sm font-bold">
        Location
        <select className="field mt-2" value={filters.location} onChange={(event) => set({ location: event.target.value })}>
          <option value="all">Any location</option>
          {EVENT_LOCATIONS.map((location) => (
            <option key={location}>{location}</option>
          ))}
        </select>
      </label>
      <label className="block text-sm font-bold">
        Online or face-to-face
        <select className="field mt-2" value={filters.format} onChange={(event) => set({ format: event.target.value as EventFormat | 'all' })}>
          <option value="all">Either</option>
          <option value="online">Online</option>
          <option value="in-person">Face-to-face</option>
        </select>
      </label>
      <label className="block text-sm font-bold">
        Topic or category
        <select className="field mt-2" value={filters.category} onChange={(event) => set({ category: event.target.value })}>
          <option value="all">All topics</option>
          {EVENT_CATEGORIES.map((category) => (
            <option key={category}>{category}</option>
          ))}
        </select>
      </label>
      <label className="block text-sm font-bold">
        Cost
        <select className="field mt-2" value={filters.cost} onChange={(event) => set({ cost: event.target.value as EventFilters['cost'] })}>
          <option value="all">Free or paid</option>
          <option value="free">Free</option>
          <option value="paid">Paid</option>
        </select>
      </label>
      <button className="btn-ghost w-full" onClick={() => setFilters(EMPTY_EVENT_FILTERS)}>
        Clear all filters
      </button>
    </div>
  )
}

function EventGroup({
  title,
  events,
  empty,
  registrations,
  bookmarks,
  onOpen,
  onRegister,
  onBookmark,
}: {
  title: string
  events: EventItem[]
  empty: string
  registrations: string[]
  bookmarks: string[]
  onOpen: (event: EventItem) => void
  onRegister: (id: string) => void
  onBookmark: (id: string) => void
}) {
  return (
    <section className="space-y-3">
      <h2 className="font-display text-2xl text-sage-700">{title}</h2>
      {events.length === 0 && <div className="card p-4 text-sm text-ink-soft">{empty}</div>}
      {events.map((event) => (
        <EventCard key={`${title}-${event.id}`} event={event} registered={registrations.includes(event.id)} bookmarked={bookmarks.includes(event.id)} onOpen={() => onOpen(event)} onRegister={() => onRegister(event.id)} onBookmark={() => onBookmark(event.id)} />
      ))}
    </section>
  )
}

function EventCard({
  event,
  registered,
  bookmarked,
  onOpen,
  onRegister,
  onBookmark,
}: {
  event: EventItem
  registered: boolean
  bookmarked: boolean
  onOpen: () => void
  onRegister: () => void
  onBookmark: () => void
}) {
  return (
    <article className="card p-4">
      <button className="w-full text-left" onClick={onOpen}>
        <p className="text-xs font-bold uppercase tracking-wide text-sage-600">
          {EVENT_TYPE_LABELS[event.type]} · {event.category}
        </p>
        <h3 className="mt-1 font-display text-2xl text-sage-700">{event.title}</h3>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-ink-soft">{event.description}</p>
      </button>
      <div className="mt-3 space-y-1 text-sm">
        <p>{formatWhen(event.startsAt)}</p>
        <p className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-mist-700" /> {event.location} · {event.format === 'online' ? 'Online' : 'Face-to-face'}
        </p>
        <p>
          {formatDuration(event.durationMinutes)} · {formatCost(event.cost)}
        </p>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <button className="btn-primary" onClick={onRegister}>
          {registered ? 'Cancel registration' : 'Register'}
        </button>
        <button className={cx('btn-ghost', bookmarked && 'bg-sage-100')} onClick={onBookmark} aria-pressed={bookmarked}>
          <Bookmark className="h-4 w-4" /> {bookmarked ? 'Saved' : 'Bookmark'}
        </button>
      </div>
    </article>
  )
}

function EventDetails({ event }: { event: EventItem }) {
  return (
    <div className="space-y-2 text-sm leading-6">
      <p>{event.description}</p>
      <p><strong>Type:</strong> {EVENT_TYPE_LABELS[event.type]}</p>
      <p><strong>Category:</strong> {event.category}</p>
      <p><strong>When:</strong> {formatWhen(event.startsAt)}</p>
      <p><strong>Duration:</strong> {formatDuration(event.durationMinutes)}</p>
      <p><strong>Where:</strong> {event.location} ({event.format === 'online' ? 'Online' : 'Face-to-face'})</p>
      <p><strong>Cost:</strong> {formatCost(event.cost)}</p>
      <p><strong>Organiser:</strong> {event.organiser}</p>
    </div>
  )
}
