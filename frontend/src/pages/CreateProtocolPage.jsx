import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createProtocol } from '../api/protocols'

const CATEGORIES = ['Nutrition', 'Recovery', 'Movement', 'Mental Health', 'Sleep', 'Detox', 'Breathwork']

export default function CreateProtocolPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ title: '', content: '', category: '', tags: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})
    setLoading(true)
    try {
      const tags = form.tags.split(',').map((t) => t.trim()).filter(Boolean)
      const res = await createProtocol({ ...form, tags })
      navigate(`/protocols/${res.data.data?.id || res.data.id}`)
    } catch (err) {
      setErrors(err.response?.data?.errors || {})
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-enter max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <span className="text-xs font-medium text-amber-600 uppercase tracking-wider">Share Knowledge</span>
        <h1 className="font-display text-3xl text-ink mt-1">Post a Protocol</h1>
        <p className="text-muted text-sm mt-1">Share a structured wellness or healing practice with the community</p>
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
              placeholder="e.g. 72-Hour Gut Reset Protocol"
              required
            />
            {errors.title && <p className="text-terra text-xs mt-1">{errors.title[0]}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-ink mb-1.5">Category</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="input"
            >
              <option value="">Select a category</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-ink mb-1.5">Protocol Content</label>
            <textarea
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              className="input resize-none h-64"
              placeholder="Describe your protocol in detail — steps, duration, materials needed, expected outcomes..."
              required
            />
            {errors.content && <p className="text-terra text-xs mt-1">{errors.content[0]}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-ink mb-1.5">Tags</label>
            <input
              type="text"
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
              className="input"
              placeholder="fasting, gut-health, detox (comma separated)"
            />
            <p className="text-xs text-muted mt-1">Separate tags with commas</p>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Publishing...' : 'Publish Protocol'}
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