import { useEffect, useRef, useState } from 'react'
import { Pause, Play } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Mark } from './Logo'
import { formatClock } from '../lib/format'
import { Modal } from './Modal'

const TOTAL_MS = 120_000
const CYCLE_MS = 12_000
const PROMPTS = [
  'You do not have to fix anything during these two minutes.',
  'If your mind wanders, that is part of it. Come back to the breath.',
  'Let your shoulders drop a little, if they want to.',
  'Notice one sound, then let it pass.',
  'You are allowed to take up this small amount of time.',
]

function breathAt(elapsed: number) {
  const t = elapsed % CYCLE_MS
  if (t < 4000) {
    return { phase: 'Inhale', hint: 'Breathe in gently.', scale: 0.72 + (t / 4000) * 0.4 }
  }
  if (t < 6000) return { phase: 'Hold', hint: 'Rest at the top of the breath.', scale: 1.12 }
  if (t < 10000) {
    return { phase: 'Exhale', hint: 'Let the breath leave slowly.', scale: 1.12 - ((t - 6000) / 4000) * 0.4 }
  }
  return { phase: 'Rest', hint: 'Begin again whenever you are ready.', scale: 0.72 }
}

export function Mindfulness() {
  const navigate = useNavigate()
  const [elapsed, setElapsed] = useState(0)
  const [running, setRunning] = useState(true)
  const [done, setDone] = useState(false)
  const [confirmExit, setConfirmExit] = useState(false)
  const elapsedRef = useRef(0)
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    if (!running || done) return
    let frame = 0
    let last = performance.now()
    const tick = (now: number) => {
      const delta = now - last
      last = now
      const next = Math.min(TOTAL_MS, elapsedRef.current + delta)
      elapsedRef.current = next
      setElapsed(next)
      if (next >= TOTAL_MS) {
        setDone(true)
        setRunning(false)
        return
      }
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [running, done])

  const breath = breathAt(done ? 0 : elapsed)
  const scale = reduceMotion ? (breath.phase === 'Inhale' || breath.phase === 'Hold' ? 1.05 : 0.9) : breath.scale
  const remaining = Math.ceil((TOTAL_MS - elapsed) / 1000)
  const prompt = PROMPTS[Math.floor(elapsed / 15000) % PROMPTS.length]

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-mist-100 via-sage-100 to-cream text-ink">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48">
        <svg viewBox="0 0 1440 240" className="h-full w-full" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 120c160 70 280 20 460 20s280 90 460 70 280-80 520-40v70H0z" fill="#7C9A82" opacity="0.45" />
          <path d="M0 160c180 40 300 10 480 20s300 50 470 20 250-40 490-10v50H0z" fill="#5F7F68" opacity="0.7" />
        </svg>
      </div>
      <div className="relative mx-auto flex min-h-screen max-w-xl flex-col px-5 py-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold text-sage-700">Two quiet minutes</p>
          <button className="btn-ghost bg-white/80" onClick={() => (done ? navigate('/') : setConfirmExit(true))}>
            Exit
          </button>
        </div>

        {done ? (
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <Mark className="h-16 w-16 text-sage-500" />
            <h1 className="mt-6 font-display text-4xl text-sage-700">You gave yourself two minutes.</h1>
            <p className="mt-3 max-w-sm text-base leading-7 text-ink-soft">
              Nothing else is required. You can return whenever you want a small pause.
            </p>
            <button className="btn-primary mt-8" onClick={() => navigate('/')}>
              Return home
            </button>
          </div>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <p className="font-display text-6xl text-sage-700" aria-live="polite">
              {formatClock(remaining)}
            </p>
            <div className="relative my-8 grid h-64 w-64 place-items-center">
              <div
                className="absolute h-56 w-56 rounded-full bg-lilac-300/50"
                style={{ transform: `scale(${scale})` }}
              />
              <div
                className="absolute h-40 w-40 rounded-full bg-white/80 shadow-soft"
                style={{ transform: `scale(${scale})` }}
              />
              <div className="relative">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-sage-600">{breath.phase}</p>
                <p className="mt-2 max-w-40 text-sm font-semibold">{breath.hint}</p>
              </div>
            </div>
            <p className="max-w-sm text-base leading-7">{prompt}</p>
            <div className="mt-8 h-2 w-full max-w-sm overflow-hidden rounded-full bg-white/70" aria-hidden="true">
              <div className="h-full rounded-full bg-sage-500" style={{ width: `${(elapsed / TOTAL_MS) * 100}%` }} />
            </div>
            <p className="mt-2 text-xs font-semibold text-ink-soft">Progress through 2:00</p>
            <button className="btn-primary mt-6" onClick={() => setRunning((value) => !value)}>
              {running ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {running ? 'Pause' : 'Resume'}
            </button>
            <p className="mt-6 max-w-sm text-xs leading-5 text-ink-soft">
              No audio file is included, so this practice uses the circle and the words. A browser cannot lock your phone or stop you switching apps.
            </p>
          </div>
        )}
      </div>
      {confirmExit && (
        <Modal title="Leave this pause?" onClose={() => setConfirmExit(false)}>
          <p className="text-sm leading-6">The timer will stop. You can start again from two minutes whenever you like.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button className="btn-primary" onClick={() => navigate('/')}>
              Exit to home
            </button>
            <button className="btn-ghost" onClick={() => setConfirmExit(false)}>
              Keep going
            </button>
          </div>
        </Modal>
      )}
    </main>
  )
}
