import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { search } from '../api/search'
import { useDebounce } from '../hooks/useDebounce'

export default function SearchBar({ collection = 'protocols', placeholder = 'Search protocols...' }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const debouncedQuery = useDebounce(query, 300)
  const navigate = useNavigate()
  const containerRef = useRef(null)

  useEffect(() => {
    if (debouncedQuery.length < 2) {
      setResults([])
      return
    }
    setLoading(true)
    search({ q: debouncedQuery, collection, per_page: 5 })
      .then((res) => setResults(res.data.hits || []))
      .catch(() => setResults([]))
      .finally(() => setLoading(false))
  }, [debouncedQuery, collection])

  useEffect(() => {
    const handleClick = (e) => {
      if (!containerRef.current?.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleSelect = (hit) => {
    const path = collection === 'protocols' ? `/protocols/${hit.document.id}` : `/threads/${hit.document.id}`
    navigate(path)
    setQuery('')
    setOpen(false)
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-xl">
      <div className="relative">
        <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M11 11L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true) }}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          className="input pl-10 pr-4"
        />
        {loading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-forest-100 border-t-forest-700 rounded-full animate-spin" />
          </div>
        )}
      </div>

      {open && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-xl border border-gray-100 shadow-lg overflow-hidden z-50">
          {results.map((hit) => (
            <button
              key={hit.document.id}
              onClick={() => handleSelect(hit)}
              className="w-full text-left px-4 py-3 hover:bg-forest-50 transition-colors border-b border-gray-50 last:border-0"
            >
              <p className="text-sm font-medium text-ink line-clamp-1"
                dangerouslySetInnerHTML={{ __html: hit.highlights?.find(h => h.field === 'title')?.snippet || hit.document.title }}
              />
              {hit.document.author && (
                <p className="text-xs text-muted mt-0.5">by {hit.document.author}</p>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}