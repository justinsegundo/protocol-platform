import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getThread } from '../api/threads'
import VoteButton from '../components/ui/VoteButton'
import TagBadge from '../components/ui/TagBadge'
import CommentList from '../components/comment/CommentList'
import LoadingSpinner from '../components/ui/LoadingSpinner'

export default function ThreadDetail() {
  const { id } = useParams()

  const { data, isLoading } = useQuery({
    queryKey: ['thread', id],
    queryFn: () => getThread(id),
  })

  const thread = data?.data?.data || data?.data

  if (isLoading) return <LoadingSpinner />
  if (!thread) return <div className="text-center py-20 text-muted">Thread not found.</div>

  return (
    <div className="page-enter max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link to="/threads" className="text-sm text-muted hover:text-forest-700 flex items-center gap-1.5 mb-8 transition-colors">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M11 7H3M6 4L3 7L6 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        Back to Discussions
      </Link>

      <div className="card p-8 mb-8">
        {thread.protocol && (
          <Link
            to={`/protocols/${thread.protocol.id}`}
            className="inline-flex items-center gap-1.5 text-xs text-amber-600 font-medium mb-4 hover:underline"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M6 1L7.5 4.5H11L8.5 6.5L9.5 10L6 8L2.5 10L3.5 6.5L1 4.5H4.5L6 1Z" fill="currentColor"/>
            </svg>
            {thread.protocol.title}
          </Link>
        )}

        <h1 className="font-display text-2xl md:text-3xl text-ink leading-tight mb-4">
          {thread.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-sm text-muted mb-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-forest-700 flex items-center justify-center text-cream text-xs font-semibold">
              {thread.author?.name?.charAt(0).toUpperCase()}
            </div>
            <span>{thread.author?.name}</span>
          </div>
          <span>·</span>
          <span>
            {new Date(thread.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {thread.tags?.map((tag) => <TagBadge key={tag} tag={tag} />)}
        </div>

        <div className="text-ink leading-relaxed whitespace-pre-wrap mb-6 text-sm md:text-base">
          {thread.body}
        </div>

        <div className="pt-4 border-t border-gray-100">
          <VoteButton
            votableType="thread"
            votableId={thread.id}
            upvoteCount={thread.upvote_count ?? 0}
            downvoteCount={thread.downvote_count ?? 0}
            userVote={thread.user_vote}
          />
        </div>
      </div>

      <div className="card p-8">
        <CommentList threadId={thread.id} />
      </div>
    </div>
  )
}