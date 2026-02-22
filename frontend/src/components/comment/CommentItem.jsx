import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import VoteButton from '../ui/VoteButton'
import { createComment } from '../../api/threads'

export default function CommentItem({ comment, threadId, onReply, depth = 0 }) {
  const { isAuthenticated, user } = useAuth()
  const [showReply, setShowReply] = useState(false)
  const [replyText, setReplyText] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleReply = async (e) => {
    e.preventDefault()
    if (!replyText.trim()) return
    setSubmitting(true)
    try {
      await createComment(threadId, { body: replyText, parent_id: comment.id })
      setReplyText('')
      setShowReply(false)
      onReply?.()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className={`${depth > 0 ? 'ml-8 pl-4 border-l-2 border-gray-100' : ''}`}>
      <div className="py-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-7 h-7 rounded-full bg-forest-700 flex items-center justify-center text-cream text-xs font-semibold flex-shrink-0">
            {comment.author?.name?.charAt(0).toUpperCase()}
          </div>
          <span className="text-sm font-medium text-ink">{comment.author?.name}</span>
          <span className="text-xs text-muted">
            {new Date(comment.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
        </div>

        <p className="text-sm text-ink leading-relaxed ml-9 mb-3">{comment.body}</p>

        <div className="ml-9 flex items-center gap-3">
          <VoteButton
            votableType="comment"
            votableId={comment.id}
            upvoteCount={comment.upvote_count ?? 0}
            downvoteCount={comment.downvote_count ?? 0}
            userVote={comment.user_vote}
          />
          {isAuthenticated && depth < 3 && (
            <button
              onClick={() => setShowReply(!showReply)}
              className="text-xs text-muted hover:text-forest-700 font-medium transition-colors"
            >
              Reply
            </button>
          )}
        </div>

        {showReply && (
          <form onSubmit={handleReply} className="ml-9 mt-3">
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write a reply..."
              className="input resize-none h-20 text-sm"
              required
            />
            <div className="flex gap-2 mt-2">
              <button type="submit" disabled={submitting} className="btn-primary text-xs py-1.5 px-3">
                {submitting ? 'Posting...' : 'Post reply'}
              </button>
              <button type="button" onClick={() => setShowReply(false)} className="btn-ghost text-xs py-1.5 px-3">
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      {comment.replies?.map((reply) => (
        <CommentItem
          key={reply.id}
          comment={reply}
          threadId={threadId}
          onReply={onReply}
          depth={depth + 1}
        />
      ))}
    </div>
  )
}