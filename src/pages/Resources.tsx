import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Bookmark, Search } from 'lucide-react'
import { useApp } from '../context/AppState'
import { RESOURCE_CATEGORIES, RESOURCES } from '../data/resources'
import { cx } from '../lib/format'
import type { ResourceFormat } from '../types'

export function Resources() {
  const { resourceBookmarks, toggleResourceBookmark } = useApp()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [format, setFormat] = useState<ResourceFormat | 'all'>('all')
  const [view, setView] = useState<'browse' | 'saved'>('browse')

  const saved = RESOURCES.filter((resource) => resourceBookmarks.includes(resource.id))
  const results = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return RESOURCES.filter((resource) => {
      if (category !== 'all' && resource.category !== category) return false
      if (format !== 'all' && resource.format !== format) return false
      if (!needle) return true
      return [resource.title, resource.summary, resource.category, resource.body.join(' ')].join(' ').toLowerCase().includes(needle)
    })
  }, [query, category, format])

  return (
    <div className="space-y-5">
      <section>
        <h1 className="font-display text-4xl text-sage-700">A little help for how you feel.</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-ink-soft">
          Original sample writing for this prototype. It is not verified clinical guidance, and there are no external videos or citations.
        </p>
      </section>
      <div className="flex flex-wrap gap-2">
        <button className={view === 'browse' ? 'btn-primary' : 'btn-ghost'} onClick={() => setView('browse')}>
          Browse
        </button>
        <button className={view === 'saved' ? 'btn-primary' : 'btn-ghost'} onClick={() => setView('saved')}>
          Saved resources
        </button>
      </div>

      {view === 'saved' ? (
        saved.length === 0 ? (
          <div className="card p-5 text-sm">Nothing is saved yet. Bookmarks stay in this browser.</div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {saved.map((resource) => (
              <ResourceCard key={resource.id} resourceId={resource.id} saved onToggle={() => toggleResourceBookmark(resource.id)} />
            ))}
          </div>
        )
      ) : (
        <>
          <label className="relative block">
            <Search className="pointer-events-none absolute left-4 top-3.5 h-4 w-4 text-ink-soft" />
            <input className="field pl-11" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by keyword" />
          </label>
          <div className="flex flex-wrap gap-2">
            <button className={category === 'all' ? 'chip bg-sage-100' : 'chip'} onClick={() => setCategory('all')}>
              All topics
            </button>
            {RESOURCE_CATEGORIES.map((item) => (
              <button key={item} className={category === item ? 'chip bg-sage-100' : 'chip'} onClick={() => setCategory(item)}>
                {item}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {(['all', 'article', 'video', 'exercise'] as const).map((item) => (
              <button key={item} className={format === item ? 'btn-primary min-h-10 px-4 py-2' : 'btn-ghost min-h-10 px-4 py-2'} onClick={() => setFormat(item)}>
                {item === 'all' ? 'All formats' : item[0].toUpperCase() + item.slice(1) + 's'}
              </button>
            ))}
          </div>
          <p className="text-sm font-bold">{results.length} resources</p>
          {results.length === 0 ? (
            <div className="card p-5 text-sm">Nothing matches that search and those filters together.</div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {results.map((resource) => (
                <ResourceCard
                  key={resource.id}
                  resourceId={resource.id}
                  saved={resourceBookmarks.includes(resource.id)}
                  onToggle={() => toggleResourceBookmark(resource.id)}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

function ResourceCard({ resourceId, saved, onToggle }: { resourceId: string; saved: boolean; onToggle: () => void }) {
  const resource = RESOURCES.find((item) => item.id === resourceId)
  if (!resource) return null
  return (
    <article className="card flex flex-col p-4">
      <p className="text-xs font-bold uppercase tracking-wide text-sage-600">
        {resource.format} · {resource.minutes} min
      </p>
      <h2 className="mt-2 font-display text-2xl text-sage-700">{resource.title}</h2>
      <p className="mt-2 flex-1 text-sm leading-6 text-ink-soft">{resource.summary}</p>
      <p className="mt-2 text-xs font-semibold text-ink-soft">{resource.category}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Link className="btn-primary" to={`/resources/${resource.id}`}>
          Read
        </Link>
        <button className={cx('btn-ghost', saved && 'bg-sage-100')} onClick={onToggle} aria-pressed={saved}>
          <Bookmark className="h-4 w-4" /> {saved ? 'Saved' : 'Save'}
        </button>
      </div>
    </article>
  )
}

export function ResourceDetail() {
  const { id } = useParams()
  const { resourceBookmarks, toggleResourceBookmark } = useApp()
  const resource = RESOURCES.find((item) => item.id === id)
  if (!resource) {
    return (
      <div className="card p-6">
        <p>That resource is not in the prototype.</p>
        <Link className="btn-primary mt-4" to="/resources">
          Back to resources
        </Link>
      </div>
    )
  }
  const saved = resourceBookmarks.includes(resource.id)
  return (
    <article className="mx-auto max-w-3xl">
      <Link className="text-sm font-bold text-sage-700" to="/resources">
        ← All resources
      </Link>
      <p className="mt-4 text-xs font-bold uppercase tracking-[0.16em] text-sage-600">
        {resource.category} · {resource.format} · {resource.minutes} min {resource.format === 'video' ? 'watch' : 'read'}
      </p>
      <h1 className="mt-2 font-display text-4xl text-sage-700">{resource.title}</h1>
      <p className="mt-3 text-lg leading-8 text-ink-soft">{resource.summary}</p>
      <button className={cx('btn-ghost mt-4', saved && 'bg-sage-100')} onClick={() => toggleResourceBookmark(resource.id)}>
        <Bookmark className="h-4 w-4" /> {saved ? 'Saved' : 'Save resource'}
      </button>
      <div className="mt-6 space-y-4 text-base leading-8">
        {resource.body.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      {resource.related && (
        <div className="mt-6 flex flex-wrap gap-2">
          {resource.related.map((link) => (
            <Link key={link.to} className="btn-primary" to={link.to}>
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </article>
  )
}
