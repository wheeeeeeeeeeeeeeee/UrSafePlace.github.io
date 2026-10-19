import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Flag, Trash2 } from 'lucide-react'
import { EmotionPicker } from '../components/EmotionPicker'
import { HappinessChart } from '../components/HappinessChart'
import { Modal } from '../components/Modal'
import { ReportDialog } from '../components/ReportDialog'
import { useApp } from '../context/AppState'
import { DEMO_NOTE, REACTION_META, SAMPLE_COMMENTS } from '../data/community'
import { EMOTIONS, emotionById } from '../data/emotions'
import { sameDay, startOfWeek, timeAgo } from '../lib/format'
import type { CommentItem, EmotionId } from '../types'

const GUIDELINES = [
  'Be kind. Disagree with an idea, not with a person.',
  'Do not share names, student numbers, phone numbers, or other identifying details.',
  'No bullying, hate, threats, or instructions that could hurt someone.',
  'This space is not therapy and nobody here is on duty.',
  'The report button only saves a demo report in your browser.',
]

export function Community() {
  const { alias, feed, comments: userComments, reactions, reports, addPost, deletePost, addComment, toggleReaction, addReport } =
    useApp()
  const [emotionFilter, setEmotionFilter] = useState<EmotionId | 'all'>('all')
  const [recent, setRecent] = useState<'all' | 'today' | 'week'>('all')
  const [composer, setComposer] = useState(false)
  const [draftEmotion, setDraftEmotion] = useState<EmotionId | null>(null)
  const [draftBody, setDraftBody] = useState('')
  const [draftStats, setDraftStats] = useState(false)
  const [draftError, setDraftError] = useState('')
  const [replyTo, setReplyTo] = useState<{ postId: string; parentId: string; label: string } | null>(null)
  const [commentDrafts, setCommentDrafts] = useState<Record<string, string>>({})
  const [reportTarget, setReportTarget] = useState<{ type: 'post' | 'comment'; id: string; excerpt: string } | null>(null)
  const [guidelinesOpen, setGuidelinesOpen] = useState(false)

  const comments = useMemo(() => [...SAMPLE_COMMENTS, ...userComments], [userComments])

  const visible = feed.filter((post) => {
    if (emotionFilter !== 'all' && post.emotion !== emotionFilter) return false
    const created = new Date(post.createdAt)
    if (recent === 'today' && !sameDay(created, new Date())) return false
    if (recent === 'week' && created < startOfWeek(new Date())) return false
    return true
  })

  const reported = (id: string) => reports.some((report) => report.targetId === id)

  return (
    <div className="space-y-6">
      <section className="rounded-3xl bg-mist-100 px-5 py-4 text-sm leading-6 text-mist-700">
        <p className="font-bold">Prototype community</p>
        <p>{DEMO_NOTE}</p>
      </section>

      <HappinessChart />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-4xl text-sage-700">Community</h1>
          <p className="mt-1 text-sm text-ink-soft">You appear here as {alias}. Only entries you explicitly share are added.</p>
        </div>
        <button className="btn-primary" onClick={() => setComposer(true)}>
          New post
        </button>
      </div>

      <div className="card space-y-4 p-4">
        <div className="flex flex-wrap gap-2">
          {(['all', 'today', 'week'] as const).map((option) => (
            <button key={option} className={recent === option ? 'btn-primary min-h-10 px-4 py-2' : 'btn-ghost min-h-10 px-4 py-2'} onClick={() => setRecent(option)}>
              {option === 'all' ? 'All recent' : option === 'today' ? 'Today' : 'This week'}
            </button>
          ))}
          <button className="btn-ghost min-h-10 px-4 py-2" onClick={() => setGuidelinesOpen(true)}>
            Guidelines
          </button>
          <Link className="btn-ghost min-h-10 px-4 py-2" to="/moderation">
            Local moderation demo
          </Link>
        </div>
        <div className="flex flex-wrap gap-2">
          <button className={emotionFilter === 'all' ? 'chip border-sage-500 bg-sage-100' : 'chip'} onClick={() => setEmotionFilter('all')}>
            All feelings
          </button>
          {EMOTIONS.map((emotion) => (
            <button
              key={emotion.id}
              className={emotionFilter === emotion.id ? 'chip border-sage-500 bg-sage-100' : 'chip'}
              onClick={() => setEmotionFilter(emotion.id)}
            >
              {emotion.emoji} {emotion.label}
            </button>
          ))}
        </div>
        <p className="text-sm font-bold">{visible.length} posts</p>
      </div>

      {visible.length === 0 && (
        <div className="card p-5 text-sm leading-6">No posts match both filters. Try another feeling or a wider time range.</div>
      )}

      <div className="space-y-4">
        {visible.map((post) => {
          const emotion = emotionById(post.emotion)
          const postComments = comments.filter((comment) => comment.postId === post.id)
          const roots = postComments.filter((comment) => !comment.parentId)
          return (
            <article key={post.id} className="card p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-bold text-ink-soft">
                    {emotion.emoji} {emotion.label} · {post.authorLabel}
                    {post.mine ? ' · shared from this device' : ''} · {timeAgo(post.createdAt)}
                  </p>
                </div>
                <div className="flex gap-2">
                  {post.mine && post.id.startsWith('post-') && (
                    <button className="btn-ghost min-h-10 px-3" onClick={() => deletePost(post.id)} aria-label="Delete your post">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    className="btn-ghost min-h-10 px-3"
                    onClick={() => setReportTarget({ type: 'post', id: post.id, excerpt: post.body.slice(0, 140) })}
                  >
                    <Flag className="h-4 w-4" /> Report
                  </button>
                </div>
              </div>
              <p className="mt-3 leading-7">{post.body}</p>
              {reported(post.id) && <p className="mt-2 text-xs font-bold text-sage-700">You reported this · Pending review</p>}
              <div className="mt-4 flex flex-wrap gap-2">
                {REACTION_META.map((reaction) => {
                  const count = post.baseReactions[reaction.id] + (reactions[post.id] === reaction.id ? 1 : 0)
                  const active = reactions[post.id] === reaction.id
                  return (
                    <button
                      key={reaction.id}
                      className={active ? 'chip border-sage-500 bg-sage-100' : 'chip'}
                      aria-pressed={active}
                      onClick={() => toggleReaction(post.id, reaction.id)}
                    >
                      {reaction.label} · {count}
                    </button>
                  )
                })}
              </div>

              <div className="mt-4 space-y-3 border-t border-sage-100 pt-4">
                {roots.map((comment) => (
                  <CommentThread
                    key={comment.id}
                    comment={comment}
                    replies={postComments.filter((item) => item.parentId === comment.id)}
                    reported={reported}
                    onReply={(item) =>
                      setReplyTo({
                        postId: post.id,
                        parentId: item.parentId ?? item.id,
                        label: item.authorLabel,
                      })
                    }
                    onReport={(item) => setReportTarget({ type: 'comment', id: item.id, excerpt: item.body.slice(0, 140) })}
                  />
                ))}
                <form
                  className="flex flex-col gap-2 sm:flex-row"
                  onSubmit={(event) => {
                    event.preventDefault()
                    const body = (commentDrafts[post.id] ?? '').trim()
                    if (!body) return
                    addComment({ postId: post.id, parentId: replyTo?.postId === post.id ? replyTo.parentId : null, body })
                    setCommentDrafts((current) => ({ ...current, [post.id]: '' }))
                    setReplyTo(null)
                  }}
                >
                  <label className="sr-only" htmlFor={`comment-${post.id}`}>
                    Comment
                  </label>
                  <div className="flex-1">
                    {replyTo?.postId === post.id && (
                      <button type="button" className="mb-2 text-xs font-bold text-sage-700" onClick={() => setReplyTo(null)}>
                        Cancel reply to {replyTo.label}
                      </button>
                    )}
                    <input
                      id={`comment-${post.id}`}
                      className="field"
                      maxLength={400}
                      value={commentDrafts[post.id] ?? ''}
                      onChange={(event) => setCommentDrafts((current) => ({ ...current, [post.id]: event.target.value }))}
                      placeholder={replyTo?.postId === post.id ? `Reply to ${replyTo.label}` : 'Write a supportive comment'}
                    />
                  </div>
                  <button className="btn-primary" type="submit">
                    {replyTo?.postId === post.id ? 'Reply' : 'Comment'}
                  </button>
                </form>
              </div>
            </article>
          )
        })}
      </div>

      {composer && (
        <Modal title="Share with the prototype community" onClose={() => setComposer(false)}>
          <form
            className="space-y-4"
            onSubmit={(event) => {
              event.preventDefault()
              if (!draftEmotion || !draftBody.trim()) {
                setDraftError('Choose a feeling and write something you are comfortable sharing on this device.')
                return
              }
              addPost({ emotion: draftEmotion, body: draftBody.trim(), contributeToStats: draftStats })
              setComposer(false)
              setDraftEmotion(null)
              setDraftBody('')
              setDraftStats(false)
              setDraftError('')
            }}
          >
            <EmotionPicker label="Feeling on this post" value={draftEmotion} onChange={setDraftEmotion} />
            <textarea className="field min-h-32" maxLength={800} value={draftBody} onChange={(event) => setDraftBody(event.target.value)} placeholder="What would you like to say anonymously?" />
            <label className="flex items-start gap-3 text-sm leading-6">
              <input className="mt-1 h-4 w-4 accent-sage-600" type="checkbox" checked={draftStats} onChange={(event) => setDraftStats(event.target.checked)} />
              <span>Also include this emotion in the happiness index. Posting and contributing to the index are separate.</span>
            </label>
            {draftError && <p className="text-sm font-semibold">{draftError}</p>}
            <button className="btn-primary" type="submit">
              Post anonymously
            </button>
          </form>
        </Modal>
      )}

      {guidelinesOpen && (
        <Modal title="Community guidelines" onClose={() => setGuidelinesOpen(false)}>
          <ul className="list-disc space-y-2 pl-5 text-sm leading-6">
            {GUIDELINES.map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ul>
        </Modal>
      )}

      {reportTarget && (
        <ReportDialog
          title={reportTarget.type === 'post' ? 'Report this post' : 'Report this comment'}
          onClose={() => setReportTarget(null)}
          onSubmit={(reason, details) => {
            addReport({
              targetType: reportTarget.type,
              targetId: reportTarget.id,
              reason,
              details,
              excerpt: reportTarget.excerpt,
            })
            setReportTarget(null)
          }}
        />
      )}
    </div>
  )
}

function CommentThread({
  comment,
  replies,
  reported,
  onReply,
  onReport,
}: {
  comment: CommentItem
  replies: CommentItem[]
  reported: (id: string) => boolean
  onReply: (comment: CommentItem) => void
  onReport: (comment: CommentItem) => void
}) {
  return (
    <div className="rounded-2xl bg-sage-50 px-3 py-3">
      <CommentRow comment={comment} reported={reported(comment.id)} onReply={() => onReply(comment)} onReport={() => onReport(comment)} />
      {replies.length > 0 && (
        <div className="mt-2 space-y-2 border-l-2 border-sage-200 pl-3">
          {replies.map((reply) => (
            <CommentRow
              key={reply.id}
              comment={reply}
              reported={reported(reply.id)}
              onReply={() => onReply(reply)}
              onReport={() => onReport(reply)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function CommentRow({
  comment,
  reported,
  onReply,
  onReport,
}: {
  comment: CommentItem
  reported: boolean
  onReply: () => void
  onReport: () => void
}) {
  return (
    <div>
      <p className="text-xs font-bold text-ink-soft">
        {comment.authorLabel}
        {comment.mine ? ' · you' : ''} · {timeAgo(comment.createdAt)}
      </p>
      <p className="text-sm leading-6">{comment.body}</p>
      <div className="mt-1 flex gap-3 text-xs font-bold">
        <button className="text-sage-700" onClick={onReply}>
          Reply
        </button>
        <button className="text-ink-soft" onClick={onReport}>
          Report
        </button>
        {reported && <span className="text-sage-700">Pending review</span>}
      </div>
    </div>
  )
}
