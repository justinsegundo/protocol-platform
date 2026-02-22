import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login as loginApi } from '../api/auth'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await loginApi(form)
      login(res.data.user, res.data.token)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-enter min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl text-ink mb-2">Welcome back</h1>
          <p className="text-muted text-sm">Sign in to continue to HolisticHub</p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-ink mb-1.5">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="input"
                placeholder="you@example.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink mb-1.5">Password</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="input"
                placeholder="••••••••"
                required
              />
            </div>
            {error && <p className="text-terra text-sm">{error}</p>}
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3">
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-muted mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-forest-700 font-medium hover:underline">
            Join free
          </Link>
        </p>
      </div>
    </div>
  )
}