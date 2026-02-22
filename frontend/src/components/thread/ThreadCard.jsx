import { Link } from 'react-router-dom'
import TagBadge from '../ui/TagBadge'

export default function ThreadCard({ thread }) {
  return (
    <Link to={`/threads/${thread.id}`} className="card p-5 block group">
      <div className="flex items-start gap-4">
        <div className="flex-1 min-w-0">
          {thread.protocol && (
            <span className="text-xs text-amber-600 font-medium mb-1 block truncate">
              re: {thread.protocol.title}
            </span>
          )}
          <h3 className="font-display text-base text-ink group-hover:text-forest-700 transition-colors leading-snug line-clamp-2 mb-2">
            {thread.title}
          </h3>
          <p className="text-muted text-sm line-clamp-2 mb-3">
            {thread.body?.replace(/<[^>]+>/g, '').substring(0, 120)}...
          </p>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {thread.tags?.slice(0, 3).map((tag) => (
              <TagBadge key={tag} tag={tag} />
            ))}
          </div>
          <div className="flex items-center gap-4 text-xs text-muted">
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded-full bg-forest-700 flex items-center justify-center text-cream text-xs">
                {thread.author?.name?.charAt(0).toUpperCase()}
              </div>
              {thread.author?.name}
            </div>
            <div className="flex items-center gap-1">
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path d="M6.5 1.5C3.739 1.5 1.5 3.739 1.5 6.5s2.239 5 5 5 5-2.239 5-5-2.239-5-5-5zm.5 7.5H6V6h1v3zm0-4H6V4h1v1z" fill="currentColor"/>
              </svg>
              {thread.comment_count} comments
            </div>
            <div className="flex items-center gap-1">
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path d="M6.5 2L8 5.5H12L9 7.5L10 11L6.5 9L3 11L4 7.5L1 5.5H5L6.5 2Z" fill="#E8A838"/>
              </svg>
              {thread.upvote_count}
            </div>
            <span className="ml-auto">
              {new Date(thread.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}