import { useState } from 'react'
import { quantumSanskrit } from './api.js'

// ── Quantum × Veda panel ──
// Runs a REAL quantum circuit on the Agent OS backend (quantum_engine.py) and
// shows how its behavior mirrors Vedic/Upanishadic ideas.
const CIRCUITS = [
  { id: 'bell_state', label: 'Bell State', sub: 'Entanglement = Advaita' },
  { id: 'superposition', label: 'Superposition', sub: 'Avyakta (unmanifest)' },
  { id: 'grover_2', label: 'Grover Search', sub: 'Seeking the one truth' },
  { id: 'qft_3', label: 'Fourier (QFT)', sub: 'Nada → Shabda Brahma' },
]

export default function QuantumVeda() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [active, setActive] = useState('bell_state')

  async function run(circuit) {
    setActive(circuit)
    setLoading(true)
    setError('')
    try {
      const res = await quantumSanskrit(circuit)
      setData(res)
    } catch (e) {
      setError('Backend offline — start agent_os/server.py on :8765')
    } finally {
      setLoading(false)
    }
  }

  // Turn the circuit's measurement counts into simple bars
  const counts = data?.quantum_result?.counts || data?.quantum_result?.measurements || null

  return (
    <section className="quantum-veda">
      <h2 className="section-title gold">⚛️ Quantum Veda</h2>
      <p className="section-subtitle">क्वाण्टम् × वेदाः — Sound, Observer &amp; Non-Duality</p>

      <div className="circuit-buttons">
        {CIRCUITS.map((c) => (
          <button
            key={c.id}
            className={`circuit-btn ${active === c.id ? 'active' : ''}`}
            onClick={() => run(c.id)}
          >
            <span className="circuit-label">{c.label}</span>
            <span className="circuit-sub">{c.sub}</span>
          </button>
        ))}
      </div>

      {loading && <p className="quantum-status">Running circuit on quantum backend…</p>}
      {error && <p className="quantum-error">{error}</p>}

      {data && !loading && (
        <div className="quantum-result">
          {/* Measurement histogram */}
          {counts && (
            <div className="histogram">
              {Object.entries(counts).map(([state, n]) => {
                const max = Math.max(...Object.values(counts))
                return (
                  <div className="hist-row" key={state}>
                    <span className="hist-state">|{state}⟩</span>
                    <span className="hist-bar" style={{ width: `${(n / max) * 100}%` }} />
                    <span className="hist-count">{n}</span>
                  </div>
                )
              })}
            </div>
          )}

          {/* Vedic mapping cards */}
          <div className="mapping-grid">
            {Object.entries(data.vedic_mapping || {}).map(([key, m]) => (
              <div className="mapping-card" key={key}>
                <p className="devanagari mapping-sanskrit">{m.sanskrit}</p>
                <p className="mapping-key">{key.replace(/_/g, ' ')}</p>
                <p className="mapping-concept">{m.concept}</p>
              </div>
            ))}
          </div>

          {/* The unifying shloka */}
          {data.shloka && (
            <div className="quantum-shloka">
              <p className="devanagari">{data.shloka.sanskrit}</p>
              <p className="shloka-en">{data.shloka.english}</p>
            </div>
          )}
        </div>
      )}
    </section>
  )
}
