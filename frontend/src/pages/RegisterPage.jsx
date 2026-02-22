import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { register } from '../api/auth'
import { useAuth } from '../context/AuthContext'

export default function RegisterPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', password_confirmation: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})
    setLoading(true)
    try {
      const res = await register(form)
      login(res.data.user, res.data.token)
      navigate('/')
    } catch (err) {
      setErrors(err.response?.data?.errors || { general: 'Registration failed.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-enter min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl text-ink mb-2">Join HolisticHub</h1>
          <p className="text-muted text-sm">Create your free account to share and discover protocols</p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {['name', 'email', 'password', 'password_confirmation'].map((field) => (
              <div key={field}>
                <label className="block text-sm font-medium text-ink mb-1.5 capitalize">
                  {field === 'password_confirmation' ? 'Confirm Password' : field}
                </label>
                <input
                  type={field.includes('password') ? 'password' : field === 'email' ? 'email' : 'text'}
                  value={form[field]}
                  onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                  className="input"
                  placeholder={
                    field === 'name' ? 'Your name'
                    : field === 'email' ? 'you@example.com'
                    : '••••••••'
                  }
                  required
                />
                {errors[field] && (
                  <p className="text-terra text-xs mt-1">{errors[field][0]}</p>
                )}
              </div>
            ))}
            {errors.general && <p className="text-terra text-sm">{errors.general}</p>}
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3">
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-muted mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-forest-700 font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}