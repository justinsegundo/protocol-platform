import { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { logout as logoutApi } from '../../api/auth'

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setDropdownOpen(false)
    setMenuOpen(false)
  }, [location.pathname])

  const handleLogout = async () => {
    setDropdownOpen(false)
    setMenuOpen(false)
    try {
      await logoutApi()
    } finally {
      logout()
      navigate('/')
    }
  }

  const navLinkClass = ({ isActive }) =>
    `font-body text-sm font-medium transition-colors duration-200 ${
      isActive ? 'text-forest-700' : 'text-muted hover:text-ink'
    }`

  return (
    <header className="bg-cream border-b border-gray-100 sticky top-0 z-50 backdrop-blur-sm bg-cream/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-forest-700 rounded-lg flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M9 2L9 16M2 9L16 9" stroke="#F7F4EF" strokeWidth="2.5" strokeLinecap="round"/>
                <circle cx="9" cy="9" r="3" fill="#E8A838"/>
              </svg>
            </div>
            <span className="font-display font-semibold text-lg text-forest-700 tracking-tight">
              Holistic<span className="text-amber-500">Hub</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <NavLink to="/protocols" className={navLinkClass}>Protocols</NavLink>
            <NavLink to="/threads" className={navLinkClass}>Discussions</NavLink>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 btn-ghost"
                >
                  <div className="w-7 h-7 rounded-full bg-forest-700 flex items-center justify-center text-cream text-xs font-semibold">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-ink">{user?.name}</span>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M3 5L7 9L11 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl border border-gray-100 shadow-lg py-1 z-50">
                    <Link
                      to="/protocols/create"
                      className="block px-4 py-2.5 text-sm text-ink hover:bg-forest-50 transition-colors"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Post Protocol
                    </Link>
                    <Link
                      to="/threads/create"
                      className="block px-4 py-2.5 text-sm text-ink hover:bg-forest-50 transition-colors"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Start Discussion
                    </Link>
                    <hr className="my-1 border-gray-100" />
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2.5 text-sm text-terra hover:bg-red-50 transition-colors"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="btn-ghost">Sign in</Link>
                <Link to="/register" className="btn-primary">Join free</Link>
              </>
            )}
          </div>

          <button
            className="md:hidden btn-ghost p-2"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              {menuOpen ? (
                <path d="M4 4L16 16M16 4L4 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              ) : (
                <>
                  <path d="M3 6H17M3 10H17M3 14H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </>
              )}
            </svg>
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 py-4 space-y-1">
            <NavLink to="/protocols" className="block px-3 py-2 text-sm font-medium text-ink hover:bg-forest-50 rounded-lg" onClick={() => setMenuOpen(false)}>Protocols</NavLink>
            <NavLink to="/threads" className="block px-3 py-2 text-sm font-medium text-ink hover:bg-forest-50 rounded-lg" onClick={() => setMenuOpen(false)}>Discussions</NavLink>
            {isAuthenticated ? (
              <>
                <Link to="/protocols/create" className="block px-3 py-2 text-sm font-medium text-ink hover:bg-forest-50 rounded-lg" onClick={() => setMenuOpen(false)}>Post Protocol</Link>
                <Link to="/threads/create" className="block px-3 py-2 text-sm font-medium text-ink hover:bg-forest-50 rounded-lg" onClick={() => setMenuOpen(false)}>Start Discussion</Link>
                <button onClick={handleLogout} className="w-full text-left px-3 py-2 text-sm font-medium text-terra hover:bg-red-50 rounded-lg">Sign out</button>
              </>
            ) : (
              <div className="flex gap-2 px-3 pt-2">
                <Link to="/login" className="btn-secondary flex-1 justify-center" onClick={() => setMenuOpen(false)}>Sign in</Link>
                <Link to="/register" className="btn-primary flex-1 justify-center" onClick={() => setMenuOpen(false)}>Join free</Link>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  )
}