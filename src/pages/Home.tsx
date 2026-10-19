import { Link } from 'react-router-dom'
import { CalendarDays, Leaf, MessageCircle } from 'lucide-react'
import { HappinessChart } from '../components/HappinessChart'
import { useApp } from '../context/AppState'
import { emotionById } from '../data/emotions'
import { EVENTS } from '../data/events'
import { RESOURCES } from '../data/resources'
import { formatWhen, timeAgo } from '../lib/format'

export function Home() {
  const { feed } = useApp()
  const upcoming = [...EVENTS]
    .filter((event) => new Date(event.startsAt).getTime() >= Date.now() - 60 * 60 * 1000)
    .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime())
    .slice(0, 3)

  return (
    <div className="space-y-6">
      <section className="card relative overflow-hidden bg-gradient-to-br from-paper via-sage-50 to-lilac-100 p-6 sm:p-10">
        <Leaf className="absolute -right-4 top-6 h-28 w-28 text-sage-200 animate-floaty" aria-hidden="true" />
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-sage-600">For students, as they are</p>
        <h1 className="mt-3 max-w-xl font-display text-4xl leading-tight text-sage-700 sm:text-5xl">
          Welcome to Ur Safe Place.
        </h1>
        <p className="mt-4 max-w-xl text-lg leading-8 text-ink-soft">
          You don&apos;t have to have everything figured out today.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link className="btn-primary" to="/journal">
            How are you feeling today?
          </Link>
          <Link className="btn-soft" to="/breathe">
            Take 2 minutes for yourself
          </Link>
        </div>
        <Link className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-lilac-700 underline-offset-4 hover:underline" to="/support">
          <MessageCircle className="h-4 w-4" />
          Talk to someone
        </Link>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <HappinessChart compact />
        <section className="card p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-display text-2xl text-sage-700">From the community</h2>
            <Link className="text-sm font-bold text-sage-700" to="/community">
              See all
            </Link>
          </div>
          <p className="mt-2 text-xs font-semibold text-ink-soft">Anonymous sample posts, plus anything you choose to share on this device.</p>
          <ul className="mt-4 space-y-3">
            {feed.slice(0, 3).map((post) => {
              const emotion = emotionById(post.emotion)
              return (
                <li key={post.id} className="rounded-2xl bg-sage-50 px-4 py-3">
                  <p className="text-xs font-bold text-ink-soft">
                    {emotion.emoji} {emotion.label} · {post.authorLabel}
                    {post.mine ? ' · you' : ''} · {timeAgo(post.createdAt)}
                  </p>
                  <p className="mt-1 line-clamp-3 text-sm leading-6">{post.body}</p>
                </li>
              )
            })}
          </ul>
        </section>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="card p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-display text-2xl text-sage-700">Coming up</h2>
            <Link className="text-sm font-bold text-sage-700" to="/events">
              Events
            </Link>
          </div>
          <ul className="mt-4 space-y-3">
            {upcoming.map((event) => (
              <li key={event.id} className="flex gap-3 rounded-2xl bg-mist-50 px-4 py-3">
                <CalendarDays className="mt-1 h-5 w-5 shrink-0 text-mist-700" />
                <div>
                  <p className="font-bold">{event.title}</p>
                  <p className="text-sm text-ink-soft">
                    {formatWhen(event.startsAt)} · {event.location}
                  </p>
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-ink-soft">Fictional demo events. Nothing here is a confirmed booking.</p>
        </section>

        <section className="card p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-display text-2xl text-sage-700">A little help nearby</h2>
            <Link className="text-sm font-bold text-sage-700" to="/resources">
              Resources
            </Link>
          </div>
          <ul className="mt-4 space-y-3">
            {RESOURCES.slice(0, 3).map((resource) => (
              <li key={resource.id}>
                <Link className="block rounded-2xl bg-lilac-50 px-4 py-3 hover:bg-lilac-100" to={`/resources/${resource.id}`}>
                  <p className="font-bold">{resource.title}</p>
                  <p className="text-sm text-ink-soft">
                    {resource.category} · {resource.minutes} min
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}
