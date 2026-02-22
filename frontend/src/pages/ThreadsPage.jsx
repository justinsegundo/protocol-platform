import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getThreads } from '../api/threads'
import ThreadCard from '../components/thread/ThreadCard'
import SearchBar from '../components/SearchBar'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import EmptyState from '../components/ui/EmptyState'
import { useAuth } from '../context/AuthContext'

const SORT_OPTIONS = [
  { value: 'latest', label: 'Most Recent' },
  { value: 'most_upvoted', label: 'Most Upvoted' },
  { value: 'most_commented', label: 'Most Discussed' },
]

export default function ThreadsPage() {
  const { isAuthenticated } = useAuth()
  const [sortBy, setSortBy] = useState('latest')
  const [page, setPage] = useState(1)

  const { data, isLoading } = useQuery({
    queryKey: ['threads', sortBy, page],
    queryFn: () => getThreads({ sort_by: sortBy, page, per_page: 10 }),
    keepPreviousData: true,
  })

  const threads = data?.data?.data || []
  const meta = data?.data?.meta || {}

  return (
    <div className="page-enter max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <div>
          <span className="text-xs font-medium text-amber-600 uppercase tracking-wider">Community</span>
          <h1 className="font-display text-3xl text-ink mt-1">Discussions</h1>
          <p className="text-muted text-sm mt-1">
            Ask questions, share experiences, explore ideas
          </p>
        </div>
        <div className="flex items-center gap-3">
          <SearchBar collection="threads" placeholder="Search discussions..." />
          {isAuthenticated && (
            <Link to="/threads/create" className="btn-primary flex-shrink-0">
              + New Thread
            </Link>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 mb-8">
        {SORT_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => { setSortBy(opt.value); setPage(1) }}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-150 ${
              sortBy === opt.value
                ? 'bg-forest-700 text-cream'
                : 'bg-white border border-gray-200 text-muted hover:border-forest-700 hover:text-forest-700'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : threads.length === 0 ? (
        <EmptyState
          title="No discussions yet"
          description="Start the first conversation in the community."
          action={isAuthenticated ? <Link to="/threads/create" className="btn-primary">Start Discussion</Link> : <Link to="/register" className="btn-primary">Join to Discuss</Link>}
        />
      ) : (
        <>
          <div className="space-y-3">
            {threads.map((thread) => (
              <ThreadCard key={thread.id} thread={thread} />
            ))}
          </div>

          {meta.last_page > 1 && (
            <div className="flex justify-center gap-2 mt-10">
              {Array.from({ length: meta.last_page }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${
                    page === p
                      ? 'bg-forest-700 text-cream'
                      : 'bg-white border border-gray-200 text-muted hover:border-forest-700 hover:text-forest-700'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}