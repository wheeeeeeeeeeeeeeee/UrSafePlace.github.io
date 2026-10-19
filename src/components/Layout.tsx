import { CalendarDays, House, Library, LifeBuoy, NotebookPen, Users } from 'lucide-react'
import { NavLink, Outlet } from 'react-router-dom'
import { useApp } from '../context/AppState'
import { Logo } from './Logo'

const NAV = [
  { to: '/', label: 'Home', short: 'Home', icon: House, end: true },
  { to: '/journal', label: 'My Journal', short: 'Journal', icon: NotebookPen, end: false },
  { to: '/community', label: 'Community', short: 'Community', icon: Users, end: false },
  { to: '/events', label: 'Events', short: 'Events', icon: CalendarDays, end: false },
  { to: '/resources', label: 'Resources', short: 'Resources', icon: Library, end: false },
  { to: '/support', label: 'Support', short: 'Support', icon: LifeBuoy, end: false },
]

function itemClass(active: boolean, mobile = false) {
  if (mobile) {
    return `flex min-h-14 flex-col items-center justify-center gap-1 rounded-2xl px-0.5 text-[10px] font-bold leading-none ${
      active ? 'text-sage-700' : 'text-ink-soft'
    }`
  }
  return `flex min-h-12 items-center gap-3 rounded-2xl px-3 text-sm font-bold transition ${
    active ? 'bg-sage-500 text-white' : 'text-ink hover:bg-sage-50'
  }`
}

export function Layout() {
  const { toast } = useApp()

  return (
    <div className="min-h-screen">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 flex-col border-r border-sage-100 bg-paper/90 px-5 py-6 backdrop-blur md:flex">
        <Logo />
        <nav className="mt-8 flex flex-1 flex-col gap-1" aria-label="Main">
          {NAV.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} className={({ isActive }) => itemClass(isActive)}>
              <item.icon className="h-5 w-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <NavLink to="/support" className="btn-soft w-full">
          Talk to someone
        </NavLink>
        <p className="mt-4 text-xs leading-5 text-ink-soft">
          A student prototype. Not an emergency service, and not monitored in real time.
        </p>
      </aside>

      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-sage-100 bg-cream/90 px-4 py-3 backdrop-blur md:hidden">
        <Logo compact />
        <NavLink to="/support" className="btn-soft min-h-10 px-4 py-2">
          Talk
        </NavLink>
      </header>

      <main className="px-4 py-6 pb-28 md:py-8 md:pl-80 md:pr-8">
        <div className="mx-auto max-w-6xl">
          <Outlet />
        </div>
      </main>

      <nav
        className="fixed inset-x-0 bottom-0 z-40 border-t border-sage-100 bg-paper/95 px-1 pb-[max(0.4rem,env(safe-area-inset-bottom))] backdrop-blur md:hidden"
        aria-label="Main"
      >
        <div className="grid grid-cols-6">
          {NAV.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} className={({ isActive }) => itemClass(isActive, true)}>
              <item.icon className="h-5 w-5" />
              {item.short}
            </NavLink>
          ))}
        </div>
      </nav>

      {toast && (
        <div
          role="status"
          className="fixed bottom-24 left-1/2 z-[80] w-[min(92vw,28rem)] -translate-x-1/2 rounded-2xl bg-ink px-4 py-3 text-sm font-semibold text-cream shadow-soft md:bottom-6"
        >
          {toast}
        </div>
      )}
    </div>
  )
}
