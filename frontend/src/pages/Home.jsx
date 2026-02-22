import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getProtocols } from '../api/protocols'
import { getThreads } from '../api/threads'
import ProtocolCard from '../components/protocol/ProtocolCard'
import ThreadCard from '../components/thread/ThreadCard'
import SearchBar from '../components/SearchBar'
import LoadingSpinner from '../components/ui/LoadingSpinner'

export default function Home() {
  const { data: protocolsData, isLoading: loadingProtocols } = useQuery({
    queryKey: ['protocols', 'home'],
    queryFn: () => getProtocols({ per_page: 3, sort_by: 'top_rated' }),
  })

  const { data: threadsData, isLoading: loadingThreads } = useQuery({
    queryKey: ['threads', 'home'],
    queryFn: () => getThreads({ per_page: 4, sort_by: 'latest' }),
  })

  const protocols = protocolsData?.data?.data || []
  const threads = threadsData?.data?.data || []

  return (
    <div className="page-enter">
      <section className="relative bg-forest-700 overflow-hidden">
        <div className="absolute inset-0 bg-grain opacity-30" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 text-amber-400 text-sm font-medium mb-6">
              Community Knowledge
            </span>
            <h1 className="font-display text-4xl md:text-6xl text-cream leading-tight mb-6">
              Healing protocols,<br />
              <em className="text-amber-400">shared openly.</em>
            </h1>
            <p className="text-forest-100 text-lg mb-10 leading-relaxed max-w-xl">
              Discover community-tested wellness protocols, join discussions, and contribute your healing knowledge.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mb-10">
              <SearchBar collection="protocols" placeholder="Search protocols..." />
            </div>
            <div className="flex items-center gap-6">
              <Link to="/protocols" className="btn-primary bg-amber-500 hover:bg-amber-600 text-forest-900">
                Browse Protocols
              </Link>
              <Link to="/threads" className="text-cream text-sm font-medium hover:text-amber-400 transition-colors flex items-center gap-1.5">
                View Discussions
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M3 7H11M8 4L11 7L8 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-medium text-amber-600 uppercase tracking-wider">Top Rated</span>
            <h2 className="font-display text-2xl text-ink mt-1">Featured Protocols</h2>
          </div>
          <Link to="/protocols" className="text-sm text-forest-700 font-medium hover:underline">
            View all →
          </Link>
        </div>
        {loadingProtocols ? (
          <LoadingSpinner />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {protocols.map((protocol) => (
              <ProtocolCard key={protocol.id} protocol={protocol} />
            ))}
          </div>
        )}
      </section>

      <section className="bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="text-xs font-medium text-amber-600 uppercase tracking-wider">Latest</span>
              <h2 className="font-display text-2xl text-ink mt-1">Recent Discussions</h2>
            </div>
            <Link to="/threads" className="text-sm text-forest-700 font-medium hover:underline">
              View all →
            </Link>
          </div>
          {loadingThreads ? (
            <LoadingSpinner />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {threads.map((thread) => (
                <ThreadCard key={thread.id} thread={thread} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="bg-forest-700 rounded-3xl p-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-grain opacity-20" />
          <div className="relative">
            <h2 className="font-display text-3xl text-cream mb-4">Share your protocol</h2>
            <p className="text-forest-100 mb-8 max-w-md mx-auto">
              Have a wellness practice that changed your life? Share it with the community.
            </p>
            <Link to="/protocols/create" className="btn-primary bg-amber-500 hover:bg-amber-600 text-forest-900">
              Post a Protocol
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}