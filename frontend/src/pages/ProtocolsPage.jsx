import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getProtocols } from '../api/protocols'
import ProtocolCard from '../components/protocol/ProtocolCard'
import SearchBar from '../components/SearchBar'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import EmptyState from '../components/ui/EmptyState'
import { useAuth } from '../context/AuthContext'

const SORT_OPTIONS = [
  { value: 'latest', label: 'Most Recent' },
  { value: 'top_rated', label: 'Top Rated' },
  { value: 'most_reviewed', label: 'Most Reviewed' },
]

export default function ProtocolsPage() {
  const { isAuthenticated } = useAuth()
  const [sortBy, setSortBy] = useState('latest')
  const [page, setPage] = useState(1)

  const { data, isLoading } = useQuery({
    queryKey: ['protocols', sortBy, page],
    queryFn: () => getProtocols({ sort_by: sortBy, page, per_page: 12 }),
    keepPreviousData: true,
  })

  const protocols = data?.data?.data || []
  const meta = data?.data?.meta || {}

  return (
    <div className="page-enter max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <div>
          <span className="text-xs font-medium text-amber-600 uppercase tracking-wider">Explore</span>
          <h1 className="font-display text-3xl text-ink mt-1">Protocols</h1>
          <p className="text-muted text-sm mt-1">
            Community-tested wellness and healing protocols
          </p>
        </div>
        <div className="flex items-center gap-3">
          <SearchBar collection="protocols" placeholder="Search protocols..." />
          {isAuthenticated && (
            <Link to="/protocols/create" className="btn-primary flex-shrink-0">
              + Post Protocol
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
      ) : protocols.length === 0 ? (
        <EmptyState
          title="No protocols yet"
          description="Be the first to share a wellness protocol with the community."
          action={isAuthenticated ? <Link to="/protocols/create" className="btn-primary">Post a Protocol</Link> : <Link to="/register" className="btn-primary">Join to Post</Link>}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {protocols.map((protocol) => (
              <ProtocolCard key={protocol.id} protocol={protocol} />
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