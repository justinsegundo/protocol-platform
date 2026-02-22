export default function EmptyState({ title, description, action }) {
  return (
    <div className="text-center py-16">
      <div className="w-16 h-16 bg-forest-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <circle cx="14" cy="14" r="10" stroke="#2D5A3D" strokeWidth="1.5"/>
          <path d="M14 9V14M14 19H14.01" stroke="#2D5A3D" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </div>
      <h3 className="font-display text-xl text-ink mb-2">{title}</h3>
      <p className="text-muted text-sm mb-6 max-w-xs mx-auto">{description}</p>
      {action}
    </div>
  )
}