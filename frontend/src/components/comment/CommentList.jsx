import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../../context/AuthContext'
import { getComments, createComment } from '../../api/threads'
import CommentItem from './CommentItem'
import LoadingSpinner from '../ui/LoadingSpinner'
import { Link } from 'react-router-dom'

export default function CommentList({ threadId }) {
  const { isAuthenticated } = useAuth()
  const queryClient = useQueryClient()
  const [body, setBody] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const { data, isLoading } = useQuery({
    queryKey: ['comments', threadId],
    queryFn: () => getComments(threadId),
  })

  const comments = data?.data?.data || data?.data || []

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!body.trim()) return
    setSubmitting(true)
    try {
      await createComment(threadId, { body })
      setBody('')
      queryClient.invalidateQueries(['comments', threadId])
    } finally {
      setSubmitting(false)
    }
  }

  const refresh = () => queryClient.invalidateQueries(['comments', threadId])

  return (
    <div>
      <h3 className="font-display text-xl text-ink mb-6">
        Discussion ({Array.isArray(comments) ? comments.length : 0})
      </h3>

      {isAuthenticated ? (
        <form onSubmit={handleSubmit} className="mb-8">
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Share your thoughts..."
            className="input resize-none h-28 text-sm mb-3"
            required
          />
          <button type="submit" disabled={submitting} className="btn-primary">
            {submitting ? 'Posting...' : 'Post comment'}
          </button>
        </form>
      ) : (
        <div className="bg-forest-50 rounded-xl p-4 mb-8 text-center">
          <p className="text-sm text-muted mb-2">Join the discussion</p>
          <Link to="/login" className="btn-primary text-sm">Sign in to comment</Link>
        </div>
      )}

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="divide-y divide-gray-50">
          {Array.isArray(comments) && comments.length > 0 ? (
            comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                threadId={threadId}
                onReply={refresh}
              />
            ))
          ) : (
            <p className="text-muted text-sm py-8 text-center">No comments yet. Be the first!</p>
          )}
        </div>
      )}
    </div>
  )
}