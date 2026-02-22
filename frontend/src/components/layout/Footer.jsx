import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-forest-900 text-cream mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-display text-xl mb-3">HolisticHub</h3>
            <p className="text-sm text-forest-100 leading-relaxed">
              A community-powered platform for sharing wellness protocols and healing knowledge.
            </p>
          </div>
          <div>
            <h4 className="font-body font-semibold text-sm uppercase tracking-wider text-forest-100 mb-4">Explore</h4>
            <ul className="space-y-2">
              <li><Link to="/protocols" className="text-sm text-forest-100 hover:text-cream transition-colors">Protocols</Link></li>
              <li><Link to="/threads" className="text-sm text-forest-100 hover:text-cream transition-colors">Discussions</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-body font-semibold text-sm uppercase tracking-wider text-forest-100 mb-4">Community</h4>
            <ul className="space-y-2">
              <li><Link to="/register" className="text-sm text-forest-100 hover:text-cream transition-colors">Join free</Link></li>
              <li><Link to="/login" className="text-sm text-forest-100 hover:text-cream transition-colors">Sign in</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-forest-700 mt-10 pt-6 text-center text-xs text-forest-100">
          © {new Date().getFullYear()} HolisticHub. Built for the community.
        </div>
      </div>
    </footer>
  )
}