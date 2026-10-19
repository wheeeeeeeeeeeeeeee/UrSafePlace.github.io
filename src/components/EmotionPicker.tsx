import { EMOTIONS } from '../data/emotions'
import type { EmotionId } from '../types'
import { cx } from '../lib/format'

export function EmotionPicker({
  value,
  onChange,
  label,
}: {
  value: EmotionId | null
  onChange: (emotion: EmotionId) => void
  label: string
}) {
  return (
    <fieldset>
      <legend className="mb-3 text-sm font-bold text-ink">{label}</legend>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {EMOTIONS.map((emotion) => {
          const selected = value === emotion.id
          return (
            <button
              key={emotion.id}
              type="button"
              onClick={() => onChange(emotion.id)}
              aria-pressed={selected}
              className={cx(
                'min-h-16 rounded-2xl border px-3 py-2 text-left transition',
                selected ? 'border-sage-500 bg-sage-100' : 'border-sage-100 bg-white hover:border-sage-300',
              )}
            >
              <span className="block text-lg">{emotion.emoji || '•'}</span>
              <span className="block text-sm font-bold">{emotion.label}</span>
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}
