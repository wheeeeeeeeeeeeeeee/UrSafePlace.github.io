import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Modal } from '../components/Modal'
import { useApp } from '../context/AppState'
import { SUPPORT_CONTACTS } from '../data/support'

export function Support() {
  const { resetPrototype } = useApp()
  const [note, setNote] = useState<string | null>(null)
  const [confirmReset, setConfirmReset] = useState(false)

  return (
    <div className="space-y-6">
      <section className="rounded-3xl bg-lilac-100 px-5 py-4 text-sm leading-6">
        <p className="font-bold">Ur Safe Place is not an emergency service.</p>
        <p>
          It is not monitored in real time. Nothing you write is sent to a counsellor, and the app will not contact anyone for you.
        </p>
      </section>
      <div>
        <h1 className="font-display text-4xl text-sage-700">Support</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-soft">
          These cards show the kinds of help a finished app might point to. Every contact below is a placeholder until someone verifies a real service.
        </p>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {SUPPORT_CONTACTS.map((contact) => (
          <article key={contact.id} className="card p-5">
            <p className="text-xs font-bold uppercase tracking-wide text-sage-600">{contact.type}</p>
            <h2 className="mt-2 font-display text-2xl text-sage-700">{contact.name}</h2>
            <p className="mt-3 text-sm leading-6">{contact.description}</p>
            <p className="mt-3 text-sm font-semibold">{contact.contact}</p>
            <p className="text-sm text-ink-soft">{contact.websiteNote}</p>
            <button className="btn-ghost mt-4" onClick={() => setNote(`${contact.name} is a placeholder. No call is placed and no website is opened.`)}>
              View contact note
            </button>
          </article>
        ))}
      </div>
      <section className="card flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-2xl text-sage-700">While you are here</h2>
          <p className="text-sm text-ink-soft">A short practice, or the local list of demo reports.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link className="btn-primary" to="/breathe">
            Take 2 minutes
          </Link>
          <Link className="btn-ghost" to="/moderation">
            Moderation demo
          </Link>
        </div>
      </section>
      <button className="btn-ghost" onClick={() => setConfirmReset(true)}>
        Clear prototype data on this device
      </button>
      {note && (
        <Modal title="Placeholder only" onClose={() => setNote(null)}>
          <p className="text-sm leading-6">{note}</p>
        </Modal>
      )}
      {confirmReset && (
        <Modal title="Clear data saved in this browser?" onClose={() => setConfirmReset(false)}>
          <p className="text-sm leading-6">Journal entries, posts, comments, reports, bookmarks, and demo registrations will be removed from this device.</p>
          <button className="btn-primary mt-4" onClick={resetPrototype}>
            Clear and reload
          </button>
        </Modal>
      )}
    </div>
  )
}
