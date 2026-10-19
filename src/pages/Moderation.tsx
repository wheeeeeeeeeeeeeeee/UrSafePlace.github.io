import { Link } from 'react-router-dom'
import { useApp } from '../context/AppState'
import { formatWhen } from '../lib/format'

export function Moderation() {
  const { reports } = useApp()
  return (
    <div className="space-y-5">
      <section className="rounded-3xl bg-mist-100 px-5 py-4 text-sm leading-6">
        <p className="font-bold">Local moderation demo</p>
        <p>These reports never leave this browser. There is no moderation team, and the reporter is not identified.</p>
      </section>
      <div className="flex items-end justify-between gap-3">
        <h1 className="font-display text-4xl text-sage-700">Reports</h1>
        <Link className="text-sm font-bold text-sage-700" to="/community">
          Back to Community
        </Link>
      </div>
      {reports.length === 0 ? (
        <div className="card p-5 text-sm">No reports yet. Use Report on a post, comment, or reply to see one appear here as Pending review.</div>
      ) : (
        <ul className="space-y-3">
          {reports.map((report) => (
            <li key={report.id} className="card p-4 text-sm leading-6">
              <p className="font-bold">
                {report.targetType === 'post' ? 'Post' : 'Comment'} · {report.status}
              </p>
              <p className="mt-1">{report.reason}</p>
              <p className="text-ink-soft">“{report.excerpt}”</p>
              {report.details && <p>{report.details}</p>}
              <p className="text-xs text-ink-soft">{formatWhen(report.createdAt)}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
