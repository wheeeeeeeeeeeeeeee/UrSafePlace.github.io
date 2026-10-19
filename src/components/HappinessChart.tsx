import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { EMOTIONS } from '../data/emotions'
import { useApp } from '../context/AppState'

export function HappinessChart({ compact = false }: { compact?: boolean }) {
  const { stats, includeSampleStats, setIncludeSampleStats, excludedSampleCount } = useApp()
  const data = EMOTIONS.map((emotion) => ({
    name: `${emotion.emoji ? `${emotion.emoji} ` : ''}${emotion.label}`,
    count: stats.counts[emotion.id],
    color: emotion.color,
  }))

  return (
    <section className="card p-5 sm:p-6">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-sage-600">Illustrative sample</p>
      <h2 className="mt-2 font-display text-2xl text-sage-700">Community Happiness Index</h2>
      <p className="mt-2 text-sm leading-6 text-ink-soft">
        A gentle picture of feelings people chose to include. Written entries are never shown, and one person cannot be picked out of the chart.
      </p>

      {stats.ready ? (
        <>
          <p className="mt-4 text-sm font-bold text-ink">{stats.total} responses included</p>
          <div className={compact ? 'h-56' : 'h-72'}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} layout="vertical" margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <XAxis type="number" allowDecimals={false} tick={{ fill: '#5C6B64', fontSize: 12 }} />
                <YAxis type="category" dataKey="name" width={108} tick={{ fill: '#2C3330', fontSize: 12 }} />
                <Tooltip cursor={{ fill: 'rgba(95, 127, 104, 0.08)' }} />
                <Bar dataKey="count" radius={[0, 8, 8, 0]} maxBarSize={18}>
                  {data.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      ) : (
        <div className="mt-4 rounded-3xl bg-sage-50 px-4 py-6 text-sm leading-6 text-ink">
          <p className="font-bold">Not enough responses yet.</p>
          <p className="mt-2">
            The distribution stays hidden until at least {stats.minimum} feelings have been included. Right now there {stats.total === 1 ? 'is' : 'are'}{' '}
            {stats.total}. Individual entries are not listed here.
          </p>
        </div>
      )}

      <label className="mt-4 flex items-start gap-3 text-sm leading-6 text-ink-soft">
        <input
          className="mt-1 h-4 w-4 accent-sage-600"
          type="checkbox"
          checked={includeSampleStats}
          onChange={(event) => setIncludeSampleStats(event.target.checked)}
        />
        <span>
          Include illustrative sample responses. {excludedSampleCount} fictional responses opted out and are always left out.
          Sample numbers are not live campus data.
        </span>
      </label>
    </section>
  )
}
