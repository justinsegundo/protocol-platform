import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getProtocol, createReview } from '../api/protocols'
import { useAuth } from '../context/AuthContext'
import TagBadge from '../components/ui/TagBadge'
import StarRating from '../components/ui/StarRating'
import ThreadCard from '../components/thread/ThreadCard'
import LoadingSpinner from '../components/ui/LoadingSpinner'

export default function ProtocolDetail() {
  const { id } = useParams()
  const { isAuthenticated, user } = useAuth()
  const queryClient = useQueryClient()
  const [rating, setRating] = useState(5)
  const [feedback, setFeedback] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [reviewError, setReviewError] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['protocol', id],
    queryFn: () => getProtocol(id),
  })

  const protocol = data?.data?.data || data?.data

  const hasReviewed = protocol?.reviews?.some((r) => r.author?.id === user?.id)

  const handleReview = async (e) => {
    e.preventDefault()
    setReviewError('')
    setSubmitting(true)
    try {
      await createReview(id, { rating, feedback })
      setFeedback('')
      setRating(5)
      queryClient.invalidateQueries(['protocol', id])
    } catch (err) {
      setReviewError(err.response?.data?.message || 'Failed to submit review.')
    } finally {
      setSubmitting(false)
    }
  }

  if (isLoading) return <LoadingSpinner />
  if (!protocol) return <div className="text-center py-20 text-muted">Protocol not found.</div>

  return (
    <div className="page-enter max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link to="/protocols" className="text-sm text-muted hover:text-forest-700 flex items-center gap-1.5 mb-8 transition-colors">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M11 7H3M6 4L3 7L6 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        Back to Protocols
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <div className="mb-6">
            {protocol.category && (
              <span className="text-xs font-medium text-amber-600 uppercase tracking-wider mb-2 block">
                {protocol.category}
              </span>
            )}
            <h1 className="font-display text-3xl md:text-4xl text-ink leading-tight mb-4">
              {protocol.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted mb-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-forest-700 flex items-center justify-center text-cream text-xs font-semibold">
                  {protocol.author?.name?.charAt(0).toUpperCase()}
                </div>
                <span>by {protocol.author?.name}</span>
              </div>
              <span>·</span>
              <span>{new Date(protocol.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {protocol.tags?.map((tag) => <TagBadge key={tag} tag={tag} />)}
            </div>
          </div>

          <div className="prose prose-sm max-w-none text-ink leading-relaxed mb-10 whitespace-pre-wrap">
            {protocol.content}
          </div>

          {protocol.threads?.length > 0 && (
            <div className="mb-10">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-display text-xl text-ink">Related Discussions</h2>
                <Link
                  to={`/threads/create?protocol_id=${protocol.id}`}
                  className="btn-secondary text-sm py-1.5 px-3"
                >
                  + Start Discussion
                </Link>
              </div>
              <div className="space-y-3">
                {protocol.threads.map((thread) => (
                  <ThreadCard key={thread.id} thread={thread} />
                ))}
              </div>
            </div>
          )}

          <div>
            <h2 className="font-display text-xl text-ink mb-6">
              Reviews ({protocol.review_count})
            </h2>

            {isAuthenticated && !hasReviewed && (
              <form onSubmit={handleReview} className="card p-6 mb-6">
                <h3 className="font-body font-semibold text-sm text-ink mb-4">Write a Review</h3>
                <div className="mb-4">
                  <label className="text-sm text-muted block mb-2">Your Rating</label>
                  <StarRating value={rating} onChange={setRating} size="lg" />
                </div>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Share your experience with this protocol..."
                  className="input resize-none h-24 mb-3 text-sm"
                />
                {reviewError && <p className="text-terra text-xs mb-3">{reviewError}</p>}
                <button type="submit" disabled={submitting} className="btn-primary">
                  {submitting ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            )}

            <div className="space-y-4">
              {protocol.reviews?.map((review) => (
                <div key={review.id} className="card p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-forest-700 flex items-center justify-center text-cream text-xs font-semibold">
                        {review.author?.name?.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm font-medium text-ink">{review.author?.name}</span>
                    </div>
                    <StarRating value={review.rating} readonly size="sm" />
                  </div>
                  {review.feedback && (
                    <p className="text-sm text-muted leading-relaxed">{review.feedback}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-24">
            <h3 className="font-body font-semibold text-sm text-ink mb-4">Protocol Stats</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted">Average Rating</span>
                <div className="flex items-center gap-2">
                  <StarRating value={Math.round(protocol.average_rating)} readonly size="sm" />
                  <span className="font-display font-bold text-forest-700">
                    {Number(protocol.average_rating).toFixed(1)}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted">Total Reviews</span>
                <span className="font-semibold text-ink">{protocol.review_count}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted">Discussions</span>
                <span className="font-semibold text-ink">{protocol.threads?.length ?? 0}</span>
              </div>
            </div>

            {isAuthenticated && !protocol.threads?.length && (
              <Link
                to={`/threads/create?protocol_id=${protocol.id}`}
                className="btn-secondary w-full justify-center mt-6"
              >
                Start a Discussion
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}