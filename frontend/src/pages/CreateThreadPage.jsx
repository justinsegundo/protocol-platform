import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { createThread } from '../api/threads'
import { getProtocols } from '../api/protocols'

export default function CreateThreadPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const defaultProtocolId = searchParams.get('protocol_id') || ''

  const [form, setForm] = useState({ title: '', body: '', protocol_id: defaultProtocolId, tags: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const { data } = useQuery({
    queryKey: ['protocols', 'all'],
    queryFn: () => getProtocols({ per_page: 100 }),
  })

  const protocols = data?.data?.data || []

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})
    setLoading(true)
    try {
      const tags = form.tags.split(',').map((t) => t.trim()).filter(Boolean)
      const payload = { ...form, tags }
      if (!payload.protocol_id) delete payload.protocol_id
      const res = await createThread(payload)
      navigate(`/threads/${res.data.data?.id || res.data.id}`)
    } catch (err) {
      setErrors(err.response?.data?.errors || {})
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-enter max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <span className="text-xs font-medium text-amber-600 uppercase tracking-wider">Community</span>
        <h1 className="font-display text-3xl text-ink mt-1">Start a Discussion</h1>
        <p className="text-muted text-sm mt-1">Ask a question or share your experience with the community</p>
      </div>

      <div className="card p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-ink mb-1.5">Title</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="input"
              placeholder="What's your discussion about?"
              required
            />
            {errors.title && <p className="text-terra text-xs mt-1">{errors.title[0]}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-ink mb-1.5">Related Protocol (optional)</label>
            <select
              value={form.protocol_id}
              onChange={(e) => setForm({ ...form, protocol_id: e.target.value })}
              className="input"
            >
              <option value="">None — standalone discussion</option>
              {protocols.map((p) => (
                <option key={p.id} value={p.id}>{p.title}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-ink mb-1.5">Body</label>
            <textarea
              value={form.body}
              onChange={(e) => setForm({ ...form, body: e.target.value })}
              className="input resize-none h-52"
              placeholder="Share your thoughts, questions, or experiences..."
              required
            />
            {errors.body && <p className="text-terra text-xs mt-1">{errors.body[0]}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-ink mb-1.5">Tags</label>
            <input
              type="text"
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
              className="input"
              placeholder="question, experience, tips (comma separated)"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Posting...' : 'Post Discussion'}
            </button>
            <button type="button" onClick={() => navigate(-1)} className="btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}