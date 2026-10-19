import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Trash2 } from 'lucide-react'
import { EmotionPicker } from '../components/EmotionPicker'
import { Modal } from '../components/Modal'
import { useApp } from '../context/AppState'
import { emotionById } from '../data/emotions'
import { formatWhen } from '../lib/format'
import type { EmotionId } from '../types'

export function Journal() {
  const navigate = useNavigate()
  const { journal, addJournal, deleteJournal } = useApp()
  const [primary, setPrimary] = useState<EmotionId | null>(null)
  const [secondary, setSecondary] = useState<EmotionId | null>(null)
  const [reflection, setReflection] = useState('')
  const [shareAnonymously, setShareAnonymously] = useState(false)
  const [contributeToStats, setContributeToStats] = useState(false)
  const [error, setError] = useState('')
  const [savedOpen, setSavedOpen] = useState(false)
  const [pendingDelete, setPendingDelete] = useState<string | null>(null)

  const reset = () => {
    setPrimary(null)
    setSecondary(null)
    setReflection('')
    setShareAnonymously(false)
    setContributeToStats(false)
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
      <section className="card p-5 sm:p-6">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-sage-600">Optional, and private unless you say otherwise</p>
        <h1 className="mt-2 font-display text-4xl text-sage-700">My Journal</h1>
        <p className="mt-3 text-sm leading-6 text-ink-soft">
          You do not have to feel grateful or positive. Entries stay in this browser&apos;s local storage. That storage is not encrypted, and it does not sync to your other devices.
        </p>
        <form
          className="mt-6 space-y-5"
          onSubmit={(event) => {
            event.preventDefault()
            if (!primary) {
              setError('Choose the feeling that fits best right now.')
              return
            }
            if (shareAnonymously && !reflection.trim()) {
              setError('Add a few words if you want to share this with Community. A private entry can still be only a feeling.')
              return
            }
            addJournal({
              primary,
              secondary,
              reflection: reflection.trim(),
              shareAnonymously,
              contributeToStats,
            })
            reset()
            setError('')
            setSavedOpen(true)
          }}
        >
          <EmotionPicker
            label="Primary feeling"
            value={primary}
            onChange={(emotion) => {
              setPrimary(emotion)
              if (secondary === emotion) setSecondary(null)
            }}
          />
          <EmotionPicker
            label="Second feeling, if there is one"
            value={secondary}
            onChange={(emotion) => setSecondary(emotion === primary ? null : emotion === secondary ? null : emotion)}
          />
          {secondary && (
            <button type="button" className="text-sm font-bold text-sage-700" onClick={() => setSecondary(null)}>
              Clear second feeling
            </button>
          )}
          <label className="block text-sm font-bold">
            What&apos;s been on your mind today?
            <textarea
              className="field mt-2 min-h-36"
              value={reflection}
              maxLength={800}
              onChange={(event) => setReflection(event.target.value)}
              placeholder="Write as much or as little as you want."
            />
          </label>
          <label className="flex items-start gap-3 text-sm leading-6">
            <input className="mt-1 h-4 w-4 accent-sage-600" type="checkbox" checked={shareAnonymously} onChange={(event) => setShareAnonymously(event.target.checked)} />
            <span>Share this entry anonymously in Community on this device. Private entries never appear there.</span>
          </label>
          <label className="flex items-start gap-3 text-sm leading-6">
            <input className="mt-1 h-4 w-4 accent-sage-600" type="checkbox" checked={contributeToStats} onChange={(event) => setContributeToStats(event.target.checked)} />
            <span>Include my primary emotion in the community happiness index. Only the emotion count is used. Your writing stays out of the chart. This choice is separate from sharing.</span>
          </label>
          {error && <p className="rounded-2xl bg-lilac-100 px-4 py-3 text-sm font-semibold">{error}</p>}
          <button className="btn-primary" type="submit">
            Save entry
          </button>
        </form>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-2xl text-sage-700">Previous entries</h2>
        {journal.length === 0 && (
          <div className="card p-5 text-sm leading-6 text-ink-soft">Nothing is saved yet. A feeling by itself is enough for a private entry.</div>
        )}
        {journal.map((entry) => {
          const primaryEmotion = emotionById(entry.primary)
          const secondaryEmotion = entry.secondary ? emotionById(entry.secondary) : null
          return (
            <article key={entry.id} className="card p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-bold">
                    {primaryEmotion.emoji} {primaryEmotion.label}
                    {secondaryEmotion ? ` · ${secondaryEmotion.emoji} ${secondaryEmotion.label}` : ''}
                  </p>
                  <p className="text-xs text-ink-soft">{formatWhen(entry.createdAt)}</p>
                </div>
                <button className="btn-ghost min-h-10 px-3" onClick={() => setPendingDelete(entry.id)} aria-label="Delete entry">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              {entry.reflection && <p className="mt-3 text-sm leading-6">{entry.reflection}</p>}
              <div className="mt-3 flex flex-wrap gap-2 text-xs font-bold">
                <span className="chip">{entry.shareAnonymously ? 'Shared anonymously' : 'Private'}</span>
                <span className="chip">{entry.contributeToStats ? 'Emotion in the index' : 'Not in the index'}</span>
              </div>
            </article>
          )
        })}
      </section>

      {savedOpen && (
        <Modal title="Saved on this device" onClose={() => setSavedOpen(false)}>
          <p className="text-sm leading-6">
            Would you like two quiet minutes, or would you rather come back to your journal?
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button className="btn-primary" onClick={() => navigate('/breathe')}>
              Take 2 minutes
            </button>
            <button className="btn-ghost" onClick={() => setSavedOpen(false)}>
              Not now
            </button>
          </div>
        </Modal>
      )}

      {pendingDelete && (
        <Modal title="Delete this entry?" onClose={() => setPendingDelete(null)}>
          <p className="text-sm leading-6">
            It will be removed from this browser, including Community and the happiness index if you had opted in. This cannot be undone.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              className="btn-primary"
              onClick={() => {
                deleteJournal(pendingDelete)
                setPendingDelete(null)
              }}
            >
              Delete entry
            </button>
            <button className="btn-ghost" onClick={() => setPendingDelete(null)}>
              Keep it
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}
