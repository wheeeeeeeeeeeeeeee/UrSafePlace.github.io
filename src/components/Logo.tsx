export function Mark({ className = 'h-7 w-7' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" aria-hidden="true">
      <path d="M32 8c10 10 18 18 18 29a18 18 0 0 1-36 0c0-11 8-19 18-29z" fill="currentColor" />
      <path d="M32 30c3.4 4.2 5.5 6.8 5.5 9.8a5.5 5.5 0 0 1-11 0c0-3 2.1-5.6 5.5-9.8z" fill="#B7A6CB" />
    </svg>
  )
}

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-sage-500 text-cream shadow-soft">
        <Mark className="h-7 w-7" />
      </span>
      {compact ? (
        <span className="font-display text-lg leading-none text-sage-700">Ur Safe Place</span>
      ) : (
        <span>
          <span className="block font-display text-xl leading-none text-sage-700">Ur Safe Place</span>
          <span className="mt-1 block text-xs font-semibold text-ink-soft">A calm space for students</span>
        </span>
      )}
    </div>
  )
}
