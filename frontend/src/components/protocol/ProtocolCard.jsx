import { Link } from 'react-router-dom'
import TagBadge from '../ui/TagBadge'
import StarRating from '../ui/StarRating'

export default function ProtocolCard({ protocol }) {
  return (
    <Link to={`/protocols/${protocol.id}`} className="card p-6 block group">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div>
          {protocol.category && (
            <span className="text-xs font-medium text-amber-600 uppercase tracking-wider mb-1.5 block">
              {protocol.category}
            </span>
          )}
          <h3 className="font-display text-lg text-ink group-hover:text-forest-700 transition-colors leading-snug line-clamp-2">
            {protocol.title}
          </h3>
        </div>
        {protocol.average_rating > 0 && (
          <div className="flex-shrink-0 flex flex-col items-end gap-0.5">
            <span className="text-xl font-display text-forest-700 font-bold">
              {Number(protocol.average_rating).toFixed(1)}
            </span>
            <StarRating value={Math.round(protocol.average_rating)} readonly size="sm" />
          </div>
        )}
      </div>

      <p className="text-muted text-sm leading-relaxed line-clamp-2 mb-4">
        {protocol.content?.replace(/<[^>]+>/g, '').substring(0, 150)}...
      </p>

      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-1.5">
          {protocol.tags?.slice(0, 3).map((tag) => (
            <TagBadge key={tag} tag={tag} />
          ))}
        </div>
        <div className="text-xs text-muted">
          {protocol.review_count} review{protocol.review_count !== 1 ? 's' : ''}
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-50 flex items-center gap-2">
        <div className="w-6 h-6 rounded-full bg-forest-700 flex items-center justify-center text-cream text-xs font-semibold">
          {protocol.author?.name?.charAt(0).toUpperCase()}
        </div>
        <span className="text-xs text-muted">{protocol.author?.name}</span>
        <span className="text-xs text-gray-300 ml-auto">
          {new Date(protocol.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
      </div>
    </Link>
  )
}