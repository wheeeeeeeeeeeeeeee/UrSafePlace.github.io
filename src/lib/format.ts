export function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

export function endOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999)
}

export function startOfWeek(date: Date) {
  const copy = startOfDay(date)
  const day = copy.getDay()
  const diff = day === 0 ? 6 : day - 1
  copy.setDate(copy.getDate() - diff)
  return copy
}

export function endOfWeek(date: Date) {
  const start = startOfWeek(date)
  const end = new Date(start)
  end.setDate(start.getDate() + 6)
  return endOfDay(end)
}

export function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

export function parseDateInput(value: string, end = false) {
  if (!value) return null
  const [year, month, day] = value.split('-').map(Number)
  if (!year || !month || !day) return null
  return end ? new Date(year, month - 1, day, 23, 59, 59, 999) : new Date(year, month - 1, day)
}

export function formatWhen(iso: string) {
  return new Intl.DateTimeFormat(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(iso))
}

export function timeAgo(iso: string) {
  const seconds = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000)
  if (seconds < 60) return 'just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hr ago`
  if (seconds < 86400 * 7) return `${Math.floor(seconds / 86400)} days ago`
  return formatWhen(iso)
}

export function formatDuration(minutes: number) {
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60
  if (hours && rest) return `${hours} hr ${rest} min`
  if (hours) return hours === 1 ? '1 hour' : `${hours} hours`
  return `${rest} min`
}

export function formatCost(cost: number) {
  return cost === 0 ? 'Free' : `S$${cost} demo fee`
}

export function formatClock(totalSeconds: number) {
  const safe = Math.max(0, totalSeconds)
  const minutes = Math.floor(safe / 60)
  const seconds = safe % 60
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

export function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ')
}
