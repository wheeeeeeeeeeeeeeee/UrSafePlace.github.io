import { useState } from 'react'
import { REPORT_REASONS } from '../types'
import { Modal } from './Modal'

export function ReportDialog({
  title,
  onClose,
  onSubmit,
}: {
  title: string
  onClose: () => void
  onSubmit: (reason: string, details: string) => void
}) {
  const [reason, setReason] = useState<(typeof REPORT_REASONS)[number] | ''>('')
  const [details, setDetails] = useState('')
  const [confirming, setConfirming] = useState(false)

  return (
    <Modal title={confirming ? 'Submit this report?' : title} onClose={onClose}>
      {confirming ? (
        <div className="space-y-4 text-sm leading-6">
          <p>
            This stores a report in this browser with the status <strong>Pending review</strong>. It is not sent to a moderation team, and your name is not attached.
          </p>
          <p className="rounded-2xl bg-sage-50 px-4 py-3">
            <span className="font-bold">{reason}</span>
            {details.trim() ? <span className="mt-1 block text-ink-soft">{details.trim()}</span> : null}
          </p>
          <div className="flex flex-wrap gap-2">
            <button className="btn-primary" onClick={() => onSubmit(reason, details.trim())}>
              Submit report
            </button>
            <button className="btn-ghost" onClick={() => setConfirming(false)}>
              Go back
            </button>
          </div>
        </div>
      ) : (
        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault()
            if (!reason) return
            setConfirming(true)
          }}
        >
          <label className="block text-sm font-bold">
            Reason
            <select className="field mt-2" value={reason} onChange={(event) => setReason(event.target.value as typeof reason)} required>
              <option value="">Choose a reason</option>
              {REPORT_REASONS.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm font-bold">
            Details, if you want to add them
            <textarea
              className="field mt-2 min-h-28"
              value={details}
              maxLength={500}
              onChange={(event) => setDetails(event.target.value)}
              placeholder="Optional. Do not include your own contact details."
            />
          </label>
          <button className="btn-primary" type="submit">
            Review and submit
          </button>
        </form>
      )}
    </Modal>
  )
}
