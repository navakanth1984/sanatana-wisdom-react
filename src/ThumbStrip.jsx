// ── Mobile-only thumbnail navigation ──
// On phones the full dashboard is long; this fixed bottom strip lets the user
// jump to a section. `active` + `onSelect` are passed from App (lifted state).
const SECTIONS = [
  { id: 'sage', icon: '🧙', label: 'Sage' },
  { id: 'map', icon: '🌌', label: 'Cosmos' },
  { id: 'culture', icon: '🏛️', label: 'Culture' },
  { id: 'sanskrit', icon: 'ॐ', label: 'Sanskrit' },
  { id: 'rishi', icon: '✨', label: 'Rishi' },
  { id: 'quantum', icon: '⚛️', label: 'Quantum' },
]

export default function ThumbStrip({ active, onSelect }) {
  return (
    <nav className="thumb-strip">
      {SECTIONS.map((s) => (
        <button
          key={s.id}
          className={`thumb ${active === s.id ? 'active' : ''}`}
          onClick={() => onSelect(s.id)}
        >
          <span className="thumb-icon">{s.icon}</span>
          <span className="thumb-label">{s.label}</span>
        </button>
      ))}
    </nav>
  )
}

export { SECTIONS }
